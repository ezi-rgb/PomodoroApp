"use client";

import { useTimer } from "@/hooks/use-timer";
import { formatTime } from "@/utils/format";
import { cn } from "@/lib/cn";
import { useSettingsStore } from "@/stores/settings-store";

const sessionLabels: Record<string, string> = {
  focus: "Focus Session",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export function TimerDisplay() {
  const { state, progress } = useTimer();
  const { settings } = useSettingsStore();

  const isPaused = state.status === "paused";
  const isCompleted = state.status === "completed";

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {sessionLabels[state.sessionType] ?? "Focus Session"}
        </span>
        <span className="text-xs text-muted-foreground">
          Session {state.currentSession}
        </span>
      </div>

      <div className="relative">
        <svg
          className="h-64 w-64 -rotate-90"
          viewBox="0 0 256 256"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Timer progress: ${formatTime(state.timeRemaining)} remaining`}
        >
          <circle
            cx="128"
            cy="128"
            r="112"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="8"
            className="transition-colors duration-300"
          />
          <circle
            cx="128"
            cy="128"
            r="112"
            fill="none"
            stroke={`hsl(var(--accent-h), var(--accent-s), var(--accent-l))`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 112}
            strokeDashoffset={2 * Math.PI * 112 * (1 - progress)}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              "timer-digit text-7xl font-light tracking-tighter",
              isPaused && "animate-pulse text-muted-foreground",
              isCompleted && "text-green-500",
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(state.timeRemaining)}
          </span>
          {isPaused && (
            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Paused
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
