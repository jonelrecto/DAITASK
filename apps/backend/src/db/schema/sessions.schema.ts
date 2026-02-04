import { mysqlTable, varchar, int, mediumtext } from 'drizzle-orm/mysql-core';

export const sessions = mysqlTable('sessions', {
  session_id: varchar('session_id', { length: 128 }).primaryKey(),
  expires: int('expires').notNull(),
  data: mediumtext('data'),
});
