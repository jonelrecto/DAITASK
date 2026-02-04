import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import * as path from 'path';

const TEST_DB = process.env.DB_NAME ?? 'task_management';

export async function getTestPool() {
  return mysql.createPool({
    host: process.env.DB_HOST ?? 'localhost',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: TEST_DB,
    port: Number(process.env.DB_PORT) || 3306,
  });
}

export async function runMigrations(pool: mysql.Pool) {
  const db = drizzle(pool);
  const migrationsFolder = path.join(__dirname, '../../db/migrations');
  await migrate(db, { migrationsFolder });
}

export async function closePool(pool: mysql.Pool) {
  await pool.end();
}
