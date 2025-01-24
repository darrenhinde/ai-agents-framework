import type { createDataStreamResponse, DataStreamWriter } from "ai";
import type { Langfuse } from "langfuse";
import {
  createLangfuseLogger,
  type LangfuseLoggerConfig,
} from "./logger-langfuse";

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface LogData {
  level: "debug" | "info" | "error";
  message: string;
  data?: JSONValue;
  metadata?: { [key: string]: JSONValue };
  tags?: JSONValue[];
  timestamp: string;
}

export interface LoggingConfig {
  dataStream?: DataStreamWriter;
  langfuse?: LangfuseLoggerConfig;
  metadata?: Record<string, unknown>;
  tags?: string[];
  debug?: boolean;
  currentTrace?: ReturnType<Langfuse["trace"]>;
}

const EVENT_TYPES = {
  TOOL_START: "tool.start",
  TOOL_SUCCESS: "tool.success",
  TOOL_ERROR: "tool.error",
  AGENT_START: "agent.start",
  AGENT_STEP: "agent.step",
  AGENT_TOOL_CALL: "agent.tool_call",
  AGENT_TOOL_RESULT: "agent.tool_result",
  AGENT_FINISH: "agent.finish",
  AGENT_ERROR: "agent.error",
} as const;

// Helper function to write to data stream with consistent error handling
function writeToDataStream(
  dataStream: DataStreamWriter | undefined,
  type: string,
  content: unknown
) {
  if (!dataStream) return;

  try {
    dataStream.writeData({
      type,
      content: typeof content === "string" ? content : JSON.stringify(content),
    });
  } catch (error) {
    console.error("Failed to write to data stream:", error);
  }
}

// Helper to detect environment and get appropriate waitUntil
function getEnvironmentWaitUntil() {
  type WaitUntilFn = (promise: Promise<unknown>) => Promise<unknown>;

  // Check if we're in Cloudflare Workers
  if (
    typeof globalThis.addEventListener === "function" &&
    typeof globalThis.Response === "function"
  ) {
    return ((promise: Promise<unknown>) => {
      // In Cloudflare, waitUntil is available via event context
      // This will be handled by the agent wrapper
      return promise;
    }) as WaitUntilFn;
  }

  // Check if we're in Vercel
  try {
    const vercelFunctions = require("@vercel/functions");
    if (vercelFunctions?.waitUntil) {
      return vercelFunctions.waitUntil as WaitUntilFn;
    }
  } catch {}

  // Default to regular Promise for other environments
  return (async (promise: Promise<unknown>) => {
    await promise;
  }) as WaitUntilFn;
}

