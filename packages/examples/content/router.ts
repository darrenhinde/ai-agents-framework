import { createAgent } from '../../core/agents/agent.config.js';

import { z } from 'zod';
import { generateObject } from 'ai';
import { strategyTool, researchTool, audienceTool, guidelinesTool, storageTool } from './tools';
import { ROUTER_PROMPT, STRATEGY_PROMPT, FORMATTER_PROMPT, RESEARCH_PROMPT, MANAGEMENT_PROMPT } from './prompts';

// Router response schema
const routerSchema = z.object({
  type: z.enum(['task', 'general_query']),
  action: z.enum(['create_strategy', 'create_content', 'manage_content', 'general_chat']),
  agentType: z.enum(['strategy', 'content', 'research', 'management', 'general']),
  context: z.object({
    topic: z.string().optional().describe('The main topic or subject matter'),
    platform: z.enum(['linkedin', 'twitter', 'blog']).optional().describe('Target social media platform'),
    contentType: z.enum(['post', 'article', 'thread']).optional().describe('Type of content to create'),
    existingStrategyId: z.string().optional().describe('ID of existing content strategy'),
    contentId: z.string().optional().describe('ID of existing content to manage'),
    requirements: z.array(z.string()).optional().describe('Specific requirements or constraints'),
    query: z.string().optional().describe('Original user query')
  })
});

type RouterResponse = z.infer<typeof routerSchema>;
type Agent = ReturnType<typeof createAgent>;

// Specialized agents
const createStrategyAgent = (): Agent => createAgent({
  name: 'strategy-agent',
  model: 'gpt-4',
  temperature: 0.7,
  tools: [strategyTool, researchTool],
  systemPrompt: STRATEGY_PROMPT
});

const createContentAgent = (): Agent => createAgent({
  name: 'content-agent',
  tools: [strategyTool, audienceTool, guidelinesTool, storageTool],
  systemPrompt: FORMATTER_PROMPT
});

const createResearchAgent = (): Agent => createAgent({
  name: 'research-agent',
  model: 'gpt-4',
  temperature: 0.7,
  tools: [researchTool, audienceTool],
  systemPrompt: RESEARCH_PROMPT
});

const createManagementAgent = (): Agent => createAgent({
  name: 'management-agent',
  model: 'gpt-4',
  temperature: 0.7,
  tools: [storageTool, guidelinesTool],
  systemPrompt: MANAGEMENT_PROMPT
});

// Create router agent
export const createRouterAgent = () => {
  const router = createAgent({
    name: 'content-router',
    model: 'gpt-4',
    temperature: 0.7,
    systemPrompt: ROUTER_PROMPT
  });

  return {
    async route(input: string) {
      try {
        // Use generateObject with proper schema and description
        const { object: response } = await generateObject({
          model: router,
          schema: routerSchema,
          schemaName: 'ContentRouter',
          schemaDescription: 'Routes user requests to appropriate content management agents',
          prompt: input,
          mode: 'tool' // Use tool mode for better structured output
        });

        // Create appropriate agent based on routing decision
        let agent: Agent | undefined;
        switch (response.agentType) {
          case 'strategy':
            agent = createStrategyAgent();
            break;
          case 'content':
            agent = createContentAgent();
            break;
          case 'research':
            agent = createResearchAgent();
            break;
          case 'management':
            agent = createManagementAgent();
            break;
          default:
            return {
              type: 'general_query',
              response: await router.generateText({ prompt: input })
            };
        }

        return {
          type: 'task',
          agent,
          context: response.context
        };
      } catch (error) {
        console.error('Router error:', error);
        // Fallback to general query if structured generation fails
        return {
          type: 'general_query',
          response: await router.generateText({ prompt: input })
        };
      }
    }
  };
};

// Helper function to validate and process router input
export const processRouterInput = (input: unknown) => {
  return routerSchema.parse(input);
}; 