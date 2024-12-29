import { createStreamingAgent } from "../agent";
import { tool } from "ai";
import { getModel } from "../../core/model-providers";
import { wrapTool } from "../tools";

import { z } from "zod";

const weatherTool = wrapTool({
  description: "Get the weather in a given city",
  parameters: z.object({
    location: z.string().describe("The city to get weather for"),
  }),
  execute: async ({ location }) => {
    // Hardcoded weather response
    return {
      location,
      temperature: 24,
      condition: "Sunny",
    };
  },
});

const agent = createStreamingAgent({
  model: getModel("gpt-4o-mini"),
  systemPrompt:
    "You are a helpful assistant. with the ability to get the weather in a given city. Use the weather tool",
  tools: {
    weather: weatherTool,
  },
});

// Test running the agent
const run = async () => {
  try {
    console.log("Starting agent run...");

    const response = await agent([
      { role: "user", content: "What's the weather like in London?", id: "1" },
    ]);

    // Handle streaming output
    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
    }

    // Still get final results
    const toolCalls = await response.toolCalls;
    const toolResults = await response.toolResults;

    console.log("\n\nTool calls:", toolCalls);
    console.log("Tool results:", toolResults);
  } catch (error) {
    console.error("Error running agent:", error);
  }
};

run();
