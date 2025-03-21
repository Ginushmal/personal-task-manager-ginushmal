import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { SuccessResponse, ErrorResponse } from "@/types/apiRespons";
import { Task } from "@/types/task";

function useTasks({ taskId }: { taskId: string }): {
  task: Task | null;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error, isLoading } = useSWR<
    SuccessResponse<Task> | ErrorResponse
  >(`/api/tasks/${taskId}`, fetcher);

  if (!!error || (!!data && "error" in data))
    return { task: null, isLoading, isError: true };

  return {
    task: data?.data ?? null,
    isLoading,
    isError: error,
  };
}

export default useTasks;
