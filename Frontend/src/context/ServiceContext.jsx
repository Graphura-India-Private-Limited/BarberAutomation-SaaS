import { createContext, useContext, useState, useCallback } from "react";

/* ─── Default barbers (mirrors OwnerDashboard) ─────────────────── */
const DEFAULT_BARBERS = [
  { id: 1, name: "John",  img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150" },
  { id: 2, name: "Mike",  img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150" },
  { id: 3, name: "Alex",  img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" },
];

/* ─── Default services ──────────────────────────────────────────── */
const DEFAULT_SERVICES = [
  {
    id: 1, name: "Premium Haircut", category: "Hair", price: 499, duration: 45,
    description: "Precision cut with wash & blow-dry", active: true, popular: true,
    assignedTo: "all", assignedBarbers: [],
    icon: "✂️",
  },
  {
    id: 2, name: "Beard Styling", category: "Beard", price: 299, duration: 30,
    description: "Shape, trim & hot-towel finish", active: true, popular: false,
    assignedTo: "all", assignedBarbers: [],
    icon: "🧔",
  },
  {
    id: 3, name: "Hair Spa & Massage", category: "Spa", price: 899, duration: 60,
    description: "Deep conditioning & scalp massage", active: true, popular: true,
    assignedTo: "individual", assignedBarbers: [1, 3],
    icon: "💆",
  },
  {
    id: 4, name: "Combo (Cut + Beard)", category: "Combo", price: 699, duration: 60,
    description: "Haircut + beard trim in one session", active: true, popular: false,
    assignedTo: "individual", assignedBarbers: [1, 2],
    icon: "🔥",
  },
  {
    id: 5, name: "Facial", category: "Skin", price: 599, duration: 40,
    description: "Deep cleansing & hydration facial", active: false, popular: false,
    assignedTo: "individual", assignedBarbers: [3],
    icon: "🌿",
  },
];

const ServiceContext = createContext(null);

export function ServiceProvider({ children }) {
  const [services, setServices]   = useState(DEFAULT_SERVICES);
  const [barbers]                 = useState(DEFAULT_BARBERS);
  const [toastMsg, setToastMsg]   = useState(null);

  /* ── Toast helper ─────────────────────────────────────────────── */
  const toast = useCallback((msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  }, []);

  /* ── Add service ──────────────────────────────────────────────── */
  const addService = useCallback((data) => {
    // Duplicate name check
    if (services.some(s => s.name.trim().toLowerCase() === data.name.trim().toLowerCase())) {
      toast("A service with this name already exists.", "error");
      return false;
    }
    if (Number(data.price) <= 0) { toast("Price must be greater than 0.", "error"); return false; }
    if (!data.duration)          { toast("Duration is required.", "error"); return false; }

    setServices(prev => [
      ...prev,
      { ...data, id: Date.now(), active: true, popular: false },
    ]);
    toast("Service Added ✓");
    return true;
  }, [services, toast]);

  /* ── Update service ───────────────────────────────────────────── */
  const updateService = useCallback((id, data) => {
    // Duplicate name check (exclude self)
    if (services.some(s => s.id !== id && s.name.trim().toLowerCase() === data.name.trim().toLowerCase())) {
      toast("A service with this name already exists.", "error");
      return false;
    }
    if (Number(data.price) <= 0) { toast("Price must be greater than 0.", "error"); return false; }

    setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    toast("Service Updated ✓");
    return true;
  }, [services, toast]);

  /* ── Delete service ───────────────────────────────────────────── */
  const deleteService = useCallback((id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    toast("Service Deleted");
  }, [toast]);

  /* ── Toggle active ────────────────────────────────────────────── */
  const toggleActive = useCallback((id) => {
    setServices(prev => prev.map(s =>
      s.id === id ? { ...s, active: !s.active } : s
    ));
    toast("Status Updated ✓");
  }, [toast]);

  /* ── Toggle popular ───────────────────────────────────────────── */
  const togglePopular = useCallback((id) => {
    setServices(prev => prev.map(s =>
      s.id === id ? { ...s, popular: !s.popular } : s
    ));
  }, []);

  /* ── Assign service ───────────────────────────────────────────── */
  const assignService = useCallback((id, assignedTo, assignedBarbers) => {
    setServices(prev => prev.map(s =>
      s.id === id ? { ...s, assignedTo, assignedBarbers } : s
    ));
    toast("Assigned Successfully ✓");
  }, [toast]);

  /* ── Get services for a barber ────────────────────────────────── */
  const getServicesForBarber = useCallback((barberId) => {
    return services.filter(s =>
      s.active && (s.assignedTo === "all" || s.assignedBarbers.includes(barberId))
    );
  }, [services]);

  return (
    <ServiceContext.Provider value={{
      services, barbers,
      toastMsg,
      addService, updateService, deleteService,
      toggleActive, togglePopular, assignService,
      getServicesForBarber,
    }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useServices must be used inside <ServiceProvider>");
  return ctx;
}
