import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Calendar, Users, Scissors,
  IndianRupee, Star, Settings, LogOut,
  Clock3, WifiOff, Menu, X, Wifi,
} from "lucide-react";
import BarberServiceList from "../../Components/BarberServiceList";

// Barber ID for this dashboard — in a real app this comes from auth context
const MY_BARBER_ID = 1;

/* ─── Sidebar nav ────────────────────────────────────────────────── */
const NAV = [
  { label: "Dashboard", Icon: LayoutDashboard, active: true },
  { label: "Appointments", Icon: Calendar },
  { label: "Customers", Icon: Users },
  { label: "Services", Icon: Scissors },
  { label: "Earnings", Icon: IndianRupee },
  { label: "Reviews", Icon: Star },
  { label: "Settings", Icon: Settings },
];

/* ─── Status config ──────────────────────────────────────────────── */
const STATUSES = [
  { key: "Available", dot: "bg-green-500", ring: "border-green-200", bg: "bg-green-50", text: "text-green-700" },
  { key: "Busy", dot: "bg-red-500", ring: "border-red-200", bg: "bg-red-50", text: "text-red-600" },
  { key: "On Break", dot: "bg-orange-400", ring: "border-orange-200", bg: "bg-orange-50", text: "text-orange-600" },
  { key: "Offline", dot: "bg-gray-400", ring: "border-gray-200", bg: "bg-gray-50", text: "text-gray-500" },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.key, s]));

/* ─── Queue status text color ────────────────────────────────────── */
const Q_COLOR = {
  Pending: "text-gray-500",
  "In-Progress": "text-blue-500 font-bold",
  Upcoming: "text-yellow-600",
  Completed: "text-green-600 font-bold",
};

