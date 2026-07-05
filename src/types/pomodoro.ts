export type TimerStatus = "idle" | "running" | "paused" | "completed";

export type SessionType = "focus" | "shortBreak" | "longBreak";

export type TimerState = {
  status: TimerStatus;
  sessionType: SessionType;
  currentSession: number;
  timeRemaining: number;
  totalDuration: number;
  startedAt: number | null;
  pausedAt: number | null;
  elapsedBeforePause: number;
};

export type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESET" }
  | { type: "SKIP" }
  | { type: "TICK"; now: number }
  | { type: "COMPLETE" }
  | { type: "SET_DURATION"; sessionType: SessionType; duration: number };

export type TimerConfig = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
};
