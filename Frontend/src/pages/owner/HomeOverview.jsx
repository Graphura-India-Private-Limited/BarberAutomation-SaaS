
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
import { useAuth, useQueue, salon, financeData } from "../../contexts/AppContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer"; // ✅ Imported your premium custom footer component

export default function HomeOverview() {
  const { currentUser, canViewFinance } = useAuth();
  const { queue } = useQueue();
  const navigate = useNavigate();

  const activeCount = queue.filter(q => q.status !== "done").length;
  const myQueue = currentUser?.role === "barber"
    ? queue.filter(q => q.barber === currentUser.name && q.status !== "done")
    : queue;

  const stats = [
    { label: "Your Queue", value: myQueue.length, color: "bg-white" },
    { label: "Active Customers", value: activeCount, color: "bg-white" },
    { label: "Completed Today", value: queue.filter(q => q.status === "done").length, color: "bg-white" },
    ...(canViewFinance()
      ? [{ label: "Today's Revenue", value: `₹${financeData.todayRevenue.toLocaleString()}`, color: "bg-white" }]
      : []),
  ];

  return (
    /* ✅ Structural flex layout ensures footer handles spacing nicely */
    <div className="min-h-screen font-sans flex flex-col justify-between" style={{ backgroundColor: "#FAF6F0" }}>
      
      <div>
        <Navbar />
        
        {/* Main Content Dashboard Canvas Area */}
        <div className="max-w-6xl mx-auto w-full px-6 py-10 text-left">
          
          <div className="mb-8 border-b border-stone-200/60 pb-6">
            <h2 className="text-3xl font-black font-serif text-stone-900 tracking-tight">
              Welcome, <span className="text-[#C5A059]">{currentUser?.name}</span>
            </h2>
            <p className="text-stone-400 text-xs font-black uppercase tracking-widest mt-1.5">
              {salon.name} · {salon.address}
            </p>
          </div>

          {/* Metric parameters grid tracking counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <div key={i} className={`rounded-2xl p-5 ${s.color} border border-stone-200 shadow-2xs hover:border-[#C5A059] transition-all`}>
                <div className="text-2xl font-black font-serif text-stone-900 tracking-tight">{s.value}</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Live active scheduling pipeline rows wrapper */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-4 border-b pb-2 border-stone-50">
                  Your Next Customers
                </h3>
                {myQueue.length === 0 ? (
                  <p className="text-stone-400 text-xs font-black uppercase tracking-widest py-4">No customers in queue.</p>
                ) : (
                  <div className="space-y-3">
                    {myQueue.slice(0, 4).map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-stone-50/40 rounded-xl px-4 py-3 border border-stone-200/60 transition-all hover:bg-white hover:border-[#C5A059]/40 shadow-3xs">
                        <div>
                          <p className="font-extrabold text-stone-900 text-sm tracking-tight">{item.customer}</p>
                          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-0.5">{item.service} · {item.time}</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border shadow-3xs ${
                          item.status === "in-progress" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : item.status === "waiting" ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-stone-50 text-stone-600 border-stone-200"
                        }`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate("/barber/queue")}
                className="mt-4 text-xs font-black uppercase tracking-widest text-[#A37B58] hover:text-[#8F6947] transition-colors text-left"
              >
                View full queue ➔
              </button>
            </div>

            {/* Salon Information Details Box */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-2xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-4 border-b pb-2 border-stone-50">
                Salon Workspace Info
              </h3>
              <div className="space-y-3 text-sm text-stone-700 font-medium">
                <div className="flex border-b pb-2 border-stone-50"><span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Salon Node</span> <span className="font-bold text-stone-900">{salon.name}</span></div>
                <div className="flex border-b pb-2 border-stone-50"><span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Address</span> <span className="font-bold text-stone-900">{salon.address}</span></div>
                <div className="flex border-b pb-2 border-stone-50"><span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Support Phone</span> <span className="font-bold text-stone-900 font-mono text-xs">{salon.phone}</span></div>
                {currentUser?.role === "barber" && (
                  <div className="flex"><span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Salary Model</span> <span className="font-bold text-[#A37B58] uppercase tracking-wider text-xs">{currentUser.salaryModel}</span></div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── ✅ THE PIECE INJECTION: Renders your premium layout footer cleanly at the base ── */}
      <Footer />
      
    </div>
  );
}