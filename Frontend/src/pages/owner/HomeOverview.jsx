import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useQueue, salon, financeData } from "../../contexts/AppContext";
import Navbar from "../../components/layout/Navbar";

export default function HomeOverview() {
  const { currentUser, canViewFinance } = useAuth();
  const { queue } = useQueue();
  const navigate = useNavigate();

  const activeCount = queue.filter(q => q.status !== "done").length;
  const myQueue = currentUser?.role === "barber"
    ? queue.filter(q => q.barber === currentUser.name && q.status !== "done")
    : queue;

  const stats = [
    { label: "Your Queue", value: myQueue.length },
    { label: "Active Customers", value: activeCount },
    { label: "Completed Today", value: queue.filter(q => q.status === "done").length },
    ...(canViewFinance()
      ? [{ label: "Today's Revenue", value: `₹${financeData.todayRevenue.toLocaleString()}` }]
      : []),
  ];

  const getStatusStyle = (status) => {
    if (status === "in-progress") return "bg-green-50 border border-green-200 text-green-700 font-bold";
    if (status === "waiting") return "bg-amber-50 border border-amber-200/60 text-amber-700 font-bold";
    return "bg-zinc-100 border border-zinc-200 text-zinc-600 font-bold";
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans text-zinc-800" style={{ background: "var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        :root { 
          --gold: #D97706; 
          --gold2: #B45309; 
          --bg: #FAF6F0; 
          --bg2: #FFFFFF; 
          --bg3: #FDFBF7; 
          --border: #EADBCE; 
          --text: #1C1917; 
          --muted: #78716C; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
        .card { 
          background: var(--bg2); 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -4px rgba(28, 25, 23, 0.06), 0 4px 12px -2px rgba(28, 25, 23, 0.03);
          border-color: #D6C4AE;
        }
      `}</style>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-amber-700 font-sans normal-case font-bold tracking-[2px] text-xs sm:text-sm uppercase mb-1">
            Grooming Console
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif tracking-normal">Welcome, {currentUser?.name}</h2>
          <p className="text-zinc-500 text-sm mt-1">{salon.name} · {salon.address}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="card p-6">
              <h3 className="text-xs font-bold text-zinc-500 font-sans normal-case mb-1">{s.label}</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-1 font-serif tracking-normal text-zinc-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-zinc-900 font-serif mb-4">Your Next Customers</h3>
            {myQueue.length === 0 ? (
              <p className="text-zinc-500 text-sm">No customers in queue.</p>
            ) : (
              <div className="space-y-2">
                {myQueue.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-amber-50/50 rounded-xl px-4 py-3 border border-amber-200/50 transition-all duration-200 hover:bg-amber-50">
                    <div>
                      <p className="font-bold text-zinc-900 text-sm">{item.customer}</p>
                      <p className="text-xs text-zinc-500 font-sans mt-0.5">{item.service} · {item.time}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => navigate("/barber/queue")}
              className="mt-4 text-sm text-amber-700 font-bold hover:text-amber-800 hover:underline transition">
              View Full Queue
            </button>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-zinc-900 font-serif mb-4">Salon Info</h3>
            <div className="space-y-3.5 text-sm text-zinc-600">
              <p className="flex justify-between border-b border-zinc-100 pb-2"><span className="font-bold text-zinc-800">Salon:</span> <span>{salon.name}</span></p>
              <p className="flex justify-between border-b border-zinc-100 pb-2"><span className="font-bold text-zinc-800">Address:</span> <span>{salon.address}</span></p>
              <p className="flex justify-between border-b border-zinc-100 pb-2"><span className="font-bold text-zinc-800">Phone:</span> <span>{salon.phone}</span></p>
              <p className="flex justify-between border-b border-zinc-100 pb-2"><span className="font-bold text-zinc-800">Your Role:</span> <span className="capitalize">{currentUser?.role}</span></p>
              {currentUser?.role === "barber" && (
                <p className="flex justify-between border-b border-zinc-100 pb-2"><span className="font-bold text-zinc-800">Salary Model:</span> <span>{currentUser.salaryModel}</span></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}