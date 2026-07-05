"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings-store";

const accentColorHsl: Record<string, [number, number, number]> = {
  indigo: [239, 84, 67],
  rose: [348, 83, 61],
  amber: [38, 92, 50],
  emerald: [160, 84, 39],
  sky: [199, 89, 48],
  violet: [271, 76, 53],
  orange: [24, 95, 53],
  teal: [173, 80, 40],
};

export function useAccentColor() {
  const { settings } = useSettingsStore();

  useEffect(() => {
    const hsl = accentColorHsl[settings.accentColor] ?? accentColorHsl.indigo;
    const root = document.documentElement;
    root.style.setProperty("--accent-h", hsl[0].toString());
    root.style.setProperty("--accent-s", `${hsl[1]}%`);
    root.style.setProperty("--accent-l", `${hsl[2]}%`);
  }, [settings.accentColor]);
}
