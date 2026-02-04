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

describe('Task integration tests', () => {
  let agent: ReturnType<typeof request.agent>;
  let userId: number = 0;

  beforeAll(async () => {
    const pool = await getTestPool();
    await runMigrations(pool);
    await closePool(pool);
    const { user, plainPassword } = await createTestUser('taskuser@example.com', 'Task123!');
    userId = user.id;
    agent = request.agent(app);
    await agent
      .post('/api/auth/login')
      .send({ email: user.email, password: plainPassword });
  });

  afterAll(async () => {
    await clearTestData();
  });

  beforeEach(async () => {
    await clearUserTasks(userId);
  });

  describe('GET /api/tasks', () => {
    it('returns empty array when no tasks', async () => {
      const res = await agent.get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns user tasks only', async () => {
      await createTestTask(userId, { title: 'My Task' });
      const res = await agent.get('/api/tasks');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('My Task');
    });

    it('filters by status', async () => {
      await createTestTask(userId, { title: 'P', status: 'Pending' });
      await createTestTask(userId, { title: 'C', status: 'Completed' });
      const res = await agent.get('/api/tasks?status=Pending');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].status).toBe('Pending');
    });

    it('filters by priority', async () => {
      await createTestTask(userId, { title: 'H', priority: 'High' });
      await createTestTask(userId, { title: 'L', priority: 'Low' });
      const res = await agent.get('/api/tasks?priority=High');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].priority).toBe('High');
    });

    it('requires authentication', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('returns task when exists and owned', async () => {
      const task = await createTestTask(userId, { title: 'Single' });
      const res = await agent.get(`/api/tasks/${task.id}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(task.id);
      expect(res.body.title).toBe('Single');
    });

    it('returns 404 when task does not exist', async () => {
      const res = await agent.get('/api/tasks/99999');
      expect(res.status).toBe(404);
    });

    it('requires authentication', async () => {
      const res = await request(app).get('/api/tasks/1');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('creates task with required fields only', async () => {
      const res = await agent
        .post('/api/tasks')
        .send({ title: 'New Task' });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Task');
      expect(res.body.status).toBe('Pending');
      expect(res.body.priority).toBe('Medium');
      expect(res.body.userId).toBe(userId);
    });

    it('creates task with all fields', async () => {
      const res = await agent
        .post('/api/tasks')
        .send({
          title: 'Full Task',
          description: 'Desc',
          status: 'In Progress',
          priority: 'High',
          dueDate: '2024-12-31',
        });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Full Task');
      expect(res.body.description).toBe('Desc');
      expect(res.body.status).toBe('In Progress');
      expect(res.body.priority).toBe('High');
      expect(res.body.dueDate).toBe('2024-12-31');
    });

    it('returns 400 without title', async () => {
      const res = await agent.post('/api/tasks').send({});
      expect(res.status).toBe(400);
    });

    it('requires authentication', async () => {
      const res = await request(app).post('/api/tasks').send({ title: 'No Auth' });
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('updates task title', async () => {
      const task = await createTestTask(userId, { title: 'Original' });
      const res = await agent
        .put(`/api/tasks/${task.id}`)
        .send({ title: 'Updated' });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
    });

    it('returns 404 when task does not exist', async () => {
      const res = await agent
        .put('/api/tasks/99999')
        .send({ title: 'No' });
      expect(res.status).toBe(404);
    });

    it('requires authentication', async () => {
      const res = await request(app).put('/api/tasks/1').send({ title: 'No' });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes task and returns 204', async () => {
      const task = await createTestTask(userId, { title: 'To Delete' });
      const res = await agent.delete(`/api/tasks/${task.id}`);
      expect(res.status).toBe(204);
      const getRes = await agent.get(`/api/tasks/${task.id}`);
      expect(getRes.status).toBe(404);
    });

    it('returns 404 when task does not exist', async () => {
      const res = await agent.delete('/api/tasks/99999');
      expect(res.status).toBe(404);
    });

    it('requires authentication', async () => {
      const res = await request(app).delete('/api/tasks/1');
      expect(res.status).toBe(401);
    });
  });
});
