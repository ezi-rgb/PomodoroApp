export type Priority = 0 | 1 | 2 | 3;

export type Task = {
  id: string;
  title: string;
  description: string | null;
  estimatedPomodoros: number;
  completedPomodoros: number;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  labels: Label[];
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Label = {
  id: string;
  name: string;
  color: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  estimatedPomodoros?: number;
  priority?: Priority;
  dueDate?: string;
  labels?: string[];
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  completed?: boolean;
  completedPomodoros?: number;
};
