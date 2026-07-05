"use client";

import { useEffect } from "react";
import { useTimerStore } from "@/stores/timer-store";
import { useSettingsStore } from "@/stores/settings-store";

export function useTimer() {
  const {
    state,
    config,
    progress,
    start,
    pause,
    resume,
    reset,
    skip,
    startTicking,
    stopTicking,
    updateConfig,
  } = useTimerStore();

  const { settings } = useSettingsStore();

  useEffect(() => {
    updateConfig({
      focusDuration: settings.focusDuration * 60,
      shortBreakDuration: settings.shortBreak * 60,
      longBreakDuration: settings.longBreak * 60,
      longBreakInterval: settings.longBreakInterval,
      autoStartBreaks: settings.autoStartBreaks,
      autoStartPomodoros: settings.autoStartPomodoros,
    });
  }, [
    settings.focusDuration,
    settings.shortBreakDuration,
    settings.longBreakDuration,
    settings.longBreakInterval,
    settings.autoStartBreaks,
    settings.autoStartPomodoros,
    updateConfig,
  ]);

  useEffect(() => {
    if (state.status === "running") {
      startTicking();
    } else {
      stopTicking();
    }

    return () => {
      stopTicking();
    };
  }, [state.status, startTicking, stopTicking]);

  return {
    state,
    config,
    progress,
    start,
    pause,
    resume,
    reset,
    skip,
  };
}