export function createLogger(config?: LoggingConfig) {
  let currentTrace = config?.currentTrace;
  let currentSpan:
    | ReturnType<ReturnType<Langfuse["trace"]>["span"]>
    | undefined;

  function setCurrentTrace(trace: ReturnType<Langfuse["trace"]>) {
    currentTrace = trace;
  }

  // Non-blocking logging wrapper
  function safeLog(fn: () => void) {
    try {
      fn();
    } catch (error) {
      console.warn("Logging error:", error);
    }
  }

  // Start a new span for a tool or operation
  function startSpan(params: {
    name: string;
    input?: unknown;
    metadata?: Record<string, unknown>;
  }) {
    if (!currentTrace) return;

    try {
      currentSpan = currentTrace.span({
        name: params.name,
        input: params.input,
        metadata: {
          ...params.metadata,
          startTime: new Date().toISOString(),
        },
      });
      return currentSpan;
    } catch (error) {
      console.warn("Error starting span:", error);
    }
  }

  // Update the current span with new information
  function updateSpan(params: {
    output?: unknown;
    metadata?: Record<string, unknown>;
    statusMessage?: string;
  }) {
    if (!currentSpan) return;

    try {
      currentSpan.update({
        output: params.output,
        metadata: {
          ...params.metadata,
          updateTime: new Date().toISOString(),
        },
        statusMessage: params.statusMessage,
      });
    } catch (error) {
      console.warn("Error updating span:", error);
    }
  }

  // End the current span
  function endSpan(params?: {
    output?: unknown;
    metadata?: Record<string, unknown>;
    statusMessage?: string;
  }) {
    if (!currentSpan) return;

    try {
      currentSpan.end({
        output: params?.output,
        metadata: {
          ...params?.metadata,
          endTime: new Date().toISOString(),
        },
        statusMessage: params?.statusMessage,
      });
      currentSpan = undefined;
    } catch (error) {
      console.warn("Error ending span:", error);
    }
  }

  const environmentWaitUntil = getEnvironmentWaitUntil();

  // Initialize Langfuse logger if configured
  const langfuseLogger = config?.langfuse?.langfuse
    ? createLangfuseLogger(config.langfuse)
    : undefined;

  const logger = {
    setCurrentTrace,
    startSpan,
    updateSpan,
    endSpan,
    debug: (message: string, data?: unknown) => {
      if (!config?.debug) return;
      safeLog(() => {
        log("debug", message, data);
        if (currentTrace) {
          currentTrace.update({
            metadata: {
              debug: { message, data },
              timestamp: new Date().toISOString(),
            },
          });
        }
      });
    },
    error: (message: string, data?: unknown) => {
      safeLog(() => {
        log("error", message, data);
        if (currentTrace) {
          currentTrace.update({
            metadata: {
              error: { message, data },
              timestamp: new Date().toISOString(),
              severity: "ERROR",
              statusMessage: message,
            },
          });
        }
      });
    },
    // Tool-specific logging methods
    toolStart: (toolName: string, args: unknown) => {
      if (!config?.debug) return;
      safeLog(() => {
        log("debug", `Tool ${toolName} execution started`, { args });
        startSpan({
          name: `tool-${toolName}`,
          input: args,
          metadata: {
            toolName,
            type: `tool-execution-${toolName}`,
          },
        });
      });
    },
    toolSuccess: (toolName: string, duration: number, result: unknown) => {
      if (!config?.debug) return;
      safeLog(() => {
        log("debug", `Tool ${toolName} execution completed`, {
          duration,
          result,
        });
        endSpan({
          output: result,
          metadata: {
            toolName,
            duration,
            actualDuration: duration,
            status: "success",
          },
        });
      });
    },
    toolError: (toolName: string, error: unknown, args: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      safeLog(() => {
        log("error", `Tool ${toolName} execution failed`, {
          error: errorMessage,
          args,
        });
        endSpan({
          output: { error: errorMessage },
          metadata: {
            toolName,
            status: "error",
            severity: "ERROR",
            stack: error instanceof Error ? error.stack : undefined,
            statusMessage: errorMessage,
          },
        });
      });
    },
    // Agent-specific logging methods
    agentStart: (name: string, messageCount: number, traceId: string) => {
      if (!config?.debug) return;
      safeLog(() => {
        log("debug", `Agent ${name} started`, {
          messagesCount: messageCount,
          traceId,
        });
        if (currentTrace) {
          currentTrace.update({
            metadata: {
              agentName: name,
              messageCount,
              traceId,
              status: "started",
            },
          });
        }
      });
    },
    agentToolCall: (traceId: string, toolCalls: unknown) => {
      safeLog(() => {
        log("debug", "Tool calls", { toolCalls, traceId });
        updateSpan({
          metadata: {
            toolCalls,
            traceId,
            type: "tool-calls",
          },
        });
      });
    },
    agentToolResult: (traceId: string, toolResults: unknown) => {
      safeLog(() => {
        log("debug", "Tool results", { toolResults, traceId });
        updateSpan({
          output: toolResults,
          metadata: {
            traceId,
            type: "tool-results",
          },
        });
      });
    },
    agentFinish: (name: string, finishReason?: string, usage?: unknown) => {
      if (!config?.debug) return;
      safeLog(() => {
        log("debug", `Agent ${name} stream finished`, { finishReason, usage });
        if (currentTrace) {
          currentTrace.update({
            metadata: {
              agentName: name,
              finishReason,
              usage,
              status: "completed",
              endTime: new Date().toISOString(),
            },
          });
        }
      });
    },
    agentError: (name: string, error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      safeLog(() => {
        log("error", `Agent ${name} failed`, { error: errorMessage });
        if (currentTrace) {
          currentTrace.update({
            metadata: {
              agentName: name,
              error: errorMessage,
              stack: error instanceof Error ? error.stack : undefined,
              status: "error",
              severity: "ERROR",
              statusMessage: errorMessage,
              endTime: new Date().toISOString(),
            },
          });
        }
      });
    },
    agentRunComplete: (toolCallsCount: number, toolResultsCount: number) => {
      safeLog(() => {
        log("debug", "Agent run completed", {
          toolCallsCount,
          toolResultsCount,
        });
        if (currentTrace) {
          currentTrace.update({
            metadata: {
              toolCallsCount,
              toolResultsCount,
              status: "completed",
              endTime: new Date().toISOString(),
            },
          });
        }
      });
    },
    // Expose Langfuse logging capabilities
    langfuse: langfuseLogger,
    flush: async () => {
      if (!config) return;

      const flushPromises: Promise<unknown>[] = [];

      // End any active span
      if (currentSpan) {
        try {
          currentSpan.end();
          currentSpan = undefined;
        } catch (error) {
          console.warn("Error ending span during flush:", error);
        }
      }

      // Flush Langfuse if configured
      if (langfuseLogger) {
        flushPromises.push(
          langfuseLogger.endTrace().catch((error) => {
            console.warn("Error flushing Langfuse:", error);
          })
        );
      }

      const flushPromise = Promise.all(flushPromises);
      return environmentWaitUntil(flushPromise);
    },
  };

  function log(
    level: "debug" | "info" | "error",
    message: string,
    data?: unknown
  ) {
    const logData: LogData = {
      level,
      message,
      data: data as JSONValue,
      metadata: config?.metadata as { [key: string]: JSONValue },
      tags: config?.tags as JSONValue[],
      timestamp: new Date().toISOString(),
    };

    if (level === "debug") {
      console.debug(logData);
    }

    if (level === "error" && config?.dataStream) {
      console.error(logData);
    }

    // Write debug logs to data stream
    if (config?.dataStream) {
      writeToDataStream(config.dataStream, "debug", logData);
    }

    // Log to Langfuse if configured
    if (langfuseLogger?.getCurrentTrace()) {
      langfuseLogger.logEvent({
        name: "log-event",
        level: level === "error" ? "ERROR" : "DEBUG",
        metadata: {
          message,
          data,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  return logger;
}
