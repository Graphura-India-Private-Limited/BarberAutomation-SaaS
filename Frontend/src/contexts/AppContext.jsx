import React, { createContext, useContext, useState } from "react";

// ── Seed Data ────────────────────────────────────────────
export const SALARY_MODELS = { FIXED: "fixed", COMMISSION: "commission" };

export const users = [
  { id: 1, name: "Ravi (Owner)", role: "owner", salonId: "salon-1", email: "ravi@salon.com", password: "owner123" },
  { id: 2, name: "Ajay", role: "barber", salonId: "salon-1", email: "ajay@salon.com", password: "barber123", salaryModel: SALARY_MODELS.COMMISSION, showFinance: true },
  { id: 3, name: "Kiran", role: "barber", salonId: "salon-1", email: "kiran@salon.com", password: "kiran123", salaryModel: SALARY_MODELS.FIXED, showFinance: false },
];

export const salon = {
  id: "salon-1", name: "The Royal Blade", address: "123 MG Road, Nashik", phone: "+91 98765 43210",
};

export const financeData = {
  todayRevenue: 3200, weekRevenue: 18500, monthRevenue: 72000,
  barberBreakdown: [
    { name: "Ajay", today: 1800, commission: "30%", earned: 540 },
    { name: "Kiran", today: 1400, salary: 15000, type: "Fixed" },
  ],
  topServices: [
    { service: "Haircut", count: 12, revenue: 1800 },
    { service: "Shave", count: 8, revenue: 640 },
    { service: "Hair Colour", count: 3, revenue: 760 },
  ],
};

const initialQueue = [];

const getInitialBookings = () => {
  return [];
};


// ── Auth Context ─────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const showFinance = localStorage.getItem("showFinance") === "true";
    const salaryModel = localStorage.getItem("salaryModel");
    if (token && role) {
      return { token, role, name, email, showFinance, salaryModel };
    }
    return null;
  });

  const syncAuth = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const showFinance = localStorage.getItem("showFinance") === "true";
    const salaryModel = localStorage.getItem("salaryModel");
    if (token && role) {
      setCurrentUser({ token, role, name, email, showFinance, salaryModel });
    } else {
      setCurrentUser(null);
    }
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) { 
      setCurrentUser(user); 
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
      localStorage.setItem("showFinance", String(user.showFinance || false));
      localStorage.setItem("salaryModel", user.salaryModel || "");
      return true; 
    }
    return false;
  };

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  const canViewFinance = () => {
    const role = localStorage.getItem("role") || currentUser?.role;
    if (role === "owner") return true;
    const showFinance = localStorage.getItem("showFinance") === "true" || currentUser?.showFinance === true;
    const salaryModel = localStorage.getItem("salaryModel") || currentUser?.salaryModel;
    return showFinance && salaryModel !== "fixed";
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, canViewFinance, syncAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ── Queue Context ─────────────────────────────────────────
const QueueContext = createContext(null);

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState(initialQueue);
  const [bookings, setBookings] = useState(() => getInitialBookings());
  const [servedCount, setServedCount] = useState(0);

  const updateStatus = (id, status) =>
    setQueue(q => q.map(item => item.id === id ? { ...item, status } : item));

  const addToQueue = (entry) =>
    setQueue(q => [...q, { ...entry, id: Date.now(), status: "waiting" }]);

  const removeFromQueue = (id) =>
    setQueue(q => q.filter(item => item.id !== id));

  return (
    <QueueContext.Provider
      value={{
        queue,
        setQueue,
        bookings,
        setBookings,
        servedCount,
        setServedCount,
        updateStatus,
        addToQueue,
        removeFromQueue
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export const useQueue = () => useContext(QueueContext);
