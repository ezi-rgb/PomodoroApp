import type { TimerAction, TimerConfig, TimerState } from "@/types";

export function createInitialState(config: TimerConfig): TimerState {
  return {
    status: "idle",
    sessionType: "focus",
    currentSession: 1,
    timeRemaining: config.focusDuration,
    totalDuration: config.focusDuration,
    startedAt: null,
    pausedAt: null,
    elapsedBeforePause: 0,
  };
}

function getNextSessionType(
  sessionType: TimerState["sessionType"],
  currentSession: number,
  config: TimerConfig,
): TimerState["sessionType"] {
  if (sessionType === "focus") {
    if (currentSession % config.longBreakInterval === 0) {
      return "longBreak";
    }
    return "shortBreak";
  }
  return "focus";
}

function getSessionDuration(
  sessionType: TimerState["sessionType"],
  config: TimerConfig,
): number {
  switch (sessionType) {
    case "focus":
      return config.focusDuration;
    case "shortBreak":
      return config.shortBreakDuration;
    case "longBreak":
      return config.longBreakDuration;
  }
}

export function timerReducer(state: TimerState, action: TimerAction, config: TimerConfig): TimerState {
  switch (action.type) {
    case "START": {
      if (state.status !== "idle" && state.status !== "completed") {
        return state;
      }
      return {
        ...state,
        status: "running",
        startedAt: Date.now(),
        pausedAt: null,
        elapsedBeforePause: 0,
      };
    }

    case "PAUSE": {
      if (state.status !== "running") {
        return state;
      }
      return {
        ...state,
        status: "paused",
        pausedAt: Date.now(),
        elapsedBeforePause:
          state.elapsedBeforePause + (Date.now() - (state.startedAt ?? Date.now())),
      };
    }

    case "RESUME": {
      if (state.status !== "paused") {
        return state;
      }
      return {
        ...state,
        status: "running",
        startedAt: Date.now(),
        pausedAt: null,
      };
    }

    case "RESET": {
      return {
        ...createInitialState(config),
        currentSession: 1,
      };
    }

    case "SKIP": {
      const nextType = getNextSessionType(
        state.sessionType,
        state.currentSession,
        config,
      );
      const nextSession =
        state.sessionType === "focus"
          ? state.currentSession
          : state.currentSession + 1;
      const duration = getSessionDuration(nextType, config);

      return {
        ...createInitialState(config),
        status: config.autoStartPomodoros && nextType === "focus" ? "running" : "idle",
        sessionType: nextType,
        currentSession: nextSession,
        timeRemaining: duration,
        totalDuration: duration,
        startedAt: config.autoStartPomodoros && nextType === "focus" ? Date.now() : null,
      };
    }

    case "TICK": {
      if (state.status !== "running") {
        return state;
      }

      const elapsed = state.pausedAt
        ? state.elapsedBeforePause
        : state.elapsedBeforePause + (action.now - (state.startedAt ?? action.now));

      const remaining = Math.max(0, state.totalDuration - Math.floor(elapsed / 1000));

      if (remaining <= 0) {
        return {
          ...state,
          status: "completed",
          timeRemaining: 0,
        };
      }

      return {
        ...state,
        timeRemaining: remaining,
      };
    }

    case "COMPLETE": {
      const nextType = getNextSessionType(
        state.sessionType,
        state.currentSession,
        config,
      );
      const nextSession =
        state.sessionType === "focus"
          ? state.currentSession
          : state.currentSession + 1;
      const duration = getSessionDuration(nextType, config);

      return {
        ...createInitialState(config),
        status: config.autoStartBreaks
          ? "running"
          : config.autoStartPomodoros && nextType === "focus"
            ? "running"
            : "idle",
        sessionType: nextType,
        currentSession: nextSession,
        timeRemaining: duration,
        totalDuration: duration,
        startedAt:
          config.autoStartBreaks || (config.autoStartPomodoros && nextType === "focus")
            ? Date.now()
            : null,
      };
    }

    case "SET_DURATION": {
      const duration = action.duration;
      return {
        ...state,
        totalDuration: duration,
        timeRemaining:
          state.sessionType === action.sessionType
            ? duration
            : state.timeRemaining,
      };
    }

    default:
      return state;
  }
}

export function getProgress(state: TimerState): number {
  if (state.totalDuration === 0) return 0;
  return 1 - state.timeRemaining / state.totalDuration;
}
