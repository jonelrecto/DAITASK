import { describe, it, expect } from 'vitest';

describe('Analytics unit tests', () => {
  describe('completion rate calculation', () => {
    function completionRate(completed: number, total: number): number {
      if (total === 0) return 0;
      return Math.round((completed / total) * 10000) / 100;
    }

    it('returns 0 when no tasks', () => {
      expect(completionRate(0, 0)).toBe(0);
    });

    it('returns correct percentage', () => {
      expect(completionRate(4, 10)).toBe(40);
      expect(completionRate(1, 3)).toBe(33.33);
    });

    it('rounds to 2 decimal places', () => {
      expect(completionRate(1, 3)).toBe(33.33);
    });
  });

  describe('date calculations', () => {
    it('seven days ago is in the past', () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      expect(sevenDaysAgo.getTime()).toBeLessThan(Date.now());
    });
  });
});
