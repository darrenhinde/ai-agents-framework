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
import { createLogger, type LoggingConfig } from "./logger";

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
  tools?: Record<string, CoreTool>;
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
 * Creates a streaming agent that can process messages and interact with tools.
 * You can optionally pass loggingConfig to enable or disable specific logging features.
 */
export function createStreamingAgent(
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

  /**
   * The core agent function that streams text
   */
  async function agent(messages: Message[]) {
    // Create a unique trace ID for this run
    const traceId = generateUUID();

    // Start a new trace for this agent run
    const trace = logger.langfuse?.startTrace({
      name: traceConfig?.name || name,
      userId: session?.user?.id,
      sessionId: session?.id?.toString() || traceId,

      metadata: {
        agentName: name,
        messageCount: messages.length,
        startTime: new Date().toISOString(),
        ...traceConfig?.metadata,
      },
      tags: ["agent", name, ...(traceConfig?.tags || [])],
    });

    // Set the current trace in the logger
    if (trace) {
      logger.setCurrentTrace(trace);
    }

    try {
      // Log start using centralized method
      logger.agentStart(name, messages.length, traceId);

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
          messages: messages,
          systemPrompt,
        },
        metadata: {
          startTime: new Date().toISOString(),
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

        onStepFinish: ({
          text,
          toolCalls,
          toolResults,
          finishReason,
          usage,
        }) => {
          if (toolCalls?.length) {
            // Start a new span for tool calls
            logger.startSpan({
              name: "tool-execution",
              input: toolCalls,
              metadata: {
                toolCount: toolCalls.length,
                tools: toolCalls.map((tc) => tc.toolName).join(", "),
                startTime: new Date().toISOString(),
              },
            });
          }

          // Log tool results and update span
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

          // Log finish using centralized method
          logger.agentFinish(name, finishReason, usage);

          // End the LLM generation with results
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
          // Update the main trace with final results
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
              messages: messages,
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
            },
          });
        },
      });

      return result;
    } catch (error) {
      // Log error using centralized method
      logger.agentError(name, error);
      throw error;
    } finally {
      // End the trace and flush logs
      await logger.flush();
    }
  }

  agent.run = async (messages: Message[]) => {
    try {
      logger.debug("Agent run invoked");
      const result = await agent(messages);

      // Initialize arrays to collect all tool calls and results
      const allToolCalls: Array<{
        type: "tool-call";
        toolCallId: string;
        toolName: string;
        args: Record<string, unknown>;
      }> = [];
      const allToolResults: Array<{
        type: "tool-result";
        toolCallId: string;
        toolName: string;
        args: Record<string, unknown>;
        result: unknown;
      }> = [];

      // Collect the streamed text while maintaining streaming to output
      let streamedText = "";
      for await (const chunk of result.textStream) {
        streamedText += chunk;
        // Still write to stdout for real-time feedback
        process.stdout.write(chunk);
      }

      // Collect tool calls and results from all steps
      const steps = await result.steps;
      for (const step of steps) {
        if (step.toolCalls?.length) {
          allToolCalls.push(...step.toolCalls);
        }
        if (step.toolResults?.length) {
          allToolResults.push(...step.toolResults);
        }
      }

      // Log completion using centralized method
      logger.agentRunComplete(allToolCalls.length, allToolResults.length);

      return {
        result,
        toolCalls: allToolCalls,
        toolResults: allToolResults,
        text: streamedText,
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
 * Creates a non-streaming text generation agent
 */
export function createTextAgent(
  config: AgentConfig,
  loggingConfig?: LoggingConfig
) {
  const {
    model,
    systemPrompt,
    tools = {},
    maxTokens = 4096,
    temperature = 0.7,
    langfuse,
    session,
    experimental_activeTools,
  } = config;

  const logger = createLogger(loggingConfig);

  async function agent(messages: Message[]) {
    const trace = langfuse?.trace({
      name: "text-agent",
      userId: session?.user?.id,
      metadata: {
        sessionId: session || "no session token",
        route: "text-agent",
      },
    });

    try {
      logger.debug("Text agent started", { messagesCount: messages.length });
      const coreMessages = convertToCoreMessages(messages);

      const result = await generateText({
        model,
        system: systemPrompt,
        messages: coreMessages,
        maxTokens,
        temperature,
        tools,
        experimental_activeTools,
      });

      trace?.update({
        output: result,
      });

      return result;
    } catch (error) {
      logger.error("Error in text agent", error);
      throw error;
    } finally {
      // Non-blocking flush
      await logger.flush();
      logger.debug("Text agent finished");
    }
  }

  return agent;
}

/**
 * Creates a non-streaming object generation agent
 */
export function createObjectAgent<T>(
  config: AgentConfig,
  loggingConfig?: LoggingConfig
) {
  const {
    model,
    systemPrompt,
    tools = {},
    maxTokens = 4096,
    temperature = 0.7,
    langfuse,
    session,
    experimental_activeTools,
  } = config;

  const logger = createLogger(loggingConfig);

  async function agent(messages: Message[]) {
    const trace = langfuse?.trace({
      name: "object-agent",
      userId: session?.user?.id,
      metadata: {
        sessionId: session || "no session token",
        route: "object-agent",
      },
    });

    try {
      logger.debug("Object agent started", { messagesCount: messages.length });
      const coreMessages = convertToCoreMessages(messages);
      if (!config.schema) {
        throw new Error("Schema is required for object generation");
      }

      const result = await generateObject<T>({
        model,
        system: systemPrompt,
        messages: coreMessages,
        maxTokens,
        temperature,
        schema: config.schema as unknown as ZodType<T>,
      });

      trace?.update({
        output: result,
      });

      return result;
    } catch (error) {
      logger.error("Error in object agent", error);
      throw error;
    } finally {
      // Non-blocking flush
      await logger.flush();
      logger.debug("Object agent finished");
    }
  }

  return agent;
}
