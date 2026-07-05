export type Theme = "light" | "dark" | "system";

export type TimeFormat = "12h" | "24h";

export type AccentColor =
  | "indigo"
  | "rose"
  | "amber"
  | "emerald"
  | "sky"
  | "violet"
  | "orange"
  | "teal";

export type Language = "en" | "es" | "fr" | "de" | "ja" | "pt" | "zh";

export type AppSettings = {
  focusDuration: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  soundType: string;
  notificationsEnabled: boolean;
  vibrationEnabled: boolean;
  theme: Theme;
  accentColor: AccentColor;
  language: Language;
  timeFormat: TimeFormat;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  showTasks: boolean;
  showStatistics: boolean;
};
