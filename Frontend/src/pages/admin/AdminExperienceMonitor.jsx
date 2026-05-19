import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_REVIEWS = [
  { id: 1, customer: "Rahul Sharma", salon: "Style Hub", barber: "Arjun", rating: 2, text: "Waited 40 mins, barber was rude, service was poor.", time: "10 min ago", status: "unresolved", flag: "low-rating" },
  { id: 2, customer: "Priya Singh", salon: "Cuts & Co", barber: "Rohan", rating: 1, text: "Totally unprofessional. Hair was uneven. Never coming back.", time: "25 min ago", status: "unresolved", flag: "complaint" },
  { id: 3, customer: "Vikram Nair", salon: "The Trim Shop", barber: "Kiran", rating: 5, text: "Best haircut in the city. Very professional service!", time: "1 hr ago", status: "resolved", flag: null },
  { id: 4, customer: "Amit Patel", salon: "Style Hub", barber: "Dev", rating: 3, text: "Average experience. Queue management could be better.", time: "2 hr ago", status: "resolved", flag: null },
  { id: 5, customer: "Sana Khan", salon: "Cuts & Co", barber: "Arjun", rating: 1, text: "Platform is buggy. Booking disappeared after payment!", time: "3 hr ago", status: "unresolved", flag: "platform-complaint" },
  { id: 6, customer: "Dev Mehta", salon: "BarberX", barber: "Rohan", rating: 4, text: "Smooth experience. Good barber selection feature.", time: "5 hr ago", status: "resolved", flag: null },
];

const SALONS = [
  { id: 1, name: "Style Hub", rating: 2.4, complaints: 4, status: "warned", reviews: 18 },
  { id: 2, name: "Cuts & Co", rating: 1.8, complaints: 7, status: "at-risk", reviews: 22 },
  { id: 3, name: "The Trim Shop", rating: 4.7, complaints: 0, status: "good", reviews: 31 },
  { id: 4, name: "BarberX", rating: 4.2, complaints: 1, status: "good", reviews: 14 },
];

const NOTIF_TEMPLATES = [
  { id: 1, label: "New Offer", icon: "🎁", text: "Exclusive offer: Get 20% off your next booking this weekend! Book now on the app." },
  { id: 2, label: "Maintenance", icon: "🔧", text: "Scheduled maintenance on May 25, 2:00 AM – 4:00 AM. The platform may be briefly unavailable." },
  { id: 3, label: "Feature Update", icon: "✨", text: "We've launched Priority Booking! Skip the queue with our new paid fast-track feature." },
  { id: 4, label: "Holiday Notice", icon: "📅", text: "Our partner salons may have limited hours this weekend due to the public holiday." },
];

let NOTIF_ID = 100;

const AUDIENCE_OPTS = [
  { value: "all", label: "All Users", icon: "👥" },
  { value: "customers", label: "Customers Only", icon: "🧑" },
  { value: "salons", label: "Specific Salons", icon: "✂️" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ratingColor = (r) =>
  r >= 4 ? "text-emerald-600" : r >= 3 ? "text-amber-600" : "text-rose-600";

const ratingBg = (r) =>
  r >= 4 ? "bg-emerald-50 border-emerald-200/60" : r >= 3 ? "bg-amber-50 border-amber-200/60" : "bg-rose-50 border-rose-200/60";

const salonStatusStyle = {
  good:     { badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60", dot: "bg-emerald-500" },
  warned:   { badge: "bg-amber-50 text-amber-700 border-amber-200/60",   dot: "bg-amber-500" },
  "at-risk":{ badge: "bg-rose-50 text-rose-700 border-rose-200/60",       dot: "bg-rose-500 animate-pulse" },
  suspended:{ badge: "bg-slate-100 text-slate-600 border-slate-200/60",   dot: "bg-slate-400" },
};

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-xs ${i <= rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
      ))}
    </div>
  );
}

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  const c = type === "success" ? "bg-slate-900 text-white" : type === "warn" ? "bg-amber-600 text-white" : "bg-emerald-600 text-white";
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
      className={`${c} text-xs font-medium px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 max-w-sm`}>
      {message}
    </motion.div>
  );
}

