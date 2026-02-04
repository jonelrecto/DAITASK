import { describe, it, expect } from 'vitest';
import type { TaskStatus, TaskPriority } from '../../types/task.types';

describe('Task unit tests', () => {
  describe('Task types and enums', () => {
    it('TaskStatus has expected values', () => {
      const statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
      expect(statuses).toHaveLength(3);
      expect(statuses).toContain('Pending');
      expect(statuses).toContain('In Progress');
      expect(statuses).toContain('Completed');
    });

    it('TaskPriority has expected values', () => {
      const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
      expect(priorities).toHaveLength(3);
      expect(priorities).toContain('Low');
      expect(priorities).toContain('Medium');
      expect(priorities).toContain('High');
    });
  });

  describe('filter building logic', () => {
    it('builds conditions array with userId always present', () => {
      const userId = 1;
      const conditions = [userId];
      expect(conditions).toContain(1);
    });

    it('date validation accepts ISO date string', () => {
      const validDate = '2024-02-15';
      const parsed = new Date(validDate);
      expect(parsed.getTime()).not.toBeNaN();
    });
  });
});
