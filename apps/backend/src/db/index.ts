import { drizzle } from 'drizzle-orm/mysql2';
import { pool } from '../config/database';
import * as schema from './schema';

export const db = drizzle(pool, { schema, mode: 'default' });
export * from './schema';
