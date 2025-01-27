import { tool } from "ai";
import type { CoreTool } from "ai";
import type { z } from "zod";
import { createLogger, type LoggingConfig, type Logger } from "./logger";

// Define a type for a tool factory function
export type ToolFactory = (logger: Logger) => CoreTool;

/**
 * Wraps a tool function with logging and standardized structure
 *
 * @param description - Human readable description of what the tool does
 * @param params - Configuration object for the tool
 * @param params.parameters - Zod schema defining the expected parameters
 * @param params.execute - Async function that implements the tool's logic
 * @returns A function that accepts a logger instance and returns a CoreTool
 *
 * @example
 * ```ts
 * const weatherTool = wrapTool({
 *   description: "Get the weather in a given city",
 *   parameters: z.object({
 *     location: z.string().describe("The city to get weather for")
 *   }),
 *   execute: async ({ location }) => {
 *     // Implementation
 *     return { temperature: 24 };
 *   }
 * });
 *
 * // Use in agent with existing logger
 * tools: {
 *   weather: weatherTool(logger)
 * }
 * ```
 */
export const wrapTool = <T extends z.ZodObject<z.ZodRawShape>, R>(config: {
  description: string;
  parameters: T;
  execute: (args: z.infer<T>) => Promise<R>;
}): ToolFactory => {
  // Extract tool name from description for cleaner logging
  const toolName = config.description
    .toLowerCase()
    .split(" ")[0] // Take first word
    .replace(/[^a-z0-9]/g, "-"); // Clean up special characters

  // Return a function that accepts logger instance
  return (logger: Logger): CoreTool => {
    return tool({
      description: config.description,
      parameters: config.parameters,
      execute: async (args) => {
        let span;
        try {
          // Start a new span for this tool execution
          try {
            span = logger.startSpan({
              name: `tool-${toolName}`,
              input: args,
              metadata: {
                toolName,
                type: "tool-execution",
                startTime: new Date().toISOString(),
              },
            });
          } catch (error) {
            // Silently handle logging errors
            console.warn("Failed to start logging span:", error);
          }

          const startTime = Date.now();
          const result = await config.execute(args);
          const duration = Date.now() - startTime;

          // Update span with success result
          try {
            logger.updateSpan({
              output: result,
              metadata: {
                toolName,
                duration,
                status: "success",
                endTime: new Date().toISOString(),
              },
            });
          } catch (error) {
            // Silently handle logging errors
            console.warn("Failed to update logging span:", error);
          }

          return result;
        } catch (error) {
          // Update span with error
          try {
            logger.updateSpan({
              output: {
                error: error instanceof Error ? error.message : "Unknown error",
              },
              metadata: {
                toolName,
                status: "error",
                severity: "ERROR",
                stack: error instanceof Error ? error.stack : undefined,
                endTime: new Date().toISOString(),
              },
            });
          } catch (loggingError) {
            // Silently handle logging errors
            console.warn(
              "Failed to update logging span with error:",
              loggingError
            );
          }
          throw error;
        } finally {
          // Always try to end the span
          try {
            logger.endSpan();
          } catch (error) {
            // Silently handle logging errors
            console.warn("Failed to end logging span:", error);
          }
        }
      },
    });
  };
};
