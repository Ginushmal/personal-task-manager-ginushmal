// import { useUserStore } from "@/store/userStore";
import TaskTable from "@/app/TaskTable";

export default function HomePage() {
  // const user = useUserStore((state) => state.user);

  return (
    <div className="p-10 px-36 max-w-full max-h-fit mx-auto">
      {/* <h2 className="text-2xl mb-4 font-bold">
        Hello {user?.first_name} {user?.last_name}
      </h2> */}
      <h3 className="text-base font-normal  mb-4">Here are your tasks :</h3>

      <TaskTable />
    </div>
  );
}
