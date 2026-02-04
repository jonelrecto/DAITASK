import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { tasks } from './tasks.schema';

export { users } from './users.schema';
export { sessions } from './sessions.schema';
export { tasks, type Task, type NewTask } from './tasks.schema';
export type { User, NewUser } from './users.schema';

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users),
}));
