import { createDataStreamResponse, streamText } from 'ai';
import type { 
  Agent,
  AgentConfig, 
  AgentRuntimeOptions,
  AgentEvent,
  ToolContext
} from './types';
import { ensureTraceFlushed } from './utils';

export function createAgent(config: AgentConfig): Agent {
  return {
    config,
    async run({ messages, streamCallbacks, context = {} }: AgentRuntimeOptions) {
      const { logging } = context;
      const logger = logging?.logger;

      // Helper for safe logging
      const log = {
        debug: (msg: string, meta?: any) => logger?.debug(msg, meta),
        info: (msg: string, meta?: any) => logger?.info(msg, meta),
        warn: (msg: string, meta?: any) => logger?.warn(msg, meta),
        error: (msg: string, meta?: any) => logger?.error(msg, meta),
      };

      return createDataStreamResponse({
        execute: async (dataStream) => {
          // Store dataStream in context for tools
          context.dataStream = dataStream;

          log.info('Starting agent run', { 
            agentName: config.name,
            messagesCount: messages.length 
          });

          // Wrap tools to intercept calls and add logging/streaming
          const wrappedTools = Object.fromEntries(
            Object.entries(config.tools).map(([name, tool]) => [
              name,
              {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters,
                execute: async (args: unknown) => {
                  log.debug(`Tool call start: ${name}`, args);
                  
                  // Emit tool start event
                  dataStream.writeData({
                    type: 'tool-start',
                    content: { name, args }
                  } as AgentEvent);

                  try {
                    const result = await tool.execute(args, context);
                    
                    log.debug(`Tool call end: ${name}`, { result });
                    
                    // Emit tool end event
                    dataStream.writeData({
                      type: 'tool-end', 
                      content: { name, result }
                    } as AgentEvent);

                    return result;
                  } catch (error) {
                    log.error(`Tool call error: ${name}`, { error });
                    throw error;
                  }
                }
              }
            ])
          );

          // Run the streaming text generation
          const result = streamText({
            model: config.model,
            messages,
            system: config.systemPrompt,
            maxSteps: config.maxSteps ?? 3,
            temperature: config.temperature ?? 0.7,
            maxTokens: config.maxTokens,
            tools: wrappedTools,
            ...streamCallbacks,

            onStepFinish: async (info) => {
              log.debug('Step finished', info);
              
              dataStream.writeData({
                type: 'step-complete',
                content: {
                  text: info.text,
                  tokens: info.tokens
                }
              } as AgentEvent);

              streamCallbacks?.onStepFinish?.(info);
            },

            onFinish: async (final) => {
              log.info(`Agent finishing`, { 
                reason: final.finishReason,
                output: final.output 
              });

              // Emit completion event
              dataStream.writeData({
                type: 'agent-complete',
                content: {
                  reason: final.finishReason,
                  output: final.output
                }
              } as AgentEvent);

              // Try to flush any logging
              if (logging) {
                await ensureTraceFlushed(logging);
              }

              streamCallbacks?.onFinish?.(final);
            },
          });

          // Merge the text stream into our data stream
          result.mergeIntoDataStream(dataStream);
        },

        onError: (error) => {
          log.error('Agent error', { error });
          
          // Emit error event
          dataStream?.writeData({
            type: 'error',
            content: {
              message: error.message,
              error
            }
          } as AgentEvent);

          return `Error: ${error.message}`;
        }
      })(streamCallbacks?.stream);
    }
  };
}
