import { verifySession } from "../lib/session";
import { redirect } from "next/navigation";
import {
  getDevelopers,
  getUserBugs,
  getUserTasks,
  getTimeLogs,
} from "../lib/fetch";
import FinalDashboard from "./components/FinalDashboard";

const DashboardPage = async () => {
  const user = await verifySession();

  if (!user.user) {
    return redirect("/login");
  }
  console.log("User:", user.user);
  const [tasks, bugs, developers, timeLogs] = await Promise.all([
    getUserTasks(user.user),
    getUserBugs(user.user),
    getDevelopers(),
    getTimeLogs(user.user),
  ]);

  return (
    <div className="max-w-7xl my-8 mx-auto">
      <FinalDashboard
        tasks={tasks}
        bugs={bugs}
        timeLogs={timeLogs}
        developers={developers}
        user={user.user}
      />
    </div>
  );
};

export default DashboardPage;
