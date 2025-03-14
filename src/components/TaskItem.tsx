import { Task } from "@/types/task";

export default function TaskItem({ task }: { task: Task }) {
  return (
    <div className="p-4 border  rounded-lg shadow-md bg-white m-2 grid-cols-6">
      <div className="col-span-4">
        <h2 className="text-lg font-bold text-gray-800">{task.title}</h2>
        <p className="text-gray-600 mt-2 truncate w-full">{task.description}</p>
      </div>
      <button className="col-span-1 bg-red-500 text-white rounded-lg p-2">
        Delete
      </button>
      <button className="col-span-1 bg-blue-500 text-white rounded-lg p-2">
        Edit
      </button>
    </div>
  );
}
