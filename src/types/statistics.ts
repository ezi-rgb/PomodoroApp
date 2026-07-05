export type DailyStats = {
  date: string;
  totalFocusTime: number;
  completedSessions: number;
  tasksCompleted: number;
};

export type WeeklyStats = {
  weekStart: string;
  totalFocusTime: number;
  completedSessions: number;
  tasksCompleted: number;
  dailyStats: DailyStats[];
};

export type MonthlyStats = {
  month: string;
  totalFocusTime: number;
  completedSessions: number;
  tasksCompleted: number;
  weeklyStats: WeeklyStats[];
};

export type YearlyStats = {
  year: number;
  totalFocusTime: number;
  completedSessions: number;
  tasksCompleted: number;
  monthlyStats: MonthlyStats[];
};

export type Streak = {
  current: number;
  longest: number;
};
