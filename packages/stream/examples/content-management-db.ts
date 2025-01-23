import { ContentService } from "../services/content-service";
import { calendarAgent } from "../agents/calendar-agent";
import { contentCalendarTool } from "../tools";

const contentService = new ContentService();

async function createContentStrategy() {
  // Example of creating a content strategy
  const strategy = await contentService.createStrategy({
    userId: "user-123",
    name: "Tech Blog Strategy Q1 2024",
    mission: "Share insights about AI and development",
    targetAudience: "Software developers and tech enthusiasts",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    contentTypes: ["article", "tutorial", "case-study"],
    platforms: ["linkedin", "twitter", "blog"],
    topics: ["AI", "Development", "Tech Trends"],
    contentMixRatios: {
      educational: 0.4,
      engagement: 0.3,
      promotional: 0.2,
      entertainment: 0.1,
    },
  });

  // Use calendar agent to generate content plan
  const contentPlan = await calendarAgent([
    {
      role: "user",
      content: `Create a content calendar for Q1 2024 focusing on:
    - Weekly technical deep dives
    - Daily dev tips
    - Monthly case studies
    Platform mix: LinkedIn, Twitter, Blog
    Topics: ${strategy.topics.join(", ")}`,
      id: "1",
    },
  ]);

  // Save platform schedules
  await contentService.createPlatformSchedule({
    strategyId: strategy.id,
    platform: "linkedin",
    postsPerDay: 2,
    preferredTimes: ["09:00", "16:00"],
    bestDays: ["Monday", "Wednesday", "Friday"],
  });

  // Create content series
  await contentService.createSeries({
    strategyId: strategy.id,
    name: "Weekly Tech Deep Dives",
    description: "In-depth technical content about AI and development",
    frequency: "weekly",
    platforms: ["linkedin", "blog"],
    format: "article",
    topic: "AI Development",
  });

  // Generate content matrix
  await contentService.createMatrixItem({
    strategyId: strategy.id,
    type: "educational",
    topic: "AI Development",
    ideas: [
      {
        headline: "Building Robust AI Systems",
        description: "A deep dive into system architecture",
        format: "article",
        platform: "blog",
      },
    ],
  });

  // Schedule content
  await contentService.createCalendarItem({
    strategyId: strategy.id,
    platform: "blog",
    scheduledDate: new Date("2024-01-08"),
    scheduledTime: "11:00",
    contentType: "article",
    format: "long-form",
    title: "Building Robust AI Systems",
    description: "A deep dive into system architecture",
    tags: ["AI", "Development", "Architecture"],
    series: "Weekly Tech Deep Dives",
  });

  // Track analytics
  await contentService.createAnalytics({
    contentId: "content-123",
    platform: "blog",
    views: 1000,
    likes: 50,
    shares: 25,
    comments: 10,
    clickThroughRate: 5,
    engagementRate: 8,
    performanceScore: 85,
  });
}

// Example of using the content calendar tool
async function useContentCalendarTool() {
  const result = await contentCalendarTool.createPlan({
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    platforms: ["linkedin", "twitter", "blog"],
    frequency: {
      daily: true,
      weekly: true,
      timesPerDay: {
        linkedin: 2,
        twitter: 3,
        blog: 1,
      },
    },
    topics: ["AI", "Development", "Tech Trends"],
  });

  // Save the generated plan to the database
  for (const item of result.schedule) {
    await contentService.createCalendarItem({
      strategyId: "strategy-123",
      platform: item.platform,
      scheduledDate: new Date(item.date),
      scheduledTime: item.time,
      contentType: item.type,
      format: item.format,
      title: item.title,
      description: item.description,
      tags: item.tags,
      series: item.series,
    });
  }
}

export async function runExample() {
  await createContentStrategy();
  await useContentCalendarTool();
}
