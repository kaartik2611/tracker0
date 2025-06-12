import { verifySession } from "./lib/session";

export default async function Page() {
  const { user } = await verifySession();
  if (!user) {
    return <div>not logged in</div>;
  }
  return <div>logged in as {user.name} 🔥</div>;
}
