import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { pool } from '../config/database';
import * as path from 'path';

async function runMigrations() {
  const db = drizzle(pool);
  const migrationsFolder = path.join(__dirname, 'migrations');
  await migrate(db, { migrationsFolder });
  console.log('Migrations completed.');
  await pool.end();
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
