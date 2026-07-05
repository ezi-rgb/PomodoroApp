import { describe, it, expect } from "vitest";
import { createInitialState, timerReducer, getProgress } from "@/lib/timer-engine";
import type { TimerConfig } from "@/types";

const defaultConfig: TimerConfig = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

describe("createInitialState", () => {
  it("should create an idle state with focus session", () => {
    const state = createInitialState(defaultConfig);
    expect(state.status).toBe("idle");
    expect(state.sessionType).toBe("focus");
    expect(state.timeRemaining).toBe(1500);
    expect(state.totalDuration).toBe(1500);
    expect(state.currentSession).toBe(1);
  });
});

describe("timerReducer", () => {
  it("should start the timer from idle", () => {
    const initial = createInitialState(defaultConfig);
    const result = timerReducer(initial, { type: "START" }, defaultConfig);
    expect(result.status).toBe("running");
    expect(result.startedAt).not.toBeNull();
  });

  it("should pause the timer when running", () => {
    const initial = { ...createInitialState(defaultConfig), status: "running" as const, startedAt: Date.now() };
    const result = timerReducer(initial, { type: "PAUSE" }, defaultConfig);
    expect(result.status).toBe("paused");
    expect(result.pausedAt).not.toBeNull();
  });

  it("should resume the timer when paused", () => {
    const initial = { ...createInitialState(defaultConfig), status: "paused" as const, pausedAt: Date.now(), elapsedBeforePause: 500 };
    const result = timerReducer(initial, { type: "RESUME" }, defaultConfig);
    expect(result.status).toBe("running");
    expect(result.pausedAt).toBeNull();
  });

  it("should reset to initial state", () => {
    const initial = { ...createInitialState(defaultConfig), status: "running" as const, startedAt: Date.now(), currentSession: 3 };
    const result = timerReducer(initial, { type: "RESET" }, defaultConfig);
    expect(result.status).toBe("idle");
    expect(result.sessionType).toBe("focus");
    expect(result.currentSession).toBe(1);
    expect(result.timeRemaining).toBe(1500);
  });

  it("should complete the timer when time reaches zero", () => {
    const now = Date.now();
    const initial = {
      ...createInitialState(defaultConfig),
      status: "running" as const,
      timeRemaining: 1,
      totalDuration: 1500,
      startedAt: now,
      elapsedBeforePause: 1499000,
    };
    const result = timerReducer(initial, { type: "TICK", now: now + 2000 }, defaultConfig);
    expect(result.status).toBe("completed");
    expect(result.timeRemaining).toBe(0);
  });

  it("should skip to break from focus session", () => {
    const initial = { ...createInitialState(defaultConfig), status: "running" as const, startedAt: Date.now() };
    const result = timerReducer(initial, { type: "SKIP" }, defaultConfig);
    expect(result.sessionType).toBe("shortBreak");
    expect(result.currentSession).toBe(1);
    expect(result.timeRemaining).toBe(300);
  });

  it("should skip to next focus after long break interval", () => {
    const config = { ...defaultConfig, longBreakInterval: 2 };
    const initial = {
      ...createInitialState(config),
      status: "running" as const,
      sessionType: "focus" as const,
      currentSession: 2,
      startedAt: Date.now(),
    };
    const result = timerReducer(initial, { type: "SKIP" }, config);
    expect(result.sessionType).toBe("longBreak");
    expect(result.currentSession).toBe(2);
  });
});

describe("getProgress", () => {
  it("should return 0 for idle state", () => {
    const state = createInitialState(defaultConfig);
    expect(getProgress(state)).toBe(0);
  });

  it("should return 0.5 when half time elapsed", () => {
    const state = {
      ...createInitialState(defaultConfig),
      status: "running" as const,
      timeRemaining: 750,
      totalDuration: 1500,
    };
    expect(getProgress(state)).toBeCloseTo(0.5);
  });
});
