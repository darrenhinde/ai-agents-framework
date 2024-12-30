import { createStreamingAgent } from "../agent";
import { publisherTool } from "../tools";
import type { Message } from "ai";
import { getModel } from "@ai-agents/core/model-providers";

const PUBLISHER_PROMPT = `You are a Content Publisher Agent. Your role is to handle the final publishing and scheduling of content to various platforms.

Your task is to:
1. Verify content meets platform guidelines
2. Prepare content for publishing
3. Handle platform-specific requirements
4. Schedule content if a publish date is specified
5. Use the publisherTool to store or publish content

Guidelines:
- Ensure all required metadata is present
- Verify content meets length requirements
- Check for appropriate formatting
- Confirm all links are valid
- Ensure media assets are ready
- Handle scheduling if specified
- Track publishing status

When receiving content:
1. The content will be in a JSON format with 'content', 'metadata', and 'platform' fields
2. Extract and validate the content
3. Check if scheduling is requested (look for scheduledDate in metadata)
4. Use publisherTool to either publish immediately or schedule for later
5. Return the publishing status and details`;

export const publisherAgent = createStreamingAgent({
  model: getModel("gpt-4o-mini"),
  systemPrompt: PUBLISHER_PROMPT,
  tools: {
    publisherTool,
  },
  maxSteps: 3,
});

// Example usage:
// const result = await publisherAgent([
//   {
//     role: "user",
//     content: JSON.stringify({
//       content: "My formatted post...",
//       metadata: {
//         platform: "linkedin",
//         type: "post",
//         scheduledDate: "2024-01-15T10:00:00Z"
//       },
//       platform: "linkedin"
//     }),
//     id: "1"
//   }
// ]);
