import { createAgent } from "../wrappers/agent";
import { getModel } from "../../core/model-providers";
import { wrapTool } from "../wrappers/tools";
import { z } from "zod";
import { Langfuse } from "langfuse";

// Initialize Langfuse
const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY || "",
  secretKey: process.env.LANGFUSE_SECRET_KEY || "",
  baseUrl: process.env.LANGFUSE_BASE_URL,
});

// Create a session ID
const sessionId = `weather-session-${Date.now()}`;

// Create logging config
const loggingConfig = {
  debug: true,
  langfuse: {
    langfuse,
    defaultUserId: "example-user",
    defaultSessionId: sessionId,
    defaultTags: ["weather-demo"],
    debug: false,
  },
};

// Weather Tool - Gets weather information for a location
const weatherTool = wrapTool({
  description: "Get the weather in a given city",
  parameters: z.object({
    location: z.string().describe("The city to get weather for"),
  }),
  execute: async ({ location }) => {
    // Static weather response
    return {
      location,
      currentConditions: {
        temperature: 24,
        condition: "Sunny",
        humidity: 65,
        windSpeed: "10 mph",
      },
      forecast: {
        today: {
          high: 26,
          low: 18,
          condition: "Mostly sunny",
        },
        tomorrow: {
          high: 25,
          low: 17,
          condition: "Partly cloudy",
        },
      },
      alerts: [],
      lastUpdated: new Date().toISOString(),
    };
  },
});

// Create the weather agent
const agent = createAgent(
  {
    name: "weather-assistant",
    model: getModel("ollama"),
    systemPrompt: `You are an expert weather assistant with deep knowledge of weather conditions and forecasting.
    You help users get accurate weather information for any location.
    
    Your capabilities include:
    1. Getting current weather conditions
    2. Providing temperature readings
    3. Checking weather forecasts
    4. Reporting weather alerts if any
    
    When handling requests:
    - First understand the location being asked about
    - Use the weather tool to get accurate data
    - Provide clear explanations of weather conditions
    - Include relevant details like temperature, conditions, and forecasts
    - Suggest appropriate activities based on weather when relevant`,
    tools: {
      weather: weatherTool,
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
    stream: true,
    traceConfig: {
      name: "weather-query",
      tags: ["weather", "demo"],
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
      {
        role: "user",
        content: "What's the weather like in London?",
        id: "1",
      },
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
