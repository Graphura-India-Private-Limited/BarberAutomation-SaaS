import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  BarChart2,
  CreditCard,
  DollarSign,
  Edit,
  LogOut,
  LayoutDashboard,
  MapPin,
} from "lucide-react";

import Navbar from "../../Components/layout/Navbar";
import Footer from "../../Components/layout/Footer";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const emptyForm = {
  salon_name: "",
  owner_name: "",
  email: "",
  address: "",
  latitude: 0,
  longitude: 0,
  opening_time: "09:00",
  closing_time: "21:00",
  services_offered: "",
  basic_pricing: "",
  number_of_barbers: "",
  support_number: "",
  images: [],
  about: "",
};

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [salon, setSalon] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/owner/login");
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/owner/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Unable to load profile");
      }

      syncSalon(data.salon);
    } catch (err) {
      setError(err.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const syncSalon = (nextSalon) => {
    setSalon(nextSalon);

    setForm({
      salon_name: nextSalon?.salon_name || "",
      owner_name: nextSalon?.owner_name || "",
      email: nextSalon?.email || "",
      address: nextSalon?.address || "",
      latitude: nextSalon?.latitude || 0,
      longitude: nextSalon?.longitude || 0,
      opening_time: nextSalon?.opening_time || "09:00",
      closing_time: nextSalon?.closing_time || "21:00",
      services_offered: (nextSalon?.services_offered || []).join(", "),
      basic_pricing: nextSalon?.basic_pricing || "",
      number_of_barbers: nextSalon?.number_of_barbers || "",
      support_number: nextSalon?.support_number || "",
      images: nextSalon?.images || [],
      about: nextSalon?.about || "",
    });
  };

  const setField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const statusMeta = useMemo(() => {
    if (salon?.status === "approved") {
      return {
        label: "Approved & Live",
        dot: "bg-emerald-500",
      };
    }

    if (salon?.status === "rejected") {
      return {
        label: "Rejected",
        dot: "bg-rose-500",
      };
    }

    return {
      label: "Pending Verification",
      dot: "bg-amber-500",
    };
  }, [salon?.status]);

  const approved = salon?.status === "approved";

  const payload = () => ({
    ...form,
    services_offered: form.services_offered
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),

    basic_pricing: Number(form.basic_pricing) || 0,
    number_of_barbers: Number(form.number_of_barbers) || 0,
  });

  const saveProfile = async (resubmit = false) => {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        `${API}/auth/owner/${resubmit ? "resubmit" : "profile"}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload()),
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Update failed");
      }

      syncSalon(data.salon);

      setEditing(false);

      setMessage(
        resubmit
          ? "Profile resubmitted for approval."
          : "Profile updated successfully."
      );
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const tagLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setField("latitude", position.coords.latitude);
        setField("longitude", position.coords.longitude);
        setMessage("Location updated.");
      },
      () => setError("Location permission denied.")
    );
  };

  const addImages = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5);

    const encoded = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);

            reader.readAsDataURL(file);
          })
      )
    );

    setField("images", [...form.images, ...encoded].slice(0, 5));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/owner/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
        <Navbar />

        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
              <Scissors className="w-6 h-6 text-amber-600" />
            </div>

            <p className="text-stone-600 text-sm font-semibold tracking-wide">
              Loading Owner Console...
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <Navbar />

      {/* MAIN WRAPPER */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="hidden lg:flex w-64 border-r flex-col justify-between p-6 bg-white border-stone-200 sticky top-0 h-screen">
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b pb-5 border-stone-100">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-50 border border-[#C5A059]/20">
                <Scissors size={18} color="#C5A059" />
              </div>

              <div>
                <div className="text-sm font-black tracking-tight text-stone-900">
                  Barber Pro
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-0.5">
                  Owner Panel
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <SidebarButton
                icon={<LayoutDashboard size={18} color={GOLD} />}
                label="Console Home"
                active
              />

              <SidebarButton
                icon={<Scissors size={18} />}
                label="Barbers & Services"
                onClick={() =>
                  navigate("/owner/manage-services")
                }
              />

              <SidebarButton
                icon={<BarChart2 size={18} />}
                label="Analytics"
                onClick={() =>
                  navigate("/owner/dashboard/analytics")
                }
              />

              <SidebarButton
                icon={<CreditCard size={18} />}
                label="Payments"
                onClick={() => navigate("/owner/payments")}
              />

              <SidebarButton
                icon={<DollarSign size={18} />}
                label="Revenue"
                onClick={() => navigate("/owner/revenue")}
              />
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">

            {/* HEADER */}
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b pb-6 border-stone-200">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-stone-900">
                  Dashboard{" "}
                  <span style={{ color: GOLD }}>Overview</span>
                </h1>

                <p className="text-stone-400 text-[11px] mt-1">
                  {salon?.salon_name || "The Royal Cuts"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#EADBCE]">
                  <span
                    className={`h-2 w-2 rounded-full ${statusMeta.dot}`}
                  />

                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                    {statusMeta.label}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setEditing((prev) => !prev)
                  }
                  className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] tracking-widest text-white uppercase"
                  style={{ background: CHARCOAL }}
                >
                  <Edit size={14} color="#C5A059" />

                  {editing
                    ? "Close Editor"
                    : "Edit Profile"}
                </button>
              </div>
            </header>

            {/* ALERTS */}
            {error && (
              <p className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-center text-xs font-bold text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-center text-xs font-bold text-green-700">
                {message}
              </p>
            )}

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

              {/* LEFT */}
              <section className="space-y-6 lg:col-span-5">

                <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-sm">
                  <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-stone-900">
                    Salon Information
                  </h2>

                  <div className="space-y-3.5">
                    <Info
                      label="Business Name"
                      value={salon?.salon_name}
                    />

                    <Info
                      label="Owner"
                      value={salon?.owner_name}
                    />

                    <Info
                      label="Hours"
                      value={`${salon?.opening_time || "09:00"} - ${salon?.closing_time || "21:00"
                        }`}
                    />

                    <Info
                      label="Address"
                      value={salon?.address}
                    />
                  </div>
                </div>

                <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-sm">
                  <h2 className="mb-4 text-sm font-black uppercase tracking-wider text-stone-900">
                    Gallery
                  </h2>

                  <div className="grid grid-cols-3 gap-2.5">
                    {(form.images || []).map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="aspect-square rounded-xl object-cover border border-stone-100"
                      />
                    ))}

                    {form.images.length === 0 && (
                      <div className="col-span-3 py-8 rounded-xl border border-dashed border-stone-200 text-center text-[10px] font-black uppercase tracking-widest text-stone-400">
                        No Images Uploaded
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* RIGHT */}
              <section className="space-y-6 lg:col-span-7">

                <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-sm">
                  <h2 className="mb-5 text-sm font-black uppercase tracking-wider text-stone-900">
                    Activation Checklist
                  </h2>

                  <div className="space-y-2.5">
                    <ChecklistItem
                      done={!!salon?.salon_name}
                      label="Salon details added"
                    />

                    <ChecklistItem
                      done={
                        !!salon?.latitude &&
                        !!salon?.longitude
                      }
                      label="Location tagged"
                    />

                    <ChecklistItem
                      done={
                        (salon?.services_offered || [])
                          .length > 0
                      }
                      label="Services configured"
                    />

                    <ChecklistItem
                      done={approved}
                      label="Admin verification completed"
                    />
                  </div>
                </div>

                {editing && (
                  <ProfileEditor
                    form={form}
                    setField={setField}
                    addImages={addImages}
                    tagLocation={tagLocation}
                    saveProfile={saveProfile}
                    busy={busy}
                    canResubmit={
                      salon?.status === "rejected"
                    }
                  />
                )}
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

function SidebarButton({
  icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3 text-xs font-bold rounded-xl transition-all ${active
          ? "bg-amber-50/60 text-[#C5A059] border border-amber-200/40"
          : "text-stone-500 hover:bg-stone-50"
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Info({ label, value }) {
  return (
    <div className="border-b last:border-0 pb-2.5 last:pb-0 border-stone-50">
      <label className="text-[9px] font-black uppercase tracking-wider block text-stone-400">
        {label}
      </label>

      <p className="font-bold text-stone-900 mt-0.5 text-sm">
        {value || "Not Added"}
      </p>
    </div>
  );
}

function ChecklistItem({ done, label }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/40 p-3 text-xs">
      <span className="font-semibold text-stone-600">
        {label}
      </span>

      <span
        className={`rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${done
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-amber-50 text-amber-600 border-amber-200/60"
          }`}
      >
        {done ? "Completed" : "Pending"}
      </span>
    </div>
  );
}

function ProfileEditor({
  form,
  setField,
  addImages,
  tagLocation,
  saveProfile,
  busy,
  canResubmit,
}) {
  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white p-3 text-sm font-semibold outline-none focus:border-[#C5A059] transition-all text-stone-800 placeholder-stone-400";

  return (
    <div className="bg-white border border-[#EADBCE] rounded-3xl p-6 shadow-sm">
      <h2 className="mb-5 text-md font-black uppercase tracking-wider text-stone-900 border-b pb-3 border-stone-100">
        Edit Salon Profile
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className={inputClass}
          value={form.salon_name}
          onChange={(e) =>
            setField("salon_name", e.target.value)
          }
          placeholder="Salon Name"
        />

        <input
          className={inputClass}
          value={form.owner_name}
          onChange={(e) =>
            setField("owner_name", e.target.value)
          }
          placeholder="Owner Name"
        />

        <input
          className={inputClass}
          value={form.email}
          onChange={(e) =>
            setField("email", e.target.value)
          }
          placeholder="Email"
        />

        <input
          className={inputClass}
          value={form.support_number}
          onChange={(e) =>
            setField("support_number", e.target.value)
          }
          placeholder="Support Number"
        />
      </div>

      <textarea
        className={`${inputClass} mt-4 min-h-16 resize-none`}
        value={form.address}
        onChange={(e) =>
          setField("address", e.target.value)
        }
        placeholder="Salon Address"
      />

      <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-stone-50">
        <button
          type="button"
          onClick={tagLocation}
          className="rounded-xl border border-[#C5A059] text-[#C5A059] px-5 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-1.5"
        >
          <MapPin size={14} />
          Tag Location
        </button>

        <label className="rounded-xl border border-stone-200 px-5 py-3 text-xs font-black uppercase tracking-widest cursor-pointer">
          Upload Images

          <input
            type="file"
            multiple
            hidden
            onChange={addImages}
          />
        </label>

        <button
          type="button"
          onClick={() => saveProfile(false)}
          disabled={busy}
          className="rounded-xl bg-stone-900 text-white px-6 py-3 text-xs font-black uppercase tracking-widest"
        >
          Save Changes
        </button>

        {canResubmit && (
          <button
            type="button"
            onClick={() => saveProfile(true)}
            disabled={busy}
            className="rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest text-white"
            style={{ background: GOLD }}
          >
            Resubmit
          </button>
        )}
      </div>
    </div>
  );
}