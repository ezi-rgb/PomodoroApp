import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AccentColor, AppSettings, Language, Theme, TimeFormat } from "@/types";
import { config } from "@/config";

const defaultSettings: AppSettings = {
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  soundVolume: 0.5,
  soundType: "bell",
  notificationsEnabled: true,
  vibrationEnabled: true,
  theme: "system",
  accentColor: "indigo",
  language: "en",
  timeFormat: "24h",
  animationsEnabled: true,
  reducedMotion: false,
  compactMode: false,
  showTasks: true,
  showStatistics: true,
};

type SettingsStore = {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSettings: (partial: Partial<AppSettings>) => {
        set((s) => ({ settings: { ...s.settings, ...partial } }));
      },

      resetSettings: () => {
        set({ settings: defaultSettings });
      },
    }),
    {
      name: config.storage.settings,
    },
  ),
);