// ─── REVIEW CARD ──────────────────────────────────────────────────────────────
function ReviewCard({ review, onWarn, onResolve, onSuspend }) {
  const flagStyle = {
    "low-rating":       "bg-amber-50 text-amber-700 border-amber-200/50",
    "complaint":        "bg-rose-50 text-rose-700 border-rose-200/50",
    "platform-complaint":"bg-violet-50 text-violet-700 border-violet-200/50",
  };
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`bg-white rounded-2xl border p-4 shadow-sm ${review.status === "resolved" ? "border-slate-100 opacity-60" : "border-slate-200/80"}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
            {review.customer.split(" ").map(w => w[0]).join("")}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">{review.customer}</p>
            <p className="text-[10px] text-slate-400">{review.salon} · {review.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${ratingBg(review.rating)} ${ratingColor(review.rating)}`}>
            ★ {review.rating}
          </span>
          {review.flag && (
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${flagStyle[review.flag] ?? ""}`}>
              {review.flag.replace("-", " ")}
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mb-3">"{review.text}"</p>

      {review.status === "unresolved" ? (
        <div className="flex gap-2">
          <button onClick={() => onWarn(review)}
            className="flex-1 py-1.5 rounded-xl text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 hover:bg-amber-100 transition-colors">
            ⚠ Warn Salon
          </button>
          <button onClick={() => onSuspend(review)}
            className="flex-1 py-1.5 rounded-xl text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 hover:bg-rose-100 transition-colors">
            🚫 Suspend
          </button>
          <button onClick={() => onResolve(review.id)}
            className="flex-1 py-1.5 rounded-xl text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200/60 hover:bg-slate-200 transition-colors">
            ✓ Resolve
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span className="text-[10px] text-slate-400 font-medium">Resolved</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── SALON MONITOR CARD ───────────────────────────────────────────────────────
function SalonMonitorCard({ salon, onWarn, onSuspend }) {
  const st = salonStatusStyle[salon.status] ?? salonStatusStyle.good;
  return (
    <motion.div layout className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{salon.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Stars rating={Math.round(salon.rating)} />
            <span className={`text-xs font-bold ${ratingColor(salon.rating)}`}>{salon.rating}</span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${st.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          {salon.status === "at-risk" ? "At Risk" : salon.status.charAt(0).toUpperCase() + salon.status.slice(1)}
        </span>
      </div>

      <div className="flex gap-3 mb-3">
        <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100">
          <p className="text-sm font-bold text-slate-900">{salon.complaints}</p>
          <p className="text-[10px] text-slate-400">Complaints</p>
        </div>
        <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2 text-center border border-slate-100">
          <p className="text-sm font-bold text-slate-900">{salon.reviews}</p>
          <p className="text-[10px] text-slate-400">Reviews</p>
        </div>
      </div>

      {salon.status !== "suspended" ? (
        <div className="flex gap-2">
          <button onClick={() => onWarn(salon)}
            className="flex-1 py-2 rounded-xl text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 hover:bg-amber-100 transition-colors">
            ⚠ Warn
          </button>
          <button onClick={() => onSuspend(salon)}
            className="flex-1 py-2 rounded-xl text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 hover:bg-rose-100 transition-colors">
            🚫 Suspend
          </button>
        </div>
      ) : (
        <div className="py-2 text-center text-[10px] text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          Suspended — Access Disabled
        </div>
      )}
    </motion.div>
  );
}

// ─── NOTIFICATION COMPOSER ────────────────────────────────────────────────────
function NotifComposer({ onSend }) {
  const [title, setTitle] = useState("");
  const [body, setBody]   = useState("");
  const [audience, setAudience] = useState("all");
  const [selectedSalons, setSelectedSalons] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent]     = useState(false);

  const applyTemplate = (t) => { setBody(t.text); };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    onSend({ id: ++NOTIF_ID, title: title.trim(), body: body.trim(), audience, selectedSalons, sentAt: new Date().toLocaleTimeString() });
    setTimeout(() => { setSent(false); setTitle(""); setBody(""); setAudience("all"); setSelectedSalons([]); }, 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Compose Announcement</h3>
        <p className="text-[10px] text-slate-400">Push notification to selected audience</p>
      </div>

      {/* Templates */}
      <div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Templates</p>
        <div className="flex flex-wrap gap-2">
          {NOTIF_TEMPLATES.map(t => (
            <button key={t.id} onClick={() => applyTemplate(t)}
              className="text-[10px] font-medium px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1">
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title…"
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 bg-white" />

      {/* Body */}
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Message body…" rows={3}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 bg-white resize-none" />

      {/* Audience */}
      <div>
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Send To</p>
        <div className="flex gap-2 flex-wrap">
          {AUDIENCE_OPTS.map(o => (
            <button key={o.value} onClick={() => setAudience(o.value)}
              className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all flex items-center gap-1.5 ${
                audience === o.value ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}>
              {o.icon} {o.label}
            </button>
          ))}
        </div>
        {audience === "salons" && (
          <div className="mt-2 flex flex-wrap gap-2">
            {SALONS.map(s => (
              <button key={s.id}
                onClick={() => setSelectedSalons(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                className={`text-[10px] font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                  selectedSalons.includes(s.id) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
                }`}>
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Send button */}
      <button onClick={handleSend}
        disabled={!title.trim() || !body.trim() || sending || sent}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
          sent ? "bg-emerald-600 text-white" :
          sending ? "bg-slate-300 text-slate-500 cursor-not-allowed" :
          !title.trim() || !body.trim() ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
          "bg-slate-900 text-white hover:bg-slate-800"
        }`}>
        {sent ? "✓ Sent Successfully!" : sending ? "Sending…" : "Send Notification"}
      </button>
    </div>
  );
}

