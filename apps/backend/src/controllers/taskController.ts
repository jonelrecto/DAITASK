import type { Request, Response } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db';
import { tasks } from '../db/schema/tasks.schema';
import type { TaskStatus, TaskPriority } from '../types/task.types';

export async function getAllTasks(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const status = req.query.status as TaskStatus | undefined;
  const priority = req.query.priority as TaskPriority | undefined;
  const conditions = [eq(tasks.userId, userId)];
  if (status) conditions.push(eq(tasks.status, status));
  if (priority) conditions.push(eq(tasks.priority, priority));
  const result = await db
    .select()
    .from(tasks)
    .where(and(...conditions))
    .orderBy(desc(tasks.createdAt));
  res.status(200).json(result);
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.status(200).json(task);
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const { title, description, status, priority, dueDate } = req.body;
  await db
    .insert(tasks)
    .values({
      userId,
      title,
      description: description ?? null,
      status: status ?? 'Pending',
      priority: priority ?? 'Medium',
      dueDate: dueDate ?? null,
    });
  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.id))
    .limit(1);
  res.status(201).json(task!);
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const [existing] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);
  if (!existing) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  const { title, description, status, priority, dueDate } = req.body;
  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (priority !== undefined) updateData.priority = priority;
  if (dueDate !== undefined) updateData.dueDate = dueDate;
  await db
    .update(tasks)
    .set(updateData as typeof tasks.$inferInsert)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);
  res.status(200).json(task!);
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const id = Number(req.params.id);
  const [existing] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);
  if (!existing) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  res.status(204).send();
}
