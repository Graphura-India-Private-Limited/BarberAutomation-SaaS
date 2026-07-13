
import React, { useState, useEffect } from 'react';
import {
  Calendar, CheckCircle, Clock, RotateCcw, XCircle,
  DollarSign, Sparkles, TrendingUp, ArrowLeft,
  Search, Loader2, AlertCircle, Copy, Check, Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const GOLD = "#C5A059";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Format a raw MongoID into short ref: BKG-XXXXXXX
const formatRef = (rawId) => {
  if (!rawId) return "—";
  const id = String(rawId);
  if (id.startsWith("BKG-")) return id;
  if (/^[0-9a-fA-F]{24}$/.test(id)) return `BKG-${id.slice(-7).toUpperCase()}`;
  return id;
};

// Map DB status to display info
const STATUS_MAP = {
  confirmed:    { label: "Confirmed Slot",  bg: "bg-amber-50",   text: "text-amber-800",   border: "border-amber-200",   tab: "upcoming"  },
  pending:      { label: "Pending",         bg: "bg-stone-50",   text: "text-stone-700",   border: "border-stone-200",   tab: "upcoming"  },
  "in-progress":{ label: "In Progress",     bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    tab: "upcoming"  },
  completed:    { label: "Completed",       bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", tab: "completed" },
  cancelled:    { label: "Cancelled",       bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     tab: "cancelled" },
  noshow:       { label: "No Show",         bg: "bg-red-50",     text: "text-red-600",     border: "border-red-100",     tab: "cancelled" },
};

const getStatusTab = (status) => {
  return STATUS_MAP[String(status || "").toLowerCase()]?.tab || "upcoming";
};

export default function BookingHistory() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Real bookings from API
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");

  // Booking ID lookup
  const [lookupId, setLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupCopied, setLookupCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMyBookings();
    const interval = setInterval(() => fetchMyBookings(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMyBookings = async (isBackground = false) => {
    if (!token) return;
    if (!isBackground) setLoadingBookings(true);
    setBookingsError("");
    try {
      const res = await fetch(`${API}/booking/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        setBookingsError(data.message || "Failed to load bookings.");
      }
    } catch {
      if (!isBackground) setBookingsError("Network error. Please try again.");
    } finally {
      if (!isBackground) setLoadingBookings(false);
    }
  };

  // Lookup a booking by ID (supports full MongoID or BKG-XXXXXXX suffix)
  const handleLookup = async () => {
    const raw = lookupId.trim();
    if (!raw) return;

    // Extract the raw MongoID portion if user typed a formatted ref
    // We search by checking our own fetched list first, then hit the API
    setLookupLoading(true);
    setLookupError("");
    setLookupResult(null);

    try {
      // 1. Check already-fetched bookings first (no extra API call)
      const suffix = raw.toUpperCase().replace("BKG-", "");
      const localMatch = bookings.find(b => {
        const id = String(b._id);
        return id === raw || id.slice(-7).toUpperCase() === suffix;
      });

      if (localMatch) {
        setLookupResult(localMatch);
        setLookupLoading(false);
        return;
      }

      // 2. Try full ID direct API call (only if it looks like a valid MongoID)
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(raw);
      if (isMongoId) {
        const res = await fetch(`${API}/booking/${raw}/refund-estimation`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.booking) {
          setLookupResult(data.booking);
          setLookupLoading(false);
          return;
        }
      }

      setLookupError("No booking found with that ID. Please check and try again.");
    } catch {
      setLookupError("Network error while searching. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleCancelVisit = (bookingId) => navigate(`/customer/refund/${bookingId}`);
  const handleRebook = () => navigate('/customer/services');
  const handleWriteReview = (booking) => {
    navigate('/write-review', {
      state: {
        bookingId: booking._id || booking.id,
        salonId: booking.salon_id?._id || booking.salon_id || '',
        salonName: booking.salon_id?.salon_name || booking.salon || '',
        barberId: booking.barber_id?._id || booking.barber_id || '',
        barberName: booking.barber_id?.name || 'Assigned Stylist'
      }
    });
  };

  // Map DB booking to display format
  const mapBooking = (b) => ({
    id: b._id,
    ref: formatRef(b._id),
    date: b.slot_time
      ? new Date(b.slot_time).toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC'
        })
      : new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    salon: b.salon_id?.salon_name || 'Salon',
    service: b.services?.map(s => s.service_name).join(', ') || 'Service',
    members: b.services?.filter(s => s.member_name && s.member_name !== 'Self').map(s => s.member_name) || [],
    amountPaid: b.total_amount || 0,
    status: b.status,
    salonId: b.salon_id?._id || b.salon_id,
    barberId: b.barber_id?._id || b.barber_id,
    barber: b.barber_id?.name || 'Assigned Barber',
  });

  const mappedBookings = bookings.map(mapBooking);
  const completedBookings = mappedBookings.filter(b => getStatusTab(b.status) === 'completed');
  const upcomingBookings  = mappedBookings.filter(b => getStatusTab(b.status) === 'upcoming');
  const cancelledBookings = mappedBookings.filter(b => getStatusTab(b.status) === 'cancelled');

  const totalVisits = completedBookings.length;
  const totalSpent  = completedBookings.reduce((sum, b) => sum + b.amountPaid, 0);
  const topService  = mappedBookings.length > 0 ? mappedBookings[0].service.split(',')[0] : "—";

  const displayedBookings =
    activeTab === 'upcoming'  ? upcomingBookings :
    activeTab === 'completed' ? completedBookings : cancelledBookings;

  const BookingCard = ({ booking, tab }) => {
    const statusCfg = STATUS_MAP[String(booking.status || "").toLowerCase()] || STATUS_MAP.confirmed;
    return (
      <div className={`bg-white/90 backdrop-blur-md rounded-[24px] border border-[#EADDCA] shadow-[0_8px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_35px_rgba(62,54,46,0.05)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden text-left ${
        tab === 'completed' ? 'border-l-4 border-l-[#C5A059]' : tab === 'cancelled' ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-[#3E362E]'
      }`}>
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest bg-[#C5A059]/10 px-2.5 py-1 rounded-md inline-block mb-2">
              {booking.date}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#3E362E] mt-1">{booking.salon}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-[9px] text-stone-400 font-mono uppercase tracking-wider">{booking.ref}</p>
            </div>
          </div>

          <div className="sm:text-right flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-none border-[#FAF6F0] pt-3 sm:pt-0 shrink-0">
            <div>
              <div className="text-[9px] text-stone-400 uppercase tracking-wider font-black mb-0.5">Amount Transacted</div>
              <div className="text-2xl font-serif font-black text-[#3E362E]">₹{booking.amountPaid}</div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-3xs border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
              {statusCfg.label}
            </span>
          </div>
        </div>

        <div className="border-t border-[#FAF6F0]" />

        <div className="bg-[#FAF6F0]/50 px-6 py-4 flex justify-between items-center text-stone-600 gap-4">
          <div className="flex items-center gap-2 min-w-0">
            {booking.status === 'completed' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-[#C5A059] flex-shrink-0 animate-pulse" />
            )}
            <span className="text-xs text-stone-500 truncate">
              Service: <strong className="text-[#3E362E] font-bold">{booking.service}</strong>
              {booking.barber && booking.barber !== 'Assigned Barber' && (
                <> · <span className="text-stone-400">by {booking.barber}</span></>
              )}
            </span>
          </div>

          {tab === 'upcoming' && booking.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => handleCancelVisit(booking.id)}
              className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#3E362E] text-white font-black text-[11px] tracking-[0.15em] uppercase cursor-pointer shadow-md transition-all duration-300 hover:bg-[#2F2923] hover:shadow-lg active:scale-95"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Visit</span>
            </button>
          )}
          {tab === 'completed' && (
            <div className="flex items-center gap-4 flex-shrink-0">
              <button type="button" onClick={() => handleWriteReview(booking)}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#C5A059] hover:text-[#3E362E] transition-colors cursor-pointer group select-none">
                <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                <span>Write Review</span>
              </button>
              <button type="button" onClick={handleRebook}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#3E362E] hover:text-[#C5A059] transition-colors cursor-pointer group select-none">
                <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
                <span>Rebook</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col">

        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/10 via-[#EADDCA]/20 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/30 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-50 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-all duration-300 hover:opacity-80 group text-[#3E362E] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADDCA] shadow-md hover:bg-white cursor-pointer"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" style={{ color: GOLD }} />
            <span>Back</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="relative h-[180px] sm:h-[220px] flex items-center justify-center overflow-hidden mb-2">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EADDCA]/20 via-transparent to-[#FAF6F0]" />
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white/80 backdrop-blur-md border border-[#EADDCA] px-4 py-1.5 rounded-full text-[#C5A059] shadow-sm inline-block mb-4">
              Dashboard Overview
            </span>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#3E362E] font-serif leading-none">
              My <span className="text-[#C5A059] italic normal-case">Bookings</span>
            </h1>
            <p className="text-stone-500 font-sans text-xs font-light tracking-wide mt-3 max-w-sm mx-auto">
              Manage your upcoming appointments and view past bespoke visits.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-24 relative z-10 flex-grow w-full">

          {/* ── BOOKING ID LOOKUP PANEL ── */}
          <div className="mb-8 bg-white/90 backdrop-blur-md border border-[#EADDCA] rounded-2xl p-5 shadow-[0_8px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-3">
              <Hash size={14} className="text-[#C5A059]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#3E362E]">Track by Booking ID</h3>
            </div>
            <p className="text-[10px] text-stone-400 font-medium mb-4 leading-relaxed">
              Enter your booking reference (e.g. <span className="font-mono font-bold text-[#C5A059]">BKG-4EDA425</span>) or the full booking ID from your confirmation receipt.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={lookupId}
                  onChange={e => { setLookupId(e.target.value); setLookupError(""); setLookupResult(null); }}
                  onKeyDown={e => e.key === 'Enter' && handleLookup()}
                  placeholder="BKG-4EDA425 or full 24-char ID..."
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-[#EBE6DF] bg-[#FAF9F6] text-[#3E362E] text-sm font-mono font-medium outline-none focus:border-[#C5A059] focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={handleLookup}
                disabled={!lookupId.trim() || lookupLoading}
                className="px-5 py-3 bg-[#3E362E] hover:bg-[#2A241F] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 shrink-0"
              >
                {lookupLoading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                Search
              </button>
            </div>

            {/* Lookup Error */}
            {lookupError && (
              <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle size={13} className="shrink-0" />
                {lookupError}
              </div>
            )}

            {/* Lookup Result */}
            {lookupResult && (() => {
              const b = mapBooking(lookupResult);
              const cfg = STATUS_MAP[b.status] || STATUS_MAP.confirmed;
              return (
                <div className="mt-4 border border-[#EADDCA] rounded-2xl overflow-hidden bg-[#FFFDF9]">
                  <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3 flex items-center gap-2">
                    <CheckCircle size={13} className="text-emerald-600" />
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Booking Found</span>
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    {/* Reference row */}
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 font-medium text-xs">Reference</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#3E362E] text-base tracking-wider">{b.ref}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(b.id); setLookupCopied(true); setTimeout(() => setLookupCopied(false), 2000); }}
                          className="p-1 rounded-lg hover:bg-stone-100 transition-colors text-stone-400 hover:text-[#C5A059] cursor-pointer"
                          title="Copy full booking ID"
                        >
                          {lookupCopied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between"><span className="text-stone-500 font-medium text-xs">Salon</span><span className="font-bold text-[#3E362E]">{b.salon}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500 font-medium text-xs">Service</span><span className="font-bold text-[#3E362E] text-right max-w-[60%]">{b.service}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500 font-medium text-xs">Date &amp; Time</span><span className="font-bold text-[#3E362E]">{b.date}</span></div>
                    {b.barber && b.barber !== 'Assigned Barber' && (
                      <div className="flex justify-between"><span className="text-stone-500 font-medium text-xs">Barber</span><span className="font-bold text-[#3E362E]">{b.barber}</span></div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                      <span className="text-stone-500 font-medium text-xs">Status</span>
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${cfg.bg} ${cfg.text} ${cfg.border}`}>{cfg.label}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-medium text-xs">Amount</span>
                      <span className="font-black text-emerald-700 font-mono text-base">₹{b.amountPaid}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Visits",   value: totalVisits,                          icon: CheckCircle, iconClass: "text-emerald-600" },
              { label: "Total Spent",    value: `₹${totalSpent}`,                     icon: DollarSign,  iconClass: "text-[#C5A059]" },
              { label: "Fav Service",    value: topService,                           icon: TrendingUp,  iconClass: "text-amber-600", small: true },
            ].map(s => (
              <div key={s.label} className="bg-white/80 backdrop-blur-md border border-[#EADDCA] rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.01)] flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-stone-400 block">{s.label}</span>
                  <s.icon className={`w-3.5 h-3.5 ${s.iconClass}`} />
                </div>
                <span className={`font-black text-[#3E362E] font-serif block mt-1 truncate ${s.small ? 'text-xs uppercase tracking-wide text-[#C5A059]' : 'text-2xl'}`}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-[#EADDCA] mb-8">
            {[
              { id: 'upcoming',  label: `Upcoming (${upcomingBookings.length})` },
              { id: 'completed', label: `Completed (${completedBookings.length})` },
              { id: 'cancelled', label: `Cancelled (${cancelledBookings.length})` },
            ].map(tab => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 rounded-xl font-black text-[10px] tracking-[0.12em] uppercase transition-all duration-300 cursor-pointer select-none ${
                  activeTab === tab.id ? 'bg-[#3E362E] text-white shadow-md' : 'text-stone-500 hover:text-[#3E362E] hover:bg-[#FAF6F0]'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Booking List */}
          <div className="space-y-6">
            {loadingBookings ? (
              <div className="flex items-center justify-center gap-3 py-20 text-stone-400">
                <Loader2 size={20} className="animate-spin text-[#C5A059]" />
                <span className="text-sm font-semibold">Loading your bookings…</span>
              </div>
            ) : bookingsError ? (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
                <AlertCircle size={16} />
                {bookingsError}
              </div>
            ) : displayedBookings.length === 0 ? (
              <div className="text-center py-16 bg-white/60 backdrop-blur-md rounded-3xl border border-dashed border-[#EADDCA] px-4">
                <p className="text-stone-400 font-light text-xs">No {activeTab} booking logs available.</p>
                {activeTab === 'upcoming' && (
                  <button onClick={() => navigate('/customer/services')}
                    className="mt-4 px-5 py-2.5 bg-[#C5A059] text-white rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer hover:opacity-90 transition-opacity">
                    Book Now →
                  </button>
                )}
              </div>
            ) : (
              displayedBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} tab={activeTab} />
              ))
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}