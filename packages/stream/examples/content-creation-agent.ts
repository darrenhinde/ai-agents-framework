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
const sessionId = `content-session-${Date.now()}`;

// Create logging config
const loggingConfig = {
  debug: true,
  langfuse: {
    langfuse,
    defaultUserId: "example-user",
    defaultSessionId: sessionId,
    defaultTags: ["content-creation"],
    debug: false,
  },
};

// Calendar Tool - Manages content scheduling
const calendarTool = wrapTool({
  description: "Manage content calendar and scheduling",
  parameters: z.object({
    startDate: z.string().describe("Start date for the calendar"),
    endDate: z.string().describe("End date for the calendar"),
    platforms: z
      .array(z.string())
      .describe("Platforms to schedule content for"),
    contentTypes: z.array(z.string()).describe("Types of content to schedule"),
  }),
  execute: async ({ startDate, endDate, platforms, contentTypes }) => {
    // Static calendar response
    return {
      schedule: [
        {
          date: startDate,
          platform: platforms[0],
          contentType: contentTypes[0],
          status: "scheduled",
          time: "09:00",
        },
      ],
      recommendations: {
        bestTimes: {
          linkedin: ["09:00", "16:00"],
          twitter: ["08:00", "12:00", "17:00"],
          blog: ["11:00"],
        },
        contentMix: {
          educational: 0.4,
          engagement: 0.3,
          promotional: 0.2,
          entertainment: 0.1,
        },
      },
    };
  },
});

// Strategy Tool - Manages content strategy
const strategyTool = wrapTool({
  description: "Create and manage content strategy",
  parameters: z.object({
    topic: z.string().describe("Main topic for content strategy"),
    platforms: z.array(z.string()).describe("Target platforms"),
    goals: z.array(z.string()).describe("Content strategy goals"),
  }),
  execute: async ({ topic, platforms, goals }) => {
    // Static strategy response
    return {
      topic,
      platforms,
      goals,
      contentMatrix: {
        actionable: ["How-to guide", "Tutorial", "Checklist"],
        motivational: ["Success story", "Case study", "Testimonial"],
        analytical: ["Trend analysis", "Industry report", "Data insights"],
        contrarian: ["Myth busting", "Alternative view", "Debate"],
      },
      recommendations: {
        postingFrequency: {
          linkedin: "2x per day",
          twitter: "3-4x per day",
          blog: "2x per week",
        },
        contentTypes: ["articles", "threads", "carousels"],
        hashtagStrategy: ["#Tech", "#Innovation", "#AI"],
      },
    };
  },
});

// Formatter Tool - Formats content for different platforms
const formatterTool = wrapTool({
  description: "Format content for specific platforms",
  parameters: z.object({
    content: z.string().describe("Raw content to format"),
    platform: z.string().describe("Target platform"),
    format: z.string().describe("Desired content format"),
  }),
  execute: async ({ content, platform, format }) => {
    // Static formatter response
    return {
      formattedContent: `Formatted ${content} for ${platform} in ${format} style`,
      metadata: {
        platform,
        format,
        wordCount: 500,
        readingTime: "3 mins",
      },
      structure: {
        sections: ["intro", "main points", "conclusion"],
        formatting: {
          paragraphs: 3,
          bullets: 5,
          emphasis: ["key point 1", "key point 2"],
        },
      },
    };
  },
});

// Reviewer Tool - Reviews and provides feedback on content
const reviewerTool = wrapTool({
  description: "Review content and provide feedback",
  parameters: z.object({
    content: z.string().describe("Content to review"),
    platform: z.string().describe("Platform the content is for"),
    criteria: z.array(z.string()).describe("Review criteria"),
  }),
  execute: async ({ content, platform, criteria }) => {
    // Static reviewer response
    return {
      score: 85,
      feedback: [
        "Strong opening hook",
        "Clear value proposition",
        "Engaging call to action",
      ],
      suggestions: [
        "Add more specific examples",
        "Include relevant hashtags",
        "Optimize headline",
      ],
      seoAnalysis: {
        keywords: ["tech", "innovation", "AI"],
        readability: "high",
        engagement: "medium",
      },
    };
  },
});

// Create the content creation agent
const agent = createAgent(
  {
    name: "content-creator",
    model: getModel("google"),
    systemPrompt: `You are an expert content creation assistant with deep knowledge of content strategy, 
    calendar management, formatting, and content review. You help create and manage content across multiple platforms.
    
    Your capabilities include:
    1. Managing content calendars and scheduling
    2. Creating content strategies
    3. Formatting content for different platforms
    4. Reviewing and improving content quality
    
    When handling requests:
    - First understand the type of task (calendar, strategy, formatting, or review)
    - Use appropriate tools based on the task
    - Provide clear explanations of your actions
    - Follow up with relevant suggestions or next steps`,
    tools: {
      calendar: calendarTool,
      strategy: strategyTool,
      formatter: formatterTool,
      reviewer: reviewerTool,
    },
    maxSteps: 7,
    maxTokens: 2000,
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
      name: "content-creation",
      tags: ["content", "demo"],
      metadata: {
        environment: "development",
        version: "1.0.0",
        toolset: ["calendar", "strategy", "formatter", "reviewer"],
      },
    },
  },
  loggingConfig
);

// Test running the agent
const run = async () => {
  try {
    console.log("Starting content creation assistant...");

    const { result, toolCalls, toolResults, text } = await agent.run([
      {
        role: "user",
        content:
          "Create a content strategy for AI development topics across LinkedIn and Twitter for next month, also create my first Post right now after the strategy, run each task with Tool calls",
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
