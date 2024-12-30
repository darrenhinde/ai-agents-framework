import { createStreamingAgent } from "../agent";
import { formatterTool } from "../tools";
import type { Message } from "ai";
import { getModel } from "@ai-agents/core/model-providers";

const FORMATTER_PROMPT = `You are a Content Formatter Agent. Your role is to format content appropriately for different platforms.

Your task is to:
1. Understand the target platform requirements
2. Apply platform-specific formatting rules
3. Maintain the intended tone and message
4. Use the formatterTool to structure the content

Guidelines:
- Follow platform-specific character limits
- Use appropriate formatting (paragraphs, lists)
- Include relevant hashtags for social media
- Optimize for readability
- Consider mobile viewing
- Maintain brand voice consistency
- Add appropriate calls-to-action`;

export const formatterAgent = createStreamingAgent({
  model: getModel("gpt-4o-mini"),
  systemPrompt: FORMATTER_PROMPT,
  tools: {
    formatterTool,
  },
  maxSteps: 3,
});

// Example usage:
// const result = await formatterAgent([
//   { role: "user", content: "Format this content for LinkedIn: AI is transforming...", id: "1" }
// ]);
