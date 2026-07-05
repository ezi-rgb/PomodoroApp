"use client";

import { useEffect, useRef } from "react";
import { useTimer } from "@/hooks/use-timer";
import { useTimerStore } from "@/stores/timer-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useStatisticsStore } from "@/stores/statistics-store";
import { useNotifications } from "@/hooks/use-notifications";
import { soundService } from "@/services/sound-service";
import { TimerDisplay } from "./timer-display";
import { TimerControls } from "./timer-controls";
import { Card, CardContent } from "@/components/ui/card";

export function PomodoroPanel() {
  const { state } = useTimer();
  const completeSession = useTimerStore((s) => s.completeSession);
  const { settings } = useSettingsStore();
  const { logSession } = useStatisticsStore();
  const { notify, vibrate } = useNotifications();
  const completedRef = useRef(false);

  useEffect(() => {
    if (state.status === "completed" && !completedRef.current) {
      completedRef.current = true;

      if (settings.soundEnabled) {
        soundService.play(settings.soundType);
      }

      if (settings.notificationsEnabled) {
        notify("Session Complete!", {
          body:
            state.sessionType === "focus"
              ? "Great focus! Time for a break."
              : "Break is over. Ready to focus again?",
        });
      }

      if (settings.vibrationEnabled) {
        vibrate([200, 100, 200]);
      }

      logSession(state.sessionType, state.totalDuration, true, null);

      const delay = state.sessionType === "focus" ? 1500 : 1000;
      const timeout = setTimeout(() => {
        completeSession();
        completedRef.current = false;
      }, delay);

      return () => {
        clearTimeout(timeout);
        completedRef.current = false;
      };
    }

    if (state.status !== "completed") {
      completedRef.current = false;
    }
  }, [state.status, state.sessionType, state.totalDuration, settings.soundEnabled, settings.soundType, settings.notificationsEnabled, settings.vibrationEnabled, notify, vibrate, logSession, completeSession]);

  return (
    <Card className="mx-auto max-w-md border-0 bg-transparent shadow-none">
      <CardContent className="flex flex-col items-center gap-10 p-0">
        <TimerDisplay />
        <TimerControls />
      </CardContent>
    </Card>
  );
}
