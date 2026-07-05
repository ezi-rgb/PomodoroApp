"use client";

import { useEffect } from "react";

type Shortcut = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
  enabled?: boolean;
};

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const matchKey = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchCtrl = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const matchShift = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const matchAlt = shortcut.alt ? e.altKey : !e.altKey;
        const targetIsInput =
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement;

        if (matchKey && matchCtrl && matchShift && matchAlt) {
          if (targetIsInput && (e.key === "Enter" || e.key === "Escape")) {
            shortcut.handler();
            return;
          }
          if (!targetIsInput) {
            e.preventDefault();
            shortcut.handler();
            return;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
