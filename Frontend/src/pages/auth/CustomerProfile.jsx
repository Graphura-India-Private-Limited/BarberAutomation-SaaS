import React, { useState, useEffect } from "react";
import { 
  Scissors, User, Mail, Phone, Plus, Trash2, X, 
  Calendar, Clock, Award, Image, ChevronRight, ArrowLeft, Save,
  Bell, CheckCircle, ShieldAlert, Sparkles, LogOut, CheckSquare, 
  Square, Edit3, Settings, Gift, List, Heart, CalendarPlus, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const GOLD = "#C5A059";
const DARK_BG = "#221C18"; // Rich dark charcoal from the barber panel header
const CHARCOAL = "#3E362E";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

export default function CustomerProfile() {
  // ── ACTIVE NAVIGATION TAB ──
  const [activeTab, setActiveTab] = useState("overview");

  // ── DATA STATES ──
  const [profile, setProfile] = useState({
    name: "Rahul Jagtap",
    mobile: "9876543210",
    email: "rahul@example.com",
    address: "Flat 402, Golden Heights, Pune",
    preferredBarber: "Barber Ajay",
    hairType: "Straight / Thick",
    skinType: "Sensitive Skin",
    routineCycle: "3 weeks",
  });

  const [family, setFamily] = useState([
    { _id: "1", name: "Aryan", relation: "Son", age: "12" },
    { _id: "2", name: "Snehal", relation: "Wife", age: "32" }
  ]);

  const [appointments, setAppointments] = useState([
    { 
      _id: "101", 
      service: "Classic Haircut & Beard Trim", 
      barberName: "Barber Ajay", 
      barberImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      date: "2026-06-15", 
      time: "10:30 AM", 
      status: "Upcoming",
      servicesList: [{ name: "Classic Haircut", price: 400 }, { name: "Beard Trim", price: 200 }],
      total: 600,
      paymentMethod: "UPI"
    },
    { 
      _id: "102", 
      service: "Beard Trim & Spa", 
      barberName: "Barber Ajay", 
      barberImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      date: "2026-05-15", 
      time: "02:15 PM", 
      status: "Completed",
      servicesList: [{ name: "Beard Trim", price: 200 }, { name: "Facial Spa", price: 500 }],
      total: 700,
      paymentMethod: "Razorpay Card",
      styleNotes: "Used number 2 guard on sides, left length on top."
    },
    { 
      _id: "103", 
      service: "Hair Coloring", 
      barberName: "Barber Kiran", 
      barberImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      date: "2026-04-20", 
      time: "11:00 AM", 
      status: "Completed",
      servicesList: [{ name: "Hair Coloring", price: 1200 }],
      total: 1200,
      paymentMethod: "Cash",
      styleNotes: "Organic matte dark brown color applied. Scalp wash completed."
    }
  ]);

  const [styles, setStyles] = useState([
    { id: 1, name: "Classic Trim" },
    { id: 2, name: "Taper Fade" },
    { id: 3, name: "Beard Lineup" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "status", title: "Booking Confirmed", message: "Your booking with Barber Ajay has been confirmed for June 15th.", date: "Just now", read: false },
    { id: 2, type: "announcement", title: "Festive Discount Active", message: "Special festive discount: 15% off all premium haircut styling packages this weekend!", date: "1 day ago", read: false },
    { id: 3, type: "routine", title: "Routine Grooming Alert", message: "It has been 3 weeks since your last grooming session! Time to maintain your fresh look?", date: "3 days ago", read: true }
  ]);

  // ── SUB-TABS & MODALS STATE ──
  const [apptSubTab, setApptSubTab] = useState("upcoming");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showStyleModal, setShowStyleModal] = useState(false); 
  const [newStyleName, setNewStyleName] = useState(""); 
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBarberForReview, setSelectedBarberForReview] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, feedback: "" });
  const [newMember, setNewMember] = useState({ name: "", relation: "Son", age: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Synchronize Data
  const syncData = async () => {
    const token = getToken();
    if (!token) return; 

    setLoading(true);
    try {
      const profileRes = await fetch(`${API}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      if (profileData.success && profileData.user) {
        setProfile(prev => ({
          ...prev,
          name: profileData.user.name || "",
          mobile: profileData.user.mobile || "",
          email: profileData.user.email || "",
        }));
        if (profileData.user.family_members) {
          setFamily(profileData.user.family_members);
        }
      }

      const bookingsRes = await fetch(`${API}/booking/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success && bookingsData.bookings) {
        const formatted = bookingsData.bookings.map(b => ({
          _id: b._id,
          service: b.services?.[0]?.service_name || "Custom Style Cut",
          barberName: b.barber_id?.name || "Barber Ajay",
          barberImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
          date: b.slot_time ? b.slot_time.split("T")[0] : new Date(b.created_at).toISOString().split("T")[0],
          time: b.slot_time ? new Date(b.slot_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:30 AM",
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
          servicesList: b.services?.map(s => ({ name: s.service_name, price: s.price })) || [{ name: "Custom Style Cut", price: 400 }],
          total: b.total_amount || 400,
          paymentMethod: "Razorpay Signature",
          styleNotes: b.barber_note || "Standard clean fade trim."
        }));
        setAppointments(formatted);
      }
    } catch (err) {
      console.log("Offline local data fallback active.", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
  }, []);

  const handleSaveProfile = async () => {
    setIsEditingProfile(false);
    const token = getToken();
    if (!token) {
      triggerToast("Profile revisions saved locally!");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: profile.name, email: profile.email })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Profile updated successfully!");
        syncData();
      } else {
        triggerToast(data.message || "Failed to update profile", "error");
      }
    } catch {
      triggerToast("Network error. Saved locally.", "error");
    }
  };

  const handleAddFamilyMember = async (e) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.age) {
      triggerToast("Please fill in all member fields.", "error");
      return;
    }

    const token = getToken();
    if (!token) {
      setFamily([...family, { _id: Date.now().toString(), ...newMember }]);
      setNewMember({ name: "", relation: "Son", age: "" });
      setShowAddFamily(false);
      triggerToast("Dependent linked locally!");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/family-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newMember)
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`${newMember.name} linked successfully!`);
        setNewMember({ name: "", relation: "Son", age: "" });
        setShowAddFamily(false);
        syncData();
      } else {
        triggerToast(data.message || "Failed to link member", "error");
      }
    } catch {
      triggerToast("Network error. Added locally.", "error");
    }
  };

  const handleRemoveMember = async (id) => {
    const token = getToken();
    if (!token) {
      setFamily(family.filter(m => m._id !== id));
      triggerToast("Member unlinked locally.");
      return;
    }

    try {
      const res = await fetch(`${API}/auth/family-member/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Member unlinked successfully!");
        syncData();
      } else {
        triggerToast(data.message || "Failed to remove member", "error");
      }
    } catch {
      triggerToast("Network error. Removed locally.", "error");
    }
  };

  const handleAddStyle = (e) => {
    e.preventDefault();
    if (!newStyleName.trim()) return;
    setStyles([...styles, { id: Date.now(), name: newStyleName.trim() }]);
    setNewStyleName("");
    setShowStyleModal(false);
    triggerToast("Style saved to Vault!");
  };

  const handleRemoveStyle = (id) => {
    setStyles(styles.filter(s => s.id !== id));
    triggerToast("Style look removed.");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = getToken();
    const payload = {
      barber_id: null,
      salon_rating: reviewForm.rating,
      barber_rating: reviewForm.rating,
      review_text: reviewForm.feedback
    };

    if (token) {
      try {
        await fetch(`${API}/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {}
    }

    setShowReviewModal(false);
    setReviewForm({ rating: 5, feedback: "" });
    triggerToast("Review submitted! Sent for admin approval.");
  };

  const handleCancelBooking = async (id) => {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API}/booking/${id}/cancel`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {}
    }
    setAppointments(appointments.map(a => a._id === id ? { ...a, status: "Cancelled" } : a));
    triggerToast("Session cancelled successfully.");
  };

  const getSmartReturnDate = () => {
    const completed = appointments.filter(a => a.status === "Completed");
    if (completed.length === 0) return "June 25th, 2026";
    
    const latest = new Date(completed[0].date);
    let cycleDays = 21; 
    if (profile.routineCycle === "2 weeks") cycleDays = 14;
    if (profile.routineCycle === "4 weeks") cycleDays = 28;
    if (profile.routineCycle === "1 month") cycleDays = 30;

    const returnDate = new Date(latest.getTime() + cycleDays * 24 * 60 * 60 * 1000);
    return returnDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const handleLogout = () => {
    localStorage.clear();
    triggerToast("Logged out successfully!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
  };

  const generateGoogleCalendarUrl = (appt) => {
    const title = encodeURIComponent(`Grooming Session - ${appt.service}`);
    const details = encodeURIComponent(`Styling session with ${appt.barberName} at The Royal Blade.`);
    const location = encodeURIComponent("123 MG Road, Nashik");
    const formattedDate = appt.date.replace(/-/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedDate}T103000Z/${formattedDate}T113000Z&details=${details}&location=${location}`;
  };

  const isNewUser = appointments.length === 0;

  return (
    <>
      
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans text-[#3C3630]">
        
        {/* ── CORE GRID LAYOUT ── */}
        <div className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row min-h-screen">
          
          {/* ── LEFT SIDEBAR (DARK & PREMIUM LOOK) ── */}
          <aside className="w-full lg:w-72 shrink-0 bg-white border-r border-[#EAD8C0]/30 p-6 flex flex-col justify-between">
            <div className="space-y-8">
              
              {/* Brand Header */}
              <div>
                <h2 className="text-xl font-serif font-black tracking-tight uppercase" style={{ color: CHARCOAL }}>
                  The Royal Cuts
                </h2>
                <p className="text-[9px] uppercase font-black tracking-[0.25em] text-[#C5A059] mt-0.5">
                  Customer Portal
                </p>
              </div>

              {/* User Identity Display */}
              <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#EAD8C0]/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-serif text-sm font-black text-white" style={{ background: `linear-gradient(135deg, ${GOLD}, #D2B48C)` }}>
                  {profile.name ? profile.name[0].toUpperCase() : "U"}
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-xs font-black text-[#3E362E] truncate">{profile.name}</h4>
                  <span className="inline-block mt-0.5 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#C5A059]/10 text-[#C5A059] rounded-md">
                    Premium Client
                  </span>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Left Nav menu items */}
              <nav className="flex flex-col gap-1 text-left">
                {[
                  { id: "overview", label: "Dashboard Hub", icon: Sparkles },
                  { id: "appointments", label: "My Appointments", icon: Calendar },
                  { id: "preferences", label: "Preferences & Profile", icon: User },
                  { id: "loyalty", label: "Rewards & Stamps", icon: Award },
                  { id: "notifications", label: "Notification Center", icon: Bell, count: notifications.filter(n => !n.read).length }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab.id 
                        ? "bg-[#3E362E] text-[#FFFBF2] shadow-sm font-black" 
                        : "text-[#5C5248] hover:bg-stone-50 hover:text-stone-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon size={16} className={activeTab === tab.id ? "text-[#C5A059]" : "text-stone-400"} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#C5A059] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

            </div>

            {/* Logout & Settings group */}
            <div className="mt-8 space-y-3">
              <button 
                onClick={() => window.location.href = "/customer/booking"}
                className="w-full bg-[#C5A059] hover:bg-[#B48F4B] text-white rounded-xl py-3 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Scissors size={12} /> BOOK APPOINTMENT
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl py-3 text-[10px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={12} /> LOGOUT PORTAL
              </button>
            </div>

          </aside>

          {/* ── RIGHT MAIN PANEL (WHITE CONTAINER WITH A SHARP header) ── */}
          <main className="flex-1 min-w-0 bg-[#FAF9F5] flex flex-col">
            
            {/* ── MAIN HEADER (BARBER STYLE: DARK & BOLD) ── */}
            <div className="bg-[#2D241E] text-white px-8 py-5 flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
              
              <div className="text-left relative z-10">
                <h1 className="text-xl font-serif font-black tracking-tight flex items-center gap-2">
                  <span>Dashboard Hub</span>
                  <span className="text-xs font-bold text-[#C5A059]">• Premium Client Portal</span>
                </h1>
                <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold mt-1">
                  The Royal Cuts • Nasik
                </p>
              </div>

              {/* Salon Open Indicator */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-stone-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span>Salon Open</span>
                </div>

                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center border border-white/10 font-bold text-xs">
                  SK
                </div>
              </div>
            </div>

            {/* ── CENTRAL DASHBOARD AREA ── */}
            <div className="flex-grow p-6 md:p-8 space-y-8 overflow-y-auto">

              {/* ── TAB CONTENT: OVERVIEW HUB ── */}
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  
                  {/* Banner greeting card */}
                  <div className="bg-white border border-[#EAD8C0]/40 p-6 rounded-[2rem] shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-serif font-black text-[#3E362E]">Hello, {profile.name}!</h2>
                      <p className="text-xs text-stone-400 font-medium">Ready for your next premium styling cut?</p>
                    </div>

                    {isEditingProfile ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={handleSaveProfile}
                          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <Save size={12} /> Save Updates
                        </button>
                        <button 
                          onClick={() => setIsEditingProfile(false)}
                          className="px-6 py-2.5 bg-red-50 text-red-500 border border-red-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="px-6 py-3 border border-[#EAD8C0] rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-stone-50 transition-colors"
                      >
                        Modify Profile Details
                      </button>
                    )}
                  </div>

                  {/* ── STATS CARDS GRID (AS IN BARBER DASHBOARD) ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    
                    {/* STATS 1: Loyalty Stamp */}
                    <div className="bg-white border border-[#EAD8C0]/40 p-5 rounded-[1.5rem] text-left shadow-sm flex flex-col justify-between min-h-[120px]">
                      <div className="flex justify-between items-start text-stone-400">
                        <Award size={18} className="text-[#C5A059]" />
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059]">
                          70% Completed
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-2xl font-serif font-black text-[#3E362E]">7 / 10</p>
                        <p className="text-[9px] uppercase font-black tracking-wider text-stone-400 mt-1">Loyalty stamps card</p>
                      </div>
                    </div>

                    {/* STATS 2: Next return date */}
                    <div className="bg-white border border-[#EAD8C0]/40 p-5 rounded-[1.5rem] text-left shadow-sm flex flex-col justify-between min-h-[120px]">
                      <div className="flex justify-between items-start text-stone-400">
                        <Clock size={18} className="text-[#C5A059]" />
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          Recommended
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-xl font-serif font-black text-[#3E362E]">{getSmartReturnDate().split(",")[0]}</p>
                        <p className="text-[9px] uppercase font-black tracking-wider text-stone-400 mt-1">Routine return date</p>
                      </div>
                    </div>

                    {/* STATS 3: Active bookings */}
                    <div className="bg-white border border-[#EAD8C0]/40 p-5 rounded-[1.5rem] text-left shadow-sm flex flex-col justify-between min-h-[120px]">
                      <div className="flex justify-between items-start text-stone-400">
                        <Calendar size={18} className="text-[#C5A059]" />
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          Active State
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-2xl font-serif font-black text-[#3E362E]">
                          {appointments.filter(a => a.status === "Upcoming").length} Active
                        </p>
                        <p className="text-[9px] uppercase font-black tracking-wider text-stone-400 mt-1">Upcoming sessions</p>
                      </div>
                    </div>

                    {/* STATS 4: XP Tier progress */}
                    <div className="bg-white border border-[#EAD8C0]/40 p-5 rounded-[1.5rem] text-left shadow-sm flex flex-col justify-between min-h-[120px]">
                      <div className="flex justify-between items-start text-stone-400">
                        <Sparkles size={18} className="text-[#C5A059]" />
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                          Gold Tier
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-2xl font-serif font-black text-[#3E362E]">1,450 XP</p>
                        <p className="text-[9px] uppercase font-black tracking-wider text-stone-400 mt-1">Fidelity point balance</p>
                      </div>
                    </div>

                  </div>

                  {/* ── ACTIVE TICKETS (AS IN BARBER DASHBOARD: Vikram Singh style) ── */}
                  <div className="bg-white border border-[#EAD8C0]/50 rounded-[2rem] p-6 text-left shadow-sm space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Active Upcoming Sessions</p>
                    
                    {appointments.filter(a => a.status === "Upcoming").length === 0 ? (
                      <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-[#EAD8C0]/50">
                        <Calendar size={24} className="text-stone-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">No active appointments scheduled</p>
                        <button 
                          onClick={() => window.location.href = "/customer/booking"}
                          className="mt-3 px-6 py-2.5 bg-[#3E362E] text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:opacity-95"
                        >
                          Book Grooming Today
                        </button>
                      </div>
                    ) : (
                      appointments.filter(a => a.status === "Upcoming").map(appt => (
                        <div key={appt._id} className="p-5 border border-[#EAD8C0]/40 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#FAF6F0]/20 hover:bg-[#FAF6F0]/40 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center font-serif text-sm font-black text-[#C5A059] shrink-0">
                              AJ
                            </div>
                            <div>
                              <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#C5A059]/20 text-[#3E362E] inline-block mb-1">
                                Scheduled Session
                              </span>
                              <h3 className="text-sm font-black text-[#3E362E]">{appt.service}</h3>
                              <p className="text-[10px] font-semibold text-stone-500 mt-1">With {appt.barberName} • Cost: ₹{appt.total}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-stone-400 text-xs font-bold py-2 px-4 bg-white rounded-xl border border-gray-100">
                            <span className="flex items-center gap-1"><Calendar size={13} className="text-[#C5A059]" /> {appt.date}</span>
                            <span className="flex items-center gap-1"><Clock size={13} className="text-[#C5A059]" /> {appt.time}</span>
                          </div>

                          <div className="flex gap-2 w-full md:w-auto shrink-0">
                            <button 
                              onClick={() => handleCancelBooking(appt._id)}
                              className="flex-1 md:flex-none px-4 py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-wider"
                            >
                              Cancel Booking
                            </button>
                            <a 
                              href={generateGoogleCalendarUrl(appt)}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 md:flex-none px-4 py-2.5 bg-[#3E362E] text-white hover:bg-[#4E443A] rounded-xl text-[9px] font-black uppercase tracking-wider text-center flex items-center justify-center gap-1"
                            >
                              <CalendarPlus size={11} className="text-[#C5A059]" /> Google Calendar
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Loyalty progress stamps grid */}
                  <div className="bg-[#2D241E] text-white p-6 rounded-[2rem] border border-[#C5A059]/30 text-left shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-5 pointer-events-none">
                      <Award size={140} />
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-[#F8E4A0] font-black">Loyalty stamp progression</p>
                        <h4 className="text-base font-serif font-black mt-1">Get 10 stamps for a complimentary haircut</h4>
                      </div>
                      <span className="text-[10px] font-black text-[#C5A059]">7 / 10 Stamps</span>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 pt-2">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${
                            i < 7 
                              ? "bg-[#C5A059]/20 border-[#C5A059] text-[#F8E4A0] scale-105" 
                              : "bg-white/5 border-white/10 text-white/20"
                          }`}
                        >
                          {i < 7 ? (
                            <CheckCircle size={14} className="text-[#C5A059]" />
                          ) : (
                            <span className="text-[10px] font-mono font-bold">{i + 1}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ── TAB CONTENT: MY APPOINTMENTS ── */}
              {activeTab === "appointments" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200 text-left">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-2 gap-4">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-wider">Appointments Registry</h2>
                      <p className="text-[10px] text-gray-400 font-medium">History of your future styling sessions and past look databases.</p>
                    </div>

                    <div className="flex border border-[#EAD8C0]/60 rounded-xl overflow-hidden bg-stone-50 select-none">
                      {["upcoming", "past"].map(sub => (
                        <button
                          key={sub}
                          onClick={() => setApptSubTab(sub)}
                          className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-wider cursor-pointer ${
                            apptSubTab === sub 
                              ? "bg-[#3E362E] text-white" 
                              : "text-stone-500 hover:text-stone-800"
                          }`}
                        >
                          {sub === "upcoming" ? "Upcoming Sessions" : "Past Cut History"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SUBTAB: UPCOMING APPOINTMENTS */}
                  {apptSubTab === "upcoming" && (
                    <div className="space-y-4">
                      {appointments.filter(a => a.status === "Upcoming" || a.status === "Pending").length === 0 ? (
                        <div className="text-center py-16 bg-white border border-[#EAD8C0]/40 rounded-2xl">
                          <Calendar size={32} className="mx-auto text-stone-200 mb-2" />
                          <p className="text-xs font-black uppercase tracking-wider text-stone-400">No upcoming sessions mapped</p>
                        </div>
                      ) : (
                        appointments.filter(a => a.status === "Upcoming" || a.status === "Pending").map(appt => (
                          <div key={appt._id} className="p-5 border border-[#EAD8C0]/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#FAF6F0]/20 text-left">
                            <div className="flex items-center gap-4">
                              <img src={appt.barberImage} alt={appt.barberName} className="w-14 h-14 rounded-2xl object-cover" />
                              <div>
                                <h4 className="text-sm font-black text-[#3E362E]">{appt.service}</h4>
                                <p className="text-xs font-semibold text-stone-500 mt-1">Barber Stylist: {appt.barberName}</p>
                                <div className="flex items-center gap-4 mt-2.5 text-[10px] font-bold text-stone-400">
                                  <span className="flex items-center gap-1"><Calendar size={12} className="text-[#C5A059]" /> {appt.date}</span>
                                  <span className="flex items-center gap-1"><Clock size={12} className="text-[#C5A059]" /> {appt.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto shrink-0">
                              <button 
                                onClick={() => handleCancelBooking(appt._id)}
                                className="flex-1 md:flex-none px-4 py-2.5 bg-red-50 text-red-500 border border-red-200 rounded-xl text-[9px] font-black tracking-wider uppercase hover:bg-red-100 cursor-pointer"
                              >
                                Cancel Session
                              </button>
                              <a 
                                href={generateGoogleCalendarUrl(appt)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 md:flex-none px-4 py-2.5 bg-[#3E362E] text-white rounded-xl text-[9px] font-black tracking-wider uppercase hover:opacity-90 flex items-center justify-center gap-1"
                              >
                                <CalendarPlus size={11} className="text-[#C5A059]" /> Google Calendar
                              </a>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* SUBTAB: PAST HISTORY (MEMORY BANK) */}
                  {apptSubTab === "past" && (
                    <div className="space-y-4">
                      {appointments.filter(a => a.status === "Completed" || a.status === "Cancelled").length === 0 ? (
                        <div className="text-center py-16 bg-white border border-[#EAD8C0]/40 rounded-2xl">
                          <Scissors size={32} className="mx-auto text-stone-200 mb-2" />
                          <p className="text-xs font-black uppercase tracking-wider text-stone-400">Past history ledger is empty</p>
                        </div>
                      ) : (
                        appointments.filter(a => a.status === "Completed" || a.status === "Cancelled").map(appt => (
                          <div key={appt._id} className="p-5 border border-[#EAD8C0]/40 rounded-2xl bg-white shadow-sm flex flex-col gap-4">
                            
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex items-center gap-3">
                                <img src={appt.barberImage} alt={appt.barberName} className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                                <div>
                                  <h4 className="text-xs font-black tracking-wide text-[#3E362E]">{appt.service}</h4>
                                  <p className="text-[10px] font-bold text-stone-400 mt-0.5">By {appt.barberName} • {appt.date}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-black font-mono">₹{appt.total}</span>
                                <p className="text-[8px] uppercase tracking-widest text-stone-400 font-bold mt-0.5">via {appt.paymentMethod}</p>
                              </div>
                            </div>

                            <div className="bg-[#FAF6F0]/40 rounded-xl p-3 border border-[#EAD8C0]/20 space-y-1.5">
                              <p className="text-[8px] uppercase font-black tracking-widest text-[#C5A059] mb-1">Services Cost breakdown</p>
                              {(appt.servicesList || []).map((s, idx) => (
                                <div key={idx} className="flex justify-between text-[10px] text-stone-500">
                                  <span>{s.name}</span>
                                  <span className="font-mono font-semibold">₹{s.price}</span>
                                </div>
                              ))}
                            </div>

                            {appt.styleNotes && (
                              <div className="bg-[#C5A059]/5 border border-dashed border-[#C5A059]/40 rounded-xl p-3 text-[10px] text-stone-600 flex gap-2">
                                <Scissors size={12} className="text-[#C5A059] shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-[#C5A059] uppercase tracking-widest text-[8px] block mb-0.5">Style Notes from Stylist</span>
                                  <p className="italic">"{appt.styleNotes}"</p>
                                </div>
                              </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                              {appt.status === "Completed" && (
                                <button 
                                  onClick={() => {
                                    setSelectedBarberForReview(appt.barberName);
                                    setShowReviewModal(true);
                                  }}
                                  className="px-4 py-2 border rounded-lg text-[9px] font-black uppercase tracking-wider text-stone-500 hover:bg-stone-50 cursor-pointer"
                                >
                                  Leave a Review
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  triggerToast(`Scheduling rebook with ${appt.barberName}...`);
                                  setTimeout(() => {
                                    window.location.href = "/customer/booking";
                                  }, 1000);
                                }}
                                className="px-4 py-2 bg-[#3E362E] text-[#FFFBF2] rounded-lg text-[9px] font-black uppercase tracking-wider hover:opacity-90 cursor-pointer"
                              >
                                Book Again
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB CONTENT: PROFILE & PREFERENCES ── */}
              {activeTab === "preferences" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200 text-left">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider">Preferences & Personal details</h2>
                    <p className="text-[10px] text-gray-400 font-medium">Manage your contact parameters, styles, and routine settings.</p>
                  </div>

                  <div className="bg-white border border-[#EAD8C0]/50 p-6 rounded-[2rem] space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] border-b pb-1">Contact Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Full Name</label>
                        <input 
                          disabled={!isEditingProfile}
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className={`w-full bg-[#FAF6F0] border rounded-xl px-4 py-3 text-xs font-bold outline-none text-[#3E362E] focus:border-[#C5A059] transition-all ${
                            !isEditingProfile ? "border-transparent opacity-80" : "border-[#EAD8C0]"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Mobile number</label>
                        <input 
                          disabled={true}
                          value={profile.mobile}
                          className="w-full bg-[#FAF6F0] border border-transparent rounded-xl px-4 py-3 text-xs font-bold font-mono outline-none text-[#3E362E] opacity-60 cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Email address</label>
                        <input 
                          disabled={!isEditingProfile}
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className={`w-full bg-[#FAF6F0] border rounded-xl px-4 py-3 text-xs font-bold outline-none text-[#3E362E] focus:border-[#C5A059] transition-all ${
                            !isEditingProfile ? "border-transparent opacity-80" : "border-[#EAD8C0]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#EAD8C0]/50 p-6 rounded-[2rem] space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] border-b pb-1">Grooming & Hair Preferences</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Preferred Barber Stylist</label>
                        <select 
                          value={profile.preferredBarber}
                          onChange={(e) => setProfile({...profile, preferredBarber: e.target.value})}
                          className="w-full bg-[#FAF6F0] border border-[#EAD8C0] rounded-xl px-3 py-3 text-xs font-bold outline-none text-[#3E362E]"
                        >
                          <option>Barber Ajay</option>
                          <option>Barber Kiran</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Hair texture / Profile</label>
                        <input 
                          value={profile.hairType}
                          onChange={(e) => setProfile({...profile, hairType: e.target.value})}
                          className="w-full bg-[#FAF6F0] border border-[#EAD8C0] rounded-xl px-4 py-3 text-xs font-bold outline-none text-[#3E362E] focus:border-[#C5A059]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Skin details / Notes</label>
                        <input 
                          value={profile.skinType}
                          onChange={(e) => setProfile({...profile, skinType: e.target.value})}
                          className="w-full bg-[#FAF6F0] border border-[#EAD8C0] rounded-xl px-4 py-3 text-xs font-bold outline-none text-[#3E362E] focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-2">Configure Grooming Routine Interval</label>
                      <div className="flex flex-wrap gap-2">
                        {["2 weeks", "3 weeks", "4 weeks", "1 month"].map(cycle => (
                          <button 
                            key={cycle}
                            type="button"
                            onClick={() => {
                              setProfile({...profile, routineCycle: cycle});
                              triggerToast(`Grooming cadence set to ${cycle}!`);
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              profile.routineCycle === cycle
                                ? "bg-[#3E362E] text-white shadow-sm"
                                : "bg-[#FAF6F0] text-stone-600 border border-[#EAD8C0] hover:bg-[#C5A059]/10"
                            }`}
                          >
                            {cycle}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Family Linkage registry */}
                  <div className="bg-white border border-[#EAD8C0]/50 p-6 rounded-[2rem] space-y-4">
                    <div className="flex justify-between items-center border-b pb-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">Family registry slots</p>
                      <button 
                        onClick={() => setShowAddFamily(!showAddFamily)}
                        className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] hover:underline"
                      >
                        + Link Dependent
                      </button>
                    </div>

                    <AnimatePresence>
                      {showAddFamily && (
                        <motion.form 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleAddFamilyMember}
                          className="bg-stone-50 border border-[#EAD8C0]/40 rounded-2xl p-4 space-y-3 overflow-hidden text-left"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input 
                              type="text" 
                              required
                              placeholder="Name" 
                              value={newMember.name} 
                              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                              className="bg-white border border-[#EAD8C0]/50 rounded-lg px-3 py-2 text-xs outline-none text-[#3E362E]" 
                            />
                            <select 
                              value={newMember.relation}
                              onChange={(e) => setNewMember({...newMember, relation: e.target.value})}
                              className="bg-white border border-[#EAD8C0]/50 rounded-lg px-3 py-2 text-xs outline-none text-[#3E362E]"
                            >
                              <option>Son</option>
                              <option>Daughter</option>
                              <option>Wife</option>
                              <option>Husband</option>
                            </select>
                            <input 
                              type="text" 
                              required
                              placeholder="Age" 
                              value={newMember.age} 
                              onChange={(e) => setNewMember({...newMember, age: e.target.value.replace(/\D/g, "")})}
                              className="bg-white border border-[#EAD8C0]/50 rounded-lg px-3 py-2 text-xs outline-none text-[#3E362E] text-center" 
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button 
                              type="button" 
                              onClick={() => setShowAddFamily(false)}
                              className="px-4 py-2 border rounded-lg text-[9px] font-black uppercase tracking-widest text-stone-500 hover:bg-stone-100"
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit"
                              className="px-4 py-2 text-white rounded-lg text-[9px] font-black uppercase tracking-widest"
                              style={{ background: CHARCOAL }}
                            >
                              Link Dependent
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {family.map(member => (
                        <div key={member._id} className="p-4 border border-[#EAD8C0]/40 rounded-xl bg-[#FAF6F0]/20 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-black text-[#3E362E]">{member.name}</p>
                            <p className="text-[9px] text-stone-400 uppercase tracking-widest mt-0.5">{member.relation} • Age {member.age}</p>
                          </div>
                          <button 
                            onClick={() => handleRemoveMember(member._id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB CONTENT: REWARDS & LOYALTY ── */}
              {activeTab === "loyalty" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200 text-left">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider">Rewards & Stamp cycle</h2>
                    <p className="text-[10px] text-gray-400 font-medium">Verify your styling stamp cadence benefits and exclusive perks.</p>
                  </div>

                  {/* Stamp layout card */}
                  <div className="bg-[#2D241E] text-[#FFFBF2] p-8 rounded-[2.5rem] border border-[#C5A059]/40 relative overflow-hidden shadow-xl">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-[#F8E4A0] bg-[#C5A059]/20 border border-[#C5A059]/30 px-3 py-1 rounded-full font-black">
                            Gold Tier Level Card
                          </span>
                          <h3 className="text-xl font-serif font-black mt-2">1 stamp collected per completed cut</h3>
                        </div>
                        <Award size={36} className="text-[#C5A059]" />
                      </div>

                      <div className="space-y-2 pt-4">
                        <div className="flex justify-between text-xs text-stone-300 font-black">
                          <span>Fidelity Progress</span>
                          <span className="text-[#C5A059]">{isNewUser ? "0" : "7"} / 10 stamps collected</span>
                        </div>
                        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-[#C5A059] to-[#F8E4A0] transition-all duration-700" style={{ width: isNewUser ? "0%" : "70%" }}></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 pt-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${
                              !isNewUser && i < 7 
                                ? "bg-[#C5A059]/20 border-[#C5A059] text-[#F8E4A0] shadow-sm shadow-[#C5A059]/20 scale-105" 
                                : "bg-white/5 border-white/10 text-white/20"
                            }`}
                          >
                            {!isNewUser && i < 7 ? (
                              <CheckCircle size={16} className="text-[#C5A059]" />
                            ) : (
                              <span className="text-xs font-mono font-bold">{i + 1}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Style vault prefer list */}
                  <div className="bg-white border border-[#EAD8C0]/50 p-6 rounded-[2rem] shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Image size={16} className="text-[#C5A059]" />
                        <h4 className="text-xs font-black uppercase tracking-wider">Style Vault preferred styles</h4>
                      </div>
                      <button 
                        onClick={() => setShowStyleModal(true)}
                        className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] hover:underline"
                      >
                        + Add Style
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {styles.map(s => (
                        <div key={s.id} className="px-4 py-2 bg-[#FDF5E6]/40 border border-[#EAD8C0]/35 rounded-xl text-xs font-bold text-[#3E362E] flex items-center gap-2">
                          <Scissors size={12} className="text-[#C5A059]" />
                          <span>{s.name}</span>
                          <button onClick={() => handleRemoveStyle(s.id)} className="text-gray-400 hover:text-red-500 font-bold ml-1">
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB CONTENT: NOTIFICATION FEED ── */}
              {activeTab === "notifications" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200 text-left">
                  
                  <div className="flex justify-between items-center border-b pb-4 mb-2">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-wider">Live System Alerts</h2>
                      <p className="text-[10px] text-gray-400 font-medium">Real-time status updates, reminders, and broad announcements.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setNotifications(notifications.map(n => ({...n, read: true})));
                        triggerToast("All alerts marked as read!");
                      }}
                      className="px-4 py-2 border rounded-xl text-[9px] font-black uppercase tracking-widest text-[#C5A059] bg-[#C5A059]/5 hover:bg-[#C5A059]/10 cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-5 rounded-2xl border transition-all flex gap-4 ${
                          n.read 
                            ? "bg-white border-gray-100 opacity-80 shadow-inner" 
                            : "bg-amber-50/10 border-[#C5A059]/30 shadow-sm"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                          n.type === "status" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          n.type === "announcement" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                          {n.type === "status" ? <CheckCircle size={18} /> :
                           n.type === "announcement" ? <Sparkles size={18} /> :
                           <Clock size={18} />}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="text-xs font-black tracking-wide text-[#3E362E] flex items-center gap-1.5">
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>}
                              {n.title}
                            </h4>
                            <span className="text-[8px] text-gray-400 font-mono shrink-0">{n.date}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-light mt-1.5 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          </main>

        </div>
      </div>

      {/* ── BOOKING LEDGER MODAL ── */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-md h-full bg-[#FFFBF2] shadow-2xl p-6 flex flex-col justify-start overflow-y-auto z-10 border-l border-[#EAD8C0]/80"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#EAD8C0]/60 mb-6">
                <div className="flex items-center gap-2 text-left">
                  <Scissors size={18} color={GOLD} />
                  <h3 className="text-md font-black uppercase tracking-wider" style={{ color: CHARCOAL }}>Complete Booking Ledger</h3>
                </div>
                <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                {appointments.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar size={32} className="mx-auto text-stone-300 mb-2" />
                    <p className="text-xs font-black uppercase tracking-wider text-stone-400">Ledger Empty</p>
                  </div>
                ) : (
                  appointments.map((app) => (
                    <div key={app._id} className="p-4 bg-white rounded-2xl border border-[#EAD8C0]/40 relative overflow-hidden text-left shadow-sm">
                      <div className="absolute top-0 left-0 w-1 h-full" style={{ background: app.status === 'Upcoming' ? GOLD : '#8D7B68' }}></div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-xs font-black tracking-wide" style={{ color: CHARCOAL }}>{app.service}</p>
                          <p className="text-[9px] text-gray-400 font-mono mt-0.5">REF ID: #{app._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                          app.status === 'Upcoming' ? 'bg-amber-50 text-amber-700' :
                          app.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-stone-100 text-stone-500'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dashed border-gray-100 text-[10px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {app.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {app.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ADD STYLE VAULT MODAL ── */}
      <AnimatePresence>
        {showStyleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStyleModal(false)} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            ></motion.div>
            <motion.form 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleAddStyle} 
              className="relative bg-[#FFFBF2] border border-[#EAD8C0] w-full max-w-sm rounded-[2rem] p-6 shadow-2xl z-10 text-left"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2" style={{ color: CHARCOAL }}>
                  <Scissors size={14} color={GOLD} /> Add Preferred Look
                </h3>
                <button type="button" onClick={() => setShowStyleModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <div className="mb-4">
                <label className="text-[9px] uppercase font-black tracking-widest mb-1.5 block text-gray-400">Style / Cut Name</label>
                <input 
                  type="text"
                  required
                  autoFocus
                  value={newStyleName}
                  onChange={(e) => setNewStyleName(e.target.value)}
                  placeholder="e.g., Mid Drop Fade, Messy Quiff"
                  className="w-full bg-white border border-[#EAD8C0] rounded-xl px-4 py-3 text-xs font-bold outline-none text-[#3E362E] focus:border-[#C5A059] shadow-inner"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 text-[#FFFBF2] font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all duration-200 hover:opacity-95 cursor-pointer"
                style={{ background: CHARCOAL }}
              >
                Save to Vault
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* ── LEAVE A REVIEW MODAL ── */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            ></motion.div>
            <motion.form 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleSubmitReview} 
              className="relative bg-[#FFFBF2] border border-[#EAD8C0] w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl z-10 text-left space-y-6"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2" style={{ color: CHARCOAL }}>
                  <Star size={16} fill={GOLD} color={GOLD} /> Rate Grooming Experience
                </h3>
                <button type="button" onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500">Rate your experience with <span className="text-[#C5A059]">{selectedBarberForReview}</span>:</p>
                <div className="flex gap-2.5 mt-3 justify-center">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating: val})}
                      className="p-1 cursor-pointer transition-transform hover:scale-110 animate-pulse"
                    >
                      <Star 
                        size={28} 
                        fill={val <= reviewForm.rating ? GOLD : "transparent"} 
                        color={GOLD} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-2">Write Review Message</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Details about styling details, speed, barber guidance..."
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm({...reviewForm, feedback: e.target.value})}
                  className="w-full bg-white border border-[#EAD8C0] rounded-2xl px-4 py-3 text-xs font-medium outline-none text-[#3E362E] focus:border-[#C5A059]"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 text-[#FFFBF2] font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all duration-200 hover:opacity-95 cursor-pointer"
                style={{ background: CHARCOAL }}
              >
                Submit Feedback
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST STACK */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-50 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl flex items-center gap-2.5 ${
              toast.type === "error" ? "bg-red-900 border border-red-700" : "bg-[#3E362E] border border-[#C5A059]/30"
            }`}
          >
            {toast.type === "error" ? (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-red-500 animate-bounce">
                <ShieldAlert size={12} strokeWidth={3} />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-emerald-500">
                <CheckCircle size={12} strokeWidth={3} />
              </div>
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      
    </>
  );
}