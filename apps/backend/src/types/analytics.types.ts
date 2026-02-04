export interface DashboardStats {
  totalTasks: number;
  byStatus: {
    Pending: number;
    'In Progress': number;
    Completed: number;
  };
  byPriority: {
    Low: number;
    Medium: number;
    High: number;
  };
  overdueTasks: number;
  completedThisWeek: number;
  completionRate: number;
}
