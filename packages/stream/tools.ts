import { tool } from "ai";
import type { CoreTool } from "ai";
import { z } from "zod";

/**
 * Wraps a tool function with logging and standardized structure
 *
 * @param description - Human readable description of what the tool does
 * @param params - Configuration object for the tool
 * @param params.parameters - Zod schema defining the expected parameters
 * @param params.execute - Async function that implements the tool's logic
 * @returns A CoreTool that can be used with the streaming agent
 *
 * @example
 * ```ts
 * const weatherTool = wrapTool(
 *   "Get the weather in a given city",
 *   {
 *     parameters: z.object({
 *       location: z.string().describe("The city to get weather for")
 *     }),
 *     execute: async ({ location }) => {
 *       // Implementation
 *       return { temperature: 24 };
 *     }
 *   }
 * );
 * ```
 */
export const wrapTool = <T extends z.ZodObject<any>, R>(config: {
  description: string;
  parameters: T;
  execute: (args: z.infer<T>) => Promise<R>;
}) => {
  return tool({
    description: config.description,
    parameters: config.parameters,
    execute: async (args) => {
      console.log("Tool Execution Started:", {
        description: config.description,
        args,
      });

      const result = await config.execute(args);

      console.log("Tool Execution Completed:", {
        description: config.description,
        args,
        result,
      });
      return result;
    },
  });
};

// Content Management System Tools

/**
 * Router Tool - Determines the action and platform based on user input
 */
export const routerTool = wrapTool({
  description: "A tool that parses user input to decide the route action",
  parameters: z.object({
    userInput: z.string().describe("The user's message or request"),
  }),
  execute: async ({ userInput }) => {
    // Simple routing logic based on keywords
    const input = userInput.toLowerCase();

    if (input.includes("strategy")) {
      return { action: "create_strategy", platform: "twitter" };
    } else if (input.includes("update") || input.includes("manage")) {
      return { action: "manage_content", platform: "blog" };
    }

    // Default to content creation
    const platform = input.includes("linkedin")
      ? "linkedin"
      : input.includes("twitter")
        ? "twitter"
        : "blog";

    return { action: "create_content", platform };
  },
});

/**
 * Strategy Tool - Creates or updates content strategies
 */
export const strategyTool = wrapTool({
  description: "Tool that returns a new content strategy object",
  parameters: z.object({
    topic: z.string().describe("Topic for the strategy"),
    platform: z.string().describe("Which platform - twitter, linkedin, blog?"),
  }),
  execute: async ({ topic, platform }) => {
    return {
      tone: "professional",
      structure: {
        sections: ["intro", "body", "conclusion"],
        wordCount: platform === "blog" ? 1000 : 300,
        format: platform === "twitter" ? "thread" : "article",
      },
      guidelines: [
        "Be concise and clear",
        "Use relevant examples",
        "Include a call to action",
      ],
      keywords: [topic.toLowerCase(), "technology", "innovation"],
      engagement: {
        callToAction: "Share your thoughts in the comments!",
        targetAudience: "tech professionals",
        hashtagStrategy: `#${topic.replace(/\s+/g, "")} #Tech`,
      },
    };
  },
});

/**
 * Research Tool - Gathers information about a topic
 */
export const researchTool = wrapTool({
  description: "Gather references or data about a topic",
  parameters: z.object({
    topic: z.string().describe("The topic to research"),
  }),
  execute: async ({ topic }) => {
    return {
      references: [
        `Latest trends in ${topic}`,
        `Key statistics about ${topic}`,
        `Industry insights for ${topic}`,
      ],
      keyPoints: [
        `${topic} is transforming rapidly`,
        `Major companies are investing in ${topic}`,
        `Future outlook for ${topic} is promising`,
      ],
      sources: [
        `https://example.com/research/${topic}`,
        `https://example.com/stats/${topic}`,
      ],
    };
  },
});

/**
 * Formatter Tool - Formats content for specific platforms
 */
