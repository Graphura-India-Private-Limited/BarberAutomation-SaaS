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

const initialQueue = [
  { id: 1, customer: "Suresh K.", service: "Haircut", barber: "Ajay", status: "in-progress", time: "10:00 AM" },
  { id: 2, customer: "Dinesh M.", service: "Shave", barber: "Kiran", status: "waiting", time: "10:15 AM" },
  { id: 3, customer: "Prakash R.", service: "Hair Colour", barber: "Ajay", status: "waiting", time: "10:30 AM" },
  { id: 4, customer: "Vijay S.", service: "Haircut + Shave", barber: "Kiran", status: "done", time: "09:45 AM" },
];

// ── Auth Context ─────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) { setCurrentUser(user); return true; }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const canViewFinance = () => {
    if (!currentUser) return false;
    if (currentUser.role === "owner") return true;
    return currentUser.showFinance === true && currentUser.salaryModel !== "fixed";
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, canViewFinance }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ── Queue Context ─────────────────────────────────────────
const QueueContext = createContext(null);

export function QueueProvider({ children }) {
  const [queue, setQueue] = useState(initialQueue);

  const updateStatus = (id, status) =>
    setQueue(q => q.map(item => item.id === id ? { ...item, status } : item));

  const addToQueue = (entry) =>
    setQueue(q => [...q, { ...entry, id: Date.now(), status: "waiting" }]);

  const removeFromQueue = (id) =>
    setQueue(q => q.filter(item => item.id !== id));

  return (
    // <QueueContext.Provider value={{ queue, updateStatus, addToQueue, removeFromQueue }}>
    <QueueContext.Provider
      value={{
        queue,
        setQueue,
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
