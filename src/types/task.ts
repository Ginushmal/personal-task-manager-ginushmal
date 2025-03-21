export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum Status {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export type TaskSortField =
  | "created_at"
  | "title"
  | "priority"
  | "status"
  | "category"
  | "due_date";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  due_date?: Date;
  priority?: Priority;
  status?: Status;
  created_at: Date;
  updated_at: Date;
};

// to pass objects with user entered data
export type TaskData = {
  title: string;
  description?: string;
  category?: string;
  due_date?: string;
  priority?: string;
  status?: string;
};
