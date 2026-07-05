import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000).optional(),
  estimatedPomodoros: z.number().int().min(1).max(99).optional().default(1),
  priority: z.number().int().min(0).max(3).optional().default(0),
  dueDate: z.string().datetime().optional().nullable(),
  labels: z.array(z.string()).max(10).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  estimatedPomodoros: z.number().int().min(1).max(99).optional(),
  completedPomodoros: z.number().int().min(0).optional(),
  priority: z.number().int().min(0).max(3).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  completed: z.boolean().optional(),
  labels: z.array(z.string()).max(10).optional(),
});

export const createSessionSchema = z.object({
  taskId: z.string().optional().nullable(),
  type: z.enum(["focus", "shortBreak", "longBreak"]),
  duration: z.number().int().min(1),
  completed: z.boolean(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional().nullable(),
});

export const updateSettingsSchema = z.object({
  focusDuration: z.number().int().min(1).max(180).optional(),
  shortBreak: z.number().int().min(1).max(30).optional(),
  longBreak: z.number().int().min(1).max(60).optional(),
  longBreakInterval: z.number().int().min(2).max(8).optional(),
  autoStartBreaks: z.boolean().optional(),
  autoStartPomodoros: z.boolean().optional(),
  soundEnabled: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
  vibrationEnabled: z.boolean().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  accentColor: z.string().optional(),
  language: z.string().optional(),
  timeFormat: z.enum(["12h", "24h"]).optional(),
  animationsEnabled: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
