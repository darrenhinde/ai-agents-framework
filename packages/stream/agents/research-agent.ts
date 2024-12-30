import { createStreamingAgent } from "../agent";
import { researchTool } from "../tools";
import type { Message } from "ai";
import { getModel } from "@ai-agents/core/model-providers";

const RESEARCH_PROMPT = `You are a Content Research Agent. Your role is to gather relevant information and insights about topics.

Your task is to:
1. Analyze the research topic
2. Identify key areas to investigate
3. Gather relevant information and data
4. Use the researchTool to collect structured data

Guidelines:
- Focus on recent and relevant information
- Include statistics when available
- Gather diverse perspectives
- Look for trending discussions
- Consider industry insights
- Identify key influencers or experts`;

export const researchAgent = createStreamingAgent({
  model: getModel("gpt-4o-mini"),
  systemPrompt: RESEARCH_PROMPT,
  tools: {
    researchTool,
  },
  maxSteps: 3,
});

// Example usage:
// const result = await researchAgent([
//   { role: "user", content: "Research latest trends in AI development", id: "1" }
// ]);
