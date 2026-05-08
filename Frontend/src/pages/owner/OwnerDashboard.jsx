import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Users, Scissors,
  IndianRupee, Star, UserCog, BarChart2,
  Settings, LogOut, Menu, WifiOff,
  Bell, UserCircle, Clock, MapPin,
  AlertTriangle, PlusCircle, Pencil,
} from "lucide-react";

/* ─── Sidebar nav ────────────────────────────────────────────────── */
const NAV = [
  { label: "Dashboard", Icon: LayoutDashboard, active: true },
  { label: "Appointments", Icon: Calendar },
  { label: "Customers", Icon: Users },
  { label: "Services", Icon: Scissors },
  { label: "Earnings", Icon: IndianRupee },
  { label: "Reviews", Icon: Star },
  { label: "Staff", Icon: UserCog },
  { label: "Reports", Icon: BarChart2 },
  { label: "Settings", Icon: Settings },
];

/* ─── Status dot colors ──────────────────────────────────────────── */
const STATUS_DOT = {
  Available: "bg-green-500",
  Busy: "bg-orange-400",
  "On Break": "bg-yellow-400",
  Offline: "bg-gray-400",
};
const STATUS_BG = {
  Available: "bg-green-100 text-green-700",
  Busy: "bg-orange-100 text-orange-600",
  "On Break": "bg-yellow-100 text-yellow-700",
  Offline: "bg-gray-100 text-gray-500",
};

/* ─── Gallery images ─────────────────────────────────────────────── */
const GALLERY = [
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=200",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=200",
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=200",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=200",
];