/* ─── Initial queue data ─────────────────────────────────────────── */
const INIT_QUEUE = [
  {
    id: 1, num: "10", name: "Rahul Jagtap", service: "PREMIUM HAIRCUT", time: "10:30 AM", status: "Pending",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
  },
  {
    id: 2, num: "11", name: "Aryan", service: "KID'S STYLING", time: "11:15 AM", status: "In-Progress",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150"
  },
  {
    id: 3, num: "01", name: "Snehal", service: "HAIR SPA", time: "01:00 PM", status: "Upcoming",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
  },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function BarberDashboard() {
  const [sideOpen, setSideOpen] = useState(false);
  const [status, setStatus] = useState("On Break");
  const [liveSync, setLiveSync] = useState(false);
  const [breakSecs, setBreakSecs] = useState(0);
  const [queue, setQueue] = useState(INIT_QUEUE);
  const timerRef = useRef(null);

  /* break timer */
  useEffect(() => {
    if (status === "On Break") {
      timerRef.current = setInterval(() => setBreakSecs(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setBreakSecs(0);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  const breakMins = Math.floor(breakSecs / 60);
  const sc = STATUS_MAP[status];

  const act = (id, next) => {
    if (status === "Offline") return;
    setQueue(q => q.map(r => r.id === id ? { ...r, status: next } : r));
    if (next === "In-Progress" && status === "Available") setStatus("Busy");
    if (next === "Completed") {
      const stillActive = queue.filter(r => r.id !== id && r.status === "In-Progress");
      if (stillActive.length === 0 && status === "Busy") setStatus("Available");
    }
  };

  return (
    <div className="flex h-screen bg-[#fdf8f4] font-sans overflow-hidden">

      {/* ── Mobile overlay ── */}
      {sideOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSideOpen(false)} />
      )}

      {/* ══════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════ */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-56 xl:w-60 bg-white border-r border-[#f3dfcf]
        flex flex-col transition-transform duration-300
        ${sideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* Logo */}
        <div className="flex flex-col items-center py-7 px-4 border-b border-[#f3dfcf]">
          <div className="text-5xl text-orange-500 mb-2 leading-none">✂️</div>
          <h1 className="text-base font-black text-gray-800 uppercase tracking-wide">Royal Groom</h1>
          <p className="text-[10px] tracking-[3px] text-orange-500 font-bold uppercase mt-0.5">Barber Studio</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.map(({ label, Icon, active }) => (
            <button key={label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left
                ${active
                  ? "bg-orange-50 text-orange-500 border-l-4 border-orange-500"
                  : "text-gray-500 hover:bg-orange-50 hover:text-orange-500"}`}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-5 border-t border-[#f3dfcf]">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top bar ── */}
        <header className="bg-white border-b border-[#f3dfcf] px-4 sm:px-6 xl:px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0">

          {/* Left */}
          <div className="flex items-center gap-4 min-w-0">
            <button className="lg:hidden p-2 rounded-xl border border-[#f3dfcf] text-gray-500 hover:bg-orange-50 flex-shrink-0"
              onClick={() => setSideOpen(true)}>
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[3px] hidden sm:block">
                  Staff Terminal
                </span>
                {/* Sync toggle */}
                <button
                  onClick={() => setLiveSync(p => !p)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all
                    ${liveSync ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                  <span className={`w-2 h-2 rounded-full ${liveSync ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  {liveSync ? "Sync On" : "Sync Off"}
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black uppercase leading-tight mt-0.5">
                <span className="text-gray-800">Barber </span>
                <span className="text-orange-500">Dashboard</span>
              </h1>
            </div>
          </div>

          {/* Total bookings card */}
          <div className="flex-shrink-0 bg-white border border-[#f3dfcf] rounded-2xl px-5 py-3 flex items-center gap-4 shadow-sm">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                Total Bookings Today
              </p>
              <p className="text-3xl font-black text-orange-500 mt-0.5">{queue.length}</p>
            </div>
            <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
              <Calendar size={22} />
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 xl:p-7">
          <div className="flex flex-col xl:flex-row gap-5 h-full">

            {/* ════ LEFT PANEL ════ */}
            <div className="w-full xl:w-72 2xl:w-80 flex-shrink-0 space-y-5">
              {/* Profile card */}
              <div className="bg-white border border-[#f3dfcf] rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute right-4 top-4 text-7xl opacity-[0.04] select-none leading-none">✂</div>

                <p className="text-sm font-black text-orange-500 uppercase tracking-widest mb-5">
                  My Profile
                </p>

                <div className="flex items-center gap-4 mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
                    alt="Sameer Khan"
                    className="w-16 h-16 rounded-full object-cover border-[3px] border-orange-300 flex-shrink-0"
                  />
                  <div>
                    <p className="text-xl font-black text-gray-800">Sameer Khan</p>
                    <p className="text-sm text-gray-400 mt-0.5">Senior Stylist • The Royal Groom</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 border border-orange-100 text-orange-500 text-xs font-bold rounded-xl uppercase">
                    ✂ Haircut Expert
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 border border-orange-100 text-orange-500 text-xs font-bold rounded-xl uppercase">
                    🧔 Beard Pro
                  </span>
                </div>
              </div>

              {/* Availability & Status card */}
              <div className="bg-white border border-[#f3dfcf] rounded-3xl p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <Clock3 size={18} className="text-orange-500" />
                  <p className="text-sm font-black text-gray-700 uppercase tracking-widest">
                    Availability &amp; Status
                  </p>
                </div>

                {/* Current status pill */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 mb-5 ${sc.ring} ${sc.bg} ${sc.text}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
                  {status}
                </div>

                {/* 4-button status grid */}
                <div className="grid grid-cols-4 gap-2.5 mb-5">
                  {STATUSES.map(s => (
                    <button
                      key={s.key}
                      onClick={() => setStatus(s.key)}
                      className={`flex flex-col items-center gap-2 py-3 px-1 rounded-2xl border-2 transition-all
                        ${status === s.key
                          ? `${s.ring} ${s.bg} shadow-sm`
                          : "border-[#f3dfcf] bg-gray-50 hover:border-orange-200"}`}>
                      <span className={`w-3 h-3 rounded-full ${s.dot}`} />
                      <span className={`text-[10px] font-bold leading-tight text-center
                        ${status === s.key ? s.text : "text-gray-500"}`}>
                        {s.key === "On Break" ? <><span>On</span><br /><span>Break</span></> : s.key}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Break timer */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  Break ends in
                  <span className="flex items-center gap-1.5 text-orange-500 font-black text-base">
                    <Clock3 size={15} /> {breakMins} mins
                  </span>
                </div>
              </div>

              {/* ── My Services card ── */}
              <div className="bg-white border border-[#f3dfcf] rounded-3xl p-6">
                <div className="flex items-center gap-2.5 mb-4">
                  <Scissors size={18} className="text-orange-500" />
                  <p className="text-sm font-black text-gray-700 uppercase tracking-widest">
                    My Services
                  </p>
                </div>
                <BarberServiceList barberId={MY_BARBER_ID} compact />
              </div>
            </div>

            {/* ════ RIGHT PANEL — Queue ════ */}
            <div className="flex-1 min-w-0 bg-white border border-[#f3dfcf] rounded-3xl flex flex-col overflow-hidden">

              {/* Queue header */}
              <div className="flex items-center gap-4 px-6 xl:px-8 py-5 border-b border-[#f3dfcf] flex-shrink-0">
                <div className="w-8 h-1 bg-orange-500 rounded-full" />
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
                  Today's Queue
                </h2>
              </div>

              {/* Queue rows */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#fdf0e6]">
                {queue.map(r => (
                  <div key={r.id}
                    className={`flex flex-col sm:flex-row sm:items-center gap-4 px-5 xl:px-8 py-5 hover:bg-orange-50/30 transition-all
                      ${r.status === "Completed" ? "opacity-50" : ""}`}>

                    {/* Number box */}
                    <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center font-black text-orange-500 text-lg flex-shrink-0">
                      {r.num}
                    </div>

                    {/* Avatar */}
                    <img
                      src={r.img}
                      alt={r.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#f3dfcf] flex-shrink-0"
                    />

                    {/* Name + service */}
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-black text-gray-800">{r.name}</p>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">{r.service}</p>
                    </div>

                    {/* Time + status */}
                    <div className="flex-shrink-0 sm:w-32 xl:w-36">
                      <p className="text-sm font-bold text-orange-500 flex items-center gap-1.5">
                        <Clock3 size={14} /> {r.time}
                      </p>
                      <p className={`text-sm mt-1 ${Q_COLOR[r.status] || "text-gray-500"}`}>
                        {r.status}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2.5 flex-shrink-0">
                      <button
                        onClick={() => act(r.id, "In-Progress")}
                        disabled={status === "Offline" || r.status === "Completed" || r.status === "In-Progress"}
                        className="px-5 py-2.5 border-2 border-[#f3dfcf] text-gray-600 text-xs font-black uppercase rounded-xl hover:border-orange-300 hover:text-orange-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        START
                      </button>
                      <button
                        onClick={() => act(r.id, "Completed")}
                        disabled={status === "Offline" || r.status === "Completed"}
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                      >
                        FINISH
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alert banners */}
              <div className="px-5 xl:px-8 py-4 space-y-3 border-t border-[#fdf0e6] flex-shrink-0">
                {status === "On Break" && (
                  <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold px-5 py-3 rounded-2xl">
                    <span className="text-base">ℹ️</span>
                    On Break: cannot accept new customers.
                  </div>
                )}
                {status === "Offline" && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold px-5 py-3 rounded-2xl">
                    <span className="text-base">⛔</span>
                    Offline mode: booking-related actions are disabled.
                  </div>
                )}
                {!liveSync && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-500 text-sm font-semibold px-5 py-3 rounded-2xl">
                    <WifiOff size={16} />
                    Live sync disconnected
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
