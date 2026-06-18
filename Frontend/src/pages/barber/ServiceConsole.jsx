import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  PlusCircle,
  ArrowLeft,
  User,
  X,
  Trash2,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react";

export default function ServiceConsole() {
  const navigate = useNavigate();

  const location = useLocation();
  const customerData = location.state;

  const [status, setStatus] = useState("busy");
  const [seconds, setSeconds] = useState(720);
  // const [currentCustomer] = useState("Vikram Singh");

  const [currentCustomer] = useState(
    customerData?.customer_name || "Rohit Sharma"
  );

  const [showServices, setShowServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceStatus, setServiceStatus] = useState("busy");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const getToken = () => localStorage.getItem("token");

  // const queueId = 1; // temporary
  const queueId = customerData?.id;

  const salonInfo = {
    salonName: "The Royal Cuts",
    initials: "SK",
  };

  const baseService = {
    name: "Premium Haircut",
    price: 499,
  };

  const extraServices = [
    { id: 1, name: "Beard Shape", price: 150 },
    { id: 2, name: "Head Massage (Oil)", price: 100 },
    { id: 3, name: "Face D-Tan", price: 350 },
    { id: 4, name: "Hair Color (Black)", price: 500 },
  ];

  /* ───────────────── TIMER ───────────────── */
  useEffect(() => {
    let interval = null;

    if (status === "busy") {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  /* ───────────────── HELPERS ───────────────── */
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const addService = (service) => {
    const alreadyAdded = selectedServices.find(
      (item) => item.id === service.id
    );

    if (alreadyAdded) return;

    setSelectedServices((prev) => [...prev, service]);
    setShowServices(false);
  };

  const removeService = (id) => {
    setSelectedServices((prev) =>
      prev.filter((service) => service.id !== id)
    );
  };

  const totalAmount =
    baseService.price +
    selectedServices.reduce((acc, item) => acc + item.price, 0);

  // const toast_ = (msg, type = "success") => {
  //   setToast({ msg, type });
  //   setTimeout(() => setToast(null), 3500);
  // };

  const toast_ = (msg, type = "success") => {
    setToast({ msg, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const handleAPIStatusUpdate = async (status, reason = "") => {
    try {
      await fetch(`${API}/queue/${queueId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status, reason }),
      });

      setServiceStatus(status);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAPINotify = async () => {
    try {
      await fetch(`${API}/queue/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          queue_id: queueId,
          message: `Hello ${currentCustomer}, your turn is coming up soon!`,
        }),
      });

      toast_(`Reminder sent to ${currentCustomer}!`);
    } catch {
      toast_(`Notification sent to ${currentCustomer}!`);
    }
  };

  const handleMarkDelayed = async () => {
    await handleAPIStatusUpdate(
      "delayed",
      "Late by 5+ mins"
    );

    setModal(null);

    toast_(
      `${currentCustomer} marked Delayed.`,
      "warn"
    );
  };

  const handleMarkNoShow = async () => {
    await handleAPIStatusUpdate(
      "noshow",
      "Did not arrive"
    );

    setModal(null);

    toast_(
      `${currentCustomer} marked No-Show.`,
      "error"
    );
  };

  const handleSendNotif = async () => {
    await handleAPINotify();
    setModal(null);
  };

  const handleCompleted = async () => {
    await handleAPIStatusUpdate(
      "completed"
    );

    toast_(
      `Service completed for ${currentCustomer}!`
    );
  };



  /* ───────────────── COMPLETE ───────────────── */
  const handleCompleteService = () => {
    const finalBill = {
      customer: currentCustomer,
      baseService,
      extras: selectedServices,
      total: totalAmount,
      timeSpent: formatTime(seconds),
    };

    console.log("FINAL BILL :", finalBill);

    alert(
      `Service Completed ✅\n\nCustomer: ${currentCustomer}\nTotal Bill: ₹${totalAmount}`
    );

    setStatus("available");

    setTimeout(() => {
      navigate("/barber/dashboard");
    }, 1000);
  };

  return (
    <div className="w-full text-[#3E362E] font-sans antialiased flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl text-left mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="stroke-[2.5px]" /> Return to Dashboard
          </button>
        </div>
        <div className="max-w-xl w-full bg-white border border-[#EADDCA] rounded-[24px] p-6 sm:p-8 shadow-sm space-y-8 relative">
          {/* CUSTOMER */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-black text-[#A37B58]">
                In Salon Chair
              </span>

              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-stone-400" />

                <h3 className="text-2xl font-bold text-stone-900 font-serif">
                  {currentCustomer}
                </h3>
              </div>
            </div>

            <button
              onClick={() =>
                setStatus((prev) =>
                  prev === "busy" ? "paused" : "busy"
                )
              }
              className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all ${status === "busy"
                ? "bg-[#FAF6F0] text-[#A37B58] border-[#EADDCA]"
                : "bg-red-50 text-red-500 border-red-200"
                }`}
            >
              {status}
            </button>
          </div>

          {/* TIMER */}
          <div className="flex justify-center py-2">
            <div className="relative w-48 h-48 flex items-center justify-center border-4 border-[#FAF6F0] rounded-full bg-gradient-to-br from-white to-stone-50">
              <div className="text-center">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Elapsed
                </p>

                <div className="text-4xl font-black text-stone-900 font-mono">
                  {formatTime(seconds)}
                </div>

                <p className="text-[9px] text-[#A37B58] font-bold mt-1">
                  ACTIVE SESSION
                </p>
              </div>
            </div>
          </div>

          {/* NO SHOW ACTIONS */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() =>
                setModal({
                  type: "delayed",
                })
              }
              className="flex items-center justify-center gap-2 p-3 border border-amber-200 bg-amber-50 rounded-xl text-xs font-black uppercase tracking-wider text-amber-900"
            >
              <Clock size={14} />
              Delay Log
            </button>

            <button
              type="button"
              onClick={() =>
                setModal({
                  type: "noshow",
                })
              }
              className="flex items-center justify-center gap-2 p-3 border border-red-200 bg-red-50 rounded-xl text-xs font-black uppercase tracking-wider text-red-700"
            >
              <AlertTriangle size={14} />
              No-Show
            </button>

            <button
              type="button"
              onClick={() =>
                setModal({
                  type: "notify",
                })
              }
              className="flex items-center justify-center gap-2 p-3 border border-stone-200 bg-stone-50 rounded-xl text-xs font-black uppercase tracking-wider text-stone-700"
            >
              <Send size={14} />
              Notify Client
            </button>

            <button
              type="button"
              onClick={handleCompleted}
              className="flex items-center justify-center gap-2 p-3 border border-emerald-200 bg-emerald-50 rounded-xl text-xs font-black uppercase tracking-wider text-emerald-700"
            >
              <CheckCircle size={14} />
              Completed
            </button>
          </div>

          {/* BILL SECTION */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-[#EADDCA]">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>{baseService.name}</span>
              <span>₹{baseService.price}</span>
            </div>

            {selectedServices.length > 0 && (
              <div className="space-y-2 mt-4">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between items-center bg-white rounded-xl px-3 py-2 border border-stone-200"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {service.name}
                      </p>

                      <p className="text-xs text-stone-500">
                        Extra Service
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm">
                        ₹{service.price}
                      </span>

                      <button
                        onClick={() => removeService(service.id)}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TOTAL */}
            <div className="flex justify-between items-center mt-5 pt-4 border-t border-dashed border-stone-300">
              <span className="font-black uppercase text-sm">
                Total Amount
              </span>

              <span className="text-2xl font-black text-[#A37B58]">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          {/* POPUP */}
          {showServices && (
            <div className="absolute bottom-[120px] left-0 right-0 mx-6 bg-white border border-[#EADDCA] rounded-2xl shadow-2xl p-4 z-50 animate-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase text-stone-400">
                  Add Extra Service
                </p>

                <button
                  onClick={() => setShowServices(false)}
                  className="text-stone-400 hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {extraServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => addService(service)}
                    className="w-full flex justify-between items-center px-4 py-3 text-sm font-bold bg-stone-50 rounded-xl hover:bg-[#A37B58]/10 transition-all"
                  >
                    <span>{service.name}</span>

                    <span className="text-[#A37B58]">
                      ₹{service.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-6 gap-3">
            <button
              onClick={handleCompleteService}
              className="col-span-5 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-[#3E362E] hover:bg-[#2A241F] transition-all hover:scale-[1.01]"
            >
              <CheckCircle size={16} />
              Complete & Bill
            </button>

            <button
              onClick={() =>
                setShowServices((prev) => !prev)
              }
              className={`col-span-1 flex items-center justify-center border rounded-xl transition-all ${showServices
                ? "bg-[#3E362E] text-white border-[#3E362E]"
                : "border-[#EADDCA] text-[#3E362E] hover:bg-stone-50"
                }`}
            >
              <PlusCircle size={22} />
            </button>
          </div>
        </div>

        {/* {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-[350px]">

              {modal.type === "delayed" && (
                <>
                  <h3 className="font-bold text-lg mb-3">Mark as Delayed?</h3>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setModal(null)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleMarkDelayed}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg"
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}

              {modal.type === "noshow" && (
                <>
                  <h3 className="font-bold text-lg mb-3">Mark as No Show?</h3>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setModal(null)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleMarkNoShow}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}

              {modal.type === "notify" && (
                <>
                  <h3 className="font-bold text-lg mb-3">Send Notification?</h3>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setModal(null)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSendNotif}
                      className="px-4 py-2 bg-black text-white rounded-lg"
                    >
                      Send
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )} */}

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-[28px] p-7 shadow-2xl border border-[#EADDCA]">

              {modal.type === "delayed" && (
                <>
                  <h3 className="text-2xl font-black text-[#3E362E] uppercase tracking-wide">
                    Mark as Delayed?
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-stone-500">
                    This will change <strong>{currentCustomer}</strong>'s status to
                    delayed and trigger a grace-period timer before escalation.
                  </p>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={() => setModal(null)}
                      className="px-5 py-3 text-sm font-bold text-stone-500 hover:text-stone-700 transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleMarkDelayed}
                      className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-black tracking-wide transition"
                    >
                      Confirm Delay
                    </button>
                  </div>
                </>
              )}

              {modal.type === "noshow" && (
                <>
                  <h3 className="text-2xl font-black text-[#3E362E] uppercase tracking-wide">
                    Mark as No-Show?
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-stone-500">
                    This will permanently remove <strong>{currentCustomer}</strong>'s
                    active appointment block and free up the timeline.
                  </p>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={() => setModal(null)}
                      className="px-5 py-3 text-sm font-bold text-stone-500 hover:text-stone-700 transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleMarkNoShow}
                      className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-black tracking-wide transition"
                    >
                      Confirm No-Show
                    </button>
                  </div>
                </>
              )}

              {modal.type === "notify" && (
                <>
                  <h3 className="text-2xl font-black text-[#3E362E] uppercase tracking-wide">
                    Send Notification?
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-stone-500">
                    Send a reminder notification to <strong>{currentCustomer}</strong>
                    informing them about their upcoming service slot.
                  </p>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={() => setModal(null)}
                      className="px-5 py-3 text-sm font-bold text-stone-500 hover:text-stone-700 transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSendNotif}
                      className="px-6 py-3 rounded-xl bg-[#3E362E] hover:bg-[#2A241F] text-white text-sm font-black tracking-wide transition"
                    >
                      Send Reminder
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}



      </main>

      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999]
    flex items-center gap-3
    min-w-[340px] max-w-[420px]
    px-4 py-3
    rounded-2xl
    shadow-[0_12px_40px_rgba(0,0,0,0.12)]
    border
    backdrop-blur-md
    bg-white
    animate-in slide-in-from-top-2 duration-300
    ${toast.type === "error"
              ? "border-red-200"
              : toast.type === "warn"
                ? "border-amber-200"
                : "border-emerald-200"
            }`}
        >
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 ${toast.type === "error"
              ? "bg-red-500"
              : toast.type === "warn"
                ? "bg-amber-500"
                : "bg-emerald-500"
              }`}
          />

          <div className="flex-1">
            <p className="text-sm font-semibold text-stone-900">
              {toast.msg}
            </p>
          </div>

          <button
            onClick={() => setToast(null)}
            className="text-stone-400 hover:text-stone-700"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}