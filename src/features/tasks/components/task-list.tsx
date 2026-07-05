"use client";

import { useState } from "react";
import { useTasksStore } from "@/stores/tasks-store";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { Task } from "@/types";
import { formatDate, relativeTime } from "@/utils/format";

const priorityColors: Record<number, string> = {
  0: "bg-secondary text-secondary-foreground",
  1: "bg-blue-500/10 text-blue-500",
  2: "bg-amber-500/10 text-amber-500",
  3: "bg-rose-500/10 text-rose-500",
};

const priorityLabels: Record<number, string> = {
  0: "None",
  1: "Low",
  2: "Medium",
  3: "High",
};

export function TaskList() {
  const [newTitle, setNewTitle] = useState("");

  const {
    tasks,
    filter,
    searchQuery,
    sortBy,
    sortOrder,
    addTask,
    updateTask,
    deleteTask,
    setFilter,
    setSearchQuery,
    setSortBy,
    toggleSortOrder,
  } = useTasksStore();

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) =>
      searchQuery
        ? t.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;
      switch (sortBy) {
        case "created":
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
        case "priority":
          return (b.priority - a.priority) * dir;
        case "dueDate": {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir;
        }
        case "title":
          return a.title.localeCompare(b.title) * dir;
        default:
          return 0;
      }
    });

  const handleAdd = () => {
    const title = newTitle.trim();
    if (!title) return;
    addTask({ title });
    setNewTitle("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search tasks"
          />
        </div>
        <Select value={filter} onValueChange={(v: "all" | "active" | "completed") => setFilter(v)}>
          <SelectTrigger className="w-[130px]" aria-label="Filter tasks">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          aria-label="New task title"
          className="flex-1"
        />
        <Button
          size="icon"
          onClick={handleAdd}
          disabled={!newTitle.trim()}
          aria-label="Add task"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSortOrder}
          className="gap-1 text-xs text-muted-foreground"
          aria-label={`Sort by ${sortBy}, ${sortOrder === "asc" ? "ascending" : "descending"}`}
        >
          <ArrowUpDown className="h-3 w-3" />
          {sortBy === "created"
            ? "Created"
            : sortBy === "priority"
              ? "Priority"
              : sortBy === "dueDate"
                ? "Due Date"
                : "Title"}
        </Button>
      </div>

      <div className="flex flex-col gap-2" role="list" aria-label="Task list">
        {filteredTasks.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "No tasks match your search"
                : filter === "completed"
                  ? "No completed tasks yet"
                  : "No tasks yet. Add one above!"}
            </p>
          </div>
        )}

        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} onDelete={deleteTask} onToggle={updateTask} />
        ))}
      </div>
    </div>
  );
}

function TaskItem({
  task,
  onDelete,
  onToggle,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onToggle: (id: string, data: { completed: boolean }) => void;
}) {
  return (
    <div
      role="listitem"
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-4 transition-all duration-200 hover:bg-accent/50",
        task.completed && "opacity-60",
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) =>
          onToggle(task.id, { completed: checked === true })
        }
        className="mt-1"
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              task.completed && "line-through text-muted-foreground",
            )}
          >
            {task.title}
          </span>
          {task.priority > 0 && (
            <Badge
              variant="outline"
              className={cn("text-[10px]", priorityColors[task.priority])}
            >
              {priorityLabels[task.priority]}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{task.completedPomodoros}/{task.estimatedPomodoros} pomodoros</span>
          {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
          <span className="hidden sm:inline">{relativeTime(task.createdAt)}</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(task.id)}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        aria-label={`Delete "${task.title}"`}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
}
