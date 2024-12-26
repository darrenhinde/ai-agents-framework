import type { LangfuseTraceClient } from 'langfuse';
import type { Langfuse } from 'langfuse';
import { generateText } from 'ai';
import type { LanguageModelV1, CoreTool, ToolExecutionOptions } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';

export interface AgentConfig {
  name: string;
  traceId?: string;
  trace?: LangfuseTraceClient;
  metadata?: Record<string, unknown>;
  createNewTrace?: boolean;
  langfuse?: Langfuse;
  parentTraceId?: string;
  isServerless?: boolean; // Flag to indicate if running in serverless environment
}

export interface AgentOptions {
  maxSteps?: number;
  systemPrompt: string;
  tools?: Record<string, CoreTool<z.ZodType<Record<string, unknown>>, unknown>>;
  model: LanguageModelV1;
  requireStructuredOutput?: boolean; // Add option for requiring structured output
}

interface ToolContext {
  traceId: string;
  trace: LangfuseTraceClient;
  parentSpanId?: string;
  toolResultCache?: Map<string, unknown>; // Add cache for tool results
}

// Safe wrapper for Langfuse operations with proper error handling
async function safeTraceOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string,
  defaultValue?: T
): Promise<T | undefined> {
  try {
    return await operation();
  } catch (error) {
    console.warn(errorMessage, error instanceof Error ? error.message : String(error));
    return defaultValue;
  }
}

// Ensure all traces are flushed, especially important in serverless environments
async function ensureTraceFlushed(langfuse?: Langfuse, trace?: LangfuseTraceClient) {
  if (!langfuse && !trace) return;

  const flushPromises: Promise<void>[] = [];

  if (langfuse) {
    flushPromises.push(
      safeTraceOperation(
        () => langfuse.flushAsync(),
        'Failed to flush Langfuse instance'
      ) as Promise<void>
    );
  }

  if (trace && 'flushAsync' in trace) {
    flushPromises.push(
      safeTraceOperation(
        () => (trace as unknown as { flushAsync: () => Promise<void> }).flushAsync(),
        'Failed to flush trace'
      ) as Promise<void>
    );
  }

  if (flushPromises.length > 0) {
    await Promise.allSettled(flushPromises);
  }
}

function wrapToolWithTracing(
  toolName: string,
  tool: CoreTool<z.ZodType<Record<string, unknown>>, unknown>,
  context: ToolContext
) {
  const { traceId, trace, parentSpanId, toolResultCache = new Map() } = context;
  const wrappedTool: typeof tool = {
    ...tool,
    execute: async (args: Record<string, unknown>, options: ToolExecutionOptions) => {
      const spanId = uuidv4();
      let result: unknown;
      
      // Check cache for identical tool calls
      const cacheKey = JSON.stringify({ toolName, args });
      if (toolResultCache.has(cacheKey)) {
        console.log(`Using cached result for ${toolName}`);
        return toolResultCache.get(cacheKey);
      }
      
      // Create span for tool execution with better input logging
      await safeTraceOperation(
        async () => {
          if (!trace) return;
          
          trace.span({
            name: `tool-execution-${toolName}`,
            id: spanId,
            input: {
              tool: toolName,
              arguments: args,
              toolCallId: options.toolCallId,
              timestamp: new Date().toISOString()
            }
          });

          try {
            result = await tool.execute(args, options);
            toolResultCache.set(cacheKey, result); // Cache the result
            
            // Log successful tool execution with detailed output
            trace.span({
              name: `tool-execution-${toolName}-complete`,
              id: spanId,
              output: {
                result,
                timestamp: new Date().toISOString(),
                success: true
              }
            });

            return result;
          } catch (error) {
            // Log tool execution error with more context
            trace.span({
              name: `tool-execution-${toolName}-error`,
              id: spanId,
              output: {
                error: error instanceof Error ? error.message : String(error),
                timestamp: new Date().toISOString(),
                success: false
              },
              statusMessage: "Error",
              level: "ERROR"
            });
            throw error;
          }
        },
        `Failed to trace tool execution for ${toolName}`
      );

      return result;
    }
  };

  return wrappedTool;
}

