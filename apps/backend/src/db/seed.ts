import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { users } from './schema/users.schema';
import { tasks } from './schema/tasks.schema';
import bcrypt from 'bcryptjs';

const DEMO_USERS = [
  { email: 'demo@example.com', password: 'Demo123!' },
  { email: 'test@example.com', password: 'Test123!' },
  { email: 'admin@example.com', password: 'Admin123!' },
];

const SAMPLE_TASKS = [
  { title: 'Review project requirements', description: 'Go through the spec and note edge cases', status: 'Completed' as const, priority: 'High' as const, dueDate: '2024-01-15' },
  { title: 'Set up development environment', description: 'Install tools and clone repo', status: 'Completed' as const, priority: 'Medium' as const, dueDate: '2024-01-10' },
  { title: 'Design database schema', description: 'Finalize tables and relations', status: 'In Progress' as const, priority: 'High' as const, dueDate: '2024-02-01' },
  { title: 'Implement auth endpoints', description: 'Register, login, logout', status: 'In Progress' as const, priority: 'High' as const, dueDate: '2024-02-05' },
  { title: 'Write unit tests for auth', description: 'Cover hashing and validation', status: 'Pending' as const, priority: 'Medium' as const, dueDate: '2024-02-10' },
  { title: 'Create task CRUD API', description: 'Endpoints with filtering', status: 'Pending' as const, priority: 'High' as const, dueDate: '2024-02-15' },
  { title: 'Add analytics dashboard endpoint', description: 'Aggregate stats by status and priority', status: 'Pending' as const, priority: 'Medium' as const, dueDate: '2024-02-20' },
  { title: 'Build Vue login page', description: 'Form with validation', status: 'Pending' as const, priority: 'Medium' as const, dueDate: null },
  { title: 'Build task list UI', description: 'Cards, filters, create/edit modal', status: 'Pending' as const, priority: 'High' as const, dueDate: '2024-03-01' },
  { title: 'Integrate Chart.js for analytics', description: 'Doughnut and bar charts', status: 'Pending' as const, priority: 'Low' as const, dueDate: null },
  { title: 'Overdue placeholder task', description: 'Past due, not completed', status: 'Pending' as const, priority: 'Low' as const, dueDate: '2024-01-01' },
  { title: 'Another overdue item', description: 'To test overdue count', status: 'In Progress' as const, priority: 'Medium' as const, dueDate: '2024-01-20' },
];

async function seed() {
  for (const u of DEMO_USERS) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    try {
      await db.insert(users).values({
        email: u.email,
        password: hashedPassword,
      });
    } catch {
      // User may already exist
    }
  }

  const [demoUser] = await db.select().from(users).where(eq(users.email, 'demo@example.com')).limit(1);
  if (!demoUser) throw new Error('Demo user not found after insert');

  for (const t of SAMPLE_TASKS) {
    await db.insert(tasks).values({
      userId: demoUser.id,
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate,
    });
  }

  console.log('Seed completed: users and sample tasks created.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
