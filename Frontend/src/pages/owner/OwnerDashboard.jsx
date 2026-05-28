import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors } from "lucide-react";


const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  const [services] = useState([
    { id: 1, name: "Premium Haircut", price: "499" },
    { id: 2, name: "Beard Styling", price: "299" },
  ]);

  useEffect(() => {
    if (!token) {
      navigate("/owner/login");
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

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

    setMessage("");
    setError("");
  };

  const statusMeta = useMemo(() => {
    if (salon?.status === "approved") {
      return {
        label: "Approved",
        dot: "bg-green-500",
        panel: "bg-green-50 border-green-200 text-green-800",
      };
    }

    if (salon?.status === "rejected") {
      return {
        label: "Rejected",
        dot: "bg-red-500",
        panel: "bg-red-50 border-red-200 text-red-800",
      };
    }

    return {
      label: "Pending Approval",
      dot: "bg-yellow-500",
      panel: "bg-yellow-50 border-yellow-200 text-yellow-800",
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
          : "Profile updated."
      );
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const tagLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
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

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

          .font-sans-loading {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
        `}</style>

        <div
          style={{ background: "#FAF6F0" }}
          className="min-h-screen flex items-center justify-center font-sans-loading"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-pulse">
              <Scissors className="w-6 h-6 text-amber-600" />
            </div>

            <p className="text-zinc-600 text-sm font-medium">
              Loading Owner Console...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className="min-h-screen p-4 font-sans text-zinc-800 md:p-10"
      style={{ background: "#FAF6F0" }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold md:text-5xl text-zinc-900">
              Owner <span className="text-amber-600">Console</span>
            </h1>

            <div className="mt-2 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />

              <p className="text-xs font-semibold text-zinc-500">
                Salon Status: {statusMeta.label}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => navigate("/owner/manage-services")}
              disabled={!approved}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs font-bold transition hover:bg-zinc-50 shadow-sm disabled:opacity-50"
            >
              Barber & Service Management
            </button>

            <button
              onClick={() => navigate("/owner/dashboard/analytics")}
              disabled={!approved}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs font-bold transition hover:bg-zinc-50 shadow-sm disabled:opacity-50"
            >
              Analytics
            </button>

            <button
              onClick={() => navigate("/owner/payments")}
              disabled={!approved}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs font-bold transition hover:bg-zinc-50 shadow-sm disabled:opacity-50"
            >
              Payments
            </button>

            <button
              onClick={() => navigate("/owner/revenue")}
              disabled={!approved}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-xs font-bold transition hover:bg-zinc-50 shadow-sm disabled:opacity-50"
            >
              Revenue
            </button>

            <button
              onClick={() => setEditing((prev) => !prev)}
              className="rounded-xl bg-zinc-900 px-5 py-3 text-xs font-bold text-white hover:bg-zinc-800 transition shadow-sm"
            >
              {editing ? "Close Editor" : "Edit Profile"}
            </button>

          </div>
        </header>

        {/* Status */}
        <div className={`mb-8 rounded-2xl border p-5 ${statusMeta.panel}`}>
          <p className="text-sm font-bold">
            {approved
              ? "Your salon is live."
              : salon?.status === "rejected"
              ? "Your submission was rejected."
              : "Your salon profile is under review."}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <p className="mb-5 rounded-xl bg-red-50 p-3 text-center text-xs font-bold text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="mb-5 rounded-xl bg-green-50 p-3 text-center text-xs font-bold text-green-700">
            {message}
          </p>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Left */}
          <section className="space-y-8 lg:col-span-5">

            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
              <h2 className="mb-5 text-xl font-bold">
                Salon Details
              </h2>

              <Info label="Business Name" value={salon?.salon_name} />
              <Info label="Owner" value={salon?.owner_name} />

              <Info
                label="Hours"
                value={`${salon?.opening_time || "09:00"} - ${
                  salon?.closing_time || "21:00"
                }`}
              />

              <Info
                label="Address"
                value={salon?.address || "Not added"}
              />

              <Info
                label="Support"
                value={salon?.support_number || "Not added"}
              />
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="mb-4">
      <label className="text-xs font-bold text-amber-600">
        {label}
      </label>

      <p className="font-semibold text-zinc-900 mt-1">
        {value || "Not added"}
      </p>
    </div>
  );
}