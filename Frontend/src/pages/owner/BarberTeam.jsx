import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Users, Scissors, Phone, Award, ShieldCheck, 
  Trash2, Coffee, Sparkles, Check, Star, RefreshCw, Plus,
  Minimize2, Maximize2, Eye, FileText, X, Edit, Upload
} from "lucide-react";
import CustomSelect from "../../components/common/CustomSelect";


const PREDEFINED_SPECIALIZATIONS = [
  "Haircut & Styling",
  "Beard Sculpting & Shave",
  "Hair Spa & Treatment",
  "Hair Coloring & Highlights",
  "Facial & Grooming Massage",
  "Ayurvedic Head Massage",
  "All-Rounder Master Stylist"
];

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function BarberTeam() {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(false);

  const [editingBarber, setEditingBarber] = useState(null);
  const [editError, setEditError] = useState("");
  const editPhotoRef = useRef();
  const editDocRef = useRef();
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [customSpecInput, setCustomSpecInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleToggleSpec = (spec) => {
    let next;
    if (selectedSpecs.includes(spec)) {
      next = selectedSpecs.filter(s => s !== spec);
    } else {
      next = [...selectedSpecs, spec];
    }
    setSelectedSpecs(next);
    setEditingBarber(prev => ({ ...prev, specialization: next.join(", ") }));
  };

  const handleAddCustomSpec = (e) => {
    if (e) e.preventDefault();
    const trimmed = customSpecInput.trim();
    if (trimmed && !selectedSpecs.includes(trimmed)) {
      const next = [...selectedSpecs, trimmed];
      setSelectedSpecs(next);
      setEditingBarber(prev => ({ ...prev, specialization: next.join(", ") }));
      setCustomSpecInput("");
      setShowCustomInput(false);
    }
  };

  const closeDetails = () => {
    setSelectedBarber(null);
    setIsMaximized(false);
    setViewingDocument(false);
  };
  
  const salonId = localStorage.getItem("salonId");
  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

  const fetchBarbers = async () => {
    if (!salonId) {
      showToast("Salon ID missing. Please log in again.", "error");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/barber/salon/${salonId}`, {
        headers: headers()
      });
      const data = await res.json();
      if (data.success) {
        setBarbers(data.barbers || []);
      } else {
        showToast(data.message || "Failed to load barbers", "error");
      }
    } catch (err) {
      showToast("Network error loading barbers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.highlightBarberId && barbers.length > 0) {
      const found = barbers.find(b => b._id === location.state.highlightBarberId);
      if (found) {
        setSelectedBarber(found);
        // Clear history state to avoid opening on page reload
        window.history.replaceState({}, document.title);
      }
    }
  }, [barbers, location]);


  const changeBarberStatus = async (barberId, nextStatus) => {
    setBusyId(barberId);
    try {
      const res = await fetch(`${API}/barber/${barberId}/status`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Barber status set to ${nextStatus}`);
        setBarbers(prev => prev.map(b => b._id === barberId ? { ...b, status: nextStatus } : b));
      } else {
        showToast(data.message || "Failed to update status", "error");
      }
    } catch (err) {
      showToast("Network error updating status", "error");
    } finally {
      setBusyId(null);
    }
  };

  const executeDeactivation = async (barberId) => {
    setBusyId(barberId);
    try {
      const res = await fetch(`${API}/barber/${barberId}`, {
        method: "DELETE",
        headers: headers()
      });
      const data = await res.json();
      if (data.success) {
        showToast("Barber deactivated successfully");
        setBarbers(prev => prev.filter(b => b._id !== barberId));
      } else {
        showToast(data.message || "Failed to deactivate barber", "error");
      }
    } catch (err) {
      showToast("Network error deactivating barber", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleEditClick = (barber) => {
    setEditError("");
    const specs = barber.specialization 
      ? barber.specialization.split(",").map(s => s.trim()).filter(Boolean) 
      : [];
    setSelectedSpecs(specs);
    setEditingBarber({
      _id: barber._id,
      name: barber.name,
      mobile: barber.mobile,
      password: "",
      specialization: barber.specialization || "",
      experience: barber.experience || "",
      email: barber.email || "",
      aadhaar: barber.aadhaar || "",
      pan: barber.pan || "",
      photo: null,
      photoPreview: barber.photo || null,
      document: barber.document || null,
      documentName: barber.documentName || ""
    });
  };

  const handleEditPhotoChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditingBarber(p => ({ ...p, photo: file, photoPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleEditDocChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditingBarber(p => ({ ...p, document: ev.target.result, documentName: file.name }));
    reader.readAsDataURL(file);
  };

  const handleUpdateBarber = async (e) => {
    e.preventDefault();
    setEditError("");
    setBusyId(editingBarber._id);
    
    if (editingBarber.mobile.length !== 10) {
      setEditError("Enter a valid 10-digit mobile number.");
      setBusyId(null);
      return;
    }

    if (!editingBarber.aadhaar || editingBarber.aadhaar.length !== 12) {
      setEditError("Aadhaar Number is required and must be exactly 12 digits.");
      setBusyId(null);
      return;
    }

    try {
      const payload = {
        name: editingBarber.name,
        mobile: editingBarber.mobile,
        specialization: editingBarber.specialization,
        experience: Number(editingBarber.experience) || 0,
        email: editingBarber.email,
        aadhaar: editingBarber.aadhaar,
        pan: editingBarber.pan,
        photo: editingBarber.photoPreview || "",
        document: editingBarber.document || "",
        documentName: editingBarber.documentName || ""
      };

      if (editingBarber.password) {
        payload.password = editingBarber.password;
      }

      const res = await fetch(`${API}/barber/${editingBarber._id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        showToast("Barber profile updated successfully");
        setBarbers(prev => prev.map(b => b._id === data.barber._id ? data.barber : b));
        if (selectedBarber && selectedBarber._id === data.barber._id) {
          setSelectedBarber(data.barber);
        }
        setEditingBarber(null);
      } else {
        setEditError(data.message || "Failed to update barber");
      }
    } catch (err) {
      setEditError("Network error updating barber");
    } finally {
      setBusyId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "available":
        return {
          label: "Present & Available",
          style: "bg-emerald-50 text-emerald-700 border-emerald-200"
        };
      case "busy":
        return {
          label: "Busy",
          style: "bg-rose-50 text-rose-700 border-rose-200"
        };
      case "break":
        return {
          label: "On Break",
          style: "bg-amber-50 text-amber-700 border-amber-200"
        };
      default:
        return {
          label: "Offline",
          style: "bg-zinc-50 text-zinc-500 border-zinc-200"
        };
    }
  };

  if (!salonId) {
    return (
      <div className="min-h-screen p-6 md:p-10 font-sans text-stone-800 text-left flex items-center justify-center" style={{ background: "#FAF6F0" }}>
        <div className="card p-12 text-center max-w-md w-full bg-white shadow-xl rounded-3xl border border-[#EADBCE]">
          <div className="w-16 h-16 mx-auto bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm text-3xl mb-4">
            ⚠️
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold uppercase mb-2">Session Expired</h2>
          <p className="mx-auto max-w-xs text-sm text-stone-400 font-sans leading-relaxed mb-6">
            We couldn't detect your salon identification. Please log in again to manage your team.
          </p>
          <button 
            onClick={() => navigate("/owner/login")}
            className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm hover:opacity-90 cursor-pointer transition-all active:scale-95 animate-fade-in"
            style={{ background: GOLD }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans text-stone-800 text-left animate-fade-in" style={{ background: "#FAF6F0" }}>
      <style>{`
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
        .upload-box {
          border: 2px dashed #EADBCE;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #FAFAF8;
        }
        .upload-box:hover {
          border-color: #C5A059;
          background: #FEF9F0;
        }
      `}</style>

      {/* Header */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
            <span className="font-bold uppercase">Barber</span>
            <span className="italic text-[#C5A059] normal-case font-medium">Team</span>
          </h2>
          <p className="text-stone-400 text-xs font-medium tracking-wide mt-1.5">
            Manage your salon technicians, active statuses, and scheduling approvals
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate("/owner/add-barber")}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-sm hover:opacity-90 cursor-pointer transition-all active:scale-95"
            style={{ background: GOLD }}
          >
            <Plus size={14} className="text-white" />
            Add Barber
          </button>
          <button 
            onClick={fetchBarbers} 
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#EADBCE] text-xs font-black uppercase tracking-wider text-stone-700 shadow-sm hover:bg-stone-50 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sync Team
          </button>
        </div>
      </header>

      {loading && barbers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
            <Users className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-stone-500 text-sm font-medium">Syncing barber profiles...</p>
        </div>
      ) : (
        <>
          {barbers.length === 0 ? (
            <div className="card p-12 text-center border-dashed">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-sm text-3xl mb-4">
                💈
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold uppercase mb-2">No Barbers Seeded</h2>
              <p className="mx-auto max-w-xs text-sm text-stone-400 font-sans leading-relaxed">
                Add barbers to build your team catalog.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map(barber => {
                const statusMeta = getStatusBadge(barber.status);
                const rating = barber.rating || 0;
                
                return (
                  <div 
                    key={barber._id} 
                    onClick={() => setSelectedBarber(barber)}
                    className="card p-6 flex flex-col justify-between relative bg-white cursor-pointer hover:border-[#C5A059] transition-all hover:shadow-lg"
                  >
                    {/* Top row */}
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5A2B] to-[#4A3E3D] text-white flex items-center justify-center font-serif text-xl font-bold overflow-hidden flex-shrink-0">
                            {barber.photo ? (
                              <img src={barber.photo} alt={barber.name} className="w-full h-full object-cover" />
                            ) : (
                              barber.name?.[0]?.toUpperCase() || "?"
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-black font-serif text-stone-900 leading-tight">{barber.name}</h3>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {barber.specialization 
                                ? barber.specialization.split(",").map(s => s.trim()).filter(Boolean).map(spec => (
                                    <span 
                                      key={spec} 
                                      className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#FAF6F0] text-[#8B5A2B] border border-[#C5A059]/20"
                                    >
                                      {spec}
                                    </span>
                                  ))
                                : (
                                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#FAF6F0] text-[#8B5A2B] border border-[#C5A059]/20">
                                      General Stylist
                                    </span>
                                  )
                              }
                            </div>
                          </div>
                        </div>

                        {/* Soft-Delete & Edit Buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleEditClick(barber); }}
                            className="p-2 text-stone-400 hover:text-[#C5A059] hover:bg-amber-50 rounded-xl transition cursor-pointer"
                            title="Edit Barber"
                          >
                            <Edit size={16} />
                          </button>
                           <button 
                            onClick={(e) => { e.stopPropagation(); setDeactivatingId(barber._id); }}
                            disabled={busyId === barber._id}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer disabled:opacity-40"
                            title="Deactivate Barber"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Details segment */}
                      <div className="space-y-2.5 py-4 border-t border-b border-stone-100/60 my-4 text-xs font-medium">
                        <div className="flex items-center gap-3 text-stone-600">
                          <Phone size={14} className="text-[#C5A059]" />
                          <span>+91 {barber.mobile}</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                          <Award size={14} className="text-[#C5A059]" />
                          <span>{barber.experience || 0} Years Experience</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                          <ShieldCheck size={14} className="text-[#C5A059]" />
                          <span>Aadhaar: {barber.aadhaar ? `XXXX-XXXX-${barber.aadhaar.slice(-4)}` : "Not Provided"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                          <Star size={14} className="text-[#C5A059] fill-amber-400 stroke-amber-500" />
                          <span className="font-bold text-stone-900">{rating.toFixed(1)} / 5.0 Rating</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status Toggles */}
                    <div className="mt-2 flex flex-col gap-3 pt-3 border-t border-stone-100/60">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Status:</span>
                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${statusMeta.style}`}>
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className="flex gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                        {["available", "busy", "break"].map(s => (
                          <button
                            key={s}
                            type="button"
                            disabled={barber.status === s || busyId === barber._id}
                            onClick={() => changeBarberStatus(barber._id, s)}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer border text-center font-sans ${
                              barber.status === s
                                ? "bg-[#FAF6F0] text-[#C5A059] border-[#C5A059]"
                                : "bg-[#FAFAF8] text-stone-500 border-[#EADBCE] hover:bg-stone-50"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}      {/* Barber Details Modal */}
      {selectedBarber && (
        <div style={{ zIndex: 1000 }} className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
          <div className={`bg-white border border-[#EADBCE] shadow-2xl relative duration-300 text-left flex flex-col overflow-hidden transition-all ${
            isMaximized 
              ? "max-w-5xl w-full h-[90vh] rounded-3xl" 
              : "max-w-lg w-full max-h-[85vh] rounded-3xl"
          } animate-in zoom-in-95`}>
            {/* Header / Banner */}
            <div className="h-24 bg-gradient-to-r from-[#8B5A2B] to-[#4A3E3D] relative flex items-center justify-end px-6 flex-shrink-0">
              {/* Window Controls (Maximize, Close) */}
              <div className="flex items-center gap-2.5 absolute top-4 right-4 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-full z-10 select-none">
                {/* Maximize/Restore Toggle Button */}
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded p-1 transition cursor-pointer"
                  title={isMaximized ? "Restore Size" : "Maximize Details"}
                >
                  {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <span className="w-[1px] h-3 bg-white/20"></span>
                {/* Close Button */}
                <button 
                  onClick={closeDetails}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded p-1 transition cursor-pointer"
                  title="Close Details"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="px-6 pb-8 pt-4 overflow-y-auto flex-1 text-left scrollbar-thin">
              {/* Profile Header Row (Photo on left, Details on right) */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-4 mb-8">
                {/* Passport size photo */}
                <div className="flex-shrink-0 z-10">
                  <div className="w-32 h-44 sm:w-36 sm:h-48 rounded-2xl border-4 border-white bg-gradient-to-br from-[#8B5A2B] to-[#4A3E3D] text-white flex items-center justify-center font-serif text-3xl font-bold overflow-hidden shadow-xl">
                    {selectedBarber.photo ? (
                      <img src={selectedBarber.photo} alt={selectedBarber.name} className="w-full h-full object-cover animate-fade-in" />
                    ) : (
                      selectedBarber.name?.[0]?.toUpperCase() || "?"
                    )}
                  </div>
                </div>

                {/* Header Information (Fills the white space) */}
                <div className="flex-1 flex flex-col justify-between h-full w-full text-center md:text-left self-stretch py-1">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-3xl sm:text-4xl font-black font-serif text-stone-900 leading-tight">{selectedBarber.name}</h3>
                        <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
                          {selectedBarber.specialization 
                            ? selectedBarber.specialization.split(",").map(s => s.trim()).filter(Boolean).map(spec => (
                                <span 
                                  key={spec} 
                                  className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FAF6F0] text-[#8B5A2B] border border-[#C5A059]/25 shadow-3xs"
                                
                                >
                                  {spec}
                                </span>
                              ))
                            : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FAF6F0] text-[#8B5A2B] border border-[#C5A059]/25 shadow-3xs">
                                  General Stylist
                                </span>
                              )
                          }
                        </div>
                      </div>
                      <div className="flex flex-col items-center sm:items-end gap-1.5 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider shadow-2xs ${getStatusBadge(selectedBarber.status).style}`}>
                          {getStatusBadge(selectedBarber.status).label}
                        </span>
                        <span className="text-[10px] text-stone-400 font-semibold">Joined: {new Date(selectedBarber.created_at || selectedBarber.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 border-t border-b border-stone-100 py-3.5 text-stone-600 text-xs font-bold bg-[#FAFAF8]/50 px-4 rounded-xl border border-[#EADBCE]/30">
                    <div className="text-center">
                      <span className="text-[9px] text-stone-400 block uppercase tracking-wider mb-0.5">Rating</span>
                      <span className="text-stone-900 flex items-center justify-center gap-1 mt-0.5">
                        <Star size={12} className="text-amber-500 fill-amber-400" />
                        {(selectedBarber.rating || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-center border-l border-r border-stone-200/60">
                      <span className="text-[9px] text-stone-400 block uppercase tracking-wider mb-0.5">Experience</span>
                      <span className="text-stone-900 flex items-center justify-center gap-1 mt-0.5">
                        <Award size={12} className="text-[#C5A059]" />
                        {selectedBarber.experience || 0} Years
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] text-stone-400 block uppercase tracking-wider mb-0.5">Phone</span>
                      <span className="text-stone-900 flex items-center justify-center gap-1 mt-0.5">
                        <Phone size={12} className="text-[#C5A059]" />
                        +91 {selectedBarber.mobile}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout when Maximized */}
              <div className={`grid gap-6 ${isMaximized ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
                
                {/* Column 1: Personal Details */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#EADBCE]/50 shadow-3xs">
                    <h4 className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider mb-3 pb-1.5 border-b border-stone-200/50">Personal Profile</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-stone-700">
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase tracking-wider mb-0.5">Mobile Number</span>
                        <span className="text-stone-900 flex items-center gap-1.5 mt-0.5">
                          <Phone size={12} className="text-[#C5A059]" />
                          +91 {selectedBarber.mobile}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase tracking-wider mb-0.5">Email Address</span>
                        <span className="text-stone-900 truncate block mt-0.5">{selectedBarber.email || "Not Provided"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase tracking-wider mb-0.5">Experience</span>
                        <span className="text-stone-900 flex items-center gap-1.5 mt-0.5">
                          <Award size={12} className="text-[#C5A059]" />
                          {selectedBarber.experience || 0} Years
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase tracking-wider mb-0.5">Rating</span>
                        <span className="text-stone-900 flex items-center gap-1 mt-0.5">
                          <Star size={12} className="text-amber-500 fill-amber-400" />
                          {(selectedBarber.rating || 0).toFixed(1)} / 5.0 Rating
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Documents & Verification */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#EADBCE]/50 shadow-3xs">
                    <h4 className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider mb-3 pb-1.5 border-b border-stone-200/50">Verification & ID</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-stone-700">
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase tracking-wider mb-0.5">Aadhaar Number</span>
                        <span className="text-stone-900 flex items-center gap-1.5 mt-0.5">
                          <ShieldCheck size={12} className="text-[#C5A059]" />
                          {selectedBarber.aadhaar || "Not Provided"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 block uppercase tracking-wider mb-0.5">PAN Card Number</span>
                        <span className="text-stone-900 uppercase block mt-0.5">{selectedBarber.pan || "Not Provided"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents ID Section */}
              {selectedBarber.document ? (
                <div className="mt-6 p-4 rounded-2xl bg-stone-50 border border-[#EADBCE]/60 shadow-3xs">
                  <h4 className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider mb-3 pb-1.5 border-b border-stone-200/50">Attached Document ID</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl flex-shrink-0">
                        📄
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-stone-800 truncate">{selectedBarber.documentName || "Identity Document"}</p>
                        <p className="text-[10px] text-stone-400">Identity verification file</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setViewingDocument(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#EADBCE] text-[10px] font-black uppercase tracking-wider text-stone-700 hover:bg-stone-100 transition-all cursor-pointer shadow-3xs active:scale-95"
                      >
                        <Eye size={12} className="text-[#C5A059]" />
                        View
                      </button>
                      <a 
                        href={selectedBarber.document} 
                        download={selectedBarber.documentName || "document"} 
                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-white hover:opacity-90 transition-all cursor-pointer flex items-center justify-center shadow-3xs active:scale-95"
                        style={{ background: GOLD }}
                      >
                        Download
                      </a>
                    </div>
                  </div>
                  {/* Document preview if it's an image */}
                  {selectedBarber.document.startsWith("data:image/") && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-stone-200/50 max-h-56 flex items-center justify-center bg-white cursor-pointer hover:opacity-95 transition-all shadow-3xs" onClick={() => setViewingDocument(true)}>
                      <img src={selectedBarber.document} alt="Document Preview" className="max-h-56 object-contain w-full" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 p-6 rounded-2xl bg-[#FAFAF8] border border-dashed border-stone-200 text-center text-xs text-stone-400 font-semibold shadow-3xs">
                  No identity documents uploaded.
                </div>
              )}

              {/* Footer actions */}
              <div className="mt-8 pt-4 border-t border-stone-100 flex justify-end">
                <button 
                  onClick={closeDetails}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-600 hover:bg-stone-200 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all active:scale-95"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Document Viewer Modal */}
      {selectedBarber && viewingDocument && selectedBarber.document && (
        <div style={{ zIndex: 2000 }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <a 
              href={selectedBarber.document} 
              download={selectedBarber.documentName || "document"} 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
            >
              Download Original
            </a>
            <button 
              onClick={() => setViewingDocument(false)}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
          
          <div className="max-w-4xl w-full max-h-[80vh] flex items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-2xl">
            {selectedBarber.document.startsWith("data:image/") || selectedBarber.documentName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img 
                src={selectedBarber.document} 
                alt={selectedBarber.documentName || "Document Proof"} 
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-xl"
              />
            ) : selectedBarber.document.startsWith("data:application/pdf") || selectedBarber.documentName?.match(/\.pdf$/i) ? (
              <object 
                data={selectedBarber.document} 
                type="application/pdf" 
                className="w-full h-[75vh] rounded-lg"
              >
                <div className="p-8 text-center text-white text-sm">
                  <p className="mb-4">PDF Preview is not supported by your browser directly from Base64 Data URL.</p>
                  <a 
                    href={selectedBarber.document} 
                    download={selectedBarber.documentName || "document.pdf"}
                    className="inline-block px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-black bg-white hover:opacity-90"
                  >
                    Download and View PDF
                  </a>
                </div>
              </object>
            ) : (
              <div className="p-12 text-center text-white">
                <FileText size={48} className="mx-auto text-white/50 mb-4" />
                <h4 className="text-base font-bold mb-1">{selectedBarber.documentName || "Identity Document"}</h4>
                <p className="text-xs text-white/40 mb-6">Preview unavailable for this file format.</p>
                <a 
                  href={selectedBarber.document} 
                  download={selectedBarber.documentName || "document"}
                  className="inline-block px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-black bg-white hover:opacity-90"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
          
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-4">
            Document ID: {selectedBarber.documentName || "document"}
          </p>
        </div>
      )}

      {/* Edit Barber Modal */}
      {editingBarber && (
        <div style={{ zIndex: 1100 }} className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
          <div className="bg-white border border-[#EADBCE] shadow-2xl relative duration-300 text-left flex flex-col overflow-hidden max-w-2xl w-full max-h-[90vh] rounded-3xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#8B5A2B] to-[#4A3E3D] flex items-center justify-between flex-shrink-0">
              <h3 className="font-serif text-lg font-bold text-white uppercase">Edit Barber Profile</h3>
              <button 
                onClick={() => setEditingBarber(null)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleUpdateBarber} className="px-6 py-6 overflow-y-auto flex-1 text-left scrollbar-thin space-y-6">
              {editError && (
                <p className="rounded-xl bg-red-50 border border-red-200 p-3 text-center text-xs font-bold text-red-600 font-sans">
                  {editError}
                </p>
              )}

              {/* Photo & Document Upload Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">Profile Photo</label>
                  <div className="upload-box" onClick={() => editPhotoRef.current?.click()}>
                    {editingBarber.photoPreview ? (
                      <div className="relative">
                        <img src={editingBarber.photoPreview} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                        <button 
                          type="button"
                          onClick={e => { e.stopPropagation(); setEditingBarber(p => ({ ...p, photo: null, photoPreview: null })); }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-[#EADBCE] rounded-2xl bg-[#FAFAF8] cursor-pointer hover:border-[#C5A059] hover:bg-[#FEF9F0] transition h-32">
                        <Upload className="w-8 h-8 text-[#C5A059] mb-2 stroke-[2.5px]" />
                        <p className="text-xs font-semibold text-stone-600 font-sans">Click to upload photo</p>
                        <p className="text-[10px] text-stone-400 font-sans mt-0.5">JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input ref={editPhotoRef} type="file" accept="image/*" className="hidden" onChange={handleEditPhotoChange} />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">ID / Document</label>
                  <div className="upload-box" onClick={() => editDocRef.current?.click()}>
                    {editingBarber.documentName ? (
                      <div className="w-full p-4 bg-emerald-50/50 border border-emerald-200/50 rounded-xl text-center flex flex-col items-center justify-center h-32">
                        <Upload className="w-8 h-8 text-emerald-600 mb-2 stroke-[2.5px]" />
                        <p className="text-xs font-bold text-emerald-800 truncate w-full px-2">{editingBarber.documentName}</p>
                        <button 
                          type="button"
                          onClick={e => { e.stopPropagation(); setEditingBarber(p => ({ ...p, document: null, documentName: "" })); }}
                          className="mt-2 text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-[#EADBCE] rounded-2xl bg-[#FAFAF8] cursor-pointer hover:border-[#C5A059] hover:bg-[#FEF9F0] transition h-32">
                        <Upload className="w-8 h-8 text-[#C5A059] mb-2 stroke-[2.5px]" />
                        <p className="text-xs font-semibold text-stone-600 font-sans">Upload ID/Aadhar</p>
                        <p className="text-[10px] text-stone-400 font-sans mt-0.5">PDF, JPG, PNG</p>
                      </div>
                    )}
                  </div>
                  <input ref={editDocRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleEditDocChange} />
                </div>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Full Name *</label>
                  <input 
                    required 
                    placeholder="Rahul Sharma" 
                    value={editingBarber.name} 
                    onChange={e => setEditingBarber(prev => ({ ...prev, name: e.target.value }))} 
                    className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Mobile Number *</label>
                  <input 
                    required 
                    type="tel"
                    maxLength={10}
                    placeholder="10 digit mobile" 
                    value={editingBarber.mobile} 
                    onChange={e => setEditingBarber(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, "") }))} 
                    className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Password (Leave blank to keep current)</label>
                  <input 
                    type="password"
                    placeholder="Change password" 
                    value={editingBarber.password} 
                    onChange={e => setEditingBarber(prev => ({ ...prev, password: e.target.value }))} 
                    className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-2">Specializations *</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PREDEFINED_SPECIALIZATIONS.map(spec => {
                      const isSelected = selectedSpecs.includes(spec);
                      return (
                        <button
                          key={spec}
                          type="button"
                          onClick={() => handleToggleSpec(spec)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            isSelected 
                              ? "bg-[#3E362E] text-white border-[#3E362E]" 
                              : "bg-white text-stone-600 border-[#EADBCE] hover:border-[#C5A059]"
                          }`}
                        >
                          {spec} {isSelected ? "✓" : "+"}
                        </button>
                      );
                    })}

                    {selectedSpecs.filter(s => !PREDEFINED_SPECIALIZATIONS.includes(s)).map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => handleToggleSpec(spec)}
                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#8B5A2B] text-white border border-[#8B5A2B] transition-all cursor-pointer"
                        title="Click to remove"
                      >
                        {spec} ×
                      </button>
                    ))}

                    {!showCustomInput && (
                      <button
                        type="button"
                        onClick={() => setShowCustomInput(true)}
                        className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-[#C5A059] bg-[#FEF9EE] border border-[#EADBCE] hover:bg-[#FEF9EE]/85 transition-all cursor-pointer"
                      >
                        + Add Custom
                      </button>
                    )}
                  </div>

                  {showCustomInput && (
                    <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-200 max-w-md">
                      <input
                        type="text"
                        placeholder="Type custom specialization..."
                        value={customSpecInput}
                        onChange={e => setCustomSpecInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSpec(e);
                          }
                        }}
                        className="flex-1 rounded-xl border border-[#EADBCE] bg-white p-2.5 text-xs font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSpec}
                        className="px-4 py-2.5 bg-[#3E362E] text-[#C5A059] rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-[#3E362E] hover:bg-[#2A241F]"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowCustomInput(false); setCustomSpecInput(""); }}
                        className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Experience (Years) *</label>
                  <input 
                    required 
                    type="number"
                    min="0"
                    placeholder="5" 
                    value={editingBarber.experience} 
                    onChange={e => setEditingBarber(prev => ({ ...prev, experience: e.target.value }))} 
                    className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Email (Optional)</label>
                  <input 
                    type="email"
                    placeholder="barber@email.com" 
                    value={editingBarber.email} 
                    onChange={e => setEditingBarber(prev => ({ ...prev, email: e.target.value }))} 
                    className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Aadhaar Number *</label>
                  <input 
                    required
                    maxLength={12}
                    placeholder="12 digit Aadhaar" 
                    value={editingBarber.aadhaar} 
                    onChange={e => setEditingBarber(prev => ({ ...prev, aadhaar: e.target.value.replace(/\D/g, "") }))} 
                    className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">PAN Card Number (Optional)</label>
                  <input 
                    maxLength={10}
                    placeholder="ABCDE1234F" 
                    value={editingBarber.pan} 
                    onChange={e => setEditingBarber(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))} 
                    className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-4 border-t border-stone-100 mt-6 font-sans">
                <button 
                  type="submit" 
                  disabled={busyId === editingBarber._id}
                  className="rounded-xl px-6 py-3.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-md hover:opacity-95 transition-all cursor-pointer flex-1 disabled:opacity-50" 
                  style={{ background: CHARCOAL }}
                >
                  {busyId === editingBarber._id ? "Saving Changes..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingBarber(null)} 
                  className="rounded-xl bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deactivatingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-2xl text-left">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100 mb-4">
              <span className="text-xl">⚠️</span>
              <h3 className="font-serif text-lg font-bold text-stone-950">Deactivate Stylist</h3>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mb-6 font-sans">
              Are you sure you want to deactivate this barber? They will be removed from your active team catalog.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100 font-sans">
              <button 
                onClick={() => setDeactivatingId(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  const targetId = deactivatingId;
                  setDeactivatingId(null);
                  await executeDeactivation(targetId);
                }}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white font-bold text-xs shadow-2xl z-50 animate-in slide-in-from-right ${
          toast.type === "error" ? "bg-red-500" : "bg-[#8B5A2B]"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
