export const config = {
  app: {
    name: "Pomodoro",
    description: "A modern, beautiful Pomodoro timer for focused productivity.",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  },
  limits: {
    maxTasksPerPage: 50,
    maxLabelsPerTask: 10,
    maxSessionHistory: 365,
  },
  storage: {
    timerState: "pomodoro:timer-state",
    settings: "pomodoro:settings",
    tasks: "pomodoro:tasks",
    statistics: "pomodoro:statistics",
    sessionLog: "pomodoro:session-log",
  },
  sync: {
    intervalMs: 30000,
    retryAttempts: 3,
    retryDelayMs: 1000,
  },
} as const;
