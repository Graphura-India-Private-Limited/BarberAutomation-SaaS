import React, { useState, useEffect } from "react";
import { useAuth, useQueue } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  Trash2,
  PlayCircle,
  Clock3,
  CheckCircle2,
  X,
} from "lucide-react";

const SERVICES = [
  "Classic Haircut",
  "Beard Trim & Shape",
  "Hair Spa",
  "Premium Grooming",
  "Shave",
  "Hair Colour",
];

export default function QueuePage() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const queueContext = useQueue() || {};

  const queue = Array.isArray(queueContext.queue)
    ? queueContext.queue
    : [];
  // console.log("QUEUE CONTEXT =", queueContext);
  // console.log("QUEUE DATA =", queue);

  // const setQueue =
  //   queueContext.setQueue ||
  //   (() => console.log("setQueue missing"));

  const addToQueue = queueContext.addToQueue;
  const removeFromQueue = queueContext.removeFromQueue;
  const updateStatus = queueContext.updateStatus;

  const [showAdd, setShowAdd] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [salonOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = currentUser || {};

  const isOwner = user?.role === "owner";

 const currentBarberName =
  user?.name || user?.username || user?.email || "";

  const profile = {
    name: user?.name || "Barber",
    initials: "SK",
    salonName: "The Royal Cuts",
  };

const visibleQueue = isOwner
  ? queue
  : queue.filter(
      (q) =>
        !q.barber ||
        q.barber?.trim().toLowerCase() ===
          currentBarberName?.trim().toLowerCase()
    );

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(t);
  }, []);

  const [newCustomer, setNewCustomer] = useState({
    customer: "",
    service: "",
  });

  /* ───────── ADD CUSTOMER ───────── */
  const handleAddCustomer = () => {
    if (
      !newCustomer.customer.trim() ||
      !newCustomer.service.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    const newEntry = {
      id: Date.now(),
      customer: newCustomer.customer,
      service: newCustomer.service,
      barber: currentBarberName,
      status: "Waiting",
      addedAt: new Date().toLocaleTimeString(),
    };

    // IMPORTANT FIX
    // setQueue((prevQueue = []) => [
    //   ...prevQueue,
    //   newEntry,
    // ]);

    addToQueue(newEntry);

    setNewCustomer({
      customer: "",
      service: "",
    });

    setShowAdd(false);
  };

  /* ───────── DELETE ───────── */
  const handleDeleteCustomer = (id) => {
    // setQueue((prevQueue) =>
    //   prevQueue.filter((item) => item.id !== id)
    // );
    removeFromQueue(id);
  };

  /* ───────── COMPLETE ───────── */
  const handleComplete = (id) => {
    // setQueue((prevQueue) =>
    //   prevQueue.map((item) =>
    //     item.id === id
    //       ? { ...item, status: "Completed" }
    //       : item
    //   )
    // );
    updateStatus(id, "done");
  };

  /* ───────── START ───────── */
  const handleStartService = (customer) => {
    navigate("/barber/live-console", {
      state: { customer },
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3E3D] font-sans antialiased">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 bg-[#1A1A1A] border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-zinc-400"
            onClick={() => setSideOpen(!sideOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="text-left">
            <h1 className="text-white font-bold text-xl font-serif">
              Queue
            </h1>

            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              {profile.salonName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />

            <span className="text-[9px] font-bold text-[#10B981] uppercase">
              {salonOpen ? "Salon Open" : "Closed"}
            </span>
          </div>

          <button className="p-2 text-zinc-400 bg-white/5 rounded-lg border border-white/10">
            <Bell className="w-4 h-4" />
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F5C842] to-[#E8A020] flex items-center justify-center text-xs font-bold text-black">
            {profile.initials}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* TITLE */}
        <div className="w-full mb-10 border-b border-[#E6D5C3]/30 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-1">
            {/* HEADER */}
        <div className="mb-10 border-b border-[#EADDCA]/60 pb-6">
          <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">My <span className="text-[#C5A059]">Queue</span></h1>
        </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8B5A2B] animate-pulse"></span>

              <p className="text-[11px] font-bold uppercase tracking-widest text-[#8B5A2B]">
                {isOwner
                  ? "All Studio Barbers' Pipelines"
                  : `Live Session — ${currentBarberName}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-8 py-4 bg-[#4A3E3D] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2d2726] shadow-lg transition-all"
          >
            {showAdd
              ? "✕ Close Panel"
              : "+ Add Customer"}
          </button>
        </div>

        {/* ADD PANEL */}
        {showAdd && (
          <div className="mb-10 bg-white p-6 rounded-3xl border border-[#E6D5C3] shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#4A3E3D] uppercase text-sm">
                Add New Customer
              </h3>

              <button
                onClick={() => setShowAdd(false)}
                className="text-stone-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                placeholder="Customer Name"
                className="p-3 rounded-xl border border-[#E6D5C3] bg-[#FDFBF7] outline-none focus:border-[#8B5A2B]"
                value={newCustomer.customer}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    customer: e.target.value,
                  })
                }
              />

              <select
                className="p-3 rounded-xl border border-[#E6D5C3] bg-[#FDFBF7] outline-none focus:border-[#8B5A2B]"
                value={newCustomer.service}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    service: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Service
                </option>

                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddCustomer}
                className="bg-[#4A3E3D] hover:bg-[#2d2726] transition-all text-white rounded-xl font-bold uppercase text-xs tracking-widest"
              >
                Add to Queue
              </button>
            </div>
          </div>
        )}

        {/* QUEUE */}
        <div className="space-y-4">
          {visibleQueue.length > 0 ? (
            visibleQueue.map((q, index) => (
              <div
                key={q.id}
                className="bg-white p-5 rounded-2xl border border-[#E6D5C3] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  {/* LEFT */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FAF6F0] border border-[#E6D5C3] flex items-center justify-center font-black text-[#8B5A2B]">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-[#4A3E3D]">
                        {q.customer}
                      </h3>

                      <p className="text-sm text-stone-500">
                        {q.service}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-3">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase">
                          <User size={12} />
                          {q.barber}
                        </span>

                        <span className="flex items-center gap-1 text-[11px] font-bold text-stone-500 uppercase">
                          <Clock3 size={12} />
                          {q.addedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${q.status === "done" ?  "Completed" : q.status}
                        ? "bg-green-100 text-green-600"
                        : "bg-[#FAF6F0] text-[#8B5A2B]"
                        }`}
                    >
                      {q.status || "Waiting"}
                    </span>

                    <button
                      onClick={() =>
                        handleStartService(q.customer)
                      }
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#4A3E3D] hover:bg-[#2d2726] text-white font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                      <PlayCircle size={15} />
                      Start
                    </button>

                    <button
                      onClick={() =>
                        handleComplete(q.id)
                      }
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                      <CheckCircle2 size={15} />
                      Done
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteCustomer(q.id)
                      }
                      className="p-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-stone-400 border border-dashed border-[#E6D5C3] rounded-3xl bg-white">
              <div className="flex justify-center mb-4">
                <User className="w-10 h-10 opacity-40" />
              </div>

              <h3 className="text-xl font-bold mb-2">
                Queue is Empty
              </h3>

              <p className="text-sm">
                Add customers to start managing salon flow.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}