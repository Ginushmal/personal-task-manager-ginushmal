import { TaskData } from "@/types/task";
import { useState, useEffect } from "react";

export const useTasksApi = ({
  lazy_fetch = false,
  dependencies = [],
}: {
  lazy_fetch?: boolean;
  dependencies?: any[];
}) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<any | null>(null);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  //   // Fetch all tasks
  //   const fetchTasks = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch("/api/tasks");
  //       if (!response.ok) throw new Error("Failed to fetch tasks");
  //       const result = await response.json();
  //       setTasks(result.data);
  //     } catch (err) {
  //       setError((err as Error).message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // Fetch all tasks with pagination
  const fetchTasks = async (page: number = 1, perPage: number = 10) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/tasks?page=${page}&perPage=${perPage}`
      );
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const result = await response.json();
      setTasks(result.data);
      return result; // Return result to use total pages if needed
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single task by ID
  const fetchTaskById = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${id}`);
      if (!response.ok) throw new Error("Task not found");
      const result = await response.json();
      setTask(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (taskData: { taskData: TaskData }) => {
    try {
      setLoading(true);
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to create task");
      const result = await response.json();
      setTasks((prev) => [...prev, result.data]);
      return result;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Update a task by ID
  const updateTask = async (id: string, taskData: Partial<TaskData>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const result = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? result.data : task))
      );
      return result;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a task by ID
  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch tasks if not lazy
  useEffect(() => {
    if (!lazy_fetch) {
      fetchTasks(page, perPage).then((res) => {
        if (res) setTotalPages(res.meta.totalPages); // Store total pages from response
      });
    }
  }, [page, perPage, ...dependencies]);

  return {
    tasks,
    task,
    loading,
    error,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    setTasks,
  };
};
