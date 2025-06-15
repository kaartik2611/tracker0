import Link from "next/link";
import { verifySession } from "./lib/session";

export default async function Page() {
  const { user } = await verifySession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!user ? (
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Ship Better Code, <span className="text-indigo-600">Faster</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Tracker.app helps engineering teams manage bugs and tasks.
            </p>

            <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Try Demo Version
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h3 className="font-medium text-indigo-800 mb-2">
                    Manager Account
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      steverogers@x.com
                    </p>
                    <p>
                      <span className="font-medium">Password:</span> manager123
                    </p>
                  </div>
                  <p className="mt-3 text-xs text-purple-600">
                    Manage tasks, bugs, and team members
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">
                    Developer Account
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      brucewayne@x.com
                    </p>
                    <p>
                      <span className="font-medium">Password:</span> password123
                    </p>
                  </div>
                  <p className="mt-3 text-xs text-purple-600">
                    Task/bug management
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go to Login Page
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              You are logged in as a {user.role.toLowerCase()}.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
