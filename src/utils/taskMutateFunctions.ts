import { useSWRConfig } from "swr";
import { Task, TaskData } from "@/types/task"; // Adjust the import path as needed
import { SuccessResponse } from "@/types/apiRespons";

const API_URL = "/api/tasks";
const { mutate, cache } = useSWRConfig();

// Create a new task
export const createTask = async (taskData: TaskData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error("Failed to create task");

    const result = await response.json();

    if (!!response.ok) {
      const resultTyped = result as SuccessResponse<Task>;

      const taskDataCreated = resultTyped.data;

      Array.from(cache.keys()).forEach((key) => {
        if (key.startsWith(API_URL)) {
          mutate(
            API_URL,
            (tasks: Task[] = []) => [...tasks, taskDataCreated],
            false
          );
        }
      });

      return taskDataCreated;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Update a task by ID
export const updateTask = async (id: string, taskData: Partial<TaskData>) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error("Failed to update task");

    const result = await response.json();

    // Update task in SWR cache
    if (!!response.ok) {
      const resultTyped = result as SuccessResponse<Task>;

      const updatedTask = resultTyped.data;

      Array.from(cache.keys()).forEach((key) => {
        if (key.startsWith(API_URL)) {
          mutate(key, (tasks: Task[] = []) =>
            tasks.map((task) => (task.id === id ? updatedTask : task))
          );
        }
      });
      mutate(`${API_URL}/${id}`, updatedTask, true);

      return updatedTask;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Delete a task by ID
export const deleteTask = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) throw new Error("Failed to delete task");

    if (!!response.ok) {
      Array.from(cache.keys()).forEach((key) => {
        if (key.startsWith(API_URL)) {
          mutate(key, (tasks: Task[] = []) =>
            tasks.filter((task) => task.id !== id)
          );
        }
      });

      mutate(`${API_URL}/${id}`, null, true);

      return true;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};
