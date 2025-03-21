import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { SuccessPageResponse, ErrorResponse } from "@/types/apiRespons";
import { Task, TaskSortField } from "@/types/task";

type TaskParams = {
  page?: number;
  perPage?: number;
  sortBy?: TaskSortField;
  sortOrder?: "asc" | "desc";
};

function useTasks({
  page = 1,
  perPage = 10,
  sortBy = "created_at",
  sortOrder = "desc",
}: TaskParams): {
  tasks: Task[] | null;
  meta: SuccessPageResponse<any>["meta"] | null;
  isLoading: boolean;
  isError: boolean;
} {
  const query = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    sortBy,
    sortOrder,
  }).toString();

  const apiUrl = `/api/tasks?${query}`.replace(/([^:]\/)\/+/g, "$1"); // Removes duplicate slashes

  console.log("Full URL", apiUrl);

  const { data, error, isLoading } = useSWR<
    SuccessPageResponse<Task> | ErrorResponse
  >(apiUrl, fetcher);

  console.log("Data fetched RN", data);
  console.log("Error:", error);

  if (!!error || (!!data && "error" in data))
    return { tasks: null, meta: null, isLoading, isError: true };

  return {
    tasks: data?.data ?? null,
    meta: data?.meta ?? null,
    isLoading,
    isError: !!error,
  };
}

export default useTasks;
