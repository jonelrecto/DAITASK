import { mysqlTable, int, varchar, text, date, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

const taskStatusEnum = mysqlEnum('task_status', ['Pending', 'In Progress', 'Completed']);
const taskPriorityEnum = mysqlEnum('task_priority', ['Low', 'Medium', 'High']);

export const tasks = mysqlTable('tasks', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: taskStatusEnum.notNull().default('Pending'),
  priority: taskPriorityEnum.notNull().default('Medium'),
  dueDate: date('due_date', { mode: 'string' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
