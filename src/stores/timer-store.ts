import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionType, TimerConfig, TimerState } from "@/types";
import { createInitialState, timerReducer, getProgress } from "@/lib/timer-engine";
import { config } from "@/config";
import {
  DEFAULT_FOCUS_DURATION,
  DEFAULT_LONG_BREAK_DURATION,
  DEFAULT_LONG_BREAK_INTERVAL,
  DEFAULT_SHORT_BREAK_DURATION,
  TICK_INTERVAL_MS,
} from "@/constants";

type TimerStore = {
  state: TimerState;
  config: TimerConfig;
  progress: number;
  tickInterval: ReturnType<typeof setInterval> | null;

  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  completeSession: () => void;
  updateConfig: (partial: Partial<TimerConfig>) => void;
  updateDuration: (sessionType: SessionType, duration: number) => void;
  setProgress: (progress: number) => void;
  startTicking: () => void;
  stopTicking: () => void;
};

const defaultConfig: TimerConfig = {
  focusDuration: DEFAULT_FOCUS_DURATION,
  shortBreakDuration: DEFAULT_SHORT_BREAK_DURATION,
  longBreakDuration: DEFAULT_LONG_BREAK_DURATION,
  longBreakInterval: DEFAULT_LONG_BREAK_INTERVAL,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      state: createInitialState(defaultConfig),
      config: defaultConfig,
      progress: 0,
      tickInterval: null,

      start: () => {
        const { config } = get();
        set((s) => {
          const newState = timerReducer(s.state, { type: "START" }, config);
          return { state: newState, progress: getProgress(newState) };
        });
      },

      pause: () => {
        const { config } = get();
        set((s) => {
          const newState = timerReducer(s.state, { type: "PAUSE" }, config);
          return { state: newState, progress: getProgress(newState) };
        });
      },

      resume: () => {
        const { config } = get();
        set((s) => {
          const newState = timerReducer(s.state, { type: "RESUME" }, config);
          return { state: newState, progress: getProgress(newState) };
        });
      },

      reset: () => {
        const { config } = get();
        set((s) => {
          const newState = timerReducer(s.state, { type: "RESET" }, config);
          return { state: newState, progress: 0 };
        });
      },

      skip: () => {
        const { config } = get();
        set((s) => {
          const newState = timerReducer(s.state, { type: "SKIP" }, config);
          return { state: newState, progress: getProgress(newState) };
        });
      },

      completeSession: () => {
        const { config } = get();
        set((s) => {
          const newState = timerReducer(s.state, { type: "COMPLETE" }, config);
          return { state: newState, progress: 0 };
        });
      },

      updateConfig: (partial: Partial<TimerConfig>) => {
        set((s) => {
          const newConfig = { ...s.config, ...partial };
          return { config: newConfig };
        });
      },

      updateDuration: (sessionType: SessionType, duration: number) => {
        const { config } = get();
        set((s) => {
          const newState = timerReducer(
            s.state,
            { type: "SET_DURATION", sessionType, duration },
            config,
          );
          return { state: newState, progress: getProgress(newState) };
        });
      },

      setProgress: (progress: number) => {
        set({ progress });
      },

      startTicking: () => {
        const { tickInterval } = get();
        if (tickInterval) return;

        const interval = setInterval(() => {
          const { state, config } = get();
          if (state.status !== "running") return;

          const newState = timerReducer(state, { type: "TICK", now: Date.now() }, config);
          set({ state: newState, progress: getProgress(newState) });
        }, TICK_INTERVAL_MS);

        set({ tickInterval: interval });
      },

      stopTicking: () => {
        const { tickInterval } = get();
        if (tickInterval) {
          clearInterval(tickInterval);
          set({ tickInterval: null });
        }
      },
    }),
    {
      name: config.storage.timerState,
      partialize: (state) => ({
        state: state.state,
        config: state.config,
      }),
    },
  ),
);
