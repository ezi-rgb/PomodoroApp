import { TaskList } from "@/features/tasks/components/task-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Manage your tasks and track pomodoro sessions.",
};

export default function TasksPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Manage your tasks and track completed pomodoros
        </p>
      </div>
      <TaskList />
    </div>
  );
}
