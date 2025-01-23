import { tool } from "ai";
import type { CoreTool } from "ai";
import type { z } from "zod";
import { createLogger, type LoggingConfig } from "./logger";

/**
 * Wraps a tool function with logging and standardized structure
 *
 * @param description - Human readable description of what the tool does
 * @param params - Configuration object for the tool
 * @param params.parameters - Zod schema defining the expected parameters
 * @param params.execute - Async function that implements the tool's logic
 * @returns A function that accepts optional logging config and returns a CoreTool
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
 * // Use in agent with logging config
 * tools: {
 *   weather: weatherTool(loggingConfig)
 * }
 * ```
 */
export const wrapTool = <T extends z.ZodObject<z.ZodRawShape>, R>(config: {
  description: string;
  parameters: T;
  execute: (args: z.infer<T>) => Promise<R>;
}) => {
  // Extract tool name from description for cleaner logging
  const toolName = config.description
    .toLowerCase()
    .split(" ")[0] // Take first word
    .replace(/[^a-z0-9]/g, "-"); // Clean up special characters

  // Return a function that accepts logging config
  return (loggingConfig?: LoggingConfig): CoreTool => {
    const logger = createLogger(loggingConfig);

    return tool({
      description: config.description,
      parameters: config.parameters,
      execute: async (args) => {
        try {
          // Start tool execution span
          logger.toolStart(toolName, args);

          const startTime = Date.now();
          const result = await config.execute(args);
          const duration = Date.now() - startTime;

          // Log success and end span
          logger.toolSuccess(toolName, duration, result);

          return result;
        } catch (error) {
          // Log error and end span
          logger.toolError(toolName, error, args);
          throw error;
        }
      },
    });
  };
};
