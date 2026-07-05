export const DEFAULT_FOCUS_DURATION = 25 * 60;
export const DEFAULT_SHORT_BREAK_DURATION = 5 * 60;
export const DEFAULT_LONG_BREAK_DURATION = 15 * 60;
export const DEFAULT_LONG_BREAK_INTERVAL = 4;

export const TICK_INTERVAL_MS = 250;

export const ACCENT_COLORS = [
  { name: "indigo", value: "#6366f1" },
  { name: "rose", value: "#f43f5e" },
  { name: "amber", value: "#f59e0b" },
  { name: "emerald", value: "#10b981" },
  { name: "sky", value: "#0ea5e9" },
  { name: "violet", value: "#8b5cf6" },
  { name: "orange", value: "#f97316" },
  { name: "teal", value: "#14b8a6" },
] as const;

export const SOUND_TYPES = [
  "bell",
  "chime",
  "digital",
  "gentle",
  "marimba",
  "none",
] as const;

export const PRIORITY_LABELS: Record<number, string> = {
  0: "None",
  1: "Low",
  2: "Medium",
  3: "High",
};