export const formatterTool = wrapTool({
  description: "Format content for a given platform",
  parameters: z.object({
    content: z.string().describe("The content to format"),
    platform: z.enum(["linkedin", "twitter", "blog"]),
    tone: z.string().describe("The desired tone of voice"),
  }),
  execute: async ({ content, platform, tone }) => {
    return {
      formattedContent: `[${platform.toUpperCase()}] ${content} (in ${tone} tone)`,
      metadata: {
        platform,
        type: platform === "blog" ? "article" : "post",
        wordCount: content.split(" ").length,
        readingTime: Math.ceil(content.split(" ").length / 200),
      },
      structure: {
        sections: [
          { type: "opening", content: "Opening lines..." },
          { type: "body", content: "Main content..." },
          { type: "closing", content: "Call to action..." },
        ],
      },
      seo: {
        keywords: content.split(" ").slice(0, 5),
        hashtags: ["#Tech", "#Innovation"],
      },
    };
  },
});

/**
 * Publisher Tool - Stores or publishes the content
 */
export const publisherTool = wrapTool({
  description: "Store or publish the final content",
  parameters: z.object({
    content: z.string(),
    metadata: z.object({
      platform: z.enum(["linkedin", "twitter", "blog"]),
      type: z.string(),
      scheduledDate: z.string().optional(),
      status: z.enum(["draft", "scheduled", "published"]).optional(),
      tags: z.array(z.string()).optional(),
      category: z.string().optional(),
      wordCount: z.number().optional(),
      readingTime: z.number().optional(),
    }),
    platform: z.enum(["linkedin", "twitter", "blog"]),
  }),
  execute: async ({ content, metadata, platform }) => {
    // In a real implementation, this would:
    // 1. Store content in a database
    // 2. Schedule for publishing if scheduledDate is provided
    // 3. Publish immediately if no scheduledDate
    // 4. Return the status and details

    const id = `doc_${Date.now()}`;
    const scheduledDate = metadata.scheduledDate
      ? new Date(metadata.scheduledDate)
      : undefined;
    const isScheduled = scheduledDate && scheduledDate > new Date();
    const status = isScheduled ? "scheduled" : "published";
    const publishedAt = isScheduled
      ? metadata.scheduledDate
      : new Date().toISOString();

    return {
      id,
      status,
      platform,
      publishedAt,
      content,
      metadata: {
        ...metadata,
        status,
        lastUpdated: new Date().toISOString(),
      },
      url: `https://example.com/${platform}/${id}`,
      schedulingDetails:
        isScheduled && scheduledDate
          ? {
              scheduledFor: metadata.scheduledDate,
              willPublishIn:
                Math.floor((scheduledDate.getTime() - Date.now()) / 1000 / 60) +
                " minutes",
            }
          : undefined,
    };
  },
});

/**
 * Content Calendar Tool - Manages content scheduling and planning
 */
