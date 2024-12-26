import type { LangfuseTraceClient } from 'langfuse';
import { tool } from 'ai';
import type { z } from 'zod';

export interface ToolConfig {
  traceId?: string;
  trace?: LangfuseTraceClient;
}

export type ToolExecuteFunction<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

export function createTool<TInput, TOutput>({
  name,
  description,
  parameters,
  execute,
  config = {},
}: {
  name: string;
  description: string;
  parameters: z.ZodType<TInput>;
  execute: ToolExecuteFunction<TInput, TOutput>;
  config?: ToolConfig;
}) {
  return tool({
    description,
    parameters,
    execute: async (input: TInput) => {
      const { trace, traceId } = config;

      if (trace && traceId) {
        trace.span({
          name: `${name}-tool`,
          id: traceId,
          input,
        });
      }

      try {
        const output = await execute(input);

        if (trace && traceId) {
          trace.span({
            name: `${name}-tool`,
            id: traceId,
            output,
          });
        }

        return output;
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'An unknown error occurred';
          
        throw new Error(`${name} tool failed: ${errorMessage}`);
      }
    },
  });
}

