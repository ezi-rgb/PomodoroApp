import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types";
import { config } from "@/config";

type TasksStore = {
  tasks: Task[];
  selectedTaskId: string | null;
  filter: "all" | "active" | "completed";
  searchQuery: string;
  sortBy: "created" | "priority" | "dueDate" | "title";
  sortOrder: "asc" | "desc";

  addTask: (input: CreateTaskInput) => void;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  setFilter: (filter: "all" | "active" | "completed") => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: "created" | "priority" | "dueDate" | "title") => void;
  toggleSortOrder: () => void;
  incrementCompletedPomodoros: (id: string) => void;
  clearCompleted: () => void;
};

let nextId = 1;
function generateId(): string {
  return `task_${Date.now()}_${nextId++}`;
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set) => ({
      tasks: [],
      selectedTaskId: null,
      filter: "all",
      searchQuery: "",
      sortBy: "created",
      sortOrder: "desc",

      addTask: (input: CreateTaskInput) => {
        const now = new Date().toISOString();
        const task: Task = {
          id: generateId(),
          title: input.title,
          description: input.description ?? null,
          estimatedPomodoros: input.estimatedPomodoros ?? 1,
          completedPomodoros: 0,
          priority: input.priority ?? 0,
          dueDate: input.dueDate ?? null,
          completed: false,
          labels: [],
          userId: "local",
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
      },

      updateTask: (id: string, input: UpdateTaskInput) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? { ...t, ...input, updatedAt: new Date().toISOString() }
              : t,
          ),
        }));
      },

      deleteTask: (id: string) => {
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id),
          selectedTaskId: s.selectedTaskId === id ? null : s.selectedTaskId,
        }));
      },

      selectTask: (id: string | null) => {
        set({ selectedTaskId: id });
      },

      setFilter: (filter) => {
        set({ filter });
      },

      setSearchQuery: (searchQuery) => {
        set({ searchQuery });
      },

      setSortBy: (sortBy) => {
        set({ sortBy });
      },

      toggleSortOrder: () => {
        set((s) => ({ sortOrder: s.sortOrder === "asc" ? "desc" : "asc" }));
      },

      incrementCompletedPomodoros: (id: string) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completedPomodoros: t.completedPomodoros + 1,
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        }));
      },

      clearCompleted: () => {
        set((s) => ({ tasks: s.tasks.filter((t) => !t.completed) }));
      },
    }),
    {
      name: config.storage.tasks,
    },
  ),
);
