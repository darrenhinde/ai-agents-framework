import { tool } from "ai";
import type { CoreTool } from "ai";
import { z } from "zod";

/**
 * Wraps a tool function with logging and standardized structure
 *
 * @param description - Human readable description of what the tool does
 * @param params - Configuration object for the tool
 * @param params.parameters - Zod schema defining the expected parameters
 * @param params.execute - Async function that implements the tool's logic
 * @returns A CoreTool that can be used with the streaming agent
 *
 * @example
 * ```ts
 * const weatherTool = wrapTool(
 *   "Get the weather in a given city",
 *   {
 *     parameters: z.object({
 *       location: z.string().describe("The city to get weather for")
 *     }),
 *     execute: async ({ location }) => {
 *       // Implementation
 *       return { temperature: 24 };
 *     }
 *   }
 * );
 * ```
 */
export const wrapTool = <T extends z.ZodObject<any>, R>(config: {
  description: string;
  parameters: T;
  execute: (args: z.infer<T>) => Promise<R>;
}) => {
  return tool({
    description: config.description,
    parameters: config.parameters,
    execute: async (args) => {
      console.log("Tool Execution Started:", {
        description: config.description,
        args,
      });

      const result = await config.execute(args);

      console.log("Tool Execution Completed:", {
        description: config.description,
        args,
        result,
      });
      return result;
    },
  });
};
