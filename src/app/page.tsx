import TaskTable from "@/app/TaskTable";
// import { useUserStore } from "@/store/userStore";

export default function HomePage() {
  // const user = useUserStore((state) => state.user);

  return (
    <div className="p-10 md:px-12 lg:px-28 xl:px-52 max-w-full mx-auto">
      {/* Welcome Message */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Your Task Manager 📝
        </h1>
        {/* {user && ( */}
        <p className="text-lg text-gray-600 mt-2">
          {/* Welcome, {user.first_name} {user.last_name}! 👋 */}
          Stay organized and productive.
        </p>
        {/* )} */}
      </div>

      {/* Task Table Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <TaskTable />
      </div>
    </div>
  );
}
