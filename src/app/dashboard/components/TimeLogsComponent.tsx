// import { TimeLog } from "@/generated/prisma";
// import { format } from "date-fns";

// export const TimeLogsComponent = ({ timeLogs }: { timeLogs: TimeLog[] }) => {
//   if (!timeLogs.length) {
//     return (
//       <div className="text-gray-500 italic text-center mt-4">
//         No time logs available.
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Time Logs ({timeLogs.length})
//         </h2>
//         <span className="text-sm text-gray-500">
//           Total:{" "}
//           {(timeLogs.reduce((sum, log) => sum + log.minutes, 0) / 60).toFixed(
//             2
//           )}{" "}
//           hours
//         </span>
//       </div>
//       <ul className="divide-y divide-gray-200">
//         {timeLogs.map((log) => (
//           <li key={log.id} className="py-3 flex justify-between items-center">
//             <div>
//               <p className="text-sm text-gray-600">
//                 {format(new Date(log.createdAt), "MMM dd, yyyy")}
//               </p>
//               {log.comments && (
//                 <p className="text-xs text-gray-500">{log.comments}</p>
//               )}
//             </div>
//             <span className="text-sm font-medium text-blue-600">
//               {(log.minutes / 60).toFixed(2)} hours
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

import { TimeLog } from "@/generated/prisma";
import { format } from "date-fns";

export const TimeLogsComponent = ({ timeLogs }: { timeLogs: TimeLog[] }) => {
  const totalHours = timeLogs.reduce((sum, log) => sum + log.minutes, 0) / 60;

  // sort time logs by date descending
  timeLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!timeLogs.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="bg-gray-50 inline-flex p-3 rounded-full mb-3">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-gray-600 font-medium">No time logs recorded</h3>
        <p className="text-gray-400 text-sm mt-1">
          Track time to see activity here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Time Logs
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
              {timeLogs.length} entries
            </span>
            <span className="text-sm font-medium text-gray-700">
              Total:{" "}
              <span className="text-blue-600">{totalHours.toFixed(2)} hr</span>
            </span>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <ul className="divide-y divide-gray-200">
        {timeLogs.map((log) => (
          <li
            key={log.id}
            className="px-5 py-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {format(new Date(log.createdAt), "MMM dd, yyyy")}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(log.createdAt), "h:mm a")}
                  </span>
                </div>
                {log.comments && (
                  <p className="text-xs text-gray-600 truncate">
                    {log.comments}
                  </p>
                )}
              </div>
              <span className="text-sm font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                {(log.minutes / 60).toFixed(2)}h
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