export function createAgent(config: AgentConfig) {
  return async function agent(
    options: AgentOptions,
    userPrompt: string
  ) {
    const traceId = config.traceId || uuidv4();
    let trace = config.trace;
    let response: unknown;
    const toolResultCache = new Map<string, unknown>();

    // Create new trace if requested or if no trace exists
    if (config.langfuse && (!trace || config.createNewTrace)) {
      const newTrace = await safeTraceOperation(
        async () => config.langfuse?.trace({
          id: traceId,
          name: `${config.name}-trace`,
          metadata: {
            ...config.metadata,
            parentTraceId: config.parentTraceId,
            isServerless: config.isServerless,
            requireStructuredOutput: options.requireStructuredOutput,
            maxSteps: options.maxSteps
          },
          input: {
            systemPrompt: options.systemPrompt,
            userPrompt,
            tools: Object.keys(options.tools || {}),
            timestamp: new Date().toISOString()
          }
        }),
        'Failed to create Langfuse trace'
      );
      if (newTrace) {
        trace = newTrace;
      }
    }

    // Create main span for agent execution if tracing is available
    const mainSpanId = uuidv4();
    if (trace) {
      await safeTraceOperation(
        async () => {
          if (!trace) return;
          
          trace.span({
            name: `${config.name}-agent-start`,
            id: mainSpanId,
            input: {
              systemPrompt: options.systemPrompt,
              userPrompt,
              parentTraceId: config.parentTraceId,
              ...config.metadata
            }
          });
        },
        'Failed to create agent start span'
      );
    }

    try {
      // Wrap tools with tracing if they exist and tracing is available
      const wrappedTools = options.tools && trace ? 
        Object.entries(options.tools).reduce<Record<string, CoreTool<z.ZodType<Record<string, unknown>>, unknown>>>(
          (acc, [name, tool]) => {
            acc[name] = wrapToolWithTracing(name, tool, { 
              traceId, 
              trace, 
              parentSpanId: mainSpanId,
              toolResultCache 
            });
            return acc;
          }, 
          {}
        ) : 
        options.tools;

      const result = await generateText({
        ...options,
        tools: wrappedTools,
        prompt: userPrompt,
        toolChoice: wrappedTools ? (options.requireStructuredOutput ? 'required' : 'auto') : 'none',
        maxSteps: options.maxSteps || 3, // Default to 3 steps if not specified
        experimental_telemetry: trace ? {
          isEnabled: true,
          functionId: `${config.name}-${options.model.modelId}`,
          metadata: {
            traceId,
            agentName: config.name,
            spanId: mainSpanId,
            langfuseTraceId: traceId,
            parentTraceId: config.parentTraceId,
            isServerless: config.isServerless,
            requireStructuredOutput: options.requireStructuredOutput,
            toolResultCache: Array.from(toolResultCache.keys()),
            ...config.metadata
          }
        } : undefined
      });

      // Log tool calls and their results if tracing is available
      if (trace && result.toolCalls && Array.isArray(result.toolCalls)) {
        await Promise.all(result.toolCalls.map(async toolCall => {
          if ('toolName' in toolCall && 'args' in toolCall && trace) {
            const toolResult = await safeTraceOperation(
              async () => {
                const generation = trace.generation({
                  name: `tool-call-${toolCall.toolName}`,
                  model: options.model.modelId,
                  modelParameters: {
                    tool: toolCall.toolName,
                    maxSteps: options.maxSteps,
                    requireStructuredOutput: options.requireStructuredOutput
                  },
                  input: toolCall.args
                });

                // Update the generation with the tool's output
                if ('output' in toolCall) {
                  generation.update({
                    output: toolCall.output,
                    endTime: new Date()
                  });
                }

                return generation;
              },
              `Failed to log tool call for ${toolCall.toolName}`
            );

            return toolResult;
          }
          return Promise.resolve();
        }));
      }

      // Format the response based on whether structured output is required
      response = options.requireStructuredOutput ? {
        toolCalls: result.toolCalls,
        structuredOutput: result.text
      } : {
        messages: [{
          role: 'assistant',
          content: [
            { type: 'text', text: result.text },
            ...(result.toolCalls || []).map(toolCall => ({
              type: 'tool_call',
              toolName: toolCall.toolName,
              args: toolCall.args,
              toolResults: toolCall.args
            }))
          ]
        }],
        toolResults: (result.toolCalls || []).reduce((acc, call) => {
          Object.assign(acc, { [call.toolName]: call.args });
          return acc;
        }, {} as Record<string, unknown>)
      };

      // Log final result if tracing is available
      if (trace) {
        await safeTraceOperation(
          async () => {
            if (!trace) return;
            
            trace.span({
              name: `${config.name}-agent-complete`,
              id: mainSpanId,
              output: {
                text: result.text,
                toolCalls: result.toolCalls,
                structuredOutput: options.requireStructuredOutput ? result.text : undefined
              }
            });

            // Update the trace with final results
            trace.update({
              output: {
                text: result.text,
                toolCalls: result.toolCalls,
                structuredOutput: options.requireStructuredOutput ? result.text : undefined
              }
            });
          },
          'Failed to log agent completion'
        );
      }

      return response;
    } catch (error) {
      // Log error if tracing is available
      if (trace) {
        await safeTraceOperation(
          async () => {
            if (!trace) return;
            
            trace.span({
              name: `${config.name}-agent-error`,
              id: mainSpanId,
              output: {
                error: error instanceof Error ? error.message : String(error)
              },
              statusMessage: "Error"
            });
          },
          'Failed to log agent error'
        );
      }
      throw error;
    } finally {
      // Always try to flush traces in serverless environments or if explicitly created
      if (config.isServerless || (config.createNewTrace && config.langfuse)) {
        await ensureTraceFlushed(config.langfuse, trace);
      }
    }
  };
} 