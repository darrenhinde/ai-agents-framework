import { createStreamingAgent } from "../wrappers/agent";
import { getModel } from "../../core/model-providers";
import { wrapTool } from "../wrappers/tools";
import { z } from "zod";
import { Langfuse } from "langfuse";

// Initialize Langfuse with your credentials
const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY || "",
  secretKey: process.env.LANGFUSE_SECRET_KEY || "",
  baseUrl: process.env.LANGFUSE_BASE_URL,
});

// Create a session ID for this run
const sessionId = `weather-session-${Date.now()}`;

// Create the base tool definition
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

// Create logging config to be shared between agent and tools
const loggingConfig = {
  debug: true,
  langfuse: {
    langfuse,
    defaultUserId: "example-user",
    defaultSessionId: sessionId,
    defaultTags: ["weather-demo"],
  },
};

const agent = createStreamingAgent(
  {
    name: "weather-assistant",
    model: getModel("google"),
    systemPrompt:
      "You are a helpful assistant with the ability to get the weather in a given city. Use the weather tool to provide accurate weather information.",
    tools: {
      // Pass the logging config to the tool at usage time
      weather: weatherTool(loggingConfig),
    },
    maxSteps: 3,
    maxTokens: 1000,
    temperature: 0.7,
    langfuse,
    session: {
      id: sessionId,
      user: {
        id: "example-user",
      },
    },
    traceConfig: {
      name: "weather-query",
      tags: ["weather-tool", "demo"],
      metadata: {
        environment: "development",
        version: "1.0.0",
        toolset: ["weather"],
      },
    },
  },
  loggingConfig
);

// Test running the agent
const run = async () => {
  try {
    console.log("Starting weather assistant...");

    const { result, toolCalls, toolResults, text } = await agent.run([
      { role: "user", content: "What's the weather like in London?", id: "1" },
    ]);

    console.log("\n\n******* Final Text:", text);
    console.log("\n\nTool calls:", toolCalls);
    console.log("Tool results:", toolResults);
  } catch (error) {
    console.error("Error running agent:", error);
  } finally {
    await langfuse.shutdownAsync();
  }
};

run();
