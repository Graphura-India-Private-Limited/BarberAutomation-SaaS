import React, { useState, useEffect } from "react";
import { 
  Scissors, User, Mail, Phone, Plus, Trash2, X, 
  Calendar, Clock, Award, Image, ChevronRight, ArrowLeft, Save,
  Bell, CheckCircle, ShieldAlert, Sparkles, LogOut, CheckSquare, 
  Square, Edit3, Settings, Gift, List, Heart, CalendarPlus, Star,
  RefreshCw, Play, Search, ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GOLD = "#B58B67";
const GOLD_LIGHT = "#FEF9EE";
const GOLD_BORDER = "#EADBCE";
const BG_WARM = "#FAF6F0";
const CHARCOAL = "#3D3126";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

export default function CustomerProfile() {
  // ── ACTIVE NAVIGATION TAB ──
  const [activeTab, setActiveTab] = useState("overview");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // ── DATA STATES ──
  const [profile, setProfile] = useState({
    name: "Rahul Jagtap",
    mobile: "9876543210",
    email: "rahul@example.com",
    profile_picture: "",
    membership_tier: "Standard", // Standard, VIP Bronze, VIP Gold
    membership_renewal_date: null,
    total_visits: 0,
    marketing_emails: true,
    monthly_reminders: true,
    new_services_alerts: true,
    newsletter_opt_in: true,
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
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: "status", title: "Booking Confirmed", message: "Your booking with Barber Ajay has been confirmed for June 15th.", date: "Just now", read: false },
    { id: 2, type: "announcement", title: "Festive Discount Active", message: "Special festive discount: 15% off all premium haircut styling packages this weekend!", date: "1 day ago", read: false },
  ]);

  // ── DUMMY SERVICES DATA CATALOG (FOR TEST RESERVATIONS & FRESH LOOK) ──
  const [dummyServices] = useState([
    { id: "s1", name: "Classic Haircut", description: "Standard scissor and clipper cutting, tailored to your head structure.", price: 400, category: "Men", duration: "30 min" },
    { id: "s2", name: "Taper Fade & Trim", description: "High-precision bald or shadow taper fade with line-up styling.", price: 500, category: "Men", duration: "40 min" },
    { id: "s3", name: "Beard Sculpting & Oil", description: "Hot towel lineup, custom beard trimming, and premium beard oil massage.", price: 250, category: "Men", duration: "25 min" },
    { id: "s4", name: "Luxury Hot Stone Shave", description: "Infused hot towels, straight-razor close shave, and stone facial calming.", price: 600, category: "Men", duration: "45 min" },
    { id: "s5", name: "Charcoal Face Mask", description: "Deep cleansing mask that removes oil, toxins, and blackheads instantly.", price: 300, category: "Addons", duration: "20 min" },
    { id: "s6", name: "Organic Hair Color", description: "Scalp-friendly, Ammonia-free coloring to refresh or change your style.", price: 1200, category: "Men", duration: "60 min" },
    { id: "s7", name: "Royal Head Massage", description: "Relaxing 20-minute coconut or almond oil head massage to relieve stress.", price: 350, category: "Addons", duration: "20 min" },
    { id: "s8", name: "Deep Conditioning Shampoo", description: "Premium wash, keratin styling treatment, and hair dryer blowout.", price: 200, category: "Addons", duration: "15 min" },
  ]);

  const [servicesSearch, setServicesSearch] = useState("");
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("All");

  // ── MODALS & CONTROLS STATE ──
  const [apptSubTab, setApptSubTab] = useState("upcoming");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddFamily, setShowAddFamily] = useState(false);
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

  const compileNotifications = (uProfile, uAppts) => {
    const list = [];
    let idCounter = 1;
    
    // 1. Check for upcoming bookings
    const upcoming = uAppts.filter(a => a.status === "Upcoming" || a.status === "Pending");
    if (upcoming.length > 0) {
      list.push({
        id: idCounter++,
        type: "status",
        title: "Booking Active",
        message: `Your appointment for ${upcoming[0].service} with ${upcoming[0].barberName} is scheduled for ${upcoming[0].date} at ${upcoming[0].time}.`,
        date: "Active",
        read: false
      });
    } else {
      list.push({
        id: idCounter++,
        type: "announcement",
        title: "Ready to Refresh?",
        message: "No active appointment scheduled. Browse our Premium Grooming Catalog and secure a priority slot today!",
        date: "Now",
        read: false
      });
    }

    // 2. Membership status alerts
    if (uProfile.membership_tier === "Standard") {
      list.push({
        id: idCounter++,
        type: "announcement",
        title: "Upgrade to VIP Bronze/Gold",
        message: "Unlock free monthly haircuts, styling product discounts, and premium queue slots today!",
        date: "Today",
        read: false
      });
    } else {
      list.push({
        id: idCounter++,
        type: "status",
        title: `${uProfile.membership_tier} Perks Active`,
        message: `Your premium membership tier is active. Enjoy exclusive styling benefits!${uProfile.membership_renewal_date ? ` Next renewal scheduled on ${uProfile.membership_renewal_date}.` : ""}`,
        date: "Active",
        read: false
      });
    }

    // 3. Fidelity stamps progression
    const stampsCount = uProfile.total_visits % 10;
    if (stampsCount > 0) {
      list.push({
        id: idCounter++,
        type: "status",
        title: "Fidelity Stamps Verified",
        message: `You have successfully gathered ${stampsCount} fidelity stamp${stampsCount > 1 ? 's' : ''}! Only ${10 - stampsCount} more sessions until your free grooming reward.`,
        date: "Updated",
        read: false
      });
    }

    // 4. General festive promo
    list.push({
      id: idCounter++,
      type: "announcement",
      title: "Festive Discount Active",
      message: "Special styling discount: 15% off all premium haircut packages and styling treatments this weekend!",
      date: "1 day ago",
      read: false
    });

    // Merge with existing read status if present
    setNotifications(prev => {
      const readMap = {};
      prev.forEach(n => {
        if (n.read) readMap[n.title] = true;
      });
      return list.map(item => ({
        ...item,
        read: readMap[item.title] || false
      }));
    });
  };

  // ── API BACKEND CONNECTION ──
  const syncData = async () => {
    const token = getToken();
    setLoading(true);
    
    // Establish local fallback values
    let currentProfile = { ...profile };
    let currentAppts = [...appointments];

    if (!token) {
      compileNotifications(currentProfile, currentAppts);
      setLoading(false);
      return;
    }

    try {
      const profileRes = await fetch(`${API}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileData = await profileRes.json();
      if (profileData.success && profileData.user) {
        const u = profileData.user;
        currentProfile = {
          name: u.name || "",
          mobile: u.mobile || "",
          email: u.email || "",
          profile_picture: u.profile_picture || "",
          membership_tier: u.membership_tier || "Standard",
          membership_renewal_date: u.membership_renewal_date ? new Date(u.membership_renewal_date).toLocaleDateString("en-IN") : null,
          total_visits: u.total_visits ?? 0,
          marketing_emails: u.marketing_emails ?? true,
          monthly_reminders: u.monthly_reminders ?? true,
          new_services_alerts: u.new_services_alerts ?? true,
          newsletter_opt_in: u.newsletter_opt_in ?? true,
        };
        setProfile(currentProfile);
        if (u.family_members) {
          setFamily(u.family_members);
        }
      }

      const bookingsRes = await fetch(`${API}/booking/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success && bookingsData.bookings) {
        currentAppts = bookingsData.bookings.map(b => ({
          _id: b._id,
          service: b.services?.[0]?.service_name || "Custom Haircut",
          barberName: b.barber_id?.name || "Barber Ajay",
          barberImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
          date: b.slot_time ? b.slot_time.split("T")[0] : new Date(b.created_at).toISOString().split("T")[0],
          time: b.slot_time ? new Date(b.slot_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:30 AM",
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
          servicesList: b.services?.map(s => ({ name: s.service_name, price: s.price })) || [{ name: "Custom Haircut", price: 400 }],
          total: b.total_amount || 400,
          paymentMethod: "Razorpay Secure",
          styleNotes: b.barber_note || "Standard clean fade cut."
        }));
        setAppointments(currentAppts);

        // Update visits dynamically in DB if mismatched
        const completedVisits = currentAppts.filter(a => a.status === "Completed").length;
        if (completedVisits !== (profileData.user.total_visits || 0)) {
          currentProfile.total_visits = completedVisits;
          setProfile({ ...currentProfile });
          await fetch(`${API}/auth/profile`, {
            method: "PUT",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ total_visits: completedVisits })
          });
        }
      }
    } catch (err) {
      console.log("Offline local data fallback active.", err.message);
    } finally {
      compileNotifications(currentProfile, currentAppts);
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
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Profile & Preferences updated successfully!");
        syncData();
      } else {
        triggerToast(data.message || "Failed to update profile", "error");
      }
    } catch {
      triggerToast("Network error. Could not connect to pipeline.", "error");
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
    triggerToast("Feedback received! Review confirmed.");
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
    triggerToast("Appointment successfully cancelled.");
  };

  const handleUpgradeMembership = async (tier) => {
    const token = getToken();
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);

    const updateData = {
      membership_tier: tier,
      membership_renewal_date: renewalDate
    };

    if (token) {
      try {
        const res = await fetch(`${API}/auth/profile`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });
        const data = await res.json();
        if (data.success) {
          triggerToast(`Plan successfully upgraded to ${tier}!`);
          syncData();
          return;
        }
      } catch (err) {}
    }

    setProfile(prev => ({
      ...prev,
      membership_tier: tier,
      membership_renewal_date: renewalDate.toLocaleDateString("en-IN")
    }));
    triggerToast(`Plan upgraded to ${tier} (Offline Mode)`);
  };

  const handleLogout = () => {
    localStorage.clear();
    triggerToast("Signing out of system console...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);
  };

  const handleBookDummyService = (service) => {
    triggerToast(`Initiating booking for ${service.name}...`);
    setTimeout(() => {
      window.location.href = `/customer/booking?svcId=${service.id}&price=${service.price}`;
    }, 1200);
  };

  const upcomingAppts = appointments.filter(a => a.status === "Upcoming" || a.status === "Pending");
  const completedAppts = appointments.filter(a => a.status === "Completed");
  const isNewUser = completedAppts.length === 0 && profile.total_visits === 0;

  // Barber frequencies calculation
  const getBarberFrequencies = () => {
    const counts = {};
    completedAppts.forEach(a => {
      counts[a.barberName] = (counts[a.barberName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  // Filter dummy services
  const filteredServices = dummyServices.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(servicesSearch.toLowerCase()) || 
                          s.description.toLowerCase().includes(servicesSearch.toLowerCase());
    const matchesCategory = selectedServiceCategory === "All" || s.category === selectedServiceCategory;
    return matchesSearch && matchesCategory;
  });

 return (
    <>
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans text-[#1C1917] transition-colors duration-300">
        
        {/* ── CENTRAL LAYOUT GRID ENGINE ── */}
        <div className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row min-h-screen">
          
          {/* ── LEFT SIDEBAR (TYPOGRAPHY & WEIGHT ALIGNED TO 2ND SCREENSHOT) ── */}
          <aside className="w-full lg:w-64 shrink-0 bg-[#FFFFFF] text-[#1C1917] flex flex-col min-h-screen border-r border-[#E7E5E4] p-5 justify-between shadow-2xs">
            <div className="space-y-6">
              
              {/* Brand Header */}
              <div className="px-1 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FDF9F3] flex items-center justify-center text-[#C5A059] shrink-0 border border-[#E7E5E4]">
                    <Scissors size={16} />
                  </div>
                  <div className="text-left">
                    {/* ── ✅ FIXED: BRAND TEXT STYLE ALIGNED TO GEORGIA SERIF WEIGHT ── */}
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#78716C] leading-none">Client Console</p>
                    <p className="text-[15px] font-bold text-[#1C1917] tracking-tight font-serif mt-1 leading-tight">Barber Pro</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links with Clean Typography Styles */}
              <nav className="space-y-0.5 text-left px-1">
                {/* ── ✅ FIXED: SECTION LABEL STYLE MATCHED EXACTLY ── */}
                <p className="px-3 text-[9px] font-bold text-[#78716C] uppercase tracking-[0.18em] mb-2.5">Navigation</p>
                {[
                  { id: "overview", label: "Dashboard Hub", icon: Sparkles },
                  { id: "history", label: "Appointments Registry", icon: Calendar },
                  { id: "dummy_services", label: "Grooming Menu", icon: ShoppingBag },
                  { id: "membership", label: "Membership Perks", icon: Award },
                  { id: "preferences", label: "Profile Settings", icon: User },
                  { id: "alerts", label: "Live System Alerts", icon: Bell, count: notifications.filter(n => !n.read).length }
                ].map(item => {
                  const isActive = activeTab === item.id;
                  return (
                  <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between gap-[10px] px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 group cursor-pointer border-none outline-none ${
              isActive
                ? 'bg-[#FDF9F3] text-[#C5A059] font-semibold border-l-3 border-[#C5A059]'
                : 'text-[#78716C] hover:bg-[#FAF6F0] hover:text-[#1C1917] font-medium'
            }`}
          >
                      <div className="flex items-center gap-[10px]">
                        <item.icon 
                          size={16} 
                          strokeWidth={isActive ? 2.5 : 2} 
                          className={`shrink-0 transition-colors ${isActive ? 'text-[#C5A059]' : 'text-[#78716C] group-hover:text-[#1C1917]'}`} 
                        />
                        <span className="flex-1">{item.label}</span>
                      </div>
                      {item.count > 0 && (
                        <span className="min-w-[17px] h-[17px] px-1 rounded-full bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer Details */}
            <div className="pt-4 border-t border-[#E7E5E4] space-y-1">
              <button
                onClick={() => window.location.href = "/customer/booking"}
                className="w-full bg-[#C5A059] hover:opacity-95 text-white rounded-lg py-2.5 text-[11px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-none outline-none font-sans"
              >
                <Scissors size={13} strokeWidth={2.5} /> Book Appointment
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-transparent hover:bg-[#FEF2F2] text-[#DC2626] rounded-lg py-2.5 text-[13px] font-medium transition-all duration-200 flex items-center justify-center gap-[10px] cursor-pointer border-none outline-none font-sans pl-3  text-left group"
              >
                <LogOut size={16} className="text-[#DC2626] shrink-0" /> 
                <span>Sign Out Console</span>
              </button>
            </div>
          </aside>

          {/* ── RIGHT DYNAMIC CANVAS ── */}
          <main className="flex-1 flex flex-col bg-[#FAF6F0] overflow-auto">
            
            {/* ── WARM HEADER SECTION (MATCHING SCREENSHOT HEADER EXACTLY) ── */}
            <header className="bg-[#FFFDF9] border-b border-[#EADBCE] px-6 py-4.5 flex items-center justify-between sticky top-0 z-10 text-left shrink-0 shadow-2xs">
              <div>
                <h1 className="text-2xl font-black font-serif text-[#3D3126]">
                  {activeTab === "overview" && "Dashboard"}
                  {activeTab === "history" && "Appointments Registry"}
                  {activeTab === "dummy_services" && "Grooming Menu"}
                  {activeTab === "membership" && "Membership Perks"}
                  {activeTab === "preferences" && "Profile Settings"}
                  {activeTab === "alerts" && "Live System Alerts"}
                </h1>
                <p className="text-xs text-[#8A7A6A] mt-0.5">Welcome back, {profile.name}!</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden md:block text-[11px] font-black uppercase text-[#8A7A6A] tracking-wider font-mono">
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </span>
                
                <button
                  onClick={syncData}
                  className="relative px-4 py-2 rounded-full border border-[#EADBCE] bg-white hover:bg-[#FEF9EE] text-[#9E7452] transition-all duration-300 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-3xs hover:scale-105"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => setActiveTab("alerts")}
                  className="relative p-2.5 rounded-full border border-[#EADBCE] bg-white text-[#8A7A6A] hover:bg-[#FEF9EE] transition-colors shadow-3xs"
                >
                  <Bell size={16} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="w-9 h-9 rounded-full overflow-hidden bg-[#B58B67] text-white flex items-center justify-center text-xs font-bold shadow-xs border border-[#EADBCE] cursor-pointer hover:scale-105 transition-all duration-300"
                  >
                    {profile.profile_picture ? (
                      <img src={profile.profile_picture} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile.name ? profile.name[0].toUpperCase() : "R"}</span>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showUserDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowUserDropdown(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-[#FFFDF9] border border-[#EADBCE] p-4 shadow-xl z-50 text-left"
                        >
                          <div className="border-b border-[#EADBCE] pb-3 mb-2.5">
                            <p className="text-xs font-black text-[#3D3126]">{profile.name}</p>
                            <p className="text-[10px] text-[#8A7A6A] font-semibold mt-0.5 truncate">{profile.email || profile.mobile}</p>
                            <p className="text-[9px] text-[#B58B67] font-black uppercase tracking-wider mt-1">{profile.membership_tier} Tier</p>
                          </div>
                          
                          <div className="space-y-1">
                            <button
                              onClick={() => { setActiveTab("preferences"); setShowUserDropdown(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase text-[#8A7A6A] hover:bg-[#FAF6F0] hover:text-[#3D3126] transition-colors cursor-pointer text-left"
                            >
                              <Settings size={13} className="text-[#B58B67]" />
                              <span>Profile Settings</span>
                            </button>
                            <button
                              onClick={() => { setActiveTab("membership"); setShowUserDropdown(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase text-[#8A7A6A] hover:bg-[#FAF6F0] hover:text-[#3D3126] transition-colors cursor-pointer text-left"
                            >
                              <Award size={13} className="text-[#B58B67]" />
                              <span>Membership Perks</span>
                            </button>
                            <button
                              onClick={() => { setActiveTab("alerts"); setShowUserDropdown(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase text-[#8A7A6A] hover:bg-[#FAF6F0] hover:text-[#3D3126] transition-colors cursor-pointer text-left"
                            >
                              <Bell size={13} className="text-[#B58B67]" />
                              <span>System Alerts</span>
                            </button>
                          </div>
                          
                          <div className="border-t border-[#EADBCE] pt-2.5 mt-2.5">
                            <button
                              onClick={() => { handleLogout(); setShowUserDropdown(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                            >
                              <LogOut size={13} />
                              <span>Sign Out Console</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </header>

            {/* ── CORE PANEL BODY ── */}
            <div className="p-6 md:p-8 space-y-8 flex-grow">

              {/* ── TAB: OVERVIEW HUB ── */}
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  
                  {profile.total_visits === 0 ? (
                    /* PROMINENT WELCOME ONBOARDING BANNER FOR NEW USERS */
                    <div className="bg-[#FEF9EE] border border-[#EADBCE] rounded-3xl p-6 text-left shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow relative overflow-hidden">
                      {/* Background Subtle Sparkle elements */}
                      <div className="absolute right-0 top-0 opacity-10 text-[#B58B67] -mr-8 -mt-8 pointer-events-none">
                        <Scissors size={200} />
                      </div>
                      
                      <div className="space-y-4 max-w-xl">
                        <span className="bg-[#B58B67] text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-3xs">
                          Onboarding Gift Active
                        </span>
                        <h2 className="text-2xl font-black font-serif text-[#3D3126] tracking-tight">Welcome to BarberPro, {profile.name}!</h2>
                        <p className="text-xs text-[#8A7A6A] leading-relaxed">
                          Experience the pinnacle of premium men's grooming. Book your first haircut today and unlock your customized styling record. Use coupon code <strong className="text-[#9E7452] font-mono text-sm bg-white border border-[#EADBCE] px-2 py-0.5 rounded-md font-black">FIRSTCUT20</strong> for a flat <strong className="text-[#9E7452]">20% off</strong> on your checkout!
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                          <button
                            onClick={() => window.location.href = "/customer/booking"}
                            className="bg-[#B58B67] hover:bg-[#9E7452] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs hover:scale-102 flex items-center gap-1.5"
                          >
                            <Scissors size={12} /> Book Your First Cut
                          </button>
                          <button
                            onClick={() => setShowVideoModal(true)}
                            className="bg-white hover:bg-[#FAF6F0] text-[#3D3126] border border-[#EADBCE] px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs hover:scale-102 flex items-center gap-1.5"
                          >
                            <Play size={12} className="fill-[#3D3126] text-[#3D3126]" /> Play Grooming Tutorial
                          </button>
                        </div>
                      </div>
                      
                      {/* Video preview thumbnail card */}
                      <div 
                        onClick={() => setShowVideoModal(true)}
                        className="relative group w-full md:w-64 aspect-video md:aspect-auto md:h-36 rounded-2xl overflow-hidden border border-[#EADBCE] shadow-xs cursor-pointer shrink-0"
                      >
                        <img 
                          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80" 
                          alt="Grooming Tutorial Video" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white text-[#B58B67] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <Play size={18} className="fill-[#B58B67] translate-x-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] text-white font-black uppercase tracking-wider truncate">
                          BarberPro Styling Guide
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* RETURNING REGULAR BANNER */
                    <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 text-left shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4 hover:shadow-sm transition-shadow">
                      <div>
                        <h2 className="text-2xl font-black font-serif text-[#3D3126]">Hello, {profile.name}!</h2>
                        <p className="text-xs text-[#8A7A6A] mt-1">Ready to refresh your style at BarberPro?</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowVideoModal(true)}
                          className="px-5 py-2.5 bg-white border border-[#EADBCE] hover:bg-[#FEF9EE] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-[#3D3126] flex items-center gap-1.5"
                        >
                          <Play size={12} className="fill-[#3D3126]" /> Styling Video
                        </button>
                        <button
                          onClick={() => setActiveTab("preferences")}
                          className="px-5 py-2.5 border border-[#EADBCE] hover:bg-[#FEF9EE] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-[#3D3126]"
                        >
                          Modify Profile Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── QUICK GLANCE METRICS GRID (MATCHING SCREENSHOT METRICS COLOR PALETTES) ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* CARD 1: Visits Counter - Gold/Cream Accent */}
                    <div 
                      onClick={() => { setActiveTab("history"); setApptSubTab("past"); }}
                      className="bg-white rounded-2xl border border-[#EADBCE] hover:border-[#B58B67] p-5 flex items-start gap-4 shadow-xs hover:shadow-md transition-all text-left cursor-pointer hover:scale-102"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#FEF9EE] border border-[#F5E6D3] flex items-center justify-center shrink-0 text-[#9E7452]">
                        <Scissors size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#8A7A6A] font-medium">Total Visits</p>
                        <p className="text-3xl font-black text-[#3D3126] mt-0.5">{profile.total_visits}</p>
                        <p className="text-[9px] text-[#8A7A6A] font-black uppercase tracking-wider mt-1.5">Grooming sessions completed</p>
                      </div>
                    </div>

                    {/* CARD 2: Next Appointment - Soft Purple/Lavender Accent */}
                    <div 
                      onClick={() => { setActiveTab("history"); setApptSubTab("upcoming"); }}
                      className="bg-white rounded-2xl border border-[#EADBCE] hover:border-purple-300 p-5 flex items-start gap-4 shadow-xs hover:shadow-md transition-all text-left cursor-pointer hover:scale-102"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100/60 flex items-center justify-center shrink-0 text-purple-600">
                        <Calendar size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#8A7A6A] font-medium">Next Booking</p>
                        {upcomingAppts.length > 0 ? (
                          <>
                            <p className="text-sm font-black text-[#3D3126] mt-1 truncate">{upcomingAppts[0].service}</p>
                            <p className="text-[10px] text-purple-600 font-black uppercase tracking-wider mt-1.5 font-mono">
                              {upcomingAppts[0].date} @ {upcomingAppts[0].time}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-lg font-black text-[#8A7A6A] mt-1">No Active Booking</p>
                            <p className="text-[9px] text-[#8A7A6A] font-black uppercase tracking-wider mt-1.5">Schedule a session anytime</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* CARD 3: Membership Tier - Soft Green/Emerald Accent */}
                    <div 
                      onClick={() => { setActiveTab("membership"); }}
                      className="bg-white rounded-2xl border border-[#EADBCE] hover:border-emerald-300 p-5 flex items-start gap-4 shadow-xs hover:shadow-md transition-all text-left cursor-pointer hover:scale-102"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-center shrink-0 text-[#137333]">
                        <Award size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#8A7A6A] font-medium">Membership Tier</p>
                        <p className="text-2xl font-black text-[#3D3126] mt-0.5">{profile.membership_tier}</p>
                        <p className="text-[9px] text-[#8A7A6A] font-black uppercase tracking-wider mt-1.5">
                          {profile.membership_tier === "Standard" ? "Upgrade to save more" : "Premium Tier unlocked"}
                        </p>
                      </div>
                    </div>

                    {/* CARD 4: Loyalty Reward Progress - Soft Orange/Amber Accent */}
                    <div 
                      onClick={() => {
                        setActiveTab("overview");
                        triggerToast(`You are ${(10 - (profile.total_visits % 10))} visits away from a free haircut reward!`);
                      }}
                      className="bg-white rounded-2xl border border-[#EADBCE] hover:border-amber-300 p-5 flex items-start gap-4 shadow-xs hover:shadow-md transition-all text-left cursor-pointer hover:scale-102"
                    >
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100/60 flex items-center justify-center shrink-0 text-[#B06000]">
                        <Gift size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#8A7A6A] font-medium">Reward Progress</p>
                        <p className="text-2xl font-black text-[#3D3126] mt-0.5">
                          {profile.total_visits % 10} / 10
                        </p>
                        <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden border border-stone-200/40">
                          <div 
                            className="bg-[#B58B67] h-full rounded-full transition-all duration-500" 
                            style={{ width: `${(profile.total_visits % 10) * 10}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-[#8A7A6A] font-black uppercase tracking-wider mt-1.5">
                          {10 - (profile.total_visits % 10)} cuts left to reward
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* ── DUAL ACTIVE SECTIONS ── */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                    
                    {/* Left: Active Reservations */}
                    <div className="card p-6 bg-white shadow-xs border border-[#EADBCE] rounded-2xl flex flex-col justify-between lg:col-span-2">
                      <div>
                        <h3 className="text-md font-black font-serif text-[#3D3126] tracking-tight">Active Reservations</h3>
                        <p className="text-[11px] text-[#8A7A6A] font-medium mt-1">Grooming sessions scheduled on your calendar</p>
                      </div>

                      <div className="my-auto py-4">
                        {upcomingAppts.length === 0 ? (
                          <div className="text-center py-6">
                            <Calendar className="mx-auto text-stone-200 mb-2" size={24} />
                            <p className="text-xs font-black uppercase tracking-wider text-stone-400">No upcoming appointments</p>
                          </div>
                        ) : (
                          upcomingAppts.map(appt => (
                            <div key={appt._id} className="p-4 border border-[#EADBCE] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FAF6F0]/20">
                              <div className="flex items-center gap-3">
                                <img src={appt.barberImage} alt={appt.barberName} className="w-10 h-10 rounded-xl object-cover" />
                                <div>
                                  <h4 className="text-xs font-black text-[#3D3126]">{appt.service}</h4>
                                  <p className="text-[10px] text-[#8A7A6A] font-medium mt-0.5">Stylist: {appt.barberName} • Cost: ₹{appt.total}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold py-1.5 px-3 bg-white rounded-lg border border-[#EADBCE]">
                                <span className="flex items-center gap-1 font-mono text-[10px] text-[#B58B67]"><Clock size={11} /> {appt.date} @ {appt.time}</span>
                              </div>

                              <button 
                                onClick={() => handleCancelBooking(appt._id)}
                                className="px-3.5 py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right: Stamps Card */}
                    <div className="card p-6 bg-white shadow-xs border border-[#EADBCE] rounded-2xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-md font-black font-serif text-[#3D3126] tracking-tight">Fidelity Stamps</h3>
                        <p className="text-[11px] text-[#8A7A6A] font-medium mt-1">Earn a complimentary cut after 10 stamps</p>
                      </div>

                      <div className="grid grid-cols-5 gap-2 my-auto py-4">
                        {Array.from({ length: 10 }).map((_, i) => {
                          const isStamped = i < (profile.total_visits % 10);
                          return (
                            <div
                              key={i}
                              className={`aspect-square rounded-xl border flex items-center justify-center transition-all duration-300 ${
                                isStamped
                                  ? "bg-[#FEF9EE] border-[#B58B67] text-[#9E7452] scale-105 shadow-3xs"
                                  : "bg-stone-50 border-[#EADBCE] text-stone-300"
                              }`}
                            >
                              {isStamped ? (
                                <CheckCircle size={14} className="text-[#9E7452]" />
                              ) : (
                                <span className="text-[10px] font-mono font-bold">{i + 1}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2.5 border-t border-[#EADBCE] flex justify-between items-center text-xs">
                        <span className="text-[#8A7A6A] font-medium">Stamps Verified</span>
                        <span className="font-black text-[#9E7452]">{profile.total_visits % 10} / 10 stamps</span>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ── TAB: APPOINTMENTS REGISTRY ── */}
              {activeTab === "history" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-[#EADBCE] gap-4">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-wider text-[#3D3126]">Appointments Ledger</h2>
                      <p className="text-xs text-[#8A7A6A]">Browse active scheduled sessions and past grooming analytics.</p>
                    </div>

                    <div className="flex border border-[#EADBCE] rounded-xl overflow-hidden bg-white select-none shadow-3xs">
                      {["upcoming", "past"].map(sub => (
                        <button
                          key={sub}
                          onClick={() => setApptSubTab(sub)}
                          className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                            apptSubTab === sub 
                              ? "bg-[#3D3126] text-white" 
                              : "text-[#8A7A6A] hover:bg-[#FEF9EE] hover:text-[#3D3126]"
                          }`}
                        >
                          {sub === "upcoming" ? "Upcoming" : "Past Cut History"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {apptSubTab === "upcoming" ? (
                    /* UPCOMING RESERVATIONS */
                    <div className="space-y-4">
                      {upcomingAppts.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-[#EADBCE] rounded-2xl">
                          <Calendar size={28} className="mx-auto text-stone-200 mb-2" />
                          <p className="text-xs font-black uppercase tracking-wider text-[#8A7A6A]">No upcoming appointments scheduled</p>
                        </div>
                      ) : (
                        upcomingAppts.map(appt => (
                          <div key={appt._id} className="p-5 bg-white border border-[#EADBCE] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-3xs">
                            <div className="flex items-center gap-4">
                              <img src={appt.barberImage} alt={appt.barberName} className="w-12 h-12 rounded-xl object-cover border border-[#EADBCE] shadow-2xs" />
                              <div>
                                <span className="bg-[#FEF9EE] text-[#9E7452] border border-[#EADBCE] text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                  Scheduled Session
                                </span>
                                <h4 className="text-sm font-black text-[#3D3126] mt-2">{appt.service}</h4>
                                <p className="text-xs font-semibold text-[#8A7A6A] mt-0.5">Barber Stylist: {appt.barberName}</p>
                              </div>
                            </div>

                            <div className="flex gap-4 text-[#3D3126] text-xs font-bold py-2 px-4 bg-[#FAF6F0]/40 rounded-xl border border-[#EADBCE]">
                              <span className="flex items-center gap-1 font-sans"><Calendar size={13} className="text-[#B58B67]" /> {appt.date}</span>
                              <span className="flex items-center gap-1 font-sans"><Clock size={13} className="text-[#B58B67]" /> {appt.time}</span>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto shrink-0">
                              <button 
                                onClick={() => handleCancelBooking(appt._id)}
                                className="flex-1 md:flex-none px-4 py-2.5 bg-rose-50 text-rose-500 border border-rose-200 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-rose-100 transition-colors cursor-pointer"
                              >
                                Cancel Booking
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    /* PAST VISITS WITH COMPLETED BADGES MATCHING THE SCREENSHOT */
                    <div className="space-y-8">
                      
                      {completedAppts.length > 0 && (
                        <div className="bg-white border border-[#EADBCE] p-5 rounded-2xl shadow-3xs">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67] border-b pb-1.5 mb-3">Preferred Barber Frequency</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {getBarberFrequencies().map(f => (
                              <div key={f.name} className="p-4 bg-[#FAF6F0]/30 border border-[#EADBCE] rounded-xl flex items-center justify-between shadow-3xs">
                                <span className="text-xs font-bold text-[#3D3126]">{f.name}</span>
                                <span className="font-mono text-xs font-black bg-[#FEF9EE] text-[#9E7452] px-2 py-0.5 rounded border border-[#EADBCE]">
                                  Visited {f.count} times
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Past Visit Ledger Table */}
                      <div className="bg-white border border-[#EADBCE] rounded-2xl overflow-hidden shadow-xs">
                        {completedAppts.length === 0 ? (
                          <div className="text-center py-16">
                            <Scissors size={28} className="mx-auto text-stone-200 mb-2" />
                            <p className="text-xs font-black uppercase tracking-wider text-[#8A7A6A]">No past cutting history found</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-[#FAF6F0]/60 border-b border-[#EADBCE] text-[10px] font-black uppercase tracking-wider text-[#8A7A6A]">
                                  <th className="px-5 py-4">Stylist & Services</th>
                                  <th className="px-5 py-4">Date</th>
                                  <th className="px-5 py-4">Status</th>
                                  <th className="px-5 py-4 text-right">Review Feedback</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#F0E8DF]">
                                {completedAppts.map(appt => (
                                  <tr key={appt._id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                                    <td className="px-5 py-4">
                                      <div className="flex items-center gap-3">
                                        <img src={appt.barberImage} alt={appt.barberName} className="w-9 h-9 rounded-lg object-cover" />
                                        <div>
                                          <p className="font-bold text-[#3D3126]">{appt.service}</p>
                                          <p className="text-[9px] text-[#8A7A6A] font-medium mt-0.5">With {appt.barberName} • ₹{appt.total}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4 text-[#8A7A6A] font-sans font-semibold">{appt.date}</td>
                                    <td className="px-5 py-4">
                                      <span className="bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block">
                                        COMPLETED
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                      <button
                                        onClick={() => {
                                          setSelectedBarberForReview(appt.barberName);
                                          setShowReviewModal(true);
                                        }}
                                        className="px-3 py-1.5 border border-[#EADBCE] hover:bg-[#FEF9EE] rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer text-[#9E7452]"
                                      >
                                        Leave Review
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ── NEW TAB: GROOMING SERVICES MENU (DUMMY DATA UI FOR TESTING) ── */}
              {activeTab === "dummy_services" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-[#EADBCE] gap-4">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-wider text-[#3D3126]">Premium Grooming Catalog</h2>
                      <p className="text-xs text-[#8A7A6A]">Browse and search through all of our available salon options.</p>
                    </div>

                    <div className="flex border border-[#EADBCE] rounded-xl overflow-hidden bg-white select-none shadow-3xs">
                      {["All", "Men", "Addons"].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedServiceCategory(cat)}
                          className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                            selectedServiceCategory === cat 
                              ? "bg-[#3D3126] text-white" 
                              : "text-[#8A7A6A] hover:bg-[#FEF9EE] hover:text-[#3D3126]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search bar inside Dummy Services tab */}
                  <div className="relative flex items-center max-w-md shadow-3xs rounded-2xl bg-white border border-[#EADBCE] overflow-hidden">
                    <Search size={16} className="absolute left-4 text-[#8A7A6A]" />
                    <input 
                      type="text" 
                      placeholder="Search services..."
                      value={servicesSearch}
                      onChange={(e) => setServicesSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 text-xs outline-none bg-white text-[#3D3126] font-sans font-medium"
                    />
                  </div>

                  {/* Grid layout of all services */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredServices.length === 0 ? (
                      <div className="text-center py-12 col-span-full">
                        <ShoppingBag size={32} className="mx-auto text-stone-200 mb-2" />
                        <p className="text-xs font-black uppercase tracking-wider text-[#8A7A6A]">No matching services found</p>
                      </div>
                    ) : (
                      filteredServices.map(service => (
                        <div key={service.id} className="bg-white border border-[#EADBCE] rounded-2xl p-5 flex flex-col justify-between shadow-3xs hover:shadow-xs transition-shadow">
                          <div className="space-y-2">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                              service.category === "Men" ? "bg-amber-50 text-[#B06000]" : "bg-purple-50 text-purple-600"
                            }`}>
                              {service.category}
                            </span>
                            <h4 className="text-sm font-black text-[#3D3126] leading-snug">{service.name}</h4>
                            <p className="text-[10px] text-[#8A7A6A] leading-relaxed line-clamp-3 font-medium">{service.description}</p>
                          </div>

                          <div className="pt-4 border-t border-[#FAF6F0] flex justify-between items-center mt-4">
                            <div>
                              <p className="text-[8px] font-black uppercase text-stone-400 tracking-wider">Estimated Price</p>
                              <span className="font-mono text-xs font-black text-[#3D3126]">₹{service.price}</span>
                            </div>
                            <button
                              onClick={() => handleBookDummyService(service)}
                              className="px-3.5 py-1.5 bg-[#B58B67] hover:bg-[#9E7452] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB: MEMBERSHIP PERKS ── */}
              {activeTab === "membership" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-[#3D3126]">Fidelity Membership Systems</h2>
                    <p className="text-xs text-[#8A7A6A]">Verify active perks, renewal schedules, or upgrade tier benefits.</p>
                  </div>

                  <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    <div className="space-y-2">
                      <span className="bg-[#B58B67]/10 text-[#9E7452] text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-[#EADBCE]">
                        ACTIVE PERK SCHEDULE
                      </span>
                      <h3 className="text-2xl font-black font-serif text-[#3D3126] mt-2">
                        {profile.membership_tier} Membership Tier
                      </h3>
                      
                      <div className="text-xs text-[#8A7A6A] space-y-1 mt-3 font-medium">
                        {profile.membership_tier === "Standard" && (
                          <p>• Standard access to scheduling, basic stamps collection perks.</p>
                        )}
                        {profile.membership_tier === "VIP Bronze" && (
                          <p>• VIP Bronze: 1 Free Fade/month, 5% off styling products.</p>
                        )}
                        {profile.membership_tier === "VIP Gold" && (
                          <p>• VIP Gold: 2 Free Fades/month, 10% off products, custom priority slots.</p>
                        )}
                        
                        {profile.membership_renewal_date && (
                          <p className="font-bold text-[#3D3126] mt-2 font-mono text-[11px]">Renewal Date: {profile.membership_renewal_date}</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#FEF9EE] border border-[#EADBCE] rounded-2xl p-5 shrink-0 text-center shadow-3xs w-full md:w-auto">
                      <Award size={32} className="text-[#9E7452] mx-auto mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#8A7A6A]">Current Status</p>
                      <span className="inline-block mt-1 font-mono text-xs font-black text-[#9E7452] bg-[#FFFDF9] border border-[#EADBCE] px-3 py-1 rounded-full uppercase tracking-wider">
                        {profile.membership_tier} Tier
                      </span>
                    </div>
                  </div>

                  {/* MEMBERSHIPS UPSELL SECTION */}
                  {profile.membership_tier !== "VIP Gold" && (
                    <div className="bg-white border border-[#EADBCE] p-6 rounded-2xl shadow-xs">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67] border-b pb-1.5 mb-4 font-serif">
                        Upgrade Memberships
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Bronze Plan Upsell */}
                        {profile.membership_tier === "Standard" && (
                          <div className="p-5 border border-[#EADBCE] rounded-xl flex flex-col justify-between bg-[#FAF6F0]/20">
                            <div>
                              <h4 className="text-sm font-black text-[#3D3126]">VIP Bronze Plan</h4>
                              <p className="text-xs text-[#8A7A6A] mt-1">Unlock standard saves and free fades.</p>
                              <ul className="text-[10px] text-[#8A7A6A] space-y-1 mt-3">
                                <li>• 1 Free Fade monthly</li>
                                <li>• 5% off styling waxes</li>
                              </ul>
                            </div>
                            <button
                              onClick={() => handleUpgradeMembership("VIP Bronze")}
                              className="mt-4 w-full py-2 bg-[#B58B67] hover:bg-[#9E7452] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                            >
                              Upgrade to Bronze
                            </button>
                          </div>
                        )}

                        {/* Gold Plan Upsell */}
                        <div className="p-5 border border-[#B58B67] rounded-xl flex flex-col justify-between bg-[#FEF9EE]/30">
                          <div>
                            <span className="bg-[#B58B67] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">RECOMMENDED</span>
                            <h4 className="text-sm font-black text-[#3D3126] mt-1">VIP Gold Plan</h4>
                            <p className="text-xs text-[#8A7A6A] mt-1">Unmatched priority scheduling and premium savings.</p>
                            <ul className="text-[10px] text-[#8A7A6A] space-y-1 mt-3">
                              <li>• 2 Free Fades monthly</li>
                              <li>• 10% off styling waxes</li>
                              <li>• Priority booking menu</li>
                            </ul>
                          </div>
                          <button
                            onClick={() => handleUpgradeMembership("VIP Gold")}
                            className="mt-4 w-full py-2 bg-[#3D3126] hover:bg-[#4E443A] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Upgrade to Gold
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ── TAB: PROFILE & PREFERENCES ── */}
              {activeTab === "preferences" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-[#3D3126]">Personal Settings</h2>
                    <p className="text-xs text-[#8A7A6A]">Manage contact coordinates and custom alert preferences.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Panel: Profile Coordinates Form */}
                    <div className="bg-white border border-[#EADBCE] p-6 rounded-2xl shadow-xs lg:col-span-2 space-y-6">
                      <div className="flex justify-between items-center border-b border-[#EADBCE] pb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67]">Profile Coordinates</p>
                        <button
                          onClick={() => setIsEditingProfile(!isEditingProfile)}
                          className="text-[10px] font-black uppercase tracking-wider text-[#B58B67] hover:underline"
                        >
                          {isEditingProfile ? "Lock Details" : "Edit Profile"}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-1">Full Name</label>
                          <input 
                            disabled={!isEditingProfile}
                            value={profile.name}
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className={`w-full bg-[#FAF6F0]/60 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none text-[#3D3126] focus:border-[#B58B67] transition-all ${
                              !isEditingProfile ? "border-transparent opacity-80 cursor-not-allowed" : "border-[#EADBCE]"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-1">Mobile Number</label>
                          <input 
                            disabled={true}
                            value={profile.mobile}
                            className="w-full bg-[#FAF6F0]/40 border border-transparent rounded-xl px-4 py-2.5 text-xs font-bold font-mono outline-none text-[#3D3126] opacity-60 cursor-not-allowed"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-1">Email Address</label>
                          <input 
                            disabled={!isEditingProfile}
                            value={profile.email}
                            onChange={(e) => setProfile({...profile, email: e.target.value})}
                            className={`w-full bg-[#FAF6F0]/60 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none text-[#3D3126] focus:border-[#B58B67] transition-all ${
                              !isEditingProfile ? "border-transparent opacity-80 cursor-not-allowed" : "border-[#EADBCE]"
                            }`}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-1">Profile Picture URL</label>
                          <input 
                            disabled={!isEditingProfile}
                            value={profile.profile_picture}
                            onChange={(e) => setProfile({...profile, profile_picture: e.target.value})}
                            placeholder="https://images.unsplash.com/... or paste image link"
                            className={`w-full bg-[#FAF6F0]/60 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none text-[#3D3126] focus:border-[#B58B67] transition-all ${
                              !isEditingProfile ? "border-transparent opacity-80 cursor-not-allowed" : "border-[#EADBCE]"
                            }`}
                          />
                        </div>
                      </div>

                      {isEditingProfile && (
                        <button
                          onClick={handleSaveProfile}
                          className="px-6 py-2.5 bg-[#B58B67] hover:bg-[#9E7452] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Save size={12} /> Save Updates
                        </button>
                      )}
                    </div>

                    {/* Right Panel: Granular Notification Preference Toggles */}
                    <div className="bg-white border border-[#EADBCE] p-6 rounded-2xl shadow-xs space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67] border-b border-[#EADBCE] pb-2 mb-2">
                        System Notifications
                      </p>
                      
                      <div className="space-y-4">
                        
                        {/* Toggle 1: marketing_emails */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-bold text-[#3D3126]">Offer Promotions</h4>
                            <p className="text-[9px] text-[#8A7A6A] mt-0.5">Email alerts for special discounts and promotions.</p>
                          </div>
                          <button
                            onClick={() => {
                              setProfile(p => ({ ...p, marketing_emails: !p.marketing_emails }));
                              triggerToast("Updated preference.");
                            }}
                            className={`shrink-0 w-8 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${profile.marketing_emails ? "bg-[#B58B67]" : "bg-stone-200"}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile.marketing_emails ? "translate-x-3" : ""}`} />
                          </button>
                        </div>

                        {/* Toggle 2: monthly_reminders */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-bold text-[#3D3126]">Monthly Reminders</h4>
                            <p className="text-[9px] text-[#8A7A6A] mt-0.5">Rebook alert exactly one month after last cut completed.</p>
                          </div>
                          <button
                            onClick={() => {
                              setProfile(p => ({ ...p, monthly_reminders: !p.monthly_reminders }));
                              triggerToast("Updated preference.");
                            }}
                            className={`shrink-0 w-8 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${profile.monthly_reminders ? "bg-[#B58B67]" : "bg-stone-200"}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile.monthly_reminders ? "translate-x-3" : ""}`} />
                          </button>
                        </div>

                        {/* Toggle 3: new_services_alerts */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-bold text-[#3D3126]">New Launch Announcements</h4>
                            <p className="text-[9px] text-[#8A7A6A] mt-0.5">Alerts when new services are published by Admin.</p>
                          </div>
                          <button
                            onClick={() => {
                              setProfile(p => ({ ...p, new_services_alerts: !p.new_services_alerts }));
                              triggerToast("Updated preference.");
                            }}
                            className={`shrink-0 w-8 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${profile.new_services_alerts ? "bg-[#B58B67]" : "bg-stone-200"}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile.new_services_alerts ? "translate-x-3" : ""}`} />
                          </button>
                        </div>

                        {/* Toggle 4: newsletter_opt_in */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-bold text-[#3D3126]">Weekly Newsletter</h4>
                            <p className="text-[9px] text-[#8A7A6A] mt-0.5">Subscribed to receive updates and news from home footer.</p>
                          </div>
                          <button
                            onClick={() => {
                              setProfile(p => ({ ...p, newsletter_opt_in: !p.newsletter_opt_in }));
                              triggerToast("Updated preference.");
                            }}
                            className={`shrink-0 w-8 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${profile.newsletter_opt_in ? "bg-[#B58B67]" : "bg-stone-200"}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile.newsletter_opt_in ? "translate-x-3" : ""}`} />
                          </button>
                        </div>

                      </div>

                      <button
                        onClick={handleSaveProfile}
                        className="w-full mt-4 py-2.5 bg-[#3D3126] hover:bg-[#4E443A] text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Save Preferences
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* ── TAB: LIVE SYSTEM ALERTS ── */}
              {activeTab === "alerts" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                  <div className="flex justify-between items-center border-b pb-4 border-[#EADBCE]">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-wider text-[#3D3126]">System Alerts Feed</h2>
                      <p className="text-xs text-[#8A7A6A]">Real-time reminders, status confirms, and general announcements.</p>
                    </div>
                    <button
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, read: true })));
                        triggerToast("All alerts marked as read!");
                      }}
                      className="px-4 py-2 bg-[#FAF6F0] hover:bg-stone-100 rounded-xl text-[9px] font-black uppercase tracking-wider text-[#B58B67] border border-[#EADBCE] cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div 
                        key={n.id}
                        className={`p-4 rounded-2xl border transition-all flex gap-4 ${n.read ? "bg-white border-[#EADBCE]/60 opacity-80" : "bg-white border-[#B58B67] shadow-3xs"}`}
                      >
                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${n.type === "status" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                          {n.type === "status" ? <CheckCircle size={18} /> : <Sparkles size={18} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-black text-[#3D3126]">{n.title}</h4>
                            <span className="text-[8px] text-[#8A7A6A] font-mono">{n.date}</span>
                          </div>
                          <p className="text-[10px] text-[#8A7A6A] mt-1.5 leading-relaxed">{n.message}</p>
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
            />
            <motion.form 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onSubmit={handleSubmitReview} 
              className="relative bg-[#FFFBF2] border border-[#EAD8C0] w-full max-w-md rounded-[2rem] p-6 shadow-2xl z-10 text-left space-y-6"
            >
              <div className="flex justify-between items-center border-b pb-3 border-[#EADBCE]">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-[#3D3126]">
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
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
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
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-2">Write Review Message</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Tell us about the styling speed, cut precision..."
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm({...reviewForm, feedback: e.target.value})}
                  className="w-full bg-white border border-[#EAD8C0] rounded-2xl px-4 py-3 text-xs font-medium outline-none text-[#3D3126] focus:border-[#C5A059]"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 text-[#FFFBF2] font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all duration-200 hover:opacity-95 cursor-pointer bg-[#3D3126]"
              >
                Submit Feedback
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* ── STUNNING GROOMING VIDEO MODAL ── */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVideoModal(false)} 
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-[#EADBCE]/30 bg-black shadow-2xl z-10 text-left"
            >
              <div className="absolute top-4 right-4 z-20">
                <button 
                  type="button"
                  onClick={() => setShowVideoModal(false)} 
                  className="p-2 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#B58B67] cursor-pointer transition-colors border border-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Aspect Ratio Container for Responsive Video */}
              <div className="aspect-video w-full">
                <iframe 
                  src="https://www.youtube.com/embed/5a2d3dD3cSc?autoplay=1&rel=0&modestbranding=1" 
                  title="BarberPro Styling & Grooming Guide"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                />
              </div>
              
              <div className="bg-[#FFFDF9] p-5 border-t border-[#EADBCE]">
                <h3 className="text-md font-black font-serif text-[#3D3126]">BarberPro Premium Styling & Grooming Guide</h3>
                <p className="text-[11px] text-[#8A7A6A] font-medium mt-1 leading-relaxed">
                  Discover professional advice on maintaining your taper fades, beard styling with essential nourishing oils, and selecting your signature cut structure. Book a seat to consult our master stylists for a personalized analysis!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION STACK */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-50 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl flex items-center gap-2.5 ${
              toast.type === "error" ? "bg-red-900 border border-red-700" : "bg-[#3D3126] border border-[#B58B67]/30"
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