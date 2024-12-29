import { Langfuse } from "langfuse";
import { createStreamingAgent } from "../stream/agent.js";
import { getModel } from "../core/model-providers/index.js";
import { config } from "dotenv";
import { tool } from "ai";
import { z } from "zod";

// Load environment variables
config();

// Enable debug mode if needed
const DEBUG = process.env.DEBUG === "true";

// Helper function to generate message IDs
function generateMessageId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// System Prompts
const RESEARCH_AGENT_PROMPT = `You are a research assistant that helps find and analyze information. Follow these steps:
1. Use the search tool to find relevant information
2. Use the analyze tool to process the search results
3. Provide a clear and concise summary of findings

Always cite your sources and explain your reasoning.`;

// Tool Definitions
function createSearchTool() {
  return tool({
    description: "Search for information on a given topic",
    parameters: z.object({
      query: z.string().describe("The search query"),
      maxResults: z
        .number()
        .optional()
        .describe("Maximum number of results to return"),
    }),
    execute: async ({ query, maxResults = 5 }) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock search results
      return {
        results: [
          {
            title: "AI Developments 2024",
            snippet: "Recent breakthroughs in artificial intelligence...",
            url: "https://example.com/ai-2024",
          },
          {
            title: "Machine Learning Trends",
            snippet: "The latest trends in machine learning include...",
            url: "https://example.com/ml-trends",
          },
        ],
        totalResults: 2,
      };
    },
  });
}

function createAnalyzeTool() {
  return tool({
    description: "Analyze and summarize information",
    parameters: z.object({
      content: z
        .array(
          z.object({
            title: z.string(),
            snippet: z.string(),
            url: z.string(),
          })
        )
        .describe("The content to analyze"),
      focusAreas: z
        .array(z.string())
        .optional()
        .describe("Specific areas to focus on"),
    }),
    execute: async ({ content, focusAreas = [] }) => {
      // Simulate analysis
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        summary: "Analysis of provided content...",
        keyPoints: ["Point 1", "Point 2"],
        relevance: "high",
      };
    },
  });
}

async function testStreamingAgent() {
  console.log("\n🧪 Testing streaming agent...");

  // Initialize Langfuse if credentials are available
  const langfuse = process.env.LANGFUSE_PUBLIC_KEY
    ? new Langfuse({
        publicKey: process.env.LANGFUSE_PUBLIC_KEY,
        secretKey: process.env.LANGFUSE_SECRET_KEY,
        baseUrl: process.env.LANGFUSE_BASE_URL || "https://cloud.langfuse.com",
      })
    : undefined;

  // Create the agent
  const agent = createStreamingAgent({
    model: getModel("openai:gpt-4"),
    systemPrompt: RESEARCH_AGENT_PROMPT,
    tools: {
      search: createSearchTool(),
      analyze: createAnalyzeTool(),
    },
    maxSteps: 3,
    temperature: 0.7,
    langfuse,
    session: { id: "test-session" },
  });

  try {
    console.log("📤 Sending request to agent...");

    const result = await agent([
      {
        id: generateMessageId(),
        role: "user",
        content: "What are the latest developments in AI and machine learning?",
      },
    ]);

    // Handle streaming response
    console.log("\n🤖 Agent response:");
    for await (const chunk of result) {
      if ("type" in chunk) {
        switch (chunk.type) {
          case "text":
            process.stdout.write(chunk.content);
            break;
          case "tool-message":
            console.log("\n🔧 Tool execution:", chunk.content);
            break;
          default:
            if (DEBUG) {
              console.log("\nUnhandled chunk type:", chunk);
            }
        }
      }
    }
    console.log("\n✅ Agent test completed");
  } catch (error) {
    console.error(
      "❌ Agent error:",
      error instanceof Error ? error.message : String(error)
    );
  } finally {
    if (langfuse) {
      await langfuse.flushAsync();
    }
  }
}

// Run the test
testStreamingAgent().catch(console.error);
