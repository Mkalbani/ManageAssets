export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  joinedAt: string;
}

export interface ReportSummary {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}
