import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../server';
import { getTestPool, runMigrations, closePool } from '../utils/testDb';
import {
  createTestUser,
  createTestTask,
  clearTestData,
  clearUserTasks,
} from '../utils/testHelpers';

describe('Analytics integration tests', () => {
  let agent: ReturnType<typeof request.agent>;
  let userId: number = 0;

  beforeAll(async () => {
    const pool = await getTestPool();
    await runMigrations(pool);
    await closePool(pool);
    const { user, plainPassword } = await createTestUser('analytics@example.com', 'Analytics123!');
    userId = user.id;
    agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: user.email, password: plainPassword });
  });

  afterAll(async () => {
    await clearTestData();
  });

  beforeEach(async () => {
    await clearUserTasks(userId);
  });

  describe('GET /api/analytics/dashboard', () => {
    it('returns correct structure', async () => {
      const res = await agent.get('/api/analytics/dashboard');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalTasks');
      expect(res.body).toHaveProperty('byStatus');
      expect(res.body).toHaveProperty('byPriority');
      expect(res.body).toHaveProperty('overdueTasks');
      expect(res.body).toHaveProperty('completedThisWeek');
      expect(res.body).toHaveProperty('completionRate');
      expect(res.body.byStatus).toEqual({ Pending: 0, 'In Progress': 0, Completed: 0 });
      expect(res.body.byPriority).toEqual({ Low: 0, Medium: 0, High: 0 });
    });

    it('returns zeros when no tasks', async () => {
      const res = await agent.get('/api/analytics/dashboard');
      expect(res.status).toBe(200);
      expect(res.body.totalTasks).toBe(0);
      expect(res.body.overdueTasks).toBe(0);
      expect(res.body.completedThisWeek).toBe(0);
      expect(res.body.completionRate).toBe(0);
    });

    it('counts total and by status correctly', async () => {
      await createTestTask(userId, { title: 'A', status: 'Pending' });
      await createTestTask(userId, { title: 'B', status: 'Completed' });
      await createTestTask(userId, { title: 'C', status: 'Completed' });
      const res = await agent.get('/api/analytics/dashboard');
      expect(res.status).toBe(200);
      expect(res.body.totalTasks).toBe(3);
      expect(res.body.byStatus.Pending).toBe(1);
      expect(res.body.byStatus.Completed).toBe(2);
      expect(res.body.completionRate).toBe(66.67);
    });

    it('requires authentication', async () => {
      const res = await request(app).get('/api/analytics/dashboard');
      expect(res.status).toBe(401);
    });
  });
});
