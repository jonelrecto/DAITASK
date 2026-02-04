import type { Request, Response } from 'express';
import { eq, and, lt, ne, gte, count } from 'drizzle-orm';
import { db } from '../db';
import { tasks } from '../db/schema/tasks.schema';
import type { DashboardStats } from '../types/analytics.types';

export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const [totalResult] = await db
    .select({ count: count() })
    .from(tasks)
    .where(eq(tasks.userId, userId));
  const totalTasks = totalResult?.count ?? 0;

  const byStatusRows = await db
    .select({
      status: tasks.status,
      count: count(),
    })
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .groupBy(tasks.status);
  const byStatus = {
    Pending: 0,
    'In Progress': 0,
    Completed: 0,
  };
  for (const row of byStatusRows) {
    if (row.status in byStatus) {
      byStatus[row.status as keyof typeof byStatus] = row.count;
    }
  }

  const byPriorityRows = await db
    .select({
      priority: tasks.priority,
      count: count(),
    })
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .groupBy(tasks.priority);
  const byPriority = {
    Low: 0,
    Medium: 0,
    High: 0,
  };
  for (const row of byPriorityRows) {
    if (row.priority in byPriority) {
      byPriority[row.priority as keyof typeof byPriority] = row.count;
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const [overdueResult] = await db
    .select({ count: count() })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        lt(tasks.dueDate, today),
        ne(tasks.status, 'Completed')
      )
    );
  const overdueTasks = overdueResult?.count ?? 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 19).replace('T', ' ');
  const [completedThisWeekResult] = await db
    .select({ count: count() })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.status, 'Completed'),
        gte(tasks.updatedAt, sevenDaysAgo)
      )
    );
  const completedThisWeek = completedThisWeekResult?.count ?? 0;

  const completedCount = byStatus.Completed;
  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 10000) / 100;

  const stats: DashboardStats = {
    totalTasks,
    byStatus,
    byPriority,
    overdueTasks,
    completedThisWeek,
    completionRate,
  };
  res.status(200).json(stats);
}
