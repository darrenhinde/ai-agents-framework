import { createOpenAI } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { createTool } from '../types.config';
import type { ToolConfig } from '../types.config';

export const PerplexityTool = (config?: ToolConfig) => createTool({
  name: 'perplexity',
  description: 'Does a research using a query on Perplexity.',
  parameters: z.object({
    prompt: z.string().describe('Give detailed prompt about the research needed...'),
  }),
  execute: async ({ prompt }) => {
    const enhancedPrompt = `${prompt} Please provide the links to the sources used in the research at the bottom.`;
    console.log("Perplexity Input: ", enhancedPrompt);

    const perplexity = createOpenAI({
      apiKey: process.env.PERPLEXITY_API_KEY ?? '',
      baseURL: 'https://api.perplexity.ai/',
    });
    
    const { text } = await generateText({
      model: perplexity('llama-3.1-sonar-small-128k-online'),
      prompt: enhancedPrompt,
    });

    console.log("Perplexity Output: ", text);
    return { data: text };
  },
  config,
});