import { z } from "zod";

// Base schemas for common fields
export const baseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Content Strategy Schema
export const contentStrategySchema = baseEntitySchema.extend({
  name: z.string(),
  mission: z.string(),
  targetAudience: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["draft", "active", "archived"]),
  contentTypes: z.array(z.string()),
  platforms: z.array(z.enum(["linkedin", "twitter", "blog"])),
  topics: z.array(z.string()),
  contentMixRatios: z.object({
    educational: z.number(),
    engagement: z.number(),
    promotional: z.number(),
    entertainment: z.number(),
  }),
});

// Content Matrix Schema
export const contentMatrixSchema = baseEntitySchema.extend({
  strategyId: z.string().uuid(),
  type: z.string(), // e.g., "Actionable", "Motivational", etc.
  topic: z.string(),
  ideas: z.array(
    z.object({
      headline: z.string(),
      description: z.string(),
      format: z.string(),
      platform: z.enum(["linkedin", "twitter", "blog"]),
    })
  ),
});

// Content Calendar Schema
export const contentCalendarSchema = baseEntitySchema.extend({
  strategyId: z.string().uuid(),
  platform: z.enum(["linkedin", "twitter", "blog"]),
  scheduledDate: z.date(),
  scheduledTime: z.string(), // HH:mm format
  status: z.enum(["draft", "scheduled", "published", "archived"]),
  contentType: z.string(),
  format: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  series: z.string().optional(),
  matrixIdeaId: z.string().uuid().optional(), // Reference to the matrix idea this content is based on
});

// Platform Schedule Schema
export const platformScheduleSchema = baseEntitySchema.extend({
  strategyId: z.string().uuid(),
  platform: z.enum(["linkedin", "twitter", "blog"]),
  postsPerDay: z.number(),
  preferredTimes: z.array(z.string()), // Array of HH:mm times
  bestDays: z.array(
    z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
  ),
});

// Content Series Schema
export const contentSeriesSchema = baseEntitySchema.extend({
  strategyId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  platforms: z.array(z.enum(["linkedin", "twitter", "blog"])),
  format: z.string(),
  topic: z.string(),
});

// Content Analytics Schema
export const contentAnalyticsSchema = baseEntitySchema.extend({
  contentId: z.string().uuid(),
  platform: z.enum(["linkedin", "twitter", "blog"]),
  views: z.number(),
  likes: z.number(),
  shares: z.number(),
  comments: z.number(),
  clickThroughRate: z.number(),
  engagementRate: z.number(),
  performanceScore: z.number(),
});

// Example of how these schemas relate to each other:
export type ContentStrategy = z.infer<typeof contentStrategySchema>;
export type ContentMatrix = z.infer<typeof contentMatrixSchema>;
export type ContentCalendar = z.infer<typeof contentCalendarSchema>;
export type PlatformSchedule = z.infer<typeof platformScheduleSchema>;
export type ContentSeries = z.infer<typeof contentSeriesSchema>;
export type ContentAnalytics = z.infer<typeof contentAnalyticsSchema>;
