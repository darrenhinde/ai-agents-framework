import type { LangfuseTraceClient } from 'langfuse';
import type { Langfuse } from 'langfuse';
import { generateText } from 'ai';
import type { CoreTool, ToolExecutionOptions } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import type { AgentConfig, AgentOptions } from './types';

/**
 * Context for tool execution with tracing capabilities
 */
interface ToolContext {
  traceId: string;                                    // Unique identifier for the trace
  trace: LangfuseTraceClient;                        // Langfuse trace client for logging
  parentSpanId?: string;                             // Optional parent span for nested operations
  toolResultCache?: Map<string, unknown>;            // Cache to store tool results and avoid duplicates
}

/**
 * Safely executes Langfuse operations with error handling
 * @param operation - The Langfuse operation to execute
 * @param errorMessage - Message to log if operation fails
 * @param defaultValue - Optional fallback value
 */
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

/**
 * Creates an agent that can process messages and use tools
 * @param config - Agent configuration including tracing options
 * @returns An async function that processes messages with the configured agent
 * 
 * Example usage:
 * ```typescript
 * const agent = createAgent({
 *   name: 'weather-agent',
 *   langfuse: langfuseClient,     // Optional: for tracing
 *   createNewTrace: true,         // Optional: create new trace for each call
 *   metadata: {                   // Optional: additional context
 *     environment: 'production'
 *   }
 * });
 * ```
 */
export function createAgent(config: AgentConfig) {
  return async function agent(
    options: AgentOptions,    // Configuration for this specific agent call
    userPrompt: string        // The current user's message
  ) {
    const traceId = config.traceId || uuidv4();                    // Generate or use provided trace ID
    let trace = config.trace;                                      // Use existing trace if provided
    let response: unknown;                                         // Store the final response
    const toolResultCache = new Map<string, unknown>();            // Cache for tool results

    // Create new trace if requested or none exists
    if (config.langfuse && (!trace || config.createNewTrace)) {
      const newTrace = await safeTraceOperation(
        async () => config.langfuse?.trace({
          id: traceId,
          name: `${config.name}-trace`,
          metadata: {
            ...config.metadata,                                    // User-provided metadata
            parentTraceId: config.parentTraceId,                  // For linking traces
            isServerless: config.isServerless,                    // Serverless environment flag
            requireStructuredOutput: options.requireStructuredOutput,  // Structured output flag
            maxSteps: options.maxSteps,                          // Max steps for tool usage
            model: options.model.modelId                         // Model identifier
          },
          input: {
            systemPrompt: options.systemPrompt,                  // System instructions
            messages: options.messages,                          // Conversation history
            userPrompt,                                         // Current user message
            tools: Object.keys(options.tools || {}),            // Available tools
            timestamp: new Date().toISOString()
          }
        }),
        'Failed to create Langfuse trace'
      );
      if (newTrace) {
        trace = newTrace;
      }
    }

    // Create main span for agent execution
    const mainSpanId = uuidv4();
    if (trace) {
      await safeTraceOperation(
        async () => {
          if (!trace) return;
          
          // Log initial generation
          trace.generation({
            name: 'initial-prompt',
            model: options.model.modelId,
            modelParameters: {
              maxSteps: options.maxSteps,
              requireStructuredOutput: options.requireStructuredOutput
            },
            input: {
              systemPrompt: options.systemPrompt,
              userPrompt,
              timestamp: new Date().toISOString()
            }
          });

          // Start main execution span
          trace.span({
            name: `${config.name}-agent-execution`,
            id: mainSpanId,
            input: {
              systemPrompt: options.systemPrompt,
              userPrompt,
              parentTraceId: config.parentTraceId,
              timestamp: new Date().toISOString(),
              ...config.metadata
            }
          });
        },
        'Failed to create agent spans'
      );
    }

    try {
      // Wrap tools with tracing if available
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

      // Generate response using Vercel AI SDK
      const result = await generateText({
        ...options,
        system: options.systemPrompt,                           // System instructions
        messages: options.messages ? [...options.messages, { role: 'user', content: userPrompt }] : [{ role: 'user', content: userPrompt }],  // Full conversation with new message
        tools: wrappedTools,                                    // Traced tools
        toolChoice: wrappedTools ? (options.requireStructuredOutput ? 'required' : 'auto') : 'none',  // Tool usage mode
        maxSteps: options.maxSteps || 3,                       // Default to 3 steps if not specified
        experimental_telemetry: trace ? {                      // Telemetry for tracing
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

      // Log tool calls with better structure
      if (trace && result.toolCalls && Array.isArray(result.toolCalls)) {
        for (const toolCall of result.toolCalls) {
          if ('toolName' in toolCall && 'args' in toolCall && trace) {
            // Log the tool call generation
            const toolGeneration = trace.generation({
              name: `tool-call-${toolCall.toolName}`,
              model: options.model.modelId,
              modelParameters: {
                tool: toolCall.toolName,
                maxSteps: options.maxSteps,
                requireStructuredOutput: options.requireStructuredOutput
              },
              input: {
                args: toolCall.args,
                timestamp: new Date().toISOString()
              }
            });

            // Log the tool execution span
            const toolSpan = trace.span({
              name: `tool-execution-${toolCall.toolName}`,
              input: {
                tool: toolCall.toolName,
                args: toolCall.args,
                timestamp: new Date().toISOString()
              }
            });

            // Update with tool results
            const cacheKey = JSON.stringify({ toolName: toolCall.toolName, args: toolCall.args });
            const toolResult = toolResultCache.get(cacheKey);
            if (toolResult) {
              toolGeneration.update({
                output: {
                  result: toolResult,
                  timestamp: new Date().toISOString()
                }
              });

              toolSpan.end({
                output: {
                  result: toolResult,
                  timestamp: new Date().toISOString()
                }
              });
            }
          }
        }
      }

      // Log final generation
      if (trace) {
        trace.generation({
          name: 'final-response',
          model: options.model.modelId,
          modelParameters: {
            maxSteps: options.maxSteps,
            requireStructuredOutput: options.requireStructuredOutput
          },
          input: {
            toolResults: Array.from(toolResultCache.entries()).map(([key, value]) => ({
              tool: JSON.parse(key).toolName,
              result: value
            })),
            timestamp: new Date().toISOString()
          },
          output: {
            text: result.text,
            toolCalls: result.toolCalls,
            timestamp: new Date().toISOString()
          }
        });
      }

      // Format response
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
              toolResults: toolResultCache.get(JSON.stringify({ 
                toolName: toolCall.toolName, 
                args: toolCall.args 
              }))
            }))
          ]
        }]
      };

      // Update final trace
      if (trace) {
        trace.update({
          output: {
            response,
            toolCalls: result.toolCalls,
            finalText: result.text,
            timestamp: new Date().toISOString()
          },
          metadata: {
            completionStatus: 'success',
            toolsUsed: Array.from(toolResultCache.keys()).map(key => JSON.parse(key).toolName)
          }
        });
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