
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth, useQueue, salon, financeData } from "../../AppContext";
// import Navbar from "../../Components/Navbar";

// export default function HomeOverview() {
//   const { currentUser, canViewFinance } = useAuth();
//   const { queue } = useQueue();
//   const navigate = useNavigate();

//   const activeCount = queue.filter(q => q.status !== "done").length;
//   const myQueue = currentUser?.role === "barber"
//     ? queue.filter(q => q.barber === currentUser.name && q.status !== "done")
//     : queue;

//   const stats = [
//     { label: "Your Queue", value: myQueue.length, color: "bg-orange-100 text-orange-800" },
//     { label: "Active Customers", value: activeCount, color: "bg-amber-100 text-amber-800" },
//     { label: "Completed Today", value: queue.filter(q => q.status === "done").length, color: "bg-green-100 text-green-800" },
//     ...(canViewFinance()
//       ? [{ label: "Today's Revenue", value: `₹${financeData.todayRevenue.toLocaleString()}`, color: "bg-yellow-100 text-yellow-800" }]
//       : []),
//   ];

//   return (
//     <div className="min-h-screen bg-orange-50">
//       <Navbar />
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-orange-900">Welcome, {currentUser?.name}</h2>
//           <p className="text-gray-600 text-sm mt-1">{salon.name} · {salon.address}</p>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {stats.map((s, i) => (
//             <div key={i} className={`rounded-xl p-5 ${s.color} border border-orange-200`}>
//               <div className="text-2xl font-bold">{s.value}</div>
//               <div className="text-sm font-semibold mt-1 opacity-80">{s.label}</div>
//             </div>
//           ))}
//         </div>
//         <div className="grid md:grid-cols-2 gap-6">
//           <div className="bg-white rounded-2xl border border-orange-200 p-5 shadow-sm">
//             <h3 className="text-lg font-bold text-orange-900 mb-3">Your Next Customers</h3>
//             {myQueue.length === 0 ? (
//               <p className="text-gray-500 text-sm">No customers in queue.</p>
//             ) : (
//               <div className="space-y-2">
//                 {myQueue.slice(0, 4).map(item => (
//                   <div key={item.id} className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
//                     <div>
//                       <p className="font-semibold text-gray-800 text-sm">{item.customer}</p>
//                       <p className="text-xs text-gray-500">{item.service} · {item.time}</p>
//                     </div>
//                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
//                       item.status === "in-progress" ? "bg-green-200 text-green-800"
//                       : item.status === "waiting" ? "bg-orange-200 text-orange-800"
//                       : "bg-gray-200 text-gray-600"
//                     }`}>{item.status}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//             <button onClick={() => navigate("/barber/queue")}
//               className="mt-3 text-sm text-orange-700 font-semibold hover:underline">
//               View Full Queue
//             </button>
//           </div>
//           <div className="bg-white rounded-2xl border border-orange-200 p-5 shadow-sm">
//             <h3 className="text-lg font-bold text-orange-900 mb-3">Salon Info</h3>
//             <div className="space-y-2 text-sm text-gray-700">
//               <p><span className="font-semibold text-gray-800">Salon:</span> {salon.name}</p>
//               <p><span className="font-semibold text-gray-800">Address:</span> {salon.address}</p>
//               <p><span className="font-semibold text-gray-800">Phone:</span> {salon.phone}</p>
//               <p><span className="font-semibold text-gray-800">Your Role:</span> {currentUser?.role}</p>
//               {currentUser?.role === "barber" && (
//                 <p><span className="font-semibold text-gray-800">Salary Model:</span> {currentUser.salaryModel}</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useQueue, salon, financeData } from "../../AppContext";
import Navbar from "../../Components/Navbar";

export default function HomeOverview() {
  const { currentUser, canViewFinance } = useAuth();
  const { queue } = useQueue();
  const navigate = useNavigate();

  const activeCount = queue.filter(q => q.status !== "done").length;
  const myQueue = currentUser?.role === "barber"
    ? queue.filter(q => q.barber === currentUser.name && q.status !== "done")
    : queue;

  const stats = [
    { label: "Your Queue", value: myQueue.length, color: "bg-orange-100 text-orange-800" },
    { label: "Active Customers", value: activeCount, color: "bg-amber-100 text-amber-800" },
    { label: "Completed Today", value: queue.filter(q => q.status === "done").length, color: "bg-green-100 text-green-800" },
    ...(canViewFinance()
      ? [{ label: "Today's Revenue", value: `₹${financeData.todayRevenue.toLocaleString()}`, color: "bg-yellow-100 text-yellow-800" }]
      : []),
  ];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#FAF6F0" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-normal font-serif text-orange-900 normal-case">
            Welcome, {currentUser?.name}
          </h2>
          <p className="text-gray-600 text-sm mt-1 font-sans normal-case">
            {salon.name} · {salon.address}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-xl p-5 ${s.color} border border-orange-200`}>
              <div className="text-2xl font-bold font-serif tracking-normal">{s.value}</div>
              <div className="text-sm mt-1 opacity-80 font-sans normal-case">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-orange-200 p-5 shadow-sm">
            <h3 className="text-lg font-bold font-serif tracking-normal text-orange-900 normal-case mb-3">
              Your next customers
            </h3>
            {myQueue.length === 0 ? (
              <p className="text-gray-500 text-sm font-sans normal-case">No customers in queue.</p>
            ) : (
              <div className="space-y-2">
                {myQueue.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
                    <div>
                      <p className="font-semibold font-sans normal-case text-gray-800 text-sm">{item.customer}</p>
                      <p className="text-xs font-sans normal-case text-gray-500">{item.service} · {item.time}</p>
                    </div>
                    <span className={`text-xs font-sans normal-case px-2 py-0.5 rounded-full ${
                      item.status === "in-progress" ? "bg-green-200 text-green-800"
                      : item.status === "waiting" ? "bg-orange-200 text-orange-800"
                      : "bg-gray-200 text-gray-600"
                    }`}>{item.status}</span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate("/barber/queue")}
              className="mt-3 text-sm font-sans normal-case text-orange-700 font-semibold hover:underline"
            >
              View full queue
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-orange-200 p-5 shadow-sm">
            <h3 className="text-lg font-bold font-serif tracking-normal text-orange-900 normal-case mb-3">
              Salon info
            </h3>
            <div className="space-y-2 text-sm text-gray-700 font-sans normal-case">
              <p><span className="font-semibold text-gray-800">Salon:</span> {salon.name}</p>
              <p><span className="font-semibold text-gray-800">Address:</span> {salon.address}</p>
              <p><span className="font-semibold text-gray-800">Phone:</span> {salon.phone}</p>
              {/* <p><span className="font-semibold text-gray-800">Your role:</span> {currentUser?.role}</p> */}
              {currentUser?.role === "barber" && (
                <p><span className="font-semibold text-gray-800">Salary model:</span> {currentUser.salaryModel}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}