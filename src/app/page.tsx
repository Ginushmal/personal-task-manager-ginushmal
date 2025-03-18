"use client";
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import TaskItem from "@/components/TaskItem";
import { useUserStore } from "@/store/userStore";
import { useTasksApi } from "@/hooks/useTaskApi";

export default function TaskList() {
  const { tasks, loading, error, fetchTasks } = useTasksApi({});
  const user = useUserStore((state) => state.user);

  // Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tasks when page or perPage changes
  useEffect(() => {
    fetchTasks(page, perPage).then((res) => {
      if (res) setTotalPages(res.meta.totalPages);
    });
  }, [page, perPage]);

  if (loading)
    return <p className="text-center text-gray-500 mt-4">Loading...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <h2 className="text-xl mb-4">
        Hello {user?.first_name} {user?.last_name}
      </h2>

      {/* "Per Page" Selector */}
      <div className="flex items-center mb-4 space-x-2">
        <label className="text-gray-700">Tasks per page:</label>
        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1); // Reset to first page when perPage changes
          }}
          className="border rounded px-2 py-1"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 border rounded ${
            page === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={page >= totalPages}
          className={`px-4 py-2 border rounded ${
            page >= totalPages
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
