import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

export default function AddBarber() {
  const navigate = useNavigate();
  
  const [newBarber, setNewBarber] = useState({
    name: "",
    mobile: "",
    password: "",
    specialization: "",
    experience: "",
    email: "",
    aadhaar: "",
    pan: "",
    photo: null,
    photoPreview: null,
    document: null,
    documentName: ""
  });
  const [addError, setAddError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const photoRef = useRef();
  const docRef = useRef();

  const salonId = localStorage.getItem("salonId");
  const token = localStorage.getItem("token");

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewBarber(p => ({ ...p, photo: file, photoPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewBarber(p => ({ ...p, document: ev.target.result, documentName: file.name }));
    reader.readAsDataURL(file);
  };

  const handleAddBarber = async (e) => {
    e.preventDefault();
    setAddError("");
    setBusy(true);
    
    if (!salonId) {
      setAddError("Salon ID missing. Please log in again.");
      setBusy(false);
      return;
    }
    
    if (newBarber.mobile.length !== 10) {
      setAddError("Enter a valid 10-digit mobile number.");
      setBusy(false);
      return;
    }

    if (!newBarber.aadhaar || newBarber.aadhaar.length !== 12) {
      setAddError("Aadhaar Number is required and must be exactly 12 digits.");
      setBusy(false);
      return;
    }
    
    try {
      const res = await fetch(`${API}/barber`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          salon_id: salonId,
          name: newBarber.name,
          mobile: newBarber.mobile,
          password: newBarber.password,
          specialization: newBarber.specialization,
          experience: Number(newBarber.experience) || 0,
          email: newBarber.email,
          aadhaar: newBarber.aadhaar,
          pan: newBarber.pan,
          photo: newBarber.photoPreview || "",
          document: newBarber.document || "",
          documentName: newBarber.documentName || ""
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/owner/barbers", { state: { highlightBarberId: data.barber._id } });
        }, 1200);
      } else {
        setAddError(data.message || "Failed to add barber");
      }
    } catch (err) {
      setAddError("Network error adding barber");
    } finally {
      setBusy(false);
    }
  };

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

      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate("/owner/barbers")}
          className="mb-6 flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase text-stone-400 hover:text-stone-600 transition-colors group cursor-pointer font-sans"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform text-[#C5A059]" /> 
          Back to Team List
        </button>

        <div className="card p-8 bg-white shadow-lg text-left relative overflow-hidden">
          <h2 className="font-serif text-2xl tracking-normal text-stone-900 font-bold uppercase mb-1">
            Add New Barber
          </h2>
          <p className="text-stone-400 text-xs font-sans mb-6">
            Credentials will be saved and barber can login to their dashboard
          </p>

          <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-2xl p-4 mb-6 text-xs font-semibold text-stone-700">
            <span className="text-[#C5A059] block font-bold mb-1">After adding barber, they can login at /barber/login with:</span>
            <span>Mobile number + Password you set below</span>
          </div>

          {addError && (
            <p className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-center text-xs font-bold text-red-600 font-sans">
              {addError}
            </p>
          )}

          {success && (
            <div className="absolute inset-0 bg-[#FAF6F0] z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-4xl mb-4 shadow-sm animate-bounce">
                🎉
              </div>
              <h3 className="font-serif text-2xl text-stone-900 font-bold uppercase mb-2">Profile Created Successfully!</h3>
              <p className="text-stone-500 text-sm max-w-xs font-sans leading-relaxed mb-6">
                Saving credentials and setting up the barber dashboard...
              </p>
              <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping inline-block mr-1"></span>
                Redirecting to details page...
              </div>
            </div>
          )}

          <form onSubmit={handleAddBarber} className="space-y-6">
            {/* Photo & Document Upload Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">Profile Photo</label>
                <div 
                  className="upload-box flex flex-col justify-center items-center h-[172px]" 
                  onClick={() => photoRef.current?.click()}
                  style={newBarber.photoPreview ? { padding: 0 } : {}}
                >
                  {newBarber.photoPreview ? (
                    <div className="relative w-full h-full">
                      <img src={newBarber.photoPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      <button 
                        type="button"
                        onClick={e => { e.stopPropagation(); setNewBarber(p => ({ ...p, photo: null, photoPreview: null })); }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Upload className="w-8 h-8 text-[#C5A059] mb-2 stroke-[2.5px] mx-auto" />
                      <p className="text-xs font-semibold text-stone-600 font-sans">Click to upload photo</p>
                      <p className="text-[10px] text-stone-400 font-sans mt-0.5">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">ID / Document</label>
                <div className="upload-box flex flex-col justify-center items-center h-[172px]" onClick={() => docRef.current?.click()}>
                  {newBarber.documentName ? (
                    <div className="w-full p-3 bg-emerald-50/50 border border-emerald-200/50 rounded-xl text-center">
                      <Upload className="w-8 h-8 text-emerald-600 mb-2 stroke-[2.5px] mx-auto" />
                      <p className="text-xs font-bold text-emerald-800 truncate px-2">{newBarber.documentName}</p>
                      <button 
                        type="button"
                        onClick={e => { e.stopPropagation(); setNewBarber(p => ({ ...p, document: null, documentName: "" })); }}
                        className="mt-2 text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <Upload className="w-8 h-8 text-[#C5A059] mb-2 stroke-[2.5px] mx-auto" />
                      <p className="text-xs font-semibold text-stone-600 font-sans">Upload ID/Aadhar</p>
                      <p className="text-[10px] text-stone-400 font-sans mt-0.5">PDF, JPG, PNG</p>
                    </div>
                  )}
                </div>
                <input ref={docRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleDocChange} />
              </div>
            </div>

            {/* Form Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Full Name *</label>
                <input 
                  required 
                  placeholder="Rahul Sharma" 
                  value={newBarber.name} 
                  onChange={e => setNewBarber(prev => ({ ...prev, name: e.target.value }))} 
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
                  value={newBarber.mobile} 
                  onChange={e => setNewBarber(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, "") }))} 
                  className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Password *</label>
                <input 
                  required 
                  type="password"
                  placeholder="Set login password" 
                  value={newBarber.password} 
                  onChange={e => setNewBarber(prev => ({ ...prev, password: e.target.value }))} 
                  className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Specialization</label>
                <input 
                  required 
                  placeholder="Haircut & Fade" 
                  value={newBarber.specialization} 
                  onChange={e => setNewBarber(prev => ({ ...prev, specialization: e.target.value }))} 
                  className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Experience (Years) *</label>
                <input 
                  required 
                  type="number"
                  min="0"
                  placeholder="5" 
                  value={newBarber.experience} 
                  onChange={e => setNewBarber(prev => ({ ...prev, experience: e.target.value }))} 
                  className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Email (Optional)</label>
                <input 
                  type="email"
                  placeholder="barber@email.com" 
                  value={newBarber.email} 
                  onChange={e => setNewBarber(prev => ({ ...prev, email: e.target.value }))} 
                  className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">Aadhaar Number *</label>
                <input 
                  required
                  maxLength={12}
                  placeholder="12 digit Aadhaar" 
                  value={newBarber.aadhaar} 
                  onChange={e => setNewBarber(prev => ({ ...prev, aadhaar: e.target.value.replace(/\D/g, "") }))} 
                  className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] block mb-1.5">PAN Card Number (Optional)</label>
                <input 
                  maxLength={10}
                  placeholder="ABCDE1234F" 
                  value={newBarber.pan} 
                  onChange={e => setNewBarber(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))} 
                  className="w-full rounded-xl border border-[#EADBCE] bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400" 
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4 border-t border-stone-100 mt-6 font-sans">
              <button 
                type="submit" 
                disabled={busy}
                className="rounded-xl px-6 py-3.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-md hover:opacity-95 transition-all cursor-pointer flex-1 disabled:opacity-50" 
                style={{ background: CHARCOAL }}
              >
                {busy ? "Creating Profile..." : "Create Profile"}
              </button>
              <button 
                type="button" 
                onClick={() => navigate("/owner/barbers")} 
                className="rounded-xl bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
