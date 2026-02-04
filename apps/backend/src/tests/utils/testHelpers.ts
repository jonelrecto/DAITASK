import { db } from '../../db';
import { users } from '../../db/schema/users.schema';
import { tasks } from '../../db/schema/tasks.schema';
import { eq, desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { TaskStatus, TaskPriority } from '../../types/task.types';

export async function createTestUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(users).values({ email, password: hashedPassword });
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) throw new Error('Test user not created');
  return { user, plainPassword: password };
}

export async function clearTestData() {
  await db.delete(tasks);
  await db.delete(users);
}

export async function createTestTask(
  userId: number,
  data: { title: string; description?: string; status?: TaskStatus; priority?: TaskPriority; dueDate?: string | null }
) {
  await db.insert(tasks).values({
    userId,
    title: data.title,
    description: data.description ?? null,
    status: data.status ?? 'Pending',
    priority: data.priority ?? 'Medium',
    dueDate: data.dueDate ?? null,
  });
  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.id))
    .limit(1);
  return task!;
}

export async function getLastTaskForUser(userId: number) {
  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.id))
    .limit(1);
  return task ?? null;
}

export async function createMultipleTestTasks(userId: number, count: number) {
  const created = [];
  for (let i = 0; i < count; i++) {
    const task = await createTestTask(userId, { title: `Task ${i + 1}` });
    created.push(task);
  }
  return created;
}

export async function clearUserTasks(userId: number) {
  await db.delete(tasks).where(eq(tasks.userId, userId));
}
