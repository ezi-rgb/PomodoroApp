"use client";

import { useTimer } from "@/hooks/use-timer";
import { useSettingsStore } from "@/stores/settings-store";
import { useNotifications } from "@/hooks/use-notifications";
import { soundService } from "@/services/sound-service";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function TimerControls() {
  const { state, start, pause, resume, reset, skip } = useTimer();
  const { settings } = useSettingsStore();
  const { notify, vibrate } = useNotifications();

  const isIdle = state.status === "idle";
  const isRunning = state.status === "running";
  const isPaused = state.status === "paused";
  const isCompleted = state.status === "completed";
  const isActive = isRunning || isPaused;

  const handleStart = () => {
    if (settings.soundEnabled) soundService.playStart();
    start();
  };

  const handlePause = () => {
    if (settings.soundEnabled) soundService.playStop();
    pause();
  };

  const handleResume = () => {
    if (settings.soundEnabled) soundService.playStart();
    resume();
  };

  const handleReset = () => {
    reset();
  };

  const handleSkip = () => {
    notify("Session skipped", { body: "You skipped the current session." });
    if (settings.vibrationEnabled) vibrate([100, 50, 100]);
    if (settings.soundEnabled) soundService.play(settings.soundType);
    skip();
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {isIdle || isCompleted ? (
        <Button
          size="xl"
          variant="accent"
          onClick={handleStart}
          className="min-w-[180px] gap-2"
          aria-label="Start timer"
        >
          <Play className="h-5 w-5 fill-current" />
          Start
        </Button>
      ) : (
        <>
          {isRunning ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="xl"
                  variant="secondary"
                  onClick={handlePause}
                  className="min-w-[180px] gap-2"
                  aria-label="Pause timer"
                >
                  <Pause className="h-5 w-5" />
                  Pause
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pause (Space)</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="xl"
                  variant="accent"
                  onClick={handleResume}
                  className="min-w-[180px] gap-2"
                  aria-label="Resume timer"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Resume
                </Button>
              </TooltipTrigger>
              <TooltipContent>Resume (Space)</TooltipContent>
            </Tooltip>
          )}

          {isActive && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSkip}
                  aria-label="Skip to next session"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Skip session</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                aria-label="Reset timer"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
}
