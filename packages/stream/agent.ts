import {
  type Message,
  convertToCoreMessages,
  streamText,
  NoSuchToolError,
  InvalidToolArgumentsError,
  LanguageModelV1,
  CoreTool,
} from "ai";

import { Langfuse } from "langfuse";

export const logger = {
  debug: (...args: unknown[]) => console.debug("[DEBUG]", ...args),
  error: (...args: unknown[]) => console.error("[ERROR]", ...args),
};

interface AgentConfig {
  model: LanguageModelV1;
  systemPrompt: string;
  tools?: Record<string, CoreTool<any, any>>;
  maxSteps?: number;
  maxTokens?: number;
  temperature?: number;
  langfuse?: Langfuse;
  session?: any;
  experimental_activeTools?: string[];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates a streaming agent that can process messages and interact with tools.
 * Returns both the raw agent function and a convenience run method.
 *
 * @example
 * ```ts
 * // Create the agent
 * const agent = createStreamingAgent({
 *   model: getModel("gpt-4"),
 *   systemPrompt: "You are a helpful assistant",
 *   tools: { weather: weatherTool }
 * });
 *
 * // Option 1: Use agent.run() for automatic streaming to stdout
 * await agent.run([
 *   { role: "user", content: "What's the weather?", id: "1" }
 * ]);
 *
 * // Option 2: Use agent() directly to handle the stream yourself
 * const response = await agent([
 *   { role: "user", content: "What's the weather?", id: "1" }
 * ]);
 * for await (const chunk of response.textStream) {
 *   // Handle chunks as needed
 * }
 * ```
 */
export function createStreamingAgent(config: AgentConfig) {
  const {
    model,
    systemPrompt,
    tools = {},
    maxSteps = 5,
    maxTokens = 4096,
    temperature = 0.7,
    langfuse,
    session,
  } = config;

  async function agent(messages: Message[]) {
    const trace = langfuse?.trace({
      name: "streaming-agent",
      userId: session?.user?.id,
      metadata: {
        sessionId: session || "no session token",
        route: "streaming-agent",
      },
    });

    try {
      const coreMessages = convertToCoreMessages(messages);

      const result = await streamText({
        model,
        system: systemPrompt,
        messages: coreMessages,
        maxSteps,
        //experimental_activeTools,
        maxTokens,
        temperature,
        tools,

        onStepFinish: ({
          text,
          toolCalls,
          toolResults,
          finishReason,
          usage,
        }) => {
          if (toolCalls?.length > 0) {
            logger.debug("Tool calls:", toolCalls);
          }

          if (toolResults?.length > 0) {
            logger.debug("Tool results:", toolResults);
          }
        },

        onFinish: async ({
          response,
          toolCalls,
          toolResults,
          finishReason,
          usage,
        }) => {
          logger.debug("Stream finished", {
            toolCalls,
            toolResults,
            finishReason,
            usage,
          });
          trace?.update({
            output: {
              toolCalls,
              toolResults,
              finishReason,
              usage,
            },
          });
        },
      });

      return result;
    } catch (error) {
      logger.error("Error in streaming agent:", error);
      throw error;
    } finally {
      await langfuse?.flushAsync();
    }
  }

  agent.run = async (messages: Message[]) => {
    try {
      const response = await agent(messages);

      // Handle streaming output
      for await (const chunk of response.textStream) {
        process.stdout.write(chunk);
      }

      // Get final results
      const toolCalls = await response.toolCalls;
      const toolResults = await response.toolResults;

      return {
        response,
        toolCalls,
        toolResults,
      };
    } catch (error) {
      logger.error("Error running agent:", error);
      throw error;
    }
  };

  return agent;
}
