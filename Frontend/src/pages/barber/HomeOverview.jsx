import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useQueue, salon, financeData } from "../../contexts/AppContext";
import { ArrowLeft, Sparkles, Layers, Users, Clock, ShieldCheck } from "lucide-react";

export default function HomeOverview() {
  const { currentUser, canViewFinance } = useAuth();
  const { queue, servedCount } = useQueue();
  const navigate = useNavigate();

  const SERVICE_MAP = {
    haircut: 'Haircut',
    shave: 'Shave',
    beard: 'Beard Trim',
    combo: 'Haircut + Shave',
    color: 'Hair Color',
    kids: "Kids' Cut"
  };

  const activeCount = queue.filter(q => q.status !== "done").length;
  const myQueue = currentUser?.role === "barber"
    ? queue.filter(q => {
        if (q.status === "done" || q.status === "Completed") return false;
        const qBarber = (q.barber || "").toLowerCase();
        const curBarber = (currentUser.name || "").toLowerCase();
        const firstWordCur = curBarber.split(" ")[0].replace(/[^a-zA-Z]/g, "");
        const firstWordQ = qBarber.split(" ")[0].replace(/[^a-zA-Z]/g, "");
        return firstWordCur === firstWordQ || curBarber.includes(qBarber) || qBarber.includes(curBarber);
      })
    : queue;

  const stats = [
    { label: "Your Queue", value: myQueue.length, color: "bg-white", icon: Clock },
    { label: "Active Customers", value: activeCount, color: "bg-white", icon: Users },
    { label: "Completed Today", value: servedCount, color: "bg-white", icon: ShieldCheck },
    ...(canViewFinance()
      ? [{ label: "Today's Revenue", value: `₹${financeData.todayRevenue.toLocaleString()}`, color: "bg-white", icon: Sparkles }]
      : []),
  ];

  return (
    <div className="p-6 md:p-10 font-sans text-stone-800 min-h-screen text-left" style={{ backgroundColor: "#FAF6F0" }}>
      <div className="max-w-6xl mx-auto w-full">
        
        {/* ── 🌟 ENHANCED: PREMIUM SERIF THEMED BACK HEADER STREAM ── */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5 bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-2 rounded-xl text-[#3E362E] font-medium text-xs tracking-wide transition-all duration-300 shadow-xs hover:bg-[#3E362E] hover:text-white hover:border-[#3E362E] cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-white transition-transform duration-300 transform group-hover:-translate-x-0.5" />
            <span className="font-sans font-bold tracking-wider uppercase text-[10px]">Back</span>
          </button>

          <div className="flex items-center gap-1.5 opacity-60">
            <Layers className="w-3 h-3 text-[#C5A059]" />
            <span className="text-[9px] font-black text-[#3E362E] uppercase tracking-[0.2em]">Console Terminal</span>
          </div>
        </div>

        {/* Welcome Card Box */}
        <div className="mb-8 border-b border-stone-200/60 pb-6">
          <h2 className="text-4xl font-bold font-serif text-stone-900 tracking-tight">
            Welcome, <span className="text-[#C5A059] italic font-normal">{currentUser?.name || "Stylist"}</span>
          </h2>
          <p className="text-stone-400 text-xs font-black uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {salon.name} · {salon.address}
          </p>
        </div>

        {/* Metric parameters grid tracking counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-2xl p-5 ${s.color} border border-stone-200/80 shadow-2xs hover:border-[#C5A059] transition-all duration-300 group`}>
              <div className="flex items-start justify-between w-full">
                <div className="text-3xl font-black font-serif text-stone-900 tracking-tight">{s.value}</div>
                <div className="w-7 h-7 rounded-lg bg-[#FAF6F0] flex items-center justify-center text-stone-400 group-hover:text-[#C5A059] transition-colors border border-stone-100">
                  <s.icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Live active scheduling pipeline rows wrapper */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-4 border-b pb-2 border-stone-100 flex items-center gap-2">
                <span className="w-1 h-3 bg-[#C5A059] rounded-full" />
                Your Next Customers
              </h3>
              {myQueue.length === 0 ? (
                <p className="text-stone-400 text-xs font-black uppercase tracking-widest py-6">No customers in queue.</p>
              ) : (
                <div className="space-y-3">
                  {myQueue.slice(0, 4).map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-stone-50/40 rounded-xl px-4 py-3 border border-stone-200/60 transition-all hover:bg-white hover:border-[#C5A059]/40 shadow-3xs">
                      <div>
                        <p className="font-extrabold text-stone-900 text-sm tracking-tight">{item.customer || item.name}</p>
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mt-0.5">
                          {(SERVICE_MAP[item.service] || item.service)} · {item.time || (item.slot || new Date(item.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                        </p>
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
              className="mt-6 text-xs font-black uppercase tracking-widest text-[#A37B58] hover:text-[#8F6947] transition-colors text-left border-none bg-transparent cursor-pointer outline-none"
            >
              View full queue ➔
            </button>
          </div>

          {/* Salon Information Details Box */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-2xs">
            <h3 className="text-sm font-black uppercase tracking-wider text-stone-900 mb-4 border-b pb-2 border-stone-100 flex items-center gap-2">
              <span className="w-1 h-3 bg-[#C5A059] rounded-full" />
              Salon Workspace Info
            </h3>
            <div className="space-y-3.5 text-sm text-stone-700 font-medium">
              <div className="flex border-b pb-2.5 border-stone-100"><span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Salon Node</span> <span className="font-bold text-stone-900">{salon.name}</span></div>
              <div className="flex border-b pb-2.5 border-stone-100"><span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Address</span> <span className="font-bold text-stone-900">{salon.address}</span></div>
              <div className="flex border-b pb-2.5 border-stone-100"><span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Support Phone</span> <span className="font-bold text-stone-900 font-mono text-xs">{salon.phone}</span></div>
              {currentUser?.role === "barber" && (
                <div className="flex"><span className="text-[10px] font-black uppercase tracking-wider text-stone-400 w-28 shrink-0">Salary Model</span> <span className="font-bold text-[#A37B58] uppercase tracking-wider text-xs">{currentUser.salaryModel}</span></div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