// ─── SENT HISTORY ROW ─────────────────────────────────────────────────────────
function SentRow({ notif, onDelete }) {
  const audienceLabel = { all: "All Users", customers: "Customers", salons: "Salons" };
  return (
    <motion.div layout initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="flex items-start gap-3 px-4 py-3 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm shrink-0">📣</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 truncate">{notif.title}</p>
        <p className="text-[10px] text-slate-500 truncate">{notif.body}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[9px] font-medium text-slate-400 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded-full">
            {audienceLabel[notif.audience] ?? notif.audience}
          </span>
          <span className="text-[9px] text-slate-400">{notif.sentAt}</span>
        </div>
      </div>
      <button onClick={() => onDelete(notif.id)} className="text-slate-300 hover:text-rose-400 transition-colors text-xs shrink-0">✕</button>
    </motion.div>
  );
}

// ─── WARN / SUSPEND MODAL ─────────────────────────────────────────────────────
function ActionModal({ target, action, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const isWarn = action === "warn";
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 flex flex-col gap-4"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}>
        <div className="absolute inset-0 rounded-2xl opacity-[0.3] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative">
          <h3 className="text-sm font-semibold text-slate-900">
            {isWarn ? "⚠ Issue Warning" : "🚫 Suspend Salon"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isWarn ? "A warning will be sent to " : "This will disable customer access for "}
            <span className="font-semibold text-slate-700">{target?.name || target?.salon}</span>.
          </p>
        </div>
        <div className="relative">
          <p className="text-[10px] font-medium text-slate-500 mb-1">Reason (required)</p>
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
            placeholder={isWarn ? "Describe the issue for the salon owner…" : "Reason for suspension…"}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 resize-none bg-white" />
        </div>
        <div className="flex gap-2 relative">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={() => reason.trim() && onConfirm(reason)}
            disabled={!reason.trim()}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
              isWarn ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-rose-500 hover:bg-rose-600 text-white"
            } disabled:opacity-40 disabled:cursor-not-allowed`}>
            {isWarn ? "Send Warning" : "Confirm Suspend"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminExperienceMonitor() {
  const [tab, setTab] = useState("reviews");  // reviews | salons | notifications
  const [reviews, setReviews]   = useState(INITIAL_REVIEWS);
  const [salons, setSalons]     = useState(SALONS);
  const [sentNotifs, setSentNotifs] = useState([]);
  const [modal, setModal]       = useState(null); // { target, action }
  const [filter, setFilter]     = useState("all"); // all | unresolved
  const [toasts, setToasts]     = useState([]);
  const toastId = useRef(0);

  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = id => setToasts(prev => prev.filter(t => t.id !== id));

  // Resolve review
  const handleResolve = (reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: "resolved" } : r));
    addToast("✓ Review marked as resolved");
  };

  // Warn/Suspend from review
  const handleReviewAction = (review, action) => {
    setModal({ target: review, action, type: "review" });
  };

  // Warn/Suspend from salon
  const handleSalonAction = (salon, action) => {
    setModal({ target: salon, action, type: "salon" });
  };

  const handleConfirmAction = (reason) => {
    const { target, action, type } = modal;
    if (action === "warn") {
      if (type === "salon") {
        setSalons(prev => prev.map(s => s.id === target.id ? { ...s, status: "warned" } : s));
      }
      addToast(`⚠ Warning issued to ${target.name || target.salon}`, "warn");
    } else {
      if (type === "salon") {
        setSalons(prev => prev.map(s => s.id === target.id ? { ...s, status: "suspended" } : s));
      } else {
        setSalons(prev => prev.map(s => s.name === target.salon ? { ...s, status: "suspended", complaints: s.complaints + 1 } : s));
      }
      addToast(`🚫 ${target.name || target.salon} has been suspended`, "warn");
    }
    if (type === "review") handleResolve(target.id);
    setModal(null);
  };

  const handleSendNotif = (notif) => {
    setSentNotifs(prev => [notif, ...prev]);
    addToast("📣 Notification sent successfully!", "notify");
  };

  const handleDeleteNotif = (id) => {
    setSentNotifs(prev => prev.filter(n => n.id !== id));
  };

  const filteredReviews = filter === "unresolved"
    ? reviews.filter(r => r.status === "unresolved")
    : reviews;

  const unresolvedCount = reviews.filter(r => r.status === "unresolved").length;
  const atRiskCount     = salons.filter(s => s.status === "at-risk" || s.status === "warned").length;

  const TABS = [
    { key: "reviews",       label: "Reviews & Ratings", badge: unresolvedCount || null },
    { key: "salons",        label: "Salon Monitor",     badge: atRiskCount || null },
    { key: "notifications", label: "Announcements",     badge: sentNotifs.length || null },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      {/* Glows */}
      <div className="fixed top-0 right-0 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-72 h-72 bg-rose-100 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Admin Panel</p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Experience & Comms</h1>
            <div className="flex gap-2">
              <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-center shadow-sm">
                <p className="text-sm font-bold text-rose-600">{unresolvedCount}</p>
                <p className="text-[9px] text-slate-400">Open</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-center shadow-sm">
                <p className="text-sm font-bold text-amber-600">{atRiskCount}</p>
                <p className="text-[9px] text-slate-400">At Risk</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-center shadow-sm">
                <p className="text-sm font-bold text-emerald-600">{sentNotifs.length}</p>
                <p className="text-[9px] text-slate-400">Sent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                tab === t.key ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}>
              {t.label}
              {t.badge ? (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"}`}>
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── TAB: REVIEWS ── */}
        <AnimatePresence mode="wait">
          {tab === "reviews" && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Filter */}
              <div className="flex gap-2 mb-4">
                {["all", "unresolved"].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`text-xs font-medium px-4 py-2 rounded-xl border transition-all ${
                      filter === f ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
                    }`}>
                    {f === "all" ? `All (${reviews.length})` : `Unresolved (${unresolvedCount})`}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {filteredReviews.map(r => (
                    <ReviewCard key={r.id} review={r}
                      onWarn={(rev) => handleReviewAction(rev, "warn")}
                      onSuspend={(rev) => handleReviewAction(rev, "suspend")}
                      onResolve={handleResolve} />
                  ))}
                </AnimatePresence>
                {filteredReviews.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-2xl mb-2">✓</p>
                    <p className="text-sm font-medium">All caught up!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── TAB: SALONS ── */}
          {tab === "salons" && (
            <motion.div key="salons" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-3">
                {salons.map(s => (
                  <SalonMonitorCard key={s.id} salon={s}
                    onWarn={(sal) => handleSalonAction(sal, "warn")}
                    onSuspend={(sal) => handleSalonAction(sal, "suspend")} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TAB: NOTIFICATIONS ── */}
          {tab === "notifications" && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col gap-4">
              <NotifComposer onSend={handleSendNotif} />
              {sentNotifs.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Sent History</p>
                  <div className="flex flex-col gap-2">
                    <AnimatePresence>
                      {sentNotifs.map(n => (
                        <SentRow key={n.id} notif={n} onDelete={handleDeleteNotif} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {modal && (
          <ActionModal
            target={modal.target}
            action={modal.action}
            onConfirm={handleConfirmAction}
            onClose={() => setModal(null)} />
        )}
      </AnimatePresence>

      {/* Toasts */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
        <AnimatePresence>
          {toasts.slice(-3).map(t => (
            <Toast key={t.id} message={t.message} type={t.type} onDone={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}