import { ScopedMutator, Cache, useSWRConfig } from "swr";
import { Task, TaskData } from "@/types/task"; // Adjust the import path as needed
import { SuccessPageResponse, SuccessResponse } from "@/types/apiRespons";

const API_URL = "/api/tasks";

// Create a new task
export const createTask = async (
  taskData: TaskData,
  mutate: ScopedMutator,
  cache: Cache<any>
) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error("Failed to create task");

    const resultTyped = (await response.json()) as SuccessResponse<Task>;
    const taskDataCreated = resultTyped.data;

    // Update paginated task lists
    Array.from(cache.keys()).forEach((key) => {
      if (key.startsWith(`${API_URL}?page=`)) {
        const cachedData = cache.get(key);
        const cachedDataResponse =
          cachedData?.data as SuccessPageResponse<Task>;

        if (!cachedDataResponse) return;

        const updatedCachedDataResponse = {
          ...cachedDataResponse,
          data: [taskDataCreated, ...cachedDataResponse.data], // Add new task at the top
        };

        mutate(key, updatedCachedDataResponse, false);
      }
    });

    // Return created task
    return taskDataCreated;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Update a task by ID
export const updateTask = async (
  id: string,
  taskData: Partial<TaskData>,
  mutate: ScopedMutator,
  cache: Cache<any>
) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    // console.log("Response", response);

    if (!response.ok) throw new Error("Failed to update task");

    const result = await response.json();

    // Update task in SWR cache
    if (!!response.ok) {
      const resultTyped = result as SuccessResponse<Task>;

      const updatedTask = resultTyped.data;

      Array.from(cache.keys()).forEach((key) => {
        if (key.startsWith(`${API_URL}?page=`)) {
          const cachedData = cache.get(key);
          const cachedDataResponse =
            cachedData?.data as SuccessPageResponse<Task>;

          console.log(`Key: ${key}`);
          console.log(`Cached Data:`, cachedData);
          console.log(`Cached Data Response:`, cachedDataResponse);

          if (!cachedDataResponse) return;

          const cachedDataTaskList = cachedDataResponse.data;

          const updatedcCachedDataTaskList = cachedDataTaskList.map((task) =>
            task.id === id ? updatedTask : task
          );

          const updatedCachedDataResponse = {
            ...cachedDataResponse,
            data: updatedcCachedDataTaskList,
          };

          console.log(`Updated Response Data:`, updatedCachedDataResponse);

          mutate(key, updatedCachedDataResponse, false);
        }
      });

      mutate(`${API_URL}/${id}`, updatedTask, false);

      return updatedTask;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Delete a task by ID
export const deleteTask = async (
  id: string,
  mutate: ScopedMutator,
  cache: Cache<any>
) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) throw new Error("Failed to delete task");

    // Update paginated task lists
    Array.from(cache.keys()).forEach((key) => {
      if (key.startsWith(`${API_URL}?page=`)) {
        const cachedData = cache.get(key);
        const cachedDataResponse =
          cachedData?.data as SuccessPageResponse<Task>;

        if (!cachedDataResponse) return;

        const updatedCachedDataResponse = {
          ...cachedDataResponse,
          data: cachedDataResponse.data.filter((task) => task.id !== id), // Remove deleted task
        };

        mutate(key, updatedCachedDataResponse, false);
      }
    });

    // Remove the individual task cache
    mutate(`${API_URL}/${id}`, null, false);

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
