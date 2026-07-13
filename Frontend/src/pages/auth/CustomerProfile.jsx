import React, { useState, useEffect, useRef } from "react";
import { 
  Scissors, User, Mail, Phone, Plus, Trash2, X, 
  Calendar, Clock, Award, Image, ChevronRight, ChevronLeft, ArrowLeft, Save,
  Bell, CheckCircle, ShieldAlert, Sparkles, LogOut, CheckSquare, 
  Square, Edit3, Settings, Gift, List, Heart, CalendarPlus, Star,
  RefreshCw, Play, Search, ShoppingBag, Compass, HelpCircle, LifeBuoy,
  Upload, Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NearbyBarbers from "../../components/queue/NearbyBarbers";
import barberBookingVideo from "../../assets/barber_booking.mp4";

const GOLD = "#B58B67";
const GOLD_LIGHT = "#FEF9EE";
const GOLD_BORDER = "#EADBCE";
const BG_WARM = "#FAF6F0";
const CHARCOAL = "#3D3126";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

const BARBER_IMAGES = {
  "john": "https://i.pinimg.com/1200x/8d/21/29/8d2129c8a618f113eb8aa2bc596b1658.jpg",
  "mike": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400",
  "alex": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400",
  "james": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  "ravi": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  "ali": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
  "nitin": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
  "varsha": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  "piyush": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
  "vansh": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400",
  "ajay": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
  "rahul": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80",
};

const getBarberImage = (name) => {
  if (!name) return null;
  const lowercaseName = name.toLowerCase();
  for (const [key, value] of Object.entries(BARBER_IMAGES)) {
    if (lowercaseName.includes(key)) {
      return value;
    }
  }
  return null;
};

const BarberAvatar = ({ name, photo, sizeClass = "w-12 h-12", iconSize = 20 }) => {
  const imgUrl = photo || getBarberImage(name);
  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={name}
        className={`${sizeClass} aspect-square rounded-xl object-cover border border-[#EADBCE] shadow-2xs shrink-0`}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-xl bg-[#FEF9EE] border border-[#EADBCE] shadow-2xs flex items-center justify-center text-[#B58B67] shrink-0`}>
      <User size={iconSize} />
    </div>
  );
};

const LiveVisualQueue = ({ activeQueue }) => {
  const peopleAhead = activeQueue.peopleAhead || 0;
  const status = activeQueue.status;

  return (
    <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-2xs text-left overflow-hidden">
      <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-4 font-sans">
        Live Queue Visualizer
      </h4>
      
      <div className="relative flex items-center justify-start gap-6 py-8 px-4 overflow-x-auto min-h-[140px] bg-[#FAF6F0]/50 rounded-2xl border border-[#FAF6F0] scrollbar-thin">
        {/* Styling Chair Area (Target Spot) */}
        <div className="flex flex-col items-center shrink-0 relative z-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
            status === "in-progress" 
              ? "bg-[#B58B67] border-[#B58B67] text-white shadow-[0_0_20px_rgba(181,139,103,0.4)]" 
              : "bg-white border-[#EADBCE] text-[#B58B67]"
          }`}>
            <motion.div
              animate={status === "in-progress" ? { rotate: [0, -10, 10, -10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Scissors size={28} />
            </motion.div>
          </div>
          <span className="text-[10px] font-black uppercase mt-2 text-[#3D3126]">
            {status === "in-progress" ? "You're In Chair" : "Styling Chair"}
          </span>
          <span className="text-[9px] text-[#8A7A6A] leading-none mt-1">
            {status === "in-progress" ? "Active Session" : "Being Served"}
          </span>
        </div>

        {/* Connecting dotted line */}
        <div className="absolute left-20 right-10 h-0.5 border-t-2 border-dashed border-[#EADBCE] top-[60px] -z-0" />

        {/* Queue line items */}
        <div className="flex items-center gap-10 pl-6 z-10 relative">
          <AnimatePresence>
            {/* If someone else is in the chair and we are waiting, render a placeholder person representing 'Current Client' */}
            {status !== "in-progress" && activeQueue.chairOccupied && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center shrink-0"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-500">
                  <User size={18} />
                </div>
                <span className="text-[9px] font-bold text-stone-500 mt-2">Active Client</span>
                <span className="text-[8px] text-stone-400">In Chair</span>
              </motion.div>
            )}

            {/* People Ahead list */}
            {Array.from({ length: peopleAhead }).map((_, idx) => (
              <motion.div
                key={`ahead-${idx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center shrink-0"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FEF9EE] border border-[#EADBCE] flex items-center justify-center text-[#B58B67] relative">
                  <User size={18} />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#B58B67] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-stone-600 mt-2">Client Ahead</span>
                <span className="text-[8px] text-[#8A7A6A]">Waiting</span>
              </motion.div>
            ))}

            {/* YOU (Customer themselves) */}
            {status !== "in-progress" && (
              <motion.div
                key="customer-self"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1.05,
                  y: [0, -4, 0]
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                  scale: { duration: 0.3 }
                }}
                className="flex flex-col items-center shrink-0"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#B58B67] border-2 border-white text-white flex items-center justify-center shadow-[0_4px_12px_rgba(181,139,103,0.3)] relative ring-2 ring-[#B58B67]/40">
                  <User size={22} className="text-white" />
                  <span className="absolute -top-2 bg-emerald-500 text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full border border-white tracking-wider">
                    YOU
                  </span>
                </div>
                <span className="text-[10px] font-black text-[#B58B67] mt-2 font-sans">Your Turn</span>
                <span className="text-[8px] text-[#8A7A6A] font-bold uppercase tracking-wider">
                  Pos #{activeQueue.position}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeQueue, setActiveQueue] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Auto-poll active queue status when queue tab is open
  useEffect(() => {
    let intervalId;
    if (activeTab === "queue") {
      // Poll every 15 seconds
      intervalId = setInterval(() => {
        syncData();
      }, 15000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedApptDetails, setSelectedApptDetails] = useState(null);
  const [stamps, setStamps] = useState(0);
  const [unusedRewards, setUnusedRewards] = useState(0);

  const [profile, setProfile] = useState({
    name: "Rahul Jagtap",
    mobile: "9876543210",
    email: "rahul@example.com",
    profile_picture: "",
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
      salonName: "The Royal Blade",
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
      salonName: "The Royal Blade",
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
  const [dbNotifications, setDbNotifications] = useState([]);

  useEffect(() => {
    compileNotifications(profile, appointments, dbNotifications, stamps);
  }, [profile.marketing_emails, profile.monthly_reminders, profile.new_services_alerts, profile.newsletter_opt_in]);

  const [dummyServices] = useState([
    { id: "s1", name: "Classic Haircut", description: "Standard scissor and clipper cutting, tailored to your head structure.", price: 400, category: "Men", duration: "30 min" },
    { id: "s2", name: "Taper Fade & Trim", description: "High-precision bald or shadow taper fade with line-up styling.", price: 500, category: "Men", duration: "40 min" },
    { id: "s3", name: "Beard Sculpting & Oil", description: "Hot towel lineup, custom beard trimming, and premium beard oil massage.", price: 250, category: "Men", duration: "25 min" },
    { id: "s4", name: "Luxury Hot Stone Shave", description: "Infused hot towels, straight-razor close shave, and stone facial calming.", price: 600, category: "Men", duration: "45 min" },
    { id: "s9", name: "Layer Cut & Styling", description: "Modern layers haircut completed with a premium blow dry and styling session.", price: 700, category: "Women", duration: "45 min" },
    { id: "s10", name: "Global Hair Coloring", description: "Premium ammonia-free permanent color transformation for rich shine.", price: 1800, category: "Women", duration: "90 min" },
    { id: "s5", name: "Charcoal Face Mask", description: "Deep cleansing mask that removes oil, toxins, and blackheads instantly.", price: 300, category: "Addons", duration: "20 min" },
    { id: "s6", name: "Organic Hair Color", description: "Scalp-friendly, Ammonia-free coloring to refresh or change your style.", price: 1200, category: "Men", duration: "60 min" },
    { id: "s7", name: "Royal Head Massage", description: "Relaxing 20-minute coconut or almond oil head massage to relieve stress.", price: 350, category: "Addons", duration: "20 min" },
    { id: "s8", name: "Deep Conditioning Shampoo", description: "Premium wash, keratin styling treatment, and hair dryer blowout.", price: 200, category: "Addons", duration: "15 min" },
  ]);

  const [servicesSearch, setServicesSearch] = useState("");
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("All");
  const [apptSubTab, setApptSubTab] = useState("upcoming");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBarberForReview, setSelectedBarberForReview] = useState("");
  const [reviewForm, setReviewForm] = useState({ rating: 5, feedback: "" });
  const [newMember, setNewMember] = useState({ name: "", relation: "Son", age: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [supportTickets, setSupportTickets] = useState([
    { id: "1", subject: "Refund for cancelled booking", category: "Payment", message: "UPI transaction failed, but amount debited from account.", status: "Resolved", date: "2026-06-05" },
    { id: "2", subject: "Stylist Ajay not available", category: "Booking", message: "Cannot select Ajay Barber for haircut booking slots.", status: "In Progress", date: "2026-06-08" }
  ]);

  const [incomingBarberNotification, setIncomingBarberNotification] = useState(null);
  const shownNotifIdsRef = useRef(new Set());

  const dismissBarberNotification = async () => {
    if (incomingBarberNotification) {
      const token = getToken();
      if (token) {
        try {
          await fetch(`${API}/auth/notifications/mark-read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
          });
          syncData();
        } catch (e) {
          console.error(e);
        }
      }
      setIncomingBarberNotification(null);
    }
  };

  const triggerToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getLocalTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatLocalDate = (dateVal) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const compileNotifications = (uProfile, uAppts, dbNotifs = [], stampsCount = 0) => {
    const list = [...dbNotifs];
    let idCounter = list.length > 0 ? Math.max(...list.map(l => typeof l.id === 'number' ? l.id : 0)) + 1 : 1;
    if (isNaN(idCounter) || idCounter === -Infinity || idCounter === Infinity) idCounter = 1;

    const todayStr = getLocalTodayStr();
    const upcoming = uAppts.filter(a => {
      const s = String(a.status || "").toLowerCase();
      const isStatusUpcoming = s === "upcoming" || s === "pending" || s === "confirmed" || s === "in-progress";
      if (!isStatusUpcoming) return false;
      if (a.date && a.date < todayStr) return false;
      return true;
    });
    if (upcoming.length > 0) {
      list.push({ id: idCounter++, type: "status", title: "Booking Active", message: `Your appointment for ${upcoming[0].service} with ${upcoming[0].barberName} is scheduled for ${upcoming[0].date} at ${upcoming[0].time}.`, date: "Active", read: false });
    } else {
      if (uProfile.monthly_reminders !== false) {
        list.push({ id: idCounter++, type: "announcement", title: "Ready to Refresh?", message: "No active appointment scheduled. Browse our Premium Grooming Catalog and secure a booking slot today!", date: "Now", read: false });
      }
    }
    if (stampsCount > 0) {
      list.push({ id: idCounter++, type: "status", title: "Fidelity Stamps Verified", message: `You have successfully gathered ${stampsCount} fidelity stamp${stampsCount > 1 ? 's' : ''}! Only ${10 - stampsCount} more sessions until your 10% discount reward.`, date: "Updated", read: false });
    }
    if (uProfile.marketing_emails !== false) {
      list.push({ id: idCounter++, type: "announcement", title: "Festive Discount Active", message: "Special styling discount: 15% off all premium haircut packages and styling treatments this weekend!", date: "1 day ago", read: false });
    }
    setNotifications(prev => {
      const readMap = {};
      prev.forEach(n => { if (n.read) readMap[n.id || n.title] = true; });
      return list.map(item => ({ ...item, read: item.read || readMap[item.id || item.title] || false }));
    });
  };

  const syncData = async () => {
    const token = getToken();
    setLoading(true);
    let currentProfile = { ...profile };
    let currentAppts = [...appointments];
    let dbNotifs = [];
    let calculatedStamps = 0;
    if (!token) {
      const activeBookings = currentAppts.filter(a => 
        a.status === "Completed" || a.status === "Confirmed" || a.status === "Pending" || a.status === "In-progress"
      );
      const usedRewardsCount = activeBookings.filter(a => a.promoCode === "LOYAL10").length;
      const paidVisitsCount = activeBookings.filter(a => a.promoCode !== "LOYAL10").length;
      calculatedStamps = paidVisitsCount % 10;
      setStamps(calculatedStamps);
      setUnusedRewards(Math.max(0, Math.floor(paidVisitsCount / 10) - usedRewardsCount));

      compileNotifications(currentProfile, currentAppts, dbNotifs, calculatedStamps);
      setLoading(false);
      return;
    }
    try {
      const profileRes = await fetch(`${API}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
      const profileData = await profileRes.json();
      if (profileData.success && profileData.user) {
        const u = profileData.user;
        currentProfile = {
          name: u.name || "", mobile: u.mobile || "", email: u.email || "",
          profile_picture: u.profile_picture || "",
          total_visits: u.total_visits ?? 0,
          marketing_emails: u.marketing_emails ?? true, monthly_reminders: u.monthly_reminders ?? true,
          new_services_alerts: u.new_services_alerts ?? true, newsletter_opt_in: u.newsletter_opt_in ?? true,
        };
        setProfile(currentProfile);
        if (u.family_members) setFamily(u.family_members);
      }
      const bookingsRes = await fetch(`${API}/booking/my`, { headers: { Authorization: `Bearer ${token}` } });
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success && bookingsData.bookings) {
        currentAppts = bookingsData.bookings.map(b => ({
          _id: b._id,
          service: b.services?.[0]?.service_name || "Custom Haircut",
          barberName: b.barber_id?.name || "Barber Ajay",
          salonName: b.salon_id?.salon_name || "The Royal Blade",
          barberImage: b.barber_id?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
          barberPhoto: b.barber_id?.photo || "",
          date: b.slot_time ? formatLocalDate(b.slot_time) : formatLocalDate(b.created_at),
          time: b.slot_time ? new Date(b.slot_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "10:30 AM",
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
          servicesList: b.services?.map(s => ({ name: s.service_name, price: s.price, member_name: s.member_name })) || [{ name: "Custom Haircut", price: 400, member_name: "Self" }],
          total: b.total_amount || 400, paymentMethod: "Razorpay Secure",
          styleNotes: b.notes || "Standard clean fade cut.",
          promoCode: b.promo_code || ""
        }));
        setAppointments(currentAppts);

        const activeBookings = currentAppts.filter(a => 
          a.status === "Completed" || a.status === "Confirmed" || a.status === "Pending" || a.status === "In-progress"
        );
        const usedRewardsCount = activeBookings.filter(a => a.promoCode === "LOYAL10").length;
        const paidVisitsCount = activeBookings.filter(a => a.promoCode !== "LOYAL10").length;

        calculatedStamps = paidVisitsCount % 10;
        const calculatedEarned = Math.floor(paidVisitsCount / 10);
        const calculatedUnused = Math.max(0, calculatedEarned - usedRewardsCount);

        setStamps(calculatedStamps);
        setUnusedRewards(calculatedUnused);

        const completedVisits = activeBookings.length;
        if (completedVisits !== (profileData.user.total_visits || 0)) {
          currentProfile.total_visits = completedVisits;
          setProfile({ ...currentProfile });
          await fetch(`${API}/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ total_visits: completedVisits }) });
        }
      }
      const notifRes = await fetch(`${API}/auth/notifications`, { headers: { Authorization: `Bearer ${token}` } });
      const notifData = await notifRes.json();
      if (notifData.success && notifData.notifications) {
        dbNotifs = notifData.notifications.map(n => ({
          id: n._id,
          type: n.type || "status",
          title: n.title,
          message: n.message,
          date: new Date(n.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " " + new Date(n.created_at).toLocaleDateString("en-IN"),
          read: n.read
        }));
        setDbNotifications(dbNotifs);

        // Find any unread barber/queue_turn notifications
        const unreadQueueTurn = notifData.notifications.find(n => 
          !n.read && 
          (n.type === "queue_turn" || n.type === "queue_update" || 
           n.title.toLowerCase().includes("beginning") || 
           n.message.toLowerCase().includes("salon") || 
           n.message.toLowerCase().includes("station"))
        );
        
        if (unreadQueueTurn && !shownNotifIdsRef.current.has(unreadQueueTurn._id)) {
          shownNotifIdsRef.current.add(unreadQueueTurn._id);
          setIncomingBarberNotification({
            id: unreadQueueTurn._id,
            title: unreadQueueTurn.title,
            message: unreadQueueTurn.message
          });
        }
      }

      const queueRes = await fetch(`${API}/queue/customer/active`, { headers: { Authorization: `Bearer ${token}` } });
      const queueData = await queueRes.json();
      if (queueData.success && queueData.active && queueData.queue) {
        setActiveQueue(queueData.queue);
      } else {
        setActiveQueue(null);
      }
    } catch (err) {
      console.log("Offline local data fallback active.", err.message);
    } finally {
      compileNotifications(currentProfile, currentAppts, dbNotifs, calculatedStamps);
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
    const interval = setInterval(syncData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleNewsletter = async () => {
    const newVal = !profile.newsletter_opt_in;
    setProfile({ ...profile, newsletter_opt_in: newVal });
    triggerToast(newVal ? "Subscribed to newsletter!" : "Unsubscribed from newsletter!");
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API}/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ newsletter_opt_in: newVal }) });
      } catch (err) { console.error(err); }
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    triggerToast("All alerts marked as read!");
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API}/auth/notifications/mark-read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to mark notifications read:", err);
      }
    }
  };

  const handleSaveProfile = async () => {
    setIsEditingProfile(false);
    const token = getToken();
    if (!token) { triggerToast("Profile revisions saved locally!"); return; }
    try {
      const res = await fetch(`${API}/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(profile) });
      const data = await res.json();
      if (data.success) { triggerToast("Profile & Preferences updated successfully!"); syncData(); }
      else triggerToast(data.message || "Failed to update profile", "error");
    } catch { triggerToast("Network error. Could not connect to pipeline.", "error"); }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast("Please upload an image file only.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target.result;
      setProfile(p => ({ ...p, profile_picture: base64 }));
      triggerToast("Image loaded successfully from computer!");
    };
    reader.onerror = () => {
      triggerToast("Failed to read image file.", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleAddFamilyMember = async (e) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.age) { triggerToast("Please fill in all member fields.", "error"); return; }
    const token = getToken();
    if (!token) {
      setFamily([...family, { _id: Date.now().toString(), ...newMember }]);
      setNewMember({ name: "", relation: "Son", age: "" }); setShowAddFamily(false);
      triggerToast("Dependent linked locally!"); return;
    }
    try {
      const res = await fetch(`${API}/auth/family-member`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(newMember) });
      const data = await res.json();
      if (data.success) { triggerToast(`${newMember.name} linked successfully!`); setNewMember({ name: "", relation: "Son", age: "" }); setShowAddFamily(false); syncData(); }
      else triggerToast(data.message || "Failed to link member", "error");
    } catch { triggerToast("Network error. Added locally.", "error"); }
  };

  const handleRemoveMember = async (id) => {
    const token = getToken();
    if (!token) { setFamily(family.filter(m => m._id !== id)); triggerToast("Member unlinked locally."); return; }
    try {
      const res = await fetch(`${API}/auth/family-member/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) { triggerToast("Member unlinked successfully!"); syncData(); }
      else triggerToast(data.message || "Failed to remove member", "error");
    } catch { triggerToast("Network error. Removed locally.", "error"); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = getToken();
    const payload = { barber_id: null, salon_rating: reviewForm.rating, barber_rating: reviewForm.rating, review_text: reviewForm.feedback };
    if (token) {
      try { await fetch(`${API}/review`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }); } catch (err) {}
    }
    setShowReviewModal(false); setReviewForm({ rating: 5, feedback: "" });
    triggerToast("Feedback received! Review confirmed.");
  };

  const handleCancelBooking = (id) => {
    window.location.href = `/customer/refund/${id}`;
  };



  const handleLogout = () => {
    localStorage.clear(); triggerToast("Signing out of system console...");
    setTimeout(() => { window.location.href = "/login"; }, 1200);
  };

  const handleBookDummyService = (service) => {
    const salonId = localStorage.getItem("selectedSalonId");
    if (!salonId) {
      triggerToast("Please select a studio/salon first!");
      setTimeout(() => { navigate("/nearby"); }, 1000);
      return;
    }
    triggerToast(`Initiating booking for ${service.name}...`);
    const serviceObj = {
      id: service.id,
      _id: service.id,
      name: service.name,
      price: service.price,
      description: service.description
    };
    setTimeout(() => {
      navigate("/customer/barber", { state: { service: serviceObj } });
    }, 1200);
  };

  const upcomingAppts = appointments.filter(a => {
    const s = String(a.status || "").toLowerCase();
    const isStatusUpcoming = s === "upcoming" || s === "pending" || s === "confirmed" || s === "in-progress";
    if (!isStatusUpcoming) return false;
    if (a.date) {
      const todayStr = getLocalTodayStr();
      if (a.date < todayStr) return false;
    }
    return true;
  });
  const completedAppts = appointments.filter(a => String(a.status || "").toLowerCase() === "completed");

  const getBarberFrequencies = () => {
    const counts = {};
    completedAppts.forEach(a => { counts[a.barberName] = (counts[a.barberName] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  const getDynamicQueueTimes = () => {
    if (!activeQueue) return { enteredAt: "", estimatedTurn: "", timeRemaining: 0 };

    const now = new Date();
    const isSlot = activeQueue.booking?.booking_type === "slot" || !!activeQueue.booking?.slot_time;
    
    let enteredAt = "";
    let estimatedTurnDate = null;
    let timeRemaining = 0;

    if (isSlot && activeQueue.booking?.slot_time) {
      enteredAt = new Date(activeQueue.joined_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      estimatedTurnDate = new Date(activeQueue.booking.slot_time);
      const diffMs = estimatedTurnDate.getTime() - now.getTime();
      timeRemaining = Math.ceil(diffMs / 60000);
      
      if (timeRemaining < 0) {
        if (activeQueue.status === "in-progress") {
          timeRemaining = 0;
        } else {
          timeRemaining = Math.max(10, activeQueue.estimated_wait || (activeQueue.position * 20));
        }
      }
    } else {
      enteredAt = new Date(activeQueue.joined_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      const originalTurnMs = new Date(activeQueue.joined_at).getTime() + (activeQueue.estimated_wait || 20) * 60000;
      estimatedTurnDate = new Date(originalTurnMs);
      const diffMs = originalTurnMs - now.getTime();
      timeRemaining = Math.ceil(diffMs / 60000);
      
      if (timeRemaining < 0) {
        if (activeQueue.status === "in-progress") {
          timeRemaining = 0;
        } else {
          timeRemaining = Math.max(10, activeQueue.estimated_wait || (activeQueue.position * 20));
        }
      }
    }

    if (activeQueue.status !== "in-progress" && now.getTime() > estimatedTurnDate.getTime()) {
      estimatedTurnDate = new Date(now.getTime() + timeRemaining * 60000);
    }

    const estimatedTurn = estimatedTurnDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    return {
      enteredAt,
      estimatedTurn,
      timeRemaining
    };
  };

  const dynamicQueue = getDynamicQueueTimes();

  const filteredServices = dummyServices.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(servicesSearch.toLowerCase()) || s.description.toLowerCase().includes(servicesSearch.toLowerCase());
    const matchesCategory = selectedServiceCategory === "All" || s.category === selectedServiceCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="h-screen bg-[#FAF6F0] flex flex-col font-sans text-[#1C1917] transition-colors duration-300 overflow-hidden">
        <div className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col xl:flex-row h-full overflow-hidden">

          {/* Backdrop Overlay for mobile drawer */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[9998] xl:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* ── LEFT SIDEBAR ── */}
          <aside className={`fixed inset-y-0 left-0 w-64 bg-[#FFFFFF] text-[#1C1917] flex flex-col min-h-screen border-r border-[#E7E5E4] p-5 justify-between shadow-2xl z-[9999] transition-transform duration-300 xl:static xl:translate-x-0 xl:flex xl:shadow-2xs ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="space-y-6">
              <div className="px-1 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FDF9F3] flex items-center justify-center text-[#C5A059] shrink-0 border border-[#E7E5E4]">
                    <Scissors size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#78716C] leading-none">Client Console</p>
                    <p className="text-[15px] font-bold text-[#1C1917] tracking-tight font-serif mt-1 leading-tight">Barber Pro</p>
                  </div>
                </div>
                {/* Close Button on mobile */}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 xl:hidden cursor-pointer border-none bg-transparent"
                  title="Close navigation menu"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-0.5 text-left px-1">
                <p className="px-3 text-[9px] font-bold text-[#78716C] uppercase tracking-[0.18em] mb-2.5">Navigation</p>
                {[
                  { id: "overview", label: "Dashboard Hub", icon: Sparkles },
                  { id: "queue", label: "Live Queue Tracker", icon: Clock },
                  { id: "studios", label: "Our Studios", icon: Compass },
                  { id: "history", label: "Appointments Registry", icon: Calendar },
                  { id: "preferences", label: "Profile Settings", icon: User },
                  { id: "alerts", label: "Live System Alerts", icon: Bell, count: notifications.filter(n => !n.read).length },
                  { id: "homepage", label: "Return to Homepage", icon: Home, action: () => navigate("/home") }
                ].map(item => {
                  const isActive = activeTab === item.id;
                  const handleClick = item.action || (() => { setActiveTab(item.id); setIsSidebarOpen(false); });
                  return (
                    <button
                      key={item.id}
                      onClick={handleClick}
                      className={`w-full flex items-center justify-between gap-[10px] px-3 py-2.5 rounded-lg text-[13px] transition-all duration-200 group cursor-pointer border-none outline-none ${
                        isActive ? 'bg-[#FDF9F3] text-[#C5A059] font-semibold border-l-3 border-[#C5A059]' : 'text-[#78716C] hover:bg-[#FAF6F0] hover:text-[#1C1917] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-[10px]">
                        <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={`shrink-0 transition-colors ${isActive ? 'text-[#C5A059]' : 'text-[#78716C] group-hover:text-[#1C1917]'}`} />
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

            <div className="pt-4 border-t border-[#E7E5E4] space-y-1">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  const salonId = localStorage.getItem("selectedSalonId");
                  if (salonId) {
                    navigate("/customer/services");
                  } else {
                    navigate("/nearby");
                  }
                }}
                className="w-full bg-[#C5A059] hover:opacity-95 text-white rounded-lg py-2.5 text-[11px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-none outline-none font-sans"
              >
                <Scissors size={13} strokeWidth={2.5} /> Book Appointment
              </button>
              <button
                onClick={() => { setIsSidebarOpen(false); handleLogout(); }}
                className="w-full bg-transparent hover:bg-[#FEF2F2] text-[#DC2626] rounded-lg py-2.5 text-[13px] font-medium transition-all duration-200 flex items-center justify-center gap-[10px] cursor-pointer border-none outline-none font-sans pl-3 text-left group"
              >
                <LogOut size={16} className="text-[#DC2626] shrink-0" />
                <span>Sign Out Console</span>
              </button>
            </div>
          </aside>

          {/* ── RIGHT DYNAMIC CANVAS ── */}
          <main className="flex-1 flex flex-col bg-[#FAF6F0] overflow-auto">

            {/* ── HEADER ── */}
            <header className="bg-[#FFFDF9] border-b border-[#EADBCE] px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between sticky top-0 z-30 text-left shrink-0 shadow-2xs">
              <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
                {/* Hamburger menu button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 rounded-xl text-[#3D3126] hover:bg-[#FAF6F0] xl:hidden cursor-pointer border-none bg-transparent flex items-center justify-center shrink-0"
                  title="Open navigation menu"
                >
                  <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>

                <div className="flex flex-col justify-center min-w-0">
                  {/* ✅ FIX: NearbyBarbers removed from h1 — only text titles here */}
                  <h1 className="text-lg sm:text-2xl font-black font-serif text-[#3D3126] leading-tight truncate">
                    {activeTab === "overview" && "Dashboard"}
                    {activeTab === "queue" && "Live Queue Tracker"}
                    {activeTab === "studios" && "Our Studios"}
                    {activeTab === "history" && "Appointments Registry"}
                    {activeTab === "membership" && "Membership Perks"}
                    {activeTab === "preferences" && "Profile Settings"}
                    {activeTab === "alerts" && "Live System Alerts"}
                  </h1>
                  <p className="text-[10px] sm:text-xs text-[#8A7A6A] mt-0.5 sm:mt-1.5 truncate max-w-[120px] sm:max-w-none">Welcome back, {profile.name}!</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                <span className="hidden md:block text-[11px] font-black uppercase text-[#8A7A6A] tracking-wider font-mono">
                  {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </span>
                <button
                  onClick={syncData}
                  className="relative p-2 sm:px-4 sm:py-2 rounded-full border border-[#EADBCE] bg-white hover:bg-[#FEF9EE] text-[#9E7452] transition-all duration-300 flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-3xs hover:scale-105"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">Refresh</span>
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
                          </div>
                          <div className="space-y-1">
                            <button onClick={() => { setActiveTab("preferences"); setShowUserDropdown(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase text-[#8A7A6A] hover:bg-[#FAF6F0] hover:text-[#3D3126] transition-colors cursor-pointer text-left">
                              <Settings size={13} className="text-[#B58B67]" /><span>Profile Settings</span>
                            </button>
                            <button onClick={() => { setActiveTab("alerts"); setShowUserDropdown(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase text-[#8A7A6A] hover:bg-[#FAF6F0] hover:text-[#3D3126] transition-colors cursor-pointer text-left">
                              <Bell size={13} className="text-[#B58B67]" /><span>System Alerts</span>
                            </button>
                          </div>
                          <div className="border-t border-[#EADBCE] pt-2.5 mt-2.5">
                            <button onClick={() => { handleLogout(); setShowUserDropdown(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left">
                              <LogOut size={13} /><span>Sign Out Console</span>
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

              {/* TAB: LIVE QUEUE TRACKER */}
              {activeTab === "queue" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                  {!activeQueue ? (
                    <div className="bg-white border border-[#EADBCE] rounded-3xl p-8 text-center max-w-xl mx-auto shadow-2xs">
                      <div className="w-16 h-16 rounded-2xl bg-[#FEF9EE] border border-[#EADBCE] flex items-center justify-center mx-auto mb-6 text-[#B58B67]">
                        <Clock size={28} />
                      </div>
                      <h2 className="text-2xl font-black font-serif text-[#3D3126] tracking-tight mb-2">No Active Queue Reservation</h2>
                      <p className="text-stone-500 text-xs leading-relaxed max-w-md mx-auto mb-8 font-sans">
                        You are not currently waiting in the live queue. Secure a grooming slot or register for walk-in timelines to view your live position, estimated wait counter, and stylist chair status here.
                      </p>
                      <button 
                        onClick={() => setActiveTab("dummy_services")}
                        className="bg-[#B58B67] hover:bg-[#9E7452] text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs inline-flex items-center gap-2 border-none outline-none font-sans"
                      >
                        <Scissors size={14} /> Join Salon Queue Pipeline
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      
                      {/* Main Live Queue Status Cards */}
                      <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
                        
                        {/* Live Header Status */}
                        <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-2xs">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#FAF6F0] mb-4">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#B58B67] bg-[#FEF9EE] px-2.5 py-1 rounded-md border border-[#EADBCE]">
                                Live Queue Status
                              </span>
                              <h3 className="text-xl font-black font-serif text-[#3D3126] mt-2">
                                {activeQueue.status === "in-progress" ? "You are on the Styling Chair!" : `Position #${activeQueue.position} in Line`}
                              </h3>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              activeQueue.status === "in-progress"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : activeQueue.status === "delayed" || activeQueue.status === "paused"
                                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                                  : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}>
                              {activeQueue.status === "in-progress" ? "In Progress" : activeQueue.status === "delayed" ? "Delayed" : activeQueue.status === "paused" ? "Paused" : "Waiting"}
                            </span>
                          </div>

                          {/* Stepper View */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 px-2">
                            {[
                              { label: "Joined Line", active: true, completed: true },
                              { label: "Waiting in Queue", active: activeQueue.status === "waiting" || activeQueue.status === "paused" || activeQueue.status === "delayed", completed: activeQueue.status === "in-progress" || (activeQueue.status === "waiting" && activeQueue.position === 1) },
                              { label: "Next in Chair", active: activeQueue.status === "waiting" && activeQueue.position === 1, completed: activeQueue.status === "in-progress" },
                              { label: "Grooming Session", active: activeQueue.status === "in-progress", completed: false }
                            ].map((step, idx) => (
                              <React.Fragment key={idx}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    step.active 
                                      ? "bg-[#B58B67] text-white ring-4 ring-[#B58B67]/20" 
                                      : step.completed 
                                        ? "bg-emerald-500 text-white" 
                                        : "bg-stone-100 text-stone-400 border border-stone-200"
                                  }`}>
                                    {step.completed ? "✓" : idx + 1}
                                  </div>
                                  <div className="text-left">
                                    <p className={`text-xs font-bold leading-none ${step.active || step.completed ? "text-stone-900" : "text-stone-400"}`}>
                                      {step.label}
                                    </p>
                                    <p className="text-[10px] text-stone-400 mt-1">
                                      {idx === 0 && "Registered"}
                                      {idx === 1 && activeQueue.status === "waiting" && `Pos #${activeQueue.position}`}
                                      {idx === 1 && (activeQueue.status === "delayed" || activeQueue.status === "paused") && "Queue On Hold"}
                                      {idx === 2 && activeQueue.status === "waiting" && activeQueue.position === 1 && "Arrived next!"}
                                      {idx === 2 && activeQueue.position > 1 && "Waiting turn"}
                                      {idx === 3 && activeQueue.status === "in-progress" && "In Chair"}
                                      {idx === 3 && activeQueue.status !== "in-progress" && "Upcoming"}
                                    </p>
                                  </div>
                                </div>
                                {idx < 3 && (
                                  <div className="hidden md:block flex-1 h-[2px] bg-stone-200 min-w-[30px]" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* Live Visual Queue Animation Card */}
                        <LiveVisualQueue activeQueue={activeQueue} />

                        {/* Booking & Service parameters */}
                        <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-2xs text-left relative overflow-hidden">
                          <h3 className="font-serif text-lg font-bold text-[#3D3126] mb-4">Service Overview</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-xs">
                              <span className="text-stone-400 font-medium">Studio Branch</span>
                              <span className="font-bold text-[#3D3126]">{activeQueue.salon?.salon_name || "Style Studio"}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-xs">
                              <span className="text-stone-400 font-medium">Stylist Assigned</span>
                              <span className="font-bold text-[#3D3126]">{activeQueue.barber?.name || "Any Stylist"}</span>
                            </div>
                            <div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-xs">
                              <span className="text-stone-400 font-medium">Services Requested</span>
                              <span className="font-bold text-[#3D3126]">
                                {activeQueue.services?.map(s => s.service_name).join(", ") || "Premium Grooming Cut"}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs pt-1">
                              <span className="text-stone-400 font-medium">Booking Reference</span>
                              <span className="font-mono font-bold text-[#B58B67]">
                                {activeQueue.booking?._id || activeQueue.booking || "BKG-QUEUE"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Queue Information Alert Tip */}
                        <div className="bg-[#FEF9EE] border border-[#EADBCE] rounded-3xl p-6 text-xs text-stone-600 space-y-3">
                          <h4 className="font-serif font-bold text-[#9E7452] text-sm flex items-center gap-1.5">
                            <HelpCircle size={16} /> How the queue works:
                          </h4>
                          <p className="leading-relaxed">
                            Our Smart Queue monitors barber speed and active session times to give you a dynamic, real-time wait estimation. 
                            As previous clients complete their sessions or get marked as no-show, your position will automatically move forward.
                          </p>
                          <p className="leading-relaxed font-bold text-[#3D3126]">
                            * Important: Please ensure you are physically present at the studio location once your position reaches #1 or #2.
                          </p>
                        </div>
                      </div>

                      {/* Right Countdown Panel */}
                      <div className="space-y-6 order-1 lg:order-2">
                        
                        {/* Countdown Wait Card */}
                        <div className="bg-[#3D3126] text-white rounded-[2.2rem] p-8 shadow-md border border-[#B58B67]/20 text-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#B58B67]/10 to-transparent rounded-full blur-2xl" />
                          <span className="text-[8px] font-black uppercase tracking-[0.25em] bg-[#B58B67]/20 text-[#B58B67] border border-[#B58B67]/30 px-3 py-1 rounded-full mb-5 inline-block">
                            Estimated Wait Counter
                          </span>

                          <div className="my-6">
                            <h2 className="text-5xl font-serif font-black tracking-tight text-[#B58B67] ">
                              {activeQueue.status === "in-progress" ? "0" : dynamicQueue.timeRemaining}
                              <span className="text-lg font-sans font-bold ml-1 text-white">mins</span>
                            </h2>
                            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-black mt-2">Time Remaining</p>
                          </div>

                          <div className="border-t border-white/10 pt-5 mt-5 text-left space-y-3.5 text-[11px]">
                            <div className="flex justify-between items-center text-stone-300">
                              <span>Entered Line At:</span>
                              <span className="font-mono text-white font-bold">
                                {dynamicQueue.enteredAt}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-stone-300">
                              <span>Estimated Turn:</span>
                              <span className="font-mono text-[#B58B67] font-bold">
                                {dynamicQueue.estimatedTurn}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-stone-300">
                              <span>Clients Ahead:</span>
                              <span className="font-mono text-white font-bold">{activeQueue.peopleAhead}</span>
                            </div>
                          </div>
                        </div>

                        {/* Manual refresh button */}
                        <button
                          onClick={syncData}
                          disabled={loading}
                          className="w-full py-4 rounded-2xl bg-white border border-[#EADBCE] text-stone-600 text-xs font-black uppercase tracking-wider hover:bg-stone-50 transition flex items-center justify-center gap-2 cursor-pointer shadow-3xs hover:scale-102 border-none outline-none font-sans"
                        >
                          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                          Sync Live Metrics
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* ✅ FIX: TAB: OUR STUDIOS — NearbyBarbers correctly in main content */}
              {activeTab === "studios" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <NearbyBarbers />
                </div>
              )}

              {/* TAB: OVERVIEW HUB */}
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Onboarding Tutorial & Discount Card */}
                  <div className="bg-[#FEF9EE] border border-[#EADBCE] rounded-3xl p-6 text-left shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 text-[#B58B67] -mr-8 -mt-8 pointer-events-none">
                      <Scissors size={200} />
                    </div>
                    <div className="space-y-4 max-w-xl">
                      <span className="bg-[#B58B67] text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-3xs">Onboarding Gift Active</span>
                      <h2 className="text-2xl font-black font-serif text-[#3D3126] tracking-tight">Welcome to BarberPro, {profile.name}!</h2>
                      <p className="text-xs text-[#8A7A6A] leading-relaxed font-sans">
                        Experience the pinnacle of premium men's grooming. Book your first haircut today and unlock your customized styling record. Use coupon code <strong className="text-[#9E7452] font-mono text-sm bg-white border border-[#EADBCE] px-2 py-0.5 rounded-md font-black">FIRSTCUT20</strong> for a flat <strong className="text-[#9E7452]">20% off</strong> on your checkout!
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button 
                          onClick={() => {
                            const salonId = localStorage.getItem("selectedSalonId");
                            if (salonId) {
                              navigate("/customer/services");
                            } else {
                              navigate("/nearby");
                            }
                          }} 
                          className="bg-[#B58B67] hover:bg-[#9E7452] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs hover:scale-102 flex items-center gap-1.5 font-sans"
                        >
                          <Scissors size={12} /> Book Your First Cut
                        </button>
                        <button onClick={() => setShowVideoModal(true)} className="bg-white hover:bg-[#FAF6F0] text-[#3D3126] border border-[#EADBCE] px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs hover:scale-102 flex items-center gap-1.5 font-sans">
                          <Play size={12} className="fill-[#3D3126] text-[#3D3126]" /> Play Grooming Tutorial
                        </button>
                        <button onClick={() => setActiveTab("preferences")} className="bg-white hover:bg-[#FAF6F0] text-[#3D3126] border border-[#EADBCE] px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs hover:scale-102 flex items-center gap-1.5 font-sans">
                          Modify Profile Details
                        </button>
                      </div>
                    </div>
                    <div onClick={() => setShowVideoModal(true)} className="relative group w-full md:w-64 aspect-video md:aspect-auto md:h-36 rounded-2xl overflow-hidden border border-[#EADBCE] shadow-xs cursor-pointer shrink-0">
                      <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80" alt="Grooming Tutorial Video" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white text-[#B58B67] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                          <Play size={18} className="fill-[#B58B67] translate-x-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[9px] text-white font-black uppercase tracking-wider truncate font-sans">BarberPro Styling Guide</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div onClick={() => { setActiveTab("history"); setApptSubTab("past"); }} className="bg-white rounded-2xl border border-[#EADBCE] hover:border-[#B58B67] p-5 flex items-start gap-4 shadow-xs hover:shadow-md transition-all text-left cursor-pointer hover:scale-102">
                      <div className="w-12 h-12 rounded-xl bg-[#FEF9EE] border border-[#F5E6D3] flex items-center justify-center shrink-0 text-[#9E7452]"><Scissors size={20} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#8A7A6A] font-medium">Total Visits</p>
                        <p className="text-3xl font-black text-[#3D3126] mt-0.5">{profile.total_visits}</p>
                        <p className="text-[9px] text-[#8A7A6A] font-black uppercase tracking-wider mt-1.5">Grooming sessions completed</p>
                      </div>
                    </div>
                    <div onClick={() => { setActiveTab("history"); setApptSubTab("upcoming"); }} className="bg-white rounded-2xl border border-[#EADBCE] hover:border-purple-300 p-5 flex items-start gap-4 shadow-xs hover:shadow-md transition-all text-left cursor-pointer hover:scale-102">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100/60 flex items-center justify-center shrink-0 text-purple-600"><Calendar size={20} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#8A7A6A] font-medium">Next Booking</p>
                        {upcomingAppts.length > 0 ? (
                          <><p className="text-sm font-black text-[#3D3126] mt-1 truncate">{upcomingAppts[0].service}</p><p className="text-[10px] text-purple-600 font-black uppercase tracking-wider mt-1.5 font-mono">{upcomingAppts[0].date} @ {upcomingAppts[0].time}</p></>
                        ) : (
                          <><p className="text-lg font-black text-[#8A7A6A] mt-1">No Active Booking</p><p className="text-[9px] text-[#8A7A6A] font-black uppercase tracking-wider mt-1.5">Schedule a session anytime</p></>
                        )}
                      </div>
                    </div>
                    <div onClick={() => { setActiveTab("overview"); triggerToast(`You are ${(10 - stamps)} visits away from a 10% discount reward!`); }} className="bg-white rounded-2xl border border-[#EADBCE] hover:border-amber-300 p-5 flex items-start gap-4 shadow-xs hover:shadow-md transition-all text-left cursor-pointer hover:scale-102">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100/60 flex items-center justify-center shrink-0 text-[#B06000]"><Gift size={20} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#8A7A6A] font-medium">Reward Progress</p>
                        <p className="text-2xl font-black text-[#3D3126] mt-0.5">{stamps} / 10</p>
                        <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden border border-stone-200/40">
                          <div className="bg-[#B58B67] h-full rounded-full transition-all duration-500" style={{ width: `${stamps * 10}%` }} />
                        </div>
                        <p className="text-[9px] text-[#8A7A6A] font-black uppercase tracking-wider mt-1.5">{10 - stamps} cuts left to reward</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                    <div className="card p-6 bg-white shadow-xs border border-[#EADBCE] rounded-2xl flex flex-col justify-between lg:col-span-2">
                      <div>
                        <h3 className="text-md font-black font-serif text-[#3D3126] tracking-tight">Active Reservations</h3>
                        <p className="text-[11px] text-[#8A7A6A] font-medium mt-1">Grooming sessions scheduled on your calendar</p>
                      </div>
                      <div className="my-auto py-4">
                        {upcomingAppts.length === 0 ? (
                          <div className="text-center py-6"><Calendar className="mx-auto text-stone-200 mb-2" size={24} /><p className="text-xs font-black uppercase tracking-wider text-stone-400">No upcoming appointments</p></div>
                        ) : (
                          upcomingAppts.map(appt => (
                            <div key={appt._id} className="p-4 border border-[#EADBCE] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FAF6F0]/20">
                              <div className="flex items-center gap-3">
                                <BarberAvatar name={appt.barberName} photo={appt.barberPhoto} sizeClass="w-10 h-10" iconSize={16} />
                                <div>
                                  <h4 className="text-xs font-black text-[#3D3126]">{appt.service}</h4>
                                  <p className="text-[10px] text-[#8A7A6A] font-medium mt-0.5">Stylist: {appt.barberName} • Cost: ₹{appt.total}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold py-1.5 px-3 bg-white rounded-lg border border-[#EADBCE]">
                                <span className="flex items-center gap-1 font-mono text-[10px] text-[#B58B67]"><Clock size={11} /> {appt.date} @ {appt.time}</span>
                              </div>
                              <button onClick={() => handleCancelBooking(appt._id)} className="px-3.5 py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer">Cancel</button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="card p-6 bg-white shadow-xs border border-[#EADBCE] rounded-2xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-md font-black font-serif text-[#3D3126] tracking-tight">Fidelity Stamps</h3>
                        <p className="text-[11px] text-[#8A7A6A] font-medium mt-1">Earn a 10% discount after 10 stamps</p>
                      </div>
                      <div className="grid grid-cols-5 gap-2 my-auto py-4">
                        {Array.from({ length: 10 }).map((_, i) => {
                          const isStamped = i < stamps;
                          return (
                            <div key={i} className={`aspect-square rounded-xl border flex items-center justify-center transition-all duration-300 ${isStamped ? "bg-[#FEF9EE] border-[#B58B67] text-[#9E7452] scale-105 shadow-3xs" : "bg-stone-50 border-[#EADBCE] text-stone-300"}`}>
                              {isStamped ? <CheckCircle size={14} className="text-[#9E7452]" /> : <span className="text-[10px] font-mono font-bold">{i + 1}</span>}
                            </div>
                          );
                        })}
                      </div>
                      <div className="pt-2.5 border-t border-[#EADBCE] flex justify-between items-center text-xs">
                        <span className="text-[#8A7A6A] font-medium">Stamps Verified</span>
                        <span className="font-black text-[#9E7452]">{stamps} / 10 stamps</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                    <div className="card p-6 bg-white shadow-xs border border-[#EADBCE] rounded-2xl flex flex-col justify-between animate-in fade-in duration-300">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-md font-black font-serif text-[#3D3126] tracking-tight">Channel Preferences</h3>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${profile.newsletter_opt_in ? 'bg-emerald-50 text-[#137333] border border-emerald-200' : 'bg-stone-50 text-[#78716C] border border-[#E7E5E4]'}`}>{profile.newsletter_opt_in ? "Subscribed" : "Opted Out"}</span>
                        </div>
                        <p className="text-[11px] text-[#8A7A6A] font-medium leading-relaxed">Receive custom styling recommendations, smart-queue check-in reminders, and exclusive rewards alerts.</p>
                        <div className="mt-4 p-4 rounded-xl border border-[#FAF6F0] bg-[#FAF6F0]/40 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#FEF9EE] border border-[#F5E6D3] flex items-center justify-center shrink-0 text-[#9E7452]"><Mail size={15} /></div>
                            <div>
                              <p className="text-[11px] font-black text-[#3D3126]">Newsletter Channel</p>
                              <p className="text-[9px] text-[#8A7A6A] mt-0.5">Bi-weekly styling insights</p>
                            </div>
                          </div>
                          <button type="button" onClick={handleToggleNewsletter} className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer border-none outline-none flex items-center ${profile.newsletter_opt_in ? "bg-[#B58B67]" : "bg-stone-200"}`}>
                            <div className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform ${profile.newsletter_opt_in ? "translate-x-5.5" : "translate-x-0"}`} />
                          </button>
                        </div>
                      </div>
                      <div className="pt-4 mt-4 border-t border-[#EADBCE] space-y-3">
                        <div className="flex items-center justify-between text-xs"><span className="text-[#8A7A6A] font-medium">Marketing Emails</span><span className="font-bold text-[#3D3126]">{profile.marketing_emails ? "Enabled" : "Disabled"}</span></div>
                        <div className="flex items-center justify-between text-xs"><span className="text-[#8A7A6A] font-medium">Monthly Reminders</span><span className="font-bold text-[#3D3126]">{profile.monthly_reminders ? "Enabled" : "Disabled"}</span></div>
                      </div>
                    </div>

                    <div className="card p-6 bg-white shadow-xs border border-[#EADBCE] rounded-2xl flex flex-col justify-between lg:col-span-2 animate-in fade-in duration-300">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-md font-black font-serif text-[#3D3126] tracking-tight">Support Tickets & Activities</h3>
                            <p className="text-[11px] text-[#8A7A6A] font-medium mt-0.5">Your resolved support inquiries and active service requests</p>
                          </div>
                          <button onClick={() => window.location.href = "/support"} className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#FEF9EE] border border-[#EADBCE] rounded-xl text-[10px] font-black uppercase tracking-wider text-[#9E7452] transition-colors cursor-pointer">New Ticket</button>
                        </div>
                        <div className="mt-4 space-y-3">
                          {supportTickets.length === 0 ? (
                            <div className="border border-dashed border-[#EADBCE] rounded-2xl p-6 text-center">
                              <HelpCircle size={24} className="mx-auto text-stone-300 mb-2" />
                              <p className="text-xs font-black uppercase tracking-wider text-stone-400">No active support inquiries</p>
                              <p className="text-[10px] text-stone-400 mt-1 max-w-md mx-auto">If you faced any issues regarding your bookings, stylists, or payments, file a support ticket to get help.</p>
                            </div>
                          ) : (
                            supportTickets.slice(0, 3).map(ticket => (
                              <div key={ticket.id} className="p-3 border border-[#EADBCE] rounded-xl bg-[#FAF6F0]/20 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center text-[#B58B67] shrink-0 mt-0.5"><HelpCircle size={14} /></div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2"><span className="text-[10px] font-black text-[#3D3126] uppercase truncate max-w-[150px] sm:max-w-[250px]">{ticket.subject}</span><span className="text-[8px] font-black uppercase tracking-wider bg-[#FEF9EE] text-[#9E7452] border border-[#EADBCE]/50 px-1.5 py-0.5 rounded-md">{ticket.category}</span></div>
                                    <p className="text-[10px] text-[#8A7A6A] font-medium mt-1 truncate">{ticket.message}</p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0"><span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">{ticket.status}</span><p className="text-[8px] text-[#8A7A6A] font-mono mt-1.5">{ticket.date.split(",")[0]}</p></div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      {supportTickets.length > 3 && (
                        <div className="pt-2.5 text-center"><button onClick={() => window.location.href = "/support"} className="text-[10px] font-black uppercase tracking-wider text-[#B58B67] hover:underline">View all support logs ({supportTickets.length})</button></div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: APPOINTMENTS REGISTRY */}
              {activeTab === "history" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 border-[#EADBCE] gap-4">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-wider text-[#3D3126]">Appointments Ledger</h2>
                      <p className="text-xs text-[#8A7A6A]">Browse active scheduled sessions and past grooming analytics.</p>
                    </div>
                    <div className="flex border border-[#EADBCE] rounded-xl overflow-hidden bg-white select-none shadow-3xs">
                      {["upcoming", "past"].map(sub => (
                        <button key={sub} onClick={() => setApptSubTab(sub)} className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${apptSubTab === sub ? "bg-[#3D3126] text-white" : "text-[#8A7A6A] hover:bg-[#FEF9EE] hover:text-[#3D3126]"}`}>
                          {sub === "upcoming" ? "Upcoming" : "Past Cut History"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {apptSubTab === "upcoming" ? (
                    <div className="space-y-4">
                      {upcomingAppts.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-[#EADBCE] rounded-2xl"><Calendar size={28} className="mx-auto text-stone-200 mb-2" /><p className="text-xs font-black uppercase tracking-wider text-[#8A7A6A]">No upcoming appointments scheduled</p></div>
                      ) : (
                        upcomingAppts.map(appt => (
                          <div key={appt._id} className="p-5 bg-white border border-[#EADBCE] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-3xs cursor-pointer hover:border-[#B58B67] transition-all" onClick={() => setSelectedApptDetails(appt)}>
                            <div className="flex items-center gap-4">
                              <BarberAvatar name={appt.barberName} photo={appt.barberPhoto} sizeClass="w-12 h-12" iconSize={20} />
                              <div>
                                <span className="bg-[#FEF9EE] text-[#9E7452] border border-[#EADBCE] text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Scheduled Session</span>
                                <h4 className="text-sm font-black text-[#3D3126] mt-2">{appt.service}</h4>
                                <p className="text-xs font-semibold text-[#8A7A6A] mt-0.5">Barber Stylist: {appt.barberName}</p>
                              </div>
                            </div>
                            <div className="flex gap-4 text-[#3D3126] text-xs font-bold py-2 px-4 bg-[#FAF6F0]/40 rounded-xl border border-[#EADBCE]">
                              <span className="flex items-center gap-1 font-sans"><Calendar size={13} className="text-[#B58B67]" /> {appt.date}</span>
                              <span className="flex items-center gap-1 font-sans"><Clock size={13} className="text-[#B58B67]" /> {appt.time}</span>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto shrink-0">
                              <button onClick={(e) => { e.stopPropagation(); handleCancelBooking(appt._id); }} className="flex-1 md:flex-none px-4 py-2.5 bg-rose-50 text-rose-500 border border-rose-200 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-rose-100 transition-colors cursor-pointer">Cancel Booking</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {completedAppts.length > 0 && (
                        <div className="bg-white border border-[#EADBCE] p-5 rounded-2xl shadow-3xs">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67] border-b pb-1.5 mb-3">Preferred Barber Frequency</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {getBarberFrequencies().map(f => (
                              <div key={f.name} className="p-4 bg-[#FAF6F0]/30 border border-[#EADBCE] rounded-xl flex items-center justify-between shadow-3xs">
                                <span className="text-xs font-bold text-[#3D3126]">{f.name}</span>
                                <span className="font-mono text-xs font-black bg-[#FEF9EE] text-[#9E7452] px-2 py-0.5 rounded border border-[#EADBCE]">Visited {f.count} times</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="bg-white border border-[#EADBCE] rounded-2xl overflow-hidden shadow-xs">
                        {completedAppts.length === 0 ? (
                          <div className="text-center py-16"><Scissors size={28} className="mx-auto text-stone-200 mb-2" /><p className="text-xs font-black uppercase tracking-wider text-[#8A7A6A]">No past cutting history found</p></div>
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
                                  <tr key={appt._id} className="hover:bg-[#FAF6F0]/40 transition-colors cursor-pointer" onClick={() => setSelectedApptDetails(appt)}>
                                    <td className="px-5 py-4">
                                      <div className="flex items-center gap-3">
                                        <BarberAvatar name={appt.barberName} photo={appt.barberPhoto} sizeClass="w-9 h-9" iconSize={14} />
                                        <div><p className="font-bold text-[#3D3126]">{appt.service}</p><p className="text-[9px] text-[#8A7A6A] font-medium mt-0.5">With {appt.barberName} • ₹{appt.total}</p></div>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4 text-[#8A7A6A] font-sans font-semibold">{appt.date}</td>
                                    <td className="px-5 py-4"><span className="bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block">COMPLETED</span></td>
                                    <td className="px-5 py-4 text-right">
                                      <button onClick={(e) => { e.stopPropagation(); setSelectedBarberForReview(appt.barberName); setShowReviewModal(true); }} className="px-3 py-1.5 border border-[#EADBCE] hover:bg-[#FEF9EE] rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer text-[#9E7452]">Leave Review</button>
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

            



              {/* TAB: PROFILE SETTINGS */}
              {activeTab === "preferences" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-[#3D3126]">Personal Settings</h2>
                    <p className="text-xs text-[#8A7A6A]">Manage contact coordinates and custom alert preferences.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#EADBCE] p-6 rounded-2xl shadow-xs lg:col-span-2 space-y-6">
                      <div className="flex justify-between items-center border-b border-[#EADBCE] pb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67]">Profile Coordinates</p>
                        <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-[10px] font-black uppercase tracking-wider text-[#B58B67] hover:underline">{isEditingProfile ? "Lock Details" : "Edit Profile"}</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-1">Full Name</label>
                          <input disabled={!isEditingProfile} value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className={`w-full bg-[#FAF6F0]/60 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none text-[#3D3126] focus:border-[#B58B67] transition-all ${!isEditingProfile ? "border-transparent opacity-80 cursor-not-allowed" : "border-[#EADBCE]"}`} />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-1">Mobile Number</label>
                          <input disabled={true} value={profile.mobile} className="w-full bg-[#FAF6F0]/40 border border-transparent rounded-xl px-4 py-2.5 text-xs font-bold font-mono outline-none text-[#3D3126] opacity-60 cursor-not-allowed" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-1">Email Address</label>
                          <input disabled={!isEditingProfile} value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className={`w-full bg-[#FAF6F0]/60 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none text-[#3D3126] focus:border-[#B58B67] transition-all ${!isEditingProfile ? "border-transparent opacity-80 cursor-not-allowed" : "border-[#EADBCE]"}`} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-1">Profile Picture URL</label>
                          <div className="flex gap-2 items-center">
                            <input 
                              disabled={!isEditingProfile} 
                              value={profile.profile_picture} 
                              onChange={(e) => setProfile({...profile, profile_picture: e.target.value})} 
                              placeholder="https://images.unsplash.com/... or paste image link" 
                              className={`flex-grow bg-[#FAF6F0]/60 border rounded-xl px-4 py-2.5 text-xs font-bold outline-none text-[#3D3126] focus:border-[#B58B67] transition-all ${!isEditingProfile ? "border-transparent opacity-80 cursor-not-allowed" : "border-[#EADBCE]"}`} 
                            />
                            {isEditingProfile && (
                              <>
                                <input
                                  type="file"
                                  id="avatar-upload"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleAvatarUpload}
                                />
                                <label
                                  htmlFor="avatar-upload"
                                  className="p-2.5 rounded-xl border border-[#EADBCE] bg-[#FAF6F0]/60 hover:bg-[#FEF9EE] text-[#B58B67] hover:border-[#B58B67] cursor-pointer transition-all flex items-center justify-center shrink-0"
                                  title="Upload Image"
                                >
                                  <Upload size={16} />
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {isEditingProfile && (
                        <button onClick={handleSaveProfile} className="px-6 py-2.5 bg-[#B58B67] hover:bg-[#9E7452] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                          <Save size={12} /> Save Updates
                        </button>
                      )}
                    </div>
                    <div className="bg-white border border-[#EADBCE] p-6 rounded-2xl shadow-xs space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67] border-b border-[#EADBCE] pb-2 mb-2">System Notifications</p>
                      <div className="space-y-4">
                        {[
                          { key: "marketing_emails", label: "Offer Promotions", desc: "Email alerts for special discounts and promotions." },
                          { key: "monthly_reminders", label: "Monthly Reminders", desc: "Rebook alert exactly one month after last cut completed." },
                          { key: "new_services_alerts", label: "New Launch Announcements", desc: "Alerts when new services are published by Admin." },
                          { key: "newsletter_opt_in", label: "Weekly Newsletter", desc: "Subscribed to receive updates and news from home footer." },
                        ].map(({ key, label, desc }) => (
                          <div key={key} className="flex items-start justify-between gap-3">
                            <div><h4 className="text-xs font-bold text-[#3D3126]">{label}</h4><p className="text-[9px] text-[#8A7A6A] mt-0.5">{desc}</p></div>
                            <button onClick={() => { setProfile(p => ({ ...p, [key]: !p[key] })); triggerToast("Updated preference."); }} className={`shrink-0 w-8 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${profile[key] ? "bg-[#B58B67]" : "bg-stone-200"}`}>
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile[key] ? "translate-x-3" : ""}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button onClick={handleSaveProfile} className="w-full mt-4 py-2.5 bg-[#3D3126] hover:bg-[#4E443A] text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer">Save Preferences</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: LIVE SYSTEM ALERTS */}
              {activeTab === "alerts" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
                  <div className="flex justify-between items-center border-b pb-4 border-[#EADBCE]">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-wider text-[#3D3126]">System Alerts Feed</h2>
                      <p className="text-xs text-[#8A7A6A]">Real-time reminders, status confirms, and general announcements.</p>
                    </div>
                    <button onClick={handleMarkAllRead} className="px-4 py-2 bg-[#FAF6F0] hover:bg-stone-100 rounded-xl text-[9px] font-black uppercase tracking-wider text-[#B58B67] border border-[#EADBCE] cursor-pointer">Mark all read</button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 rounded-2xl border transition-all flex gap-4 ${n.read ? "bg-white border-[#EADBCE]/60 opacity-80" : "bg-white border-[#B58B67] shadow-3xs"}`}>
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

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReviewModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.form initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onSubmit={handleSubmitReview} className="relative bg-[#FFFBF2] border border-[#EAD8C0] w-full max-w-md rounded-[2rem] p-6 shadow-2xl z-10 text-left space-y-6">
              <div className="flex justify-between items-center border-b pb-3 border-[#EADBCE]">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-[#3D3126]"><Star size={16} fill={GOLD} color={GOLD} /> Rate Grooming Experience</h3>
                <button type="button" onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">Rate your experience with <span className="text-[#C5A059]">{selectedBarberForReview}</span>:</p>
                <div className="flex gap-2.5 mt-3 justify-center">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button key={val} type="button" onClick={() => setReviewForm({...reviewForm, rating: val})} className="p-1 cursor-pointer transition-transform hover:scale-110">
                      <Star size={28} fill={val <= reviewForm.rating ? GOLD : "transparent"} color={GOLD} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8A7A6A] block mb-2">Write Review Message</label>
                <textarea rows={4} required placeholder="Tell us about the styling speed, cut precision..." value={reviewForm.feedback} onChange={(e) => setReviewForm({...reviewForm, feedback: e.target.value})} className="w-full bg-white border border-[#EAD8C0] rounded-2xl px-4 py-3 text-xs font-medium outline-none text-[#3D3126] focus:border-[#C5A059]" />
              </div>
              <button type="submit" className="w-full py-3.5 text-[#FFFBF2] font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all duration-200 hover:opacity-95 cursor-pointer bg-[#3D3126]">Submit Feedback</button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowVideoModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-[#EADBCE]/30 bg-black shadow-2xl z-10 text-left">
              <div className="absolute top-4 right-4 z-20">
                <button type="button" onClick={() => setShowVideoModal(false)} className="p-2 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#B58B67] cursor-pointer transition-colors border border-white/10"><X size={20} /></button>
              </div>
              <div className="aspect-video w-full bg-black flex items-center justify-center">
                <video src={barberBookingVideo} controls autoPlay className="w-full h-full object-contain" />
              </div>
              <div className="bg-[#FFFDF9] p-5 border-t border-[#EADBCE]">
                <h3 className="text-md font-black font-serif text-[#3D3126]">BarberPro Premium Styling & Grooming Guide</h3>
                <p className="text-[11px] text-[#8A7A6A] font-medium mt-1 leading-relaxed">Watch our step-by-step guide to selecting slots, booking your stylist, using promotional coupons, and navigating the smart queue radar.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPOINTMENT DETAILS MODAL */}
      <AnimatePresence>
        {selectedApptDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApptDetails(null)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#FFFDF9] border border-[#EADBCE] w-full max-w-md rounded-[2rem] p-6 shadow-2xl z-10 text-left space-y-5"
            >
              <div className="flex justify-between items-center border-b pb-3 border-[#EADBCE]">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#3D3126]">Appointment Ticket Details</h3>
                <button type="button" onClick={() => setSelectedApptDetails(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">Service Name</span>
                  <span className="font-extrabold text-[#3D3126] text-right">{selectedApptDetails.service}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">Salon Name</span>
                  <span className="font-extrabold text-[#3D3126] text-right">{selectedApptDetails.salonName || "The Royal Blade"}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">Barber Stylist</span>
                  <span className="font-extrabold text-[#3D3126]">{selectedApptDetails.barberName}</span>
                </div>

                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">Date</span>
                  <span className="font-extrabold text-[#3D3126] font-mono">{selectedApptDetails.date}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">Time Slot</span>
                  <span className="font-extrabold text-[#3D3126] font-mono">{selectedApptDetails.time}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">Status</span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider">{selectedApptDetails.status}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">Total Price</span>
                  <span className="font-extrabold text-[#C5A059] text-[13px]">₹{selectedApptDetails.total}</span>
                </div>
                
                {selectedApptDetails.styleNotes && (
                  <div className="pt-2">
                    <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px] block mb-1">Styling Notes</span>
                    <div className="bg-[#FAF6F0]/80 border border-[#EADBCE] rounded-xl p-3 text-[11px] text-[#3D3126] italic">
                      "{selectedApptDetails.styleNotes}"
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedApptDetails(null)}
                className="w-full py-3.5 text-[#FFFBF2] font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md transition-all duration-200 hover:opacity-95 cursor-pointer bg-[#3D3126]"
              >
                Close Receipt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 20, x: "-50%" }} className={`fixed bottom-6 left-1/2 z-50 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl flex items-center gap-2.5 ${toast.type === "error" ? "bg-red-900 border border-red-700" : "bg-[#3D3126] border border-[#B58B67]/30"}`}>
            {toast.type === "error" ? (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-red-500 animate-bounce"><ShieldAlert size={12} strokeWidth={3} /></div>
            ) : (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-emerald-500"><CheckCircle size={12} strokeWidth={3} /></div>
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barber Notification Top-Right Popup */}
      <AnimatePresence>
        {incomingBarberNotification && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed top-4 right-4 left-4 sm:left-auto sm:right-6 sm:top-6 sm:max-w-sm z-[9999] bg-gradient-to-br from-[#FEF9EE] to-white border-2 border-[#B58B67] rounded-2xl shadow-2xl p-5 flex flex-col gap-3 text-left border-solid"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEF9EE] border border-[#EADBCE] border-solid flex items-center justify-center text-[#B58B67] animate-pulse">
                  <Scissors size={20} className="text-[#B58B67]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-black text-stone-900 tracking-tight">
                    {incomingBarberNotification.title}
                  </h3>
                  <p className="text-[10px] text-[#B58B67] font-black uppercase tracking-wider mt-0.5">
                    Live Broadcast from Stylist
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismissBarberNotification}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 p-1 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-sans font-medium">
              {incomingBarberNotification.message}
            </p>
            <div className="flex justify-end gap-2 pt-1 border-t border-[#EADBCE]/40 border-solid border-0">
              <button
                type="button"
                onClick={dismissBarberNotification}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-[#FFFBF2] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer border-none shadow-xs"
              >
                I am coming
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Collapsible Right Arrow Tab for Live Queue Status ── */}
      {activeQueue && activeTab !== "queue" && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 animate-in fade-in duration-300">
          <button
            onClick={() => setActiveTab("queue")}
            className="bg-[#3D3126] hover:bg-[#2C2117] text-[#B58B67] border border-[#B58B67]/40 border-r-0 hover:border-[#B58B67] p-3 rounded-l-2xl shadow-lg cursor-pointer transition-all flex flex-col items-center gap-1.5 hover:pr-4"
            title="View Live Queue Tracker"
          >
            <ChevronLeft className="w-5 h-5 animate-pulse text-[#B58B67]" />
            <span className="text-[9px] font-black tracking-widest writing-mode-vertical uppercase [writing-mode:vertical-lr] rotate-180 font-sans">
              {activeQueue.status === "in-progress"
                ? "Styling Chair ⚡"
                : `Pos #${activeQueue.position} (${dynamicQueue.timeRemaining}m) ⏳`}
            </span>
          </button>
        </div>
      )}

      {/* ── Sticky Bottom Banner for Active Queue on Dashboard Hub ── */}
      {activeQueue && activeTab === "overview" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl animate-in slide-in-from-bottom-8 duration-500">
          <div 
            onClick={() => setActiveTab("queue")}
            className="cursor-pointer group flex items-center justify-between p-4 rounded-2xl bg-[#3D3126] text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex flex-col items-center justify-center text-[#C5A059] font-sans">
                <span className="text-[9px] font-black tracking-widest uppercase">Wait</span>
                <span className="text-lg font-bold leading-none mt-0.5">{dynamicQueue.timeRemaining || 0}m</span>
              </div>
              <div className="text-left">
                <h4 className="font-serif text-sm font-bold text-[#FFFBF2] flex items-center gap-1.5">
                  {activeQueue.status === "in-progress" ? (
                    <>Your Turn is Active! <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-ping" /></>
                  ) : (
                    `Estimated Wait: ${dynamicQueue.timeRemaining} mins`
                  )}
                </h4>
                <p className="text-stone-300 text-[10px] uppercase font-bold tracking-wider mt-0.5">
                  {activeQueue.status === "in-progress" 
                    ? "Grooming Session in progress" 
                    : `Position #${activeQueue.position} in Queue • ${activeQueue.peopleAhead || 0} clients ahead`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#C5A059] text-white text-[10px] font-black uppercase tracking-wider group-hover:bg-[#D5B069] transition-colors">
              Live Tracker <span className="text-xs">→</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}