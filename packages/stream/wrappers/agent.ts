import {
  type Message,
  convertToCoreMessages,
  streamText,
  generateText,
  generateObject,
  type LanguageModelV1,
  type CoreTool,
} from "ai";
import type { z, ZodType } from "zod";
import type { Langfuse } from "langfuse";
import { createLogger, type LoggingConfig, type Logger } from "./logger";
import type { ToolFactory } from "./tools";

// Define agent types
export type AgentType = "streaming" | "text" | "object";

// Define a generic session type that can be extended by the consumer
export interface Session {
  user?: {
    id?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface AgentConfig {
  model: LanguageModelV1;
  systemPrompt: string;
  tools?: Record<string, ToolFactory>;
  maxSteps?: number;
  maxTokens?: number;
  temperature?: number;
  langfuse?: Langfuse;
  session?: Session;
  experimental_activeTools?: string[];
  schema?: z.ZodObject<z.ZodRawShape>;
  name?: string; // Name of the agent for tracing
  traceConfig?: {
    name?: string; // Override trace name if different from agent name
    traceId?: string; // Override trace ID if different from agent name
    tags?: string[];
    metadata?: Record<string, unknown>;
  };
}

/**
 * Simple utility for generating a random UUID
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates a logger with the provided configuration and returns key parameters
 * used by all agent functions.
 */
function setupLoggerAndConfig(
  config: AgentConfig,
  loggingConfig?: LoggingConfig
) {
  const {
    model,
    systemPrompt,
    tools = {},
    maxSteps = 5,
    maxTokens = 4096,
    temperature = 0.7,
    langfuse,
    session,
    experimental_activeTools,
    name = "unnamed-agent",
    traceConfig,
  } = config;

  // Create a logger with the provided config and Langfuse instance
  const logger = createLogger({
    ...loggingConfig,
    langfuse: langfuse
      ? {
          langfuse,
          defaultUserId: session?.user?.id,
          defaultSessionId: session?.id?.toString(),
          defaultTags: traceConfig?.tags || [],
          traceConfig: {
            name: traceConfig?.name || name,
            tags: traceConfig?.tags,
            metadata: {
              agentName: name,
              ...traceConfig?.metadata,
            },
          },
        }
      : undefined,
    metadata: {
      ...loggingConfig?.metadata,
      agentName: name,
    },
  });

  // Initialize tools with the logger using explicit accumulation
  const initializedTools = Object.entries(tools).reduce(
    (acc, [key, toolFn]) => {
      // Create a span for tool initialization
      const span = logger.startSpan({
        name: `init-tool-${key}`,
        metadata: {
          toolName: key,
          type: "tool-initialization",
        },
      });

      try {
        // Initialize the tool with the logger
        acc[key] = toolFn(logger);

        // Update span with success
        logger.updateSpan({
          metadata: {
            status: "success",
            endTime: new Date().toISOString(),
          },
        });
      } catch (error) {
        // Log initialization error
        logger.updateSpan({
          metadata: {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            severity: "ERROR",
            endTime: new Date().toISOString(),
          },
        });
        throw error;
      } finally {
        logger.endSpan();
      }

      return acc;
    },
    {} as Record<string, CoreTool>
  );

  return {
    model,
    systemPrompt,
    tools: initializedTools,
    maxSteps,
    maxTokens,
    temperature,
    langfuse,
    session,
    experimental_activeTools,
    name,
    traceConfig,
    logger,
  };
}

/**
 * Starts a trace for an agent run, returning both the trace object and the trace ID.
 */
function startAgentTrace(
  logger: ReturnType<typeof createLogger>,
  config: AgentConfig,
  messages: Message[],
  agentType: AgentType
) {
  const { session, name = "unnamed-agent", traceConfig } = config;

  // 1) We check if a traceId exists in traceConfig (or generate one)
  const traceId = traceConfig?.traceId || generateUUID();
  // ^ Example usage: if we want to allow an external trace ID, or else generate one

  // 2) We call the logger method
  const trace = logger.startOrRetrieveTrace({
    name: traceConfig?.name || name,
    traceId,
    sessionId: session?.id?.toString(),
    userId: session?.user?.id,
    metadata: {
      agentName: name,
      agentType,
      messageCount: messages.length,
      startTime: new Date().toISOString(),
      ...traceConfig?.metadata,
    },
    tags: ["agent", name, agentType, ...(traceConfig?.tags || [])],
  });

  // 3) Log the agent start event
  logger.agentStart(name, messages.length, traceId);

  return { trace, traceId };
}

/**
 * Gathers tool calls and tool results from an array of steps.
 */
function collectToolData(
  steps: Array<{
    toolCalls?: Array<{
      type: string;
      toolCallId: string;
      toolName: string;
      args: Record<string, unknown>;
    }>;
    toolResults?: Array<{
      type: string;
      toolCallId: string;
      toolName: string;
      args: Record<string, unknown>;
      result: unknown;
    }>;
  }>
) {
  const allToolCalls: Array<{
    type: string;
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
  }> = [];
  const allToolResults: Array<{
    type: string;
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
    result: unknown;
  }> = [];

  for (const step of steps) {
    if (step.toolCalls) {
      allToolCalls.push(
        ...step.toolCalls.map((call) => ({
          ...call,
          type: "tool-roundup",
        }))
      );
    }
    if (step.toolResults) {
      allToolResults.push(
        ...step.toolResults.map((result) => ({
          ...result,
          type: "tool-roundup",
        }))
      );
    }
  }

  return { allToolCalls, allToolResults };
}

/**
 * Creates a streaming agent that can process messages and interact with tools.
 */
export function createStreamingAgent(
  config: AgentConfig,
  loggingConfig?: LoggingConfig
) {
  const {
    model,
    systemPrompt,
    tools,
    maxSteps,
    maxTokens,
    temperature,
    session,
    experimental_activeTools,
    name,
    traceConfig,
    logger,
  } = setupLoggerAndConfig(config, loggingConfig);

  async function agent(messages: Message[]) {
    const { trace, traceId } = startAgentTrace(
      logger,
      config,
      messages,
      "streaming"
    );

    try {
      const coreMessages = convertToCoreMessages(messages);

      // Create generation through logger
      const generation = logger.createGeneration({
        name: `${name}-llm-call`,
        model:
          typeof model === "object" &&
          "name" in model &&
          typeof model.name === "string"
            ? model.name
            : "unknown",
        modelParameters: {
          temperature,
          maxTokens,
          systemPrompt,
        },
        input: {
          messages,
          systemPrompt,
        },
        metadata: {
          startTime: new Date().toISOString(),
          agentType: "streaming",
        },
      });

      // Stream text from the LLM or other model
      const result = streamText({
        model,
        system: systemPrompt,
        messages: coreMessages,
        maxSteps,
        maxTokens,
        temperature,
        tools,
        experimental_activeTools,
        onStepFinish: ({ toolCalls, toolResults }) => {
          if (toolCalls?.length) {
            logger.startSpan({
              name: `${toolCalls[0].toolName}-tool`,
              input: toolCalls,
              metadata: {
                toolCount: toolCalls.length,
                tools: toolCalls.map((tc) => tc.toolName).join(", "),
                startTime: new Date().toISOString(),
              },
            });
          }

          if (toolResults?.length) {
            logger.updateSpan({
              output: toolResults,
              metadata: {
                type: "tool-results",
                endTime: new Date().toISOString(),
              },
            });
          }
        },
        onFinish: async ({
          response,
          toolCalls,
          toolResults,
          finishReason,
          usage,
        }) => {
          // End any active tool span
          logger.endSpan();
          // Log finish
          logger.agentFinish(name, finishReason, usage);
          // End the LLM generation
          generation?.end({
            output: response,
            usage: usage && {
              promptTokens: usage.promptTokens,
              completionTokens: usage.completionTokens,
              totalTokens: usage.totalTokens,
            },
            metadata: {
              finishReason,
              endTime: new Date().toISOString(),
            },
          });

          const lastMessage = response.messages[response.messages.length - 1];
          const lastContent = lastMessage.content[0];
          const resultText =
            typeof lastContent === "string"
              ? lastContent
              : "text" in lastContent
                ? lastContent.text
                : JSON.stringify(lastContent);

          trace?.update({
            input: {
              messages,
              systemPrompt,
            },
            output: {
              message: resultText,
            },
            metadata: {
              response,
              toolCalls,
              toolResults,
              usage,
              status: "completed",
              completionTime: new Date().toISOString(),
              agentType: "streaming",
            },
          });
        },
      });

      return result;
    } catch (error) {
      logger.agentError(name, error);
      throw error;
    } finally {
      await logger.flush();
    }
  }

  agent.run = async (messages: Message[]) => {
    try {
      logger.debug("Agent run invoked");
      const result = await agent(messages);

      // Collect streamed text
      let streamedText = "";
      for await (const chunk of result.textStream) {
        streamedText += chunk;
        process.stdout.write(chunk);
      }

      // Collect all tool calls and results
      const steps = await result.steps;
      const { allToolCalls, allToolResults } = collectToolData(steps);

      logger.agentRunComplete(allToolCalls.length, allToolResults.length);

      return {
        result,
        toolCalls: allToolCalls,
        toolResults: allToolResults,
        text: streamedText,
        agentType: "streaming" as AgentType,
      };
    } catch (error) {
      logger.error("Error running agent", error);
      throw error;
    } finally {
      // Non-blocking flush
      await logger.flush();
    }
  };

  return agent;
}

/**
 * Creates a 'TAgent' that uses generateText instead of streamText.
 * Effectively a non-streaming approach but preserves step/tool logging.
 */
export function createTextAgent(
  config: AgentConfig,
  loggingConfig?: LoggingConfig
) {
  const {
    model,
    systemPrompt,
    tools,
    maxSteps,
    maxTokens,
    temperature,
    session,
    experimental_activeTools,
    name,
    traceConfig,
    logger,
  } = setupLoggerAndConfig(config, loggingConfig);

  async function agent(messages: Message[]) {
    const { trace, traceId } = startAgentTrace(
      logger,
      config,
      messages,
      "text"
    );

    try {
      const coreMessages = convertToCoreMessages(messages);

      // Create a generation for the LLM call
      const generation = trace?.generation({
        name: `${name}-llm-call`,
        model:
          typeof model === "object" &&
          "name" in model &&
          typeof model.name === "string"
            ? model.name
            : "unknown",
        modelParameters: {
          temperature,
          maxTokens,
          systemPrompt,
        },
        input: {
          messages,
          systemPrompt,
        },
        metadata: {
          startTime: new Date().toISOString(),
          agentType: "non-streaming",
        },
      });

      // Generate text from the LLM
      const result = generateText({
        model,
        system: systemPrompt,
        messages: coreMessages,
        maxSteps,
        maxTokens,
        temperature,
        tools,
        experimental_activeTools,
        onStepFinish: ({ toolCalls, toolResults }) => {
          if (toolCalls?.length) {
            logger.startSpan({
              name: `${toolCalls[0].toolName}-tool`,
              input: toolCalls,
              metadata: {
                toolCount: toolCalls.length,
                tools: toolCalls.map((tc) => tc.toolName).join(", "),
                startTime: new Date().toISOString(),
              },
            });
          }
          if (toolResults?.length) {
            logger.updateSpan({
              output: toolResults,
              metadata: {
                type: "tool-results",
                endTime: new Date().toISOString(),
              },
            });
          }
        },
      });

      // End any active tool span
      logger.endSpan();

      // Await final generation
      const { text: resultText, steps, response, usage } = await result;

      logger.agentFinish(name, "Finished", usage);

      // Gather all tool calls and results
      const { allToolCalls, allToolResults } = collectToolData(steps);

      trace?.update({
        input: {
          messages,
          systemPrompt,
        },
        output: {
          message: resultText,
          toolCalls: allToolCalls,
          toolResults: allToolResults,
        },
        metadata: {
          response,
          usage,
          status: "completed",
          completionTime: new Date().toISOString(),
          agentType: "non-streaming",
        },
      });

      // Close out the LLM generation
      generation?.end({
        output: response,
        usage: usage && {
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          totalTokens: usage.totalTokens,
        },
        metadata: {
          finishReason: "generation finished",
          endTime: new Date().toISOString(),
          toolCalls: allToolCalls,
          toolResults: allToolResults,
        },
      });

      return result;
    } catch (error) {
      logger.agentError(name || "unnamed-agent", error);
      throw error;
    } finally {
      // Flush logs
      await logger.flush();
    }
  }

  agent.run = async (messages: Message[]) => {
    try {
      logger.debug("Agent run invoked");
      const result = await agent(messages);

      const steps = result.steps;
      const { allToolCalls, allToolResults } = collectToolData(steps);

      logger.agentRunComplete(allToolCalls.length, allToolResults.length);

      return {
        result,
        toolCalls: allToolCalls,
        toolResults: allToolResults,
        text: result.text,
        agentType: "text" as AgentType,
      };
    } catch (error) {
      logger.error("Error running agent", error);
      throw error;
    } finally {
      await logger.flush();
    }
  };

  return agent;
}

/**
 * Creates a non-streaming object generation agent (uses Zod schema validation).
 */
export function createObjectAgent<T>(
  config: AgentConfig,
  loggingConfig?: LoggingConfig
) {
  const {
    model,
    systemPrompt,
    tools,
    maxTokens,
    temperature,
    langfuse,
    session,
    experimental_activeTools,
    logger,
  } = setupLoggerAndConfig(config, loggingConfig);
  const { schema } = config;

  async function agent(messages: Message[]) {
    const trace = langfuse?.trace({
      name: "object-agent",
      userId: session?.user?.id,
      metadata: {
        sessionId: session || "no session token",
        route: "object-agent",
        agentType: "object",
      },
    });

    try {
      logger.debug("Object agent started", { messagesCount: messages.length });
      const coreMessages = convertToCoreMessages(messages);

      if (!schema) {
        throw new Error("Schema is required for object generation");
      }

      const result = await generateObject<T>({
        model,
        system: systemPrompt,
        messages: coreMessages,
        maxTokens,
        temperature,
        schema: schema as unknown as ZodType<T>,
      });

      trace?.update({
        output: result,
        metadata: {
          agentType: "object",
        },
      });

      return { ...result, agentType: "object" as AgentType };
    } catch (error) {
      logger.error("Error in object agent", error);
      throw error;
    } finally {
      await logger.flush();
      logger.debug("Object agent finished");
    }
  }

  return agent;
}

/**
 * Creates a unified agent that can handle both streaming and non-streaming cases.
 */
export function createAgent(
  config: AgentConfig & { stream?: boolean },
  loggingConfig?: LoggingConfig
) {
  const { stream = false, ...baseConfig } = config;

  // Choose between streaming or TAgent based on the 'stream' flag
  return stream
    ? createStreamingAgent(baseConfig, loggingConfig)
    : createTextAgent(baseConfig, loggingConfig);
}
