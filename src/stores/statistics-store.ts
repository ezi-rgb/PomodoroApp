import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DailyStats, Streak } from "@/types";
import { config } from "@/config";
import { format, subDays } from "date-fns";

type SessionLogEntry = {
  id: string;
  type: "focus" | "shortBreak" | "longBreak";
  duration: number;
  completed: boolean;
  taskId: string | null;
  timestamp: number;
};

type StatisticsStore = {
  sessionLog: SessionLogEntry[];
  dailyStats: Record<string, DailyStats>;
  streak: Streak;

  logSession: (
    type: "focus" | "shortBreak" | "longBreak",
    duration: number,
    completed: boolean,
    taskId: string | null,
  ) => void;
  getDailyStats: (date: string) => DailyStats;
  getWeeklyStats: () => { totalFocusTime: number; completedSessions: number; tasksCompleted: number };
  getMonthlyStats: () => { totalFocusTime: number; completedSessions: number; tasksCompleted: number };
  clearHistory: () => void;
};

export const useStatisticsStore = create<StatisticsStore>()(
  persist(
    (set, get) => ({
      sessionLog: [],
      dailyStats: {},
      streak: { current: 0, longest: 0 },

      logSession: (type, duration, completed, taskId) => {
        const now = Date.now();
        const today = format(now, "yyyy-MM-dd");
        const entry: SessionLogEntry = {
          id: `session_${now}_${Math.random().toString(36).slice(2, 9)}`,
          type,
          duration,
          completed,
          taskId,
          timestamp: now,
        };

        set((s) => {
          const updatedLog = [entry, ...s.sessionLog];

          const prevDaily = s.dailyStats[today] ?? {
            date: today,
            totalFocusTime: 0,
            completedSessions: 0,
            tasksCompleted: 0,
          };

          const updatedDaily: DailyStats = {
            ...prevDaily,
            totalFocusTime:
              prevDaily.totalFocusTime + (type === "focus" ? duration : 0),
            completedSessions:
              prevDaily.completedSessions + (completed ? 1 : 0),
            tasksCompleted: prevDaily.tasksCompleted + (taskId ? 1 : 0),
          };

          const updatedStreak = calculateStreak({ ...s.dailyStats, [today]: updatedDaily });

          return {
            sessionLog: updatedLog,
            dailyStats: { ...s.dailyStats, [today]: updatedDaily },
            streak: updatedStreak,
          };
        });
      },

      getDailyStats: (date: string) => {
        return (
          get().dailyStats[date] ?? {
            date,
            totalFocusTime: 0,
            completedSessions: 0,
            tasksCompleted: 0,
          }
        );
      },

      getWeeklyStats: () => {
        const { dailyStats } = get();
        const today = new Date();

        let totalFocusTime = 0;
        let completedSessions = 0;
        let tasksCompleted = 0;

        for (let i = 0; i < 7; i++) {
          const date = format(subDays(today, i), "yyyy-MM-dd");
          const day = dailyStats[date];
          if (day) {
            totalFocusTime += day.totalFocusTime;
            completedSessions += day.completedSessions;
            tasksCompleted += day.tasksCompleted;
          }
        }

        return { totalFocusTime, completedSessions, tasksCompleted };
      },

      getMonthlyStats: () => {
        const { dailyStats } = get();
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        let totalFocusTime = 0;
        let completedSessions = 0;
        let tasksCompleted = 0;

        for (const [date, stats] of Object.entries(dailyStats)) {
          const d = new Date(date);
          if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
            totalFocusTime += stats.totalFocusTime;
            completedSessions += stats.completedSessions;
            tasksCompleted += stats.tasksCompleted;
          }
        }

        return { totalFocusTime, completedSessions, tasksCompleted };
      },

      clearHistory: () => {
        set({
          sessionLog: [],
          dailyStats: {},
          streak: { current: 0, longest: 0 },
        });
      },
    }),
    {
      name: config.storage.statistics,
    },
  ),
);

function calculateStreak(
  dailyStats: Record<string, DailyStats>,
): Streak {
  let current = 0;
  let longest = 0;
  let tempStreak = 0;

  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    const day = dailyStats[date];
    if (day && day.completedSessions > 0) {
      tempStreak++;
      longest = Math.max(longest, tempStreak);
      if (i === 0) current = tempStreak;
    } else {
      if (i === 0) {
        tempStreak = 0;
      }
      longest = Math.max(longest, tempStreak);
      tempStreak = 0;
    }
  }

  return { current, longest };
}
