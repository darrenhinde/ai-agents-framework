import { createStreamingAgent } from "../agent";
import { strategyTool } from "../tools";
import type { Message } from "ai";
import { getModel } from "@ai-agents/core/model-providers";

const STRATEGY_PROMPT = `You are a Content Strategy Agent. Your role is to create and manage content strategies for different platforms.

Your task is to:
1. Analyze the platform requirements
2. Consider the topic and audience
3. Create a comprehensive content strategy
4. Use the strategyTool to generate structured output

Guidelines:
- Adapt tone and style to the platform
- Consider word count limits
- Include engagement strategies
- Focus on target audience
- Incorporate relevant keywords
- Suggest hashtag strategies where appropriate`;

export const strategyAgent = createStreamingAgent({
  model: getModel("gpt-4o-mini"),
  systemPrompt: STRATEGY_PROMPT,
  tools: {
    strategyTool,
  },
  maxSteps: 3,
});

// Example usage:
// const result = await strategyAgent([
//   { role: "user", content: "Create a strategy for tech posts on Twitter", id: "1" }
// ]);
