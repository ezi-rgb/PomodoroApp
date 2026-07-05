"use client";

import { useKeyboardShortcuts } from "@/hooks/use-keyboard";
import { useTimer } from "@/hooks/use-timer";
import { useEffect } from "react";
import { PomodoroPanel } from "@/features/pomodoro/components/pomodoro-panel";

export default function HomePage() {
  const { state, start, pause, resume, reset, skip } = useTimer();

  useKeyboardShortcuts([
    {
      key: " ",
      handler: () => {
        if (state.status === "idle" || state.status === "completed") {
          start();
        } else if (state.status === "running") {
          pause();
        } else if (state.status === "paused") {
          resume();
        }
      },
    },
    {
      key: "s",
      handler: skip,
      enabled: state.status === "running" || state.status === "paused",
    },
    {
      key: "r",
      handler: reset,
    },
  ]);

  useEffect(() => {
    document.title =
      state.status === "running"
        ? `${Math.floor(state.timeRemaining / 60)}:${(state.timeRemaining % 60).toString().padStart(2, "0")} - Pomodoro`
        : "Pomodoro - Focus Timer";
  }, [state.status, state.timeRemaining]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-12 py-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pomodoro
        </h1>
        <p className="text-sm text-muted-foreground">
          Focus one session at a time
        </p>
      </div>
      <PomodoroPanel />
      <p className="text-xs text-muted-foreground">
        Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Space</kbd> to{" "}
        {state.status === "running" ? "pause" : state.status === "paused" ? "resume" : "start"}
        {"  "}·{"  "}
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">S</kbd> to skip{"  "}·{"  "}
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">R</kbd> to reset
      </p>
    </div>
  );
}
