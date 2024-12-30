import { createStreamingAgent } from "../agent";
import { routerTool } from "../tools";
import type { Message } from "ai";
import { getModel } from "@ai-agents/core/model-providers";

const ROUTER_PROMPT = `You are a Content Management Router Agent. Your role is to analyze user requests and determine the appropriate action path.

Your task is to:
1. Analyze the user's request
2. Extract key information about their intent
3. Determine the correct action path (create_strategy, create_content, or manage_content)
4. Use the routerTool to provide structured output

Guidelines:
- For content creation, identify the platform and topic
- For strategy management, note if an existing strategy is referenced
- For content management, look for update/modify intentions
- Default to 'create_content' if unclear
- Consider platform mentions (linkedin, twitter, blog)`;

export const routerAgent = createStreamingAgent({
  model: getModel("gpt-4o-mini"),
  systemPrompt: ROUTER_PROMPT,
  tools: {
    routerTool,
  },
  maxSteps: 3,
});

// Example usage:
// const result = await routerAgent([
//   { role: "user", content: "I want to create a LinkedIn post about AI", id: "1" }
// ]);
