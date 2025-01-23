import { db } from "../db";
import { eq, and } from "drizzle-orm";
import {
  contentStrategy,
  contentMatrix,
  contentCalendar,
  platformSchedule,
  contentSeries,
  contentAnalytics,
  type NewContentStrategy,
  type NewContentMatrix,
  type NewContentCalendar,
  type NewPlatformSchedule,
  type NewContentSeries,
  type NewContentAnalytics,
} from "../db/schema/content";

export class ContentService {
  // Content Strategy
  async createStrategy(data: NewContentStrategy) {
    const [strategy] = await db
      .insert(contentStrategy)
      .values(data)
      .returning();
    return strategy;
  }

  async getStrategy(id: string) {
    const [strategy] = await db
      .select()
      .from(contentStrategy)
      .where(eq(contentStrategy.id, id));
    return strategy;
  }

  async updateStrategy(id: string, data: Partial<NewContentStrategy>) {
    const [strategy] = await db
      .update(contentStrategy)
      .set(data)
      .where(eq(contentStrategy.id, id))
      .returning();
    return strategy;
  }

  // Content Matrix
  async createMatrixItem(data: NewContentMatrix) {
    const [item] = await db.insert(contentMatrix).values(data).returning();
    return item;
  }

  async getMatrixItems(strategyId: string) {
    return await db
      .select()
      .from(contentMatrix)
      .where(eq(contentMatrix.strategyId, strategyId));
  }

  // Content Calendar
  async createCalendarItem(data: NewContentCalendar) {
    const [item] = await db.insert(contentCalendar).values(data).returning();
    return item;
  }

  async getCalendarItems(strategyId: string, startDate: Date, endDate: Date) {
    return await db
      .select()
      .from(contentCalendar)
      .where(
        and(
          eq(contentCalendar.strategyId, strategyId),
          eq(contentCalendar.scheduledDate >= startDate),
          eq(contentCalendar.scheduledDate <= endDate)
        )
      );
  }

  async updateCalendarItem(id: string, data: Partial<NewContentCalendar>) {
    const [item] = await db
      .update(contentCalendar)
      .set(data)
      .where(eq(contentCalendar.id, id))
      .returning();
    return item;
  }

  // Platform Schedule
  async createPlatformSchedule(data: NewPlatformSchedule) {
    const [schedule] = await db
      .insert(platformSchedule)
      .values(data)
      .returning();
    return schedule;
  }

  async getPlatformSchedule(strategyId: string, platform: string) {
    const [schedule] = await db
      .select()
      .from(platformSchedule)
      .where(
        and(
          eq(platformSchedule.strategyId, strategyId),
          eq(platformSchedule.platform, platform)
        )
      );
    return schedule;
  }

  // Content Series
  async createSeries(data: NewContentSeries) {
    const [series] = await db.insert(contentSeries).values(data).returning();
    return series;
  }

  async getSeriesByStrategy(strategyId: string) {
    return await db
      .select()
      .from(contentSeries)
      .where(eq(contentSeries.strategyId, strategyId));
  }

  // Content Analytics
  async createAnalytics(data: NewContentAnalytics) {
    const [analytics] = await db
      .insert(contentAnalytics)
      .values(data)
      .returning();
    return analytics;
  }

  async getContentAnalytics(contentId: string) {
    const [analytics] = await db
      .select()
      .from(contentAnalytics)
      .where(eq(contentAnalytics.contentId, contentId));
    return analytics;
  }

  async updateAnalytics(id: string, data: Partial<NewContentAnalytics>) {
    const [analytics] = await db
      .update(contentAnalytics)
      .set(data)
      .where(eq(contentAnalytics.id, id))
      .returning();
    return analytics;
  }
}
