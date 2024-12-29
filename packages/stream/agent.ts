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

  return async function (messages: Message[]) {
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
  };
}