/* ─── Service icons ──────────────────────────────────────────────── */
const SVC_ICON = ["✂️", "🧔", "💆"];

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [sideOpen, setSideOpen] = useState(false);
  const [liveSync, setLiveSync] = useState(false);
  const [toast, setToast] = useState(null);
  const [gallery, setGallery] = useState(GALLERY);

  const [salon] = useState({
    name: "The Royal Groom",
    timing: "10:00 AM – 09:00 PM",
    address: "Koregaon Park, Pune",
    status: "Approved",
  });

  const [services, setServices] = useState([
    { id: 1, name: "Premium Haircut", price: "499" },
    { id: 2, name: "Beard Styling", price: "299" },
    { id: 3, name: "Hair Spa", price: "699" },
  ]);

  const [barbers, setBarbers] = useState([
    {
      id: 1, name: "John", status: "Available", queue: 0, current: null,
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150"
    },
    {
      id: 2, name: "Mike", status: "Offline", queue: 3, current: null,
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150"
    },
    {
      id: 3, name: "Alex", status: "Available", queue: 1, current: "Rahul",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
    },
  ]);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const override = (id, newStatus) => {
    setBarbers(p => p.map(b => b.id === id ? { ...b, status: newStatus } : b));
    showToast(`Status updated to ${newStatus}`, "success");
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(f => URL.createObjectURL(f));
    setGallery(p => [...p, ...urls]);
  };

  useEffect(() => {
    return () => gallery.forEach(u => { if (u.startsWith("blob:")) URL.revokeObjectURL(u); });
  }, [gallery]);

  return (
    <div className="flex h-screen bg-[#faf8f5] font-sans overflow-hidden">

      {/* Mobile overlay */}
      {sideOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSideOpen(false)} />
      )}

      {/* ══════════════════════════════════════
          SIDEBAR — dark brown
      ══════════════════════════════════════ */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-56 xl:w-60 bg-[#1e1a14] text-white flex flex-col
        transition-transform duration-300
        ${sideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* Logo */}
        <div className="flex flex-col items-center py-7 px-4 border-b border-white/10">
          <div className="w-14 h-14 bg-orange-500/20 border border-orange-400/30 rounded-2xl flex items-center justify-center text-3xl mb-3">
            ✂️
          </div>
          <p className="text-sm font-black text-white uppercase tracking-wide">The Royal Groom</p>
          <p className="text-[10px] tracking-[3px] text-orange-400 font-bold uppercase mt-0.5">Salon Studio</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV.map(({ label, Icon, active }) => (
            <button key={label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left
                ${active
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-5 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN
      ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top bar ── */}
        <header className="bg-[#faf8f5] border-b border-orange-100 px-4 sm:px-6 xl:px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0">

          <div className="flex items-center gap-4 min-w-0">
            <button className="lg:hidden p-2 rounded-xl border border-orange-100 text-gray-600 hover:bg-orange-50 flex-shrink-0"
              onClick={() => setSideOpen(true)}>
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className={`flex items-center gap-1.5 text-xs font-bold uppercase
                  ${salon.status === "Approved" ? "text-green-600" : "text-yellow-600"}`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${salon.status === "Approved" ? "bg-green-500" : "bg-yellow-500"}`} />
                  Salon Status: {salon.status}
                </span>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => setLiveSync(p => !p)}
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase
                    ${liveSync ? "text-green-600" : "text-red-500"}`}>
                  <span className={`w-2 h-2 rounded-full ${liveSync ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  {liveSync ? "Sync On" : "Sync Off"}
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-black uppercase leading-tight">
                <span className="text-gray-800">Owner </span>
                <span className="text-orange-500">Console</span>
              </h1>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Toast pill */}
            {toast && (
              <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                ${toast.type === "success" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                ✓ {toast.msg}
              </div>
            )}
            {/* Auto status */}
            <div className="hidden md:flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-2 rounded-xl text-xs font-semibold text-orange-600">
              <Bell size={14} /> Auto status: On Break
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-orange-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-orange-50 transition-all">
              <BarChart2 size={16} className="text-orange-500" />
              <span className="hidden sm:block">View Analytics</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1e1a14] text-white rounded-xl text-sm font-bold hover:bg-black transition-all">
              <UserCircle size={16} />
              <span className="hidden sm:block">Edit Profile</span>
            </button>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 xl:p-7 space-y-5">

          {/* ════ LIVE MONITORING ════ */}
          <div className="bg-[#1e1a14] rounded-3xl p-5 sm:p-6 xl:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                Live Monitoring
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {barbers.map(b => {
                const sd = STATUS_DOT[b.status] || "bg-gray-400";
                const sb = STATUS_BG[b.status] || "bg-gray-100 text-gray-500";
                return (
                  <div key={b.id} className="bg-white/8 border border-white/10 rounded-2xl p-4 flex flex-col gap-4"
                    style={{ background: "rgba(255,255,255,0.06)" }}>

                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={b.img} alt={b.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/20 flex-shrink-0" />
                        <div>
                          <p className="font-black text-white text-base">{b.name}</p>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mt-1 ${sb}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sd}`} />
                            {b.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Queue</p>
                        <p className="text-3xl font-black text-white">{b.queue}</p>
                      </div>
                    </div>

                    {/* Serving now */}
                    {b.current && (
                      <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest">Serving Now</p>
                        <p className="text-sm font-bold text-orange-400 mt-0.5">{b.current}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => override(b.id, "On Break")}
                        className="py-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl transition-all">
                        Force Break
                      </button>
                      <button onClick={() => override(b.id, "Offline")}
                        className="py-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white text-[10px] font-black uppercase rounded-xl transition-all border border-red-500/30">
                        Offline
                      </button>
                      <button onClick={() => override(b.id, "Available")}
                        className="py-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white text-[10px] font-black uppercase rounded-xl transition-all border border-green-500/30">
                        Available
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sync warning */}
            {!liveSync && (
              <div className="flex items-center gap-2 mt-4 text-red-400 text-sm font-semibold">
                <WifiOff size={15} />
                Live sync disconnected
              </div>
            )}
          </div>

          {/* ════ BOTTOM GRID ════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ── LEFT: Salon Details + Gallery ── */}
            <div className="space-y-5">

              {/* Salon Details */}
              <div className="bg-white border border-orange-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-orange-500 text-lg">🏪</div>
                  <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">Salon Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Business Name</p>
                    <p className="text-xl font-black text-gray-800">{salon.name}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <AlertTriangle size={10} /> Operating Hours
                      </p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        <Clock size={13} className="text-orange-400" /> {salon.timing}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <MapPin size={10} /> Location
                      </p>
                      <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        <MapPin size={13} className="text-orange-400" /> {salon.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Gallery */}
              <div className="bg-white border border-orange-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-orange-500 text-lg">🖼️</div>
                  <div>
                    <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">Shop Gallery</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Showcase your workspace to build trust.</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mt-4">
                  {gallery.map((url, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-orange-50">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {/* Add photo */}
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 flex flex-col items-center justify-center gap-1 hover:border-orange-400 hover:bg-orange-100 transition-all">
                    <PlusCircle size={20} className="text-orange-400" />
                    <span className="text-[9px] font-bold text-orange-400">Add Photo</span>
                  </button>
                  <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
                </div>
              </div>
            </div>

            {/* ── RIGHT: Services & Pricing ── */}
            <div className="bg-white border border-orange-100 rounded-3xl p-6 flex flex-col">

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-orange-500 text-lg">✂️</div>
                  <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">Services &amp; Pricing</h2>
                </div>
                <button
                  onClick={() => navigate("/owner/manage-services")}
                  className="text-xs font-black text-orange-500 hover:underline uppercase tracking-widest">
                  Manage List
                </button>
              </div>

              <div className="space-y-3 flex-1">
                {services.map((s, i) => (
                  <div key={s.id}
                    className="flex items-center gap-4 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl hover:border-orange-300 transition-all group">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      {SVC_ICON[i] || "✂️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Standard Service</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-black text-gray-800">₹{s.price}</p>
                      <button className="flex items-center gap-1 text-[10px] font-bold text-orange-500 hover:underline mt-0.5">
                        <Pencil size={10} /> Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add new service CTA */}
              <button
                onClick={() => navigate("/owner/manage-services")}
                className="mt-5 w-full flex flex-col items-center gap-1.5 py-5 border-2 border-dashed border-orange-200 rounded-2xl hover:border-orange-400 hover:bg-orange-50 transition-all group">
                <div className="w-10 h-10 bg-orange-500 group-hover:bg-orange-600 rounded-full flex items-center justify-center transition-all">
                  <PlusCircle size={20} className="text-white" />
                </div>
                <p className="text-sm font-black text-gray-700">Add New Service</p>
                <p className="text-xs text-gray-400">Expand your menu with more premium services</p>
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

