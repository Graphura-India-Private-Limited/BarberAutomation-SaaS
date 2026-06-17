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
  { id: 1, name: 'Amit Shah', customer: 'Amit Shah', phone: '9876543210', mobile: '9876543210', service: 'combo', barber: 'ali', position: 1, joinedAt: Date.now() - 900000, source: 'walk-in', status: 'waiting' },
  { id: 2, name: 'Priya Nair', customer: 'Priya Nair', phone: '9123456789', mobile: '9123456789', service: 'haircut', barber: 'ravi', position: 2, joinedAt: Date.now() - 600000, source: 'booked', status: 'waiting' },
  { id: 3, name: 'Rahul Gupta', customer: 'Rahul Gupta', phone: '9988776655', mobile: '9988776655', service: 'beard', barber: 'james', position: 3, joinedAt: Date.now() - 300000, source: 'walk-in', status: 'waiting' },
  { id: 4, name: 'Sneha Patil', customer: 'Sneha Patil', phone: '9765432109', mobile: '9765432109', service: 'shave', barber: 'ali', position: 4, joinedAt: Date.now() - 120000, source: 'walk-in', status: 'waiting' },
];

const getInitialBookings = () => {
  const now = new Date();
  const pad = n => String(n).padStart(2,'0');
  const today = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  return [
    { id: 101, name: 'Kiran Desai', customer: 'Kiran Desai', phone: '9871234560', mobile: '9871234560', service: 'color', barber: 'ravi', slot: '2:00 PM', date: today, status: 'confirmed' },
    { id: 102, name: 'Meera Joshi', customer: 'Meera Joshi', phone: '9845671230', mobile: '9845671230', service: 'haircut', barber: 'ali', slot: '3:30 PM', date: today, status: 'confirmed' },
    { id: 103, name: 'Arjun Mehta', customer: 'Arjun Mehta', phone: '9732145670', mobile: '9732145670', service: 'combo', barber: 'james', slot: '4:00 PM', date: today, status: 'confirmed' },
  ];
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