export const contentCalendarTool = wrapTool({
  description: "Manage content calendar, scheduling, and planning",
  parameters: z.object({
    action: z.enum([
      "create_plan",
      "add_content",
      "get_schedule",
      "update_content",
      "save_strategy",
      "get_strategy",
      "generate_ideas",
    ]),
    data: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      strategy: z
        .object({
          mission: z.string().optional(),
          targetAudience: z.string().optional(),
          contentTypes: z.array(z.string()).optional(),
          topics: z.array(z.string()).optional(),
          formats: z.array(z.string()).optional(),
          matrix: z
            .array(
              z.object({
                type: z.string(),
                topic: z.string(),
                ideas: z.array(z.string()),
              })
            )
            .optional(),
          calendar: z
            .array(
              z.object({
                date: z.string(),
                format: z.string(),
                topic: z.string(),
                angle: z.string(),
                description: z.string(),
              })
            )
            .optional(),
        })
        .optional(),
      frequency: z
        .object({
          daily: z.number().optional(),
          weekly: z.number().optional(),
          timesPerDay: z.number().optional(),
          preferredTimes: z.array(z.string()).optional(),
          platforms: z
            .record(
              z.enum(["linkedin", "twitter", "blog"]),
              z.object({
                postsPerDay: z.number(),
                preferredTimes: z.array(z.string()),
                bestDays: z.array(z.string()),
              })
            )
            .optional(),
        })
        .optional(),
      topics: z.array(z.string()).optional(),
      platforms: z.array(z.enum(["linkedin", "twitter", "blog"])).optional(),
      contentId: z.string().optional(),
      content: z
        .object({
          title: z.string(),
          description: z.string(),
          platform: z.enum(["linkedin", "twitter", "blog"]),
          scheduledDate: z.string(),
          status: z.enum(["draft", "scheduled", "published"]),
          type: z.string(),
          format: z.string().optional(),
          angle: z.string().optional(),
          tags: z.array(z.string()).optional(),
        })
        .optional(),
    }),
  }),
  execute: async ({ action, data }) => {
    switch (action) {
      case "save_strategy": {
        const { strategy } = data;
        if (!strategy)
          throw new Error("Strategy is required for save_strategy action");

        // In a real implementation, this would save to a database
        return {
          id: `strategy_${Date.now()}`,
          ...strategy,
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          status: "active",
        };
      }

      case "get_strategy": {
        // In a real implementation, this would fetch from a database
        return {
          id: "strategy_123",
          mission: "Help professionals showcase their expertise",
          targetAudience: "Tech professionals and businesses",
          contentTypes: [
            "Actionable",
            "Motivational",
            "Analytical",
            "Contrarian",
            "Observation",
          ],
          formats: [
            "Quotes with Image",
            "Infographic",
            "Vertical Video",
            "Long Video",
            "Carousel PDF",
          ],
          matrix: [
            {
              type: "Actionable",
              topic: "AI Development",
              ideas: [
                "Step-by-step guide to implementing AI agents",
                "How to optimize AI models for production",
              ],
            },
          ],
          calendar: [
            {
              date: new Date().toISOString(),
              format: "Carousel PDF",
              topic: "AI Development",
              angle: "Step-by-step guide to implementing AI agents",
              description: "A detailed walkthrough with code examples",
            },
          ],
        };
      }

      case "generate_ideas": {
        const { topics, strategy } = data;
        if (!topics)
          throw new Error("Topics are required for generate_ideas action");

        // In a real implementation, this would use the LLM to generate ideas
        return {
          ideas: topics.map((topic) => ({
            topic,
            contentIdeas: [
              {
                type: "Actionable",
                headline: `How to master ${topic} in 30 days`,
                description: "Step-by-step guide with practical exercises",
              },
              {
                type: "Analytical",
                headline: `Why ${topic} is transforming the industry`,
                description: "Deep dive into current trends and impact",
              },
            ],
          })),
        };
      }

      case "create_plan": {
        const { startDate, endDate, frequency, topics, platforms } = data;

        // Generate platform-specific posting schedules
        const platformSchedules = platforms?.map((platform) => {
          const schedule = {
            platform,
            postsPerDay:
              platform === "linkedin" ? 2 : platform === "twitter" ? 3 : 1,
            preferredTimes:
              platform === "linkedin"
                ? ["09:00", "16:00"]
                : platform === "twitter"
                  ? ["08:00", "12:00", "17:00"]
                  : ["11:00"],
            bestDays:
              platform === "blog"
                ? ["Monday", "Thursday"]
                : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          };
          return schedule;
        });

        // Generate content themes and series
        const contentThemes = topics?.map((topic) => ({
          topic,
          series: [
            {
              name: `${topic} Insights`,
              frequency: "weekly",
              format: "deep dive",
              platforms: ["linkedin", "blog"],
            },
            {
              name: `Quick ${topic} Tips`,
              frequency: "daily",
              format: "short tips",
              platforms: ["twitter"],
            },
          ],
        }));

        const plan = {
          id: `plan_${Date.now()}`,
          startDate,
          endDate,
          frequency,
          topics,
          platforms,
          schedule: {
            platformSchedules,
            contentThemes,
            recommendations: {
              postingTimes: platformSchedules,
              contentMix: {
                educational: 0.4,
                engagement: 0.3,
                promotional: 0.2,
                entertainment: 0.1,
              },
              hashtagStrategy: topics?.map((topic) => ({
                topic,
                suggestedHashtags: [
                  `#${topic.replace(/\s+/g, "")}`,
                  "#Tech",
                  "#Innovation",
                ],
              })),
            },
          },
          suggestedContent: [
            {
              title: "Sample Post 1",
              platform: platforms?.[0] || "linkedin",
              scheduledDate: startDate,
              type: "post",
              description: `Content about ${topics?.[0] || "technology"}`,
              status: "draft",
              series: contentThemes?.[0]?.series[0].name,
            },
          ],
          metadata: {
            totalPosts:
              platforms?.reduce((acc, platform) => {
                const schedule = platformSchedules?.find(
                  (s) => s.platform === platform
                );
                const days =
                  (new Date(endDate!).getTime() -
                    new Date(startDate!).getTime()) /
                  (1000 * 60 * 60 * 24);
                return acc + (schedule?.postsPerDay || 1) * days;
              }, 0) || 0,
            coveragePeriod: `${startDate} to ${endDate}`,
            lastUpdated: new Date().toISOString(),
          },
        };
        return plan;
      }

      case "add_content": {
        const { content } = data;
        if (!content)
          throw new Error("Content is required for add_content action");

        return {
          id: `content_${Date.now()}`,
          ...content,
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        };
      }

      case "get_schedule": {
        const { startDate, endDate } = data;
        // Return detailed schedule for the date range
        return {
          period: { startDate, endDate },
          schedule: {
            daily: [
              {
                platform: "linkedin",
                posts: [
                  {
                    id: "content_123",
                    title: "AI Development Best Practices",
                    platform: "linkedin",
                    scheduledDate: startDate,
                    scheduledTime: "09:00",
                    status: "scheduled",
                    type: "educational",
                    series: "Weekly Deep Dive",
                    theme: "AI trends",
                    contentMixType: "educational",
                    hashtags: ["#AI", "#Development", "#BestPractices"],
                  },
                  {
                    id: "content_124",
                    title: "Quick Dev Productivity Tips",
                    platform: "linkedin",
                    scheduledDate: startDate,
                    scheduledTime: "16:00",
                    status: "scheduled",
                    type: "quick-tip",
                    series: "Daily Tips",
                    theme: "Developer productivity",
                    contentMixType: "engagement",
                    hashtags: ["#DevTips", "#Productivity"],
                  },
                ],
              },
              {
                platform: "twitter",
                posts: [
                  {
                    id: "content_125",
                    title: "Morning Tech Update",
                    platform: "twitter",
                    scheduledDate: startDate,
                    scheduledTime: "08:00",
                    status: "scheduled",
                    type: "news",
                    series: "Tech News Roundup",
                    theme: "Tech industry news",
                    contentMixType: "educational",
                    hashtags: ["#TechNews", "#MorningUpdate"],
                  },
                ],
              },
            ],
            weekly: [
              {
                platform: "blog",
                posts: [
                  {
                    id: "content_126",
                    title: "Deep Dive: Future of AI Development",
                    platform: "blog",
                    scheduledDate: startDate,
                    scheduledTime: "11:00",
                    status: "scheduled",
                    type: "article",
                    series: "Weekly Deep Dive",
                    theme: "AI trends",
                    contentMixType: "educational",
                    hashtags: ["#AI", "#FutureOfTech", "#Development"],
                  },
                ],
              },
            ],
          },
          metadata: {
            totalScheduled: 4,
            nextAvailableSlot: new Date(Date.now() + 86400000).toISOString(),
            contentMixBreakdown: {
              educational: 0.5,
              engagement: 0.25,
              promotional: 0.25,
            },
            platformBreakdown: {
              linkedin: 2,
              twitter: 1,
              blog: 1,
            },
          },
        };
      }

      case "update_content": {
        const { contentId, content } = data;
        if (!contentId || !content)
          throw new Error("Content ID and updated content are required");

        return {
          id: contentId,
          ...content,
          lastUpdated: new Date().toISOString(),
          updateStatus: "success",
        };
      }
    }
  },
});
