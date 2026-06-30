import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Edit,
  Calendar,
  Clock3,
  Crown,
  Search,
  Bell,
  IndianRupee,
  Users,
  Plus,
  Scissors,
  LogOut,
  SlidersHorizontal,
  ArrowLeft,
  CheckCircle,
  XCircle
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import CustomSelect from "../../components/common/CustomSelect";

const CHARCOAL = "#3E362E";
const GOLD = "#C5A059";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function BookingManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL"); // ALL, Queue, Slot
  const [view, setView] = useState("list"); // "list", "create"
  const [createStep, setCreateStep] = useState(1); // 1, 2, 3, 4
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }
  const [paymentMode, setPaymentMode] = useState("offline");
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    type: "Queue",
    slot: "10:00 AM",
    barberId: "",
    serviceId: "",
    date: new Date().toISOString().split("T")[0],
    paymentType: "TOKEN",
    attendees: [{ id: 1, name: "", type: "Primary" }]
  });

  const [bookings, setBookings] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const salonId = localStorage.getItem("salonId");
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    if (!salonId || !token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/booking/salon/${salonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const mapped = data.bookings.map(b => ({
          id: b._id,
          name: b.customer_id?.name || b.customer_id?.mobile || "Walk-in Guest",
          type: b.booking_type === "slot" ? "Slot" : "Queue",
          slot: b.booking_type === "slot" && b.slot_time 
            ? new Date(b.slot_time).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
            : (b.created_at ? new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"),
          status: b.status === "confirmed" || b.status === "completed" || b.status === "in-progress" 
            ? "Approved" 
            : (b.status === "cancelled" || b.status === "noshow" ? "Rejected" : "Pending"),
          total_amount: b.total_amount || 0,
          created_at: b.created_at,
          mobile: b.customer_id?.mobile || "",
          barberId: b.barber_id?._id || b.barber_id || "",
          serviceId: b.services?.[0]?.service_id || "",
          slot_time: b.slot_time,
          paymentType: b.payment_type || "TOKEN",
          attendees: (b.services || []).map((s, idx) => ({
            id: idx + 1,
            name: s.member_name || "Self",
            type: idx === 0 ? "Primary" : "Family Member"
          }))
        }));
        setBookings(mapped);
      } else {
        setError(data.message || "Failed to load bookings");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const fetchBarbersAndServices = async () => {
    if (!salonId || !token) return;
    try {
      const [barbersRes, servicesRes] = await Promise.all([
        fetch(`${API}/barber/salon/${salonId}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/services/${salonId}`)
      ]);
      const barbersData = await barbersRes.json();
      const servicesData = await servicesRes.json();

      if (barbersData.success) {
        const activeBarbers = (barbersData.barbers || []).filter(b => b.is_active);
        setBarbers(activeBarbers);
        if (activeBarbers.length > 0) {
          setFormData(prev => ({ ...prev, barberId: activeBarbers[0]._id }));
        }
      }
      if (servicesData.success) {
        setServices(servicesData.services || []);
        if (servicesData.services && servicesData.services.length > 0) {
          setFormData(prev => ({ ...prev, serviceId: servicesData.services[0]._id }));
        }
      }
    } catch (err) {
      console.error("Error fetching barbers/services:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchBarbersAndServices();
  }, [salonId, token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTypeFilter]);

  const [activities] = useState([
    { id: 1, text: "Rahul booked haircut", time: "2 sec ago" },
    { id: 2, text: "Priya completed checkout", time: "1 min ago" },
    { id: 3, text: "Amit cancelled appointment", time: "3 min ago" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const approveBooking = async (id) => {
    try {
      const res = await fetch(`${API}/booking/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "confirmed" })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map((b) => b.id === id ? { ...b, status: "Approved" } : b));
      } else {
        showToast(data.message || "Failed to approve booking");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating booking status");
    }
  };

  const rejectBooking = async (id) => {
    try {
      const res = await fetch(`${API}/booking/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "cancelled" })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map((b) => b.id === id ? { ...b, status: "Rejected" } : b));
      } else {
        showToast(data.message || "Failed to reject booking");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating booking status");
    }
  };

  const handleNameChange = (val) => {
    setFormData(prev => {
      const nextAtt = [...prev.attendees];
      if (nextAtt.length > 0) {
        nextAtt[0] = { ...nextAtt[0], name: val };
      }
      return { ...prev, name: val, attendees: nextAtt };
    });
  };

  const handleAddAttendee = () => {
    setFormData(prev => ({
      ...prev,
      attendees: [
        ...prev.attendees,
        { id: Date.now(), name: "", type: "Family Member" }
      ]
    }));
  };

  const handleRemoveAttendee = (id) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(member => member.id !== id)
    }));
  };

  const handleAttendeeNameChange = (id, newName) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.map(member => 
        member.id === id ? { ...member, name: newName } : member
      )
    }));
  };

  const handleNewBookingClick = () => {
    setEditingBooking(null);
    setFormData({
      name: "",
      mobile: "",
      type: "Queue",
      slot: "10:00 AM",
      barberId: barbers.length > 0 ? barbers[0]._id : "",
      serviceId: services.length > 0 ? services[0]._id : "",
      date: new Date().toISOString().split("T")[0],
      paymentType: "TOKEN",
      attendees: [{ id: 1, name: "", type: "Primary" }]
    });
    setView("create");
    setCreateStep(1);
  };

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setFormData({
      name: booking.name,
      mobile: booking.mobile || "",
      type: booking.type,
      slot: booking.slot,
      barberId: booking.barberId || (barbers.length > 0 ? barbers[0]._id : ""),
      serviceId: booking.serviceId || (services.length > 0 ? services[0]._id : ""),
      date: booking.slot_time ? booking.slot_time.split("T")[0] : new Date().toISOString().split("T")[0],
      paymentType: booking.paymentType || "TOKEN",
      attendees: booking.attendees && booking.attendees.length > 0 
        ? booking.attendees.map((a, idx) => ({ id: idx + 1, name: a.name, type: a.type || (idx === 0 ? "Primary" : "Family Member") }))
        : [{ id: 1, name: booking.name, type: "Primary" }]
    });
    setView("create");
    setCreateStep(1);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim()) {
      showToast("Name and Mobile Number are required.");
      return;
    }

    try {
      let formattedSlot = null;
      if (formData.type === "Slot") {
        if (!formData.date || !formData.slot) {
          showToast("Booking Date and Preferred Time Slot are required for Slot bookings.");
          return;
        }
        let dateStr = formData.date;
        let timeStr = formData.slot;
        let [timePart, modifier] = timeStr.split(" ");
        let [hours, minutes] = timePart.split(":");
        let h = parseInt(hours, 10);
        if (h === 12) h = 0;
        if (modifier === "PM") h += 12;
        let hStr = String(h).padStart(2, "0");
        formattedSlot = `${dateStr}T${hStr}:${minutes}:00.000Z`;
      }

      const finalAttendees = formData.attendees.map((att, i) => ({
        name: att.name.trim() || (i === 0 ? formData.name : `Attendee ${i + 1}`),
        type: i === 0 ? "Primary" : "Family Member"
      }));

      const payload = {
        salon_id: salonId,
        barber_id: formData.barberId || null,
        booking_type: formData.type.toLowerCase(),
        services: finalAttendees.map(member => ({
          service_id: formData.serviceId,
          member_name: member.name
        })),
        slot_time: formattedSlot,
        customer_name: formData.name,
        customer_mobile: formData.mobile,
        payment_type: formData.paymentType,
        attendees: finalAttendees
      };

      const res = await fetch(`${API}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setView("list");
        await fetchBookings();
      } else {
        showToast(data.message || "Failed to create booking.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error submitting booking.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  const selectedService = useMemo(() => {
    return services.find(s => s._id === formData.serviceId) || null;
  }, [services, formData.serviceId]);

  const servicePrice = selectedService ? selectedService.price : 0;
  const totalAmount = servicePrice * formData.attendees.length;
  const tokenTotal = formData.attendees.length * 50;
  const amountToPayNow = formData.paymentType === "FULL" ? totalAmount : tokenTotal;
  const remainingAtSalon = formData.paymentType === "FULL" ? 0 : Math.max(0, totalAmount - tokenTotal);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedTypeFilter === "ALL" || b.type.toLowerCase() === selectedTypeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [bookings, search, selectedTypeFilter]);

  const itemsPerPage = 10;
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayBookings = bookings.filter(b => {
      if (!b.created_at) return false;
      const bDate = new Date(b.created_at).toISOString().split("T")[0];
      return bDate === todayStr;
    }).length;

    const totalRevenue = bookings.reduce((sum, b) => {
      if (b.status === "Approved") {
        return sum + b.total_amount;
      }
      return sum;
    }, 0);

    return {
      today: todayBookings,
      customers: new Set(bookings.map(b => b.name)).size,
      revenue: totalRevenue >= 1000 ? `${(totalRevenue / 1000).toFixed(1)}k` : `${totalRevenue}`,
      pendingCount: bookings.filter(b => b.status === "Pending").length
    };
  }, [bookings]);

  const getStatusStyle = (status) => {
    if (status === "Approved") return "bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-bold";
    if (status === "Rejected") return "bg-rose-50 border border-rose-200/60 text-rose-700 font-bold";
    return "bg-amber-50 border border-amber-200/60 text-amber-700 font-bold";
  };

  if (loading) {
    return (
      <div style={{ background: "#FAF6F0" }} className="min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Scissors className="w-6 h-6 text-[#C5A059]" />
          </div>
          <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans">Loading Bookings...</p>
        </div>
      </div>
    );
  }

  // ── RENDER BOOKING WIZARD FLOW ──
  const renderWizard = () => {
    const totalSteps = formData.type === "Slot" ? 4 : 3;
    
    const getStepTitle = () => {
      if (createStep === 1) return "Customer & Service Details";
      if (createStep === 2 && formData.type === "Slot") return "Date & Time Slot";
      if (createStep === 3 || (createStep === 2 && formData.type === "Queue")) return "Attendees & Family";
      return "Payment Gateway & Review";
    };

    return (
      <div className="mx-auto max-w-2xl bg-white border border-[#EADBCE] rounded-[2.5rem] p-8 md:p-12 shadow-xl text-left">
        {/* Top Header Row with Back navigation button */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-100 mb-8">
          <button 
            type="button"
            onClick={() => {
              if (createStep > 1) {
                if (createStep === 3 && formData.type === "Queue") {
                  setCreateStep(1);
                } else {
                  setCreateStep(createStep - 1);
                }
              } else {
                setView("list");
              }
            }}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-850 transition cursor-pointer border-none bg-transparent outline-none font-bold text-xs uppercase tracking-wider font-sans"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Back
          </button>
          
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block mb-1">
              Step {createStep === 3 && formData.type === "Queue" ? 2 : createStep === 4 && formData.type === "Queue" ? 3 : createStep} of {totalSteps}
            </span>
            <span className="text-xs font-bold text-stone-400 font-sans">{getStepTitle()}</span>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              backgroundColor: GOLD, 
              width: `${((createStep === 3 && formData.type === "Queue" ? 2 : createStep === 4 && formData.type === "Queue" ? 3 : createStep) / totalSteps) * 100}%` 
            }}
          />
        </div>

        {/* Step Contents */}
        <form onSubmit={(e) => {
          e.preventDefault();
          if (createStep === 1) {
            if (!formData.name.trim() || !formData.mobile.trim()) {
              showToast("Name and Mobile Number are required.");
              return;
            }
            if (formData.type === "Slot") {
              setCreateStep(2);
            } else {
              setCreateStep(3); // skip step 2 for Queue
            }
          } else if (createStep === 2) {
            setCreateStep(3);
          } else if (createStep === 3) {
            setCreateStep(4);
          } else if (createStep === 4) {
            handleFormSubmit(e);
          }
        }} className="space-y-6 font-sans">
          
          {/* STEP 1: Guest & Barber Select */}
          {createStep === 1 && (
            <div className="space-y-5">
              <h3 className="font-serif text-2xl text-stone-900 font-bold mb-4">
                Enter <span className="italic text-[#C5A059] font-medium">Guest details</span>
              </h3>
              
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="E.g., Nitin Kumar"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 outline-none text-stone-800 focus:border-amber-500 focus:bg-white transition text-sm font-semibold placeholder-stone-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2">Customer Mobile Number</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                  placeholder="E.g., 9876543210"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 outline-none text-stone-800 focus:border-amber-500 focus:bg-white transition text-sm font-semibold placeholder-stone-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2">Target Workflow Pipeline</label>
                <CustomSelect
                  value={formData.type}
                  onChange={(val) => setFormData({ ...formData, type: val })}
                  options={[
                    { value: "Queue", label: "Queue Booking (Walk-in / Immediate)" },
                    { value: "Slot", label: "Slot Booking (Scheduled Appointment)" }
                  ]}
                  size="lg"
                  className="!bg-stone-50 !border-stone-200 !text-[#3E362E] font-bold rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2">Assigned Barber / Artist</label>
                <CustomSelect
                  value={formData.barberId}
                  onChange={(val) => setFormData({ ...formData, barberId: val })}
                  options={[
                    { value: "", label: "Auto-Assign / Any Barber" },
                    ...barbers.map((b) => ({ value: b._id, label: `${b.name} (${b.status || "available"})` }))
                  ]}
                  placeholder="Auto-Assign / Any Barber"
                  size="lg"
                  className="!bg-stone-50 !border-stone-200 !text-[#3E362E] font-bold rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2">Requested Service</label>
                <CustomSelect
                  value={formData.serviceId}
                  onChange={(val) => setFormData({ ...formData, serviceId: val })}
                  options={
                    services.length > 0
                      ? services.map((s) => ({ value: s._id, label: `${s.name} (₹${s.price})` }))
                      : [{ value: "", label: "No services available" }]
                  }
                  placeholder="Select Service"
                  size="lg"
                  className="!bg-stone-50 !border-stone-200 !text-[#3E362E] font-bold rounded-xl"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time (Slot only) */}
          {createStep === 2 && formData.type === "Slot" && (
            <div className="space-y-5">
              <h3 className="font-serif text-2xl text-stone-900 font-bold mb-4">
                Choose <span className="italic text-[#C5A059] font-medium">Date & Time</span>
              </h3>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2">Booking Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 outline-none text-stone-800 focus:border-amber-500 focus:bg-white transition text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2">Preferred Slot Time</label>
                <CustomSelect
                  value={formData.slot}
                  onChange={(val) => setFormData({ ...formData, slot: val })}
                  options={['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'].map(s => ({ value: s, label: s }))}
                  size="lg"
                  className="!bg-stone-50 !border-stone-200 !text-[#3E362E] font-bold rounded-xl"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Attendees Selection */}
          {createStep === 3 && (
            <div className="space-y-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-2xl text-stone-900 font-bold">
                  Add <span className="italic text-[#C5A059] font-medium">Attendees</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddAttendee}
                  className="text-xs text-[#A06D3B] hover:text-[#8B5A2B] font-extrabold uppercase tracking-wider transition-colors cursor-pointer border-none bg-transparent outline-none"
                >
                  + Add Attendee
                </button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {formData.attendees.map((member, index) => (
                  <div key={member.id} className="flex gap-3 items-center bg-stone-50/50 p-3 rounded-2xl border border-stone-200/50">
                    <div className="flex-grow">
                      <label className="block text-[9px] font-extrabold uppercase tracking-widest text-stone-400 mb-1.5">
                        {index === 0 ? "Primary Person Name" : `Family Member / Person #${index + 1}`}
                      </label>
                      <input
                        type="text"
                        required
                        value={member.name}
                        onChange={(e) => handleAttendeeNameChange(member.id, e.target.value)}
                        placeholder={index === 0 ? "Customer name (syncs from details)" : "Enter person's name"}
                        className="w-full bg-white border border-stone-200 rounded-xl p-3 outline-none text-stone-800 focus:border-[#C5A059] transition text-sm font-semibold"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAttendee(member.id)}
                        className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border-none bg-transparent cursor-pointer outline-none self-end"
                        title="Remove Attendee"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Payment Settings */}
          {createStep === 4 && (
            <div className="space-y-5">
              <h3 className="font-serif text-2xl text-stone-900 font-bold mb-4">
                Confirm <span className="italic text-[#C5A059] font-medium">Payment & Book</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2">Payment Type</label>
                  <CustomSelect
                    value={formData.paymentType}
                    onChange={(val) => setFormData({ ...formData, paymentType: val })}
                    options={[
                      { value: "TOKEN", label: "Token payment (₹50/person)" },
                      { value: "FULL", label: "Full payment" }
                    ]}
                    size="lg"
                    className="!bg-stone-50 !border-stone-200 !text-[#3E362E] font-bold rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-2">Payment Mode</label>
                  <CustomSelect
                    value={paymentMode}
                    onChange={(val) => setPaymentMode(val)}
                    options={[
                      { value: "offline", label: "Cash / Offline" },
                      { value: "online", label: "Online Simulation" }
                    ]}
                    size="lg"
                    className="!bg-stone-50 !border-stone-200 !text-[#3E362E] font-bold rounded-xl"
                  />
                </div>
              </div>

              {/* ── PRICE BREAKDOWN PANEL ── */}
              <div className="bg-[#FAF6F0]/60 border border-[#EADBCE] p-6 rounded-2xl space-y-3 text-sm text-stone-700">
                <p className="font-serif font-black text-xs uppercase tracking-widest text-[#C5A059] border-b border-[#EADBCE] pb-2 mb-4">Booking Invoice Preview</p>
                <div className="flex justify-between items-center">
                  <span>Selected Service:</span>
                  <span className="font-bold text-stone-900">{selectedService?.name || "Service"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rate per Person:</span>
                  <span className="font-bold text-stone-900">₹{servicePrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total People:</span>
                  <span className="font-bold text-stone-900">{formData.attendees.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Base Amount:</span>
                  <span className="font-bold text-stone-900 font-mono">₹{totalAmount}</span>
                </div>
                <div className="border-t border-[#EADBCE] my-2 pt-3 flex justify-between items-center font-bold text-base">
                  <span className="text-stone-800">Amount Due Now ({formData.paymentType}):</span>
                  <span className="text-[#A06D3B] font-mono">₹{amountToPayNow}</span>
                </div>
                {formData.paymentType === "TOKEN" && (
                  <div className="flex justify-between items-center text-xs text-stone-400 italic">
                    <span>Remaining balance at salon:</span>
                    <span className="font-mono">₹{remainingAtSalon}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Row buttons */}
          <div className="flex gap-4 pt-6 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                if (createStep > 1) {
                  if (createStep === 3 && formData.type === "Queue") {
                    setCreateStep(1);
                  } else {
                    setCreateStep(createStep - 1);
                  }
                } else {
                  setView("list");
                }
              }}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider cursor-pointer border-none outline-none"
            >
              {createStep === 1 ? "Cancel" : "Back"}
            </button>
            <button
              type="submit"
              className="w-full text-white transition py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer border-none outline-none hover:opacity-95"
              style={{ background: CHARCOAL }}
            >
              {createStep === 4 ? (editingBooking ? "Save Changes" : "Confirm & Book") : "Continue"}
            </button>
          </div>

        </form>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 font-sans text-stone-800 selection:bg-amber-100 min-h-screen" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
        
        .card { 
          background: #FFFFFF; 
          border: 1px solid #EADBCE; 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.03);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(28, 25, 23, 0.06);
          border-color: #C5A059;
        }
        .card-active {
          border-color: #C5A059 !important;
          box-shadow: 0 0 0 2px #C5A059, 0 12px 24px -4px rgba(197, 160, 89, 0.15) !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #EADBCE;
          border-radius: 10px;
        }
      `}</style>

      {view === "create" ? (
        renderWizard()
      ) : (
        /* ── MAIN WORKSPACE CONTENT GRID ── */
        <div className="mx-auto max-w-7xl">
          
          {/* ── CONTEXT HEADER TITLE CARD (Rule 1 & Rule 2 Standard Set) ── */}
          <div className="relative rounded-3xl p-6 md:p-8 mb-6 overflow-hidden card bg-white text-left">
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                {/* Rule 2: Minor Heading kicker badge styling */}
                <p className="font-extrabold uppercase tracking-widest text-[11px] text-[#C5A059] mb-1.5 font-sans">
                  Elite Grooming Management
                </p>
                {/* Rule 1: Single-Line Master Header Layout Setup */}
                <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
                  <span className="font-bold uppercase">Booking</span>
                  <span className="italic text-[#C5A059] normal-case font-medium">Dashboard</span>
                </h2>
                {/* Rule 3: Muted Description Styling */}
                <p className="text-stone-600 text-sm font-normal leading-relaxed font-sans mt-2">Monitor floor allocation flow, approve queue intents, and confirm appointment configurations.</p>
              </div>
              {/* Rule 4: Primary UI Action Link Button */}
              <button
                onClick={handleNewBookingClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer self-start sm:self-center font-sans border-none outline-none shrink-0"
                style={{ background: CHARCOAL }}
              >
                <Plus size={16} color={GOLD} /> New Booking
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600 font-sans">
              {error}
            </div>
          )}

          {/* ── SYSTEM MATRIX SUMMARY NUMBERS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
            {[
              { title: "Today's Bookings", value: stats.today, icon: Calendar, color: "bg-orange-50 text-orange-700 border-orange-100" },
              { title: "Customers Total", value: stats.customers, icon: Users, color: "bg-amber-50 text-amber-700 border-amber-100" },
              { title: "Revenue Index", value: stats.revenue, icon: IndianRupee, color: "bg-emerald-50 text-emerald-700 border-[#C5A059]/20" },
              { title: "Pending Bookings", value: stats.pendingCount, icon: Clock3, color: "bg-sky-50 text-sky-700 border-sky-100" },
            ].map((item) => (
              <div key={item.title} className="card p-5 bg-white flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <div>
                  {/* Rule 2: Minor Heading kicker tag structure */}
                  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] font-sans mb-0.5">{item.title}</h3>
                  <p className="text-2xl font-black font-serif tracking-normal text-stone-900 leading-none">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── SEARCH INDEX CONSOLE ── */}
          <div className="card p-4 mb-6 flex items-center gap-3 bg-white text-left font-sans">
            <Search className="text-[#C5A059] shrink-0" size={18} />
            <input
              type="text"
              placeholder="Search active guest by name identifier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-stone-800 placeholder-stone-400 text-sm font-medium font-sans"
            />
            {selectedTypeFilter !== "ALL" && (
              /* Rule 4: Standardized Link/Badge Action button */
              <button 
                onClick={() => setSelectedTypeFilter("ALL")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-stone-100 text-stone-500 hover:bg-stone-200 transition cursor-pointer font-sans border-none outline-none"
              >
                <SlidersHorizontal size={12} /> Clear Filter
              </button>
            )}
          </div>

          {/* ── INTERACTIVE FILTER SEGMENTS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            {[
              { filterKey: "Queue", title: "Queue Bookings", icon: Clock3, desc: "On-demand routing slot entries" },
              { filterKey: "Slot", title: "Slot Bookings", icon: Calendar, desc: "Pre-arranged appointment times" },
            ].map((item) => {
              const isTargetActive = selectedTypeFilter === item.filterKey;
              return (
                <div 
                  key={item.filterKey} 
                  onClick={() => setSelectedTypeFilter(isTargetActive ? "ALL" : item.filterKey)}
                  className={`card p-5 flex items-center gap-4 cursor-pointer select-none bg-white ${isTargetActive ? 'card-active' : 'hover:border-[#C5A059]'}`}
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${isTargetActive ? 'text-white' : 'bg-amber-50/60 border-amber-100 text-[#C5A059]'}`} style={{ backgroundColor: isTargetActive ? CHARCOAL : '' }}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h2 className="text-base font-black font-serif text-stone-900 leading-tight">{item.title}</h2>
                    {/* Rule 3: Balanced small description string */}
                    <p className="text-stone-600 text-[11px] font-normal leading-relaxed font-sans mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── LEDGER TABLE CONTENT CONTAINER ── */}
          <div className="card p-6 bg-white overflow-hidden mb-8 text-left">
            <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
              {/* Rule 1: Master Section Sub-Header Title Layout */}
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-stone-900 flex flex-wrap items-center justify-start gap-2">
                <span className="font-bold uppercase">Live Operations</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Queue</span>
                {selectedTypeFilter !== "ALL" && <span className="text-xs font-sans font-bold text-[#C5A059] lowercase">({selectedTypeFilter} only)</span>}
              </h2>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] bg-stone-50 px-2.5 py-1 rounded-md font-sans">
                {filteredBookings.length} Active Rows
              </span>
            </div>
            
            <div className="overflow-x-auto w-full custom-scrollbar font-sans">
              <table className="w-full min-w-[640px] text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 text-[11px] font-extrabold uppercase tracking-widest font-sans">
                    <th className="text-left py-4 pr-4">Customer Entity</th>
                    <th className="text-left pr-4">Pipeline Type</th>
                    <th className="text-left pr-4">Target Window</th>
                    <th className="text-left pr-4">State</th>
                    <th className="text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-stone-400 italic font-medium font-sans">
                        No matching transaction entries discovered in this viewport segment.
                      </td>
                    </tr>
                  ) : (
                    paginatedBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-stone-50/60 transition-colors group">
                        <td className="py-4.5 pr-4 whitespace-nowrap font-bold text-stone-900 text-sm">{booking.name}</td>
                        <td className="pr-4 whitespace-nowrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${booking.type === 'Slot' ? 'bg-blue-50 text-blue-700' : 'bg-stone-100 text-stone-700'}`}>
                            {booking.type}
                          </span>
                        </td>
                        <td className="pr-4 whitespace-nowrap text-stone-500 font-medium font-mono">{booking.slot}</td>
                        <td className="pr-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${getStatusStyle(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2 justify-end font-sans">
                            <button
                              onClick={() => approveBooking(booking.id)}
                              disabled={booking.status === "Approved"}
                              className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 p-2 rounded-xl transition shrink-0 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer outline-none"
                              title="Approve Slot"
                            >
                              <Check size={14} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() => rejectBooking(booking.id)}
                              disabled={booking.status === "Rejected"}
                              className="bg-rose-50 text-rose-700 border border-rose-200/60 hover:bg-rose-100 p-2 rounded-xl transition shrink-0 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer outline-none"
                              title="Reject Slot"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() => handleEditClick(booking)}
                              className="bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100 p-2 rounded-xl transition shrink-0 cursor-pointer outline-none"
                              title="Edit Allocation"
                            >
                              <Edit size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredBookings.length > 0 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-100 font-sans text-xs">
                <span className="text-stone-500 font-medium">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:hover:bg-stone-100 rounded-xl font-extrabold uppercase tracking-wider transition cursor-pointer disabled:cursor-not-allowed border-none outline-none"
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:hover:bg-stone-100 rounded-xl font-extrabold uppercase tracking-wider transition cursor-pointer disabled:cursor-not-allowed border-none outline-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[min(420px,90vw)] animate-in fade-in slide-in-from-bottom duration-300">
          <div className="relative flex items-center gap-3.5 px-5 py-4 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl text-left">
            <div className="absolute -top-10 -left-10 w-32 h-32 blur-[60px] rounded-full pointer-events-none" style={{ background: toast.type === "success" ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)" }} />
            {toast.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 relative z-10" /> : <XCircle className="w-5 h-5 text-rose-500 shrink-0 relative z-10" />}
            <p className="text-stone-200 text-xs font-semibold leading-relaxed relative z-10 font-sans">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-auto text-stone-500 hover:text-white transition-colors relative z-10"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}