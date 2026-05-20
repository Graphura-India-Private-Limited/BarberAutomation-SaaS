import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

/* ─── Seed Data ─────────────────────────────────────────────────── */
const INITIAL_PLANS = [
  {
    id: 1,
    name: "Starter",
    billingType: "Monthly",
    price: 999,
    features: ["Queue Management", "Basic Analytics", "Customer Notifications", "Email Support"],
    maxBarbers: 3,
    maxBookings: 200,
    supportType: "Email",
    status: "Active",
    recommended: false,
    color: "#6B7280",
  },
  {
    id: 2,
    name: "Pro",
    billingType: "Monthly",
    price: 2499,
    features: ["Everything in Starter", "Advanced Analytics", "Priority Support", "Custom Branding", "API Access"],
    maxBarbers: 10,
    maxBookings: 1000,
    supportType: "Priority",
    status: "Active",
    recommended: true,
    color: "#F5C842",
  },
  {
    id: 3,
    name: "Enterprise",
    billingType: "Yearly",
    price: 4999,
    features: ["Everything in Pro", "Unlimited Barbers", "Unlimited Bookings", "Dedicated Manager", "White Label", "GST Reports"],
    maxBarbers: -1, // unlimited
    maxBookings: -1,
    supportType: "Dedicated",
    status: "Active",
    recommended: false,
    color: "#C5A059",
  },
];

const INITIAL_SALONS = [
  { id: "s1", name: "The Royal Groom", owner: "Rahul Sharma", mobile: "9999999999" },
  { id: "s2", name: "Vintage Velvet",  owner: "Amit Verma",   mobile: "9123450011" },
  { id: "s3", name: "Sharp Styles",    owner: "Vikram Singh",  mobile: "8877665544" },
  { id: "s4", name: "The Groom Room",  owner: "Priya Nair",    mobile: "9876543210" },
];

const today = new Date();
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r.toISOString().split("T")[0]; };
const subDays = (d, n) => addDays(d, -n);

const INITIAL_ASSIGNMENTS = [
  {
    id: "a1",
    salonId: "s1",
    planId: 2,
    startDate: subDays(today, 20),
    expiryDate: addDays(today, 10),
    paymentStatus: "Paid",
    amountPaid: 2499,
    dueAmount: 0,
    nextBillingDate: addDays(today, 10),
    autoRenew: true,
    trialPeriod: false,
  },
  {
    id: "a2",
    salonId: "s2",
    planId: 1,
    startDate: subDays(today, 35),
    expiryDate: subDays(today, 5),
    paymentStatus: "Overdue",
    amountPaid: 0,
    dueAmount: 999,
    nextBillingDate: subDays(today, 5),
    autoRenew: false,
    trialPeriod: false,
  },
  {
    id: "a3",
    salonId: "s3",
    planId: 3,
    startDate: subDays(today, 10),
    expiryDate: addDays(today, 355),
    paymentStatus: "Paid",
    amountPaid: 4999,
    dueAmount: 0,
    nextBillingDate: addDays(today, 355),
    autoRenew: true,
    trialPeriod: false,
  },
  {
    id: "a4",
    salonId: "s4",
    planId: 1,
    startDate: subDays(today, 5),
    expiryDate: addDays(today, 25),
    paymentStatus: "Pending",
    amountPaid: 0,
    dueAmount: 999,
    nextBillingDate: addDays(today, 25),
    autoRenew: false,
    trialPeriod: true,
  },
];

const INITIAL_BILLING_HISTORY = [
  { id: "inv-001", salonId: "s1", planId: 2, planName: "Pro",        amount: 2499, paymentDate: subDays(today, 20), status: "Paid",    invoiceUrl: "#" },
  { id: "inv-002", salonId: "s1", planId: 1, planName: "Starter",    amount: 999,  paymentDate: subDays(today, 50), status: "Paid",    invoiceUrl: "#" },
  { id: "inv-003", salonId: "s2", planId: 1, planName: "Starter",    amount: 999,  paymentDate: subDays(today, 35), status: "Failed",  invoiceUrl: "#" },
  { id: "inv-004", salonId: "s3", planId: 3, planName: "Enterprise", amount: 4999, paymentDate: subDays(today, 10), status: "Paid",    invoiceUrl: "#" },
  { id: "inv-005", salonId: "s4", planId: 1, planName: "Starter",    amount: 999,  paymentDate: subDays(today, 5),  status: "Pending", invoiceUrl: "#" },
];

/* ─── Context ───────────────────────────────────────────────────── */
const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [plans,          setPlans]          = useState(INITIAL_PLANS);
  const [salons]                            = useState(INITIAL_SALONS);
  const [assignments,    setAssignments]    = useState(INITIAL_ASSIGNMENTS);
  const [billingHistory, setBillingHistory] = useState(INITIAL_BILLING_HISTORY);
  const [toastMsg,       setToastMsg]       = useState(null);

  /* ── Toast helper ─────────────────────────────────────────────── */
  const toast = useCallback((msg, type = "success") => {
    setToastMsg({ msg, type, id: Date.now() });
    setTimeout(() => setToastMsg(null), 3500);
  }, []);

  /* ══════════════════════════════════════════════════════════════
     PLAN CRUD
  ══════════════════════════════════════════════════════════════ */
  const addPlan = useCallback((data) => {
    if (!data.name?.trim()) { toast("Plan name is required.", "error"); return false; }
    if (plans.some(p => p.name.trim().toLowerCase() === data.name.trim().toLowerCase())) {
      toast("A plan with this name already exists.", "error"); return false;
    }
    if (Number(data.price) <= 0) { toast("Price must be greater than 0.", "error"); return false; }
    setPlans(prev => [...prev, { ...data, id: Date.now(), status: "Active" }]);
    toast("Plan created successfully ✓");
    return true;
  }, [plans, toast]);

  const updatePlan = useCallback((id, data) => {
    if (!data.name?.trim()) { toast("Plan name is required.", "error"); return false; }
    if (plans.some(p => p.id !== id && p.name.trim().toLowerCase() === data.name.trim().toLowerCase())) {
      toast("A plan with this name already exists.", "error"); return false;
    }
    if (Number(data.price) <= 0) { toast("Price must be greater than 0.", "error"); return false; }
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    toast("Plan updated ✓");
    return true;
  }, [plans, toast]);

  const deletePlan = useCallback((id) => {
    const inUse = assignments.some(a => a.planId === id);
    if (inUse) { toast("Cannot delete a plan currently assigned to salons.", "error"); return false; }
    setPlans(prev => prev.filter(p => p.id !== id));
    toast("Plan deleted");
    return true;
  }, [assignments, toast]);

  const togglePlanStatus = useCallback((id) => {
    setPlans(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
    ));
    toast("Plan status updated ✓");
  }, [toast]);

  /* ══════════════════════════════════════════════════════════════
     ASSIGNMENT CRUD
  ══════════════════════════════════════════════════════════════ */
  const assignPlan = useCallback((data) => {
    const existing = assignments.find(a => a.salonId === data.salonId);
    if (existing) {
      // Upgrade/downgrade — replace
      setAssignments(prev => prev.map(a =>
        a.salonId === data.salonId ? { ...a, ...data, id: a.id } : a
      ));
      toast("Plan updated for salon ✓");
    } else {
      setAssignments(prev => [...prev, { ...data, id: `a${Date.now()}` }]);
      toast("Plan assigned to salon ✓");
    }
    return true;
  }, [assignments, toast]);

  const updatePaymentStatus = useCallback((assignmentId, status) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId ? { ...a, paymentStatus: status, amountPaid: status === "Paid" ? (getPlanById(a.planId)?.price || 0) : a.amountPaid, dueAmount: status === "Paid" ? 0 : a.dueAmount } : a
    ));
    if (status === "Paid") {
      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment) {
        const plan = plans.find(p => p.id === assignment.planId);
        setBillingHistory(prev => [{
          id: `inv-${Date.now()}`,
          salonId: assignment.salonId,
          planId: assignment.planId,
          planName: plan?.name || "Unknown",
          amount: plan?.price || 0,
          paymentDate: new Date().toISOString().split("T")[0],
          status: "Paid",
          invoiceUrl: "#",
        }, ...prev]);
      }
    }
    toast(`Payment status updated to ${status} ✓`);
  }, [assignments, plans, toast]);

  const renewSubscription = useCallback((salonId) => {
    const assignment = assignments.find(a => a.salonId === salonId);
    if (!assignment) return;
    const plan = plans.find(p => p.id === assignment.planId);
    if (!plan) return;
    const newExpiry = addDays(new Date(), plan.billingType === "Yearly" ? 365 : 30);
    setAssignments(prev => prev.map(a =>
      a.salonId === salonId
        ? { ...a, paymentStatus: "Paid", amountPaid: plan.price, dueAmount: 0, expiryDate: newExpiry, nextBillingDate: newExpiry, startDate: new Date().toISOString().split("T")[0] }
        : a
    ));
    setBillingHistory(prev => [{
      id: `inv-${Date.now()}`,
      salonId,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      paymentDate: new Date().toISOString().split("T")[0],
      status: "Paid",
      invoiceUrl: "#",
    }, ...prev]);
    toast("Subscription renewed successfully ✓");
  }, [assignments, plans, toast]);

  /* ══════════════════════════════════════════════════════════════
     HELPERS / SELECTORS
  ══════════════════════════════════════════════════════════════ */
  const getPlanById = useCallback((id) => plans.find(p => p.id === id), [plans]);

  const getSalonById = useCallback((id) => salons.find(s => s.id === id), [salons]);

  const getAssignmentBySalon = useCallback((salonId) =>
    assignments.find(a => a.salonId === salonId), [assignments]);

  const getBillingHistoryBySalon = useCallback((salonId) =>
    billingHistory.filter(b => b.salonId === salonId), [billingHistory]);

  /** Returns subscription status for a salon: active | expiring | expired | none */
  const getSubscriptionStatus = useCallback((salonId) => {
    const a = assignments.find(a => a.salonId === salonId);
    if (!a) return "none";
    const today = new Date();
    const expiry = new Date(a.expiryDate);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (a.paymentStatus === "Overdue") return "expired";
    if (daysLeft < 0) return "expired";
    if (daysLeft <= 7) return "expiring";
    return "active";
  }, [assignments]);

  const getDaysRemaining = useCallback((salonId) => {
    const a = assignments.find(a => a.salonId === salonId);
    if (!a) return 0;
    const today = new Date();
    const expiry = new Date(a.expiryDate);
    return Math.max(0, Math.ceil((expiry - today) / (1000 * 60 * 60 * 24)));
  }, [assignments]);

  /** Check if a salon has access (active/paid subscription) */
  const hasAccess = useCallback((salonId) => {
    const status = getSubscriptionStatus(salonId);
    return status === "active" || status === "expiring";
  }, [getSubscriptionStatus]);

  /* Revenue stats */
  const revenueStats = {
    totalRevenue: billingHistory.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0),
    activeSubscriptions: assignments.filter(a => {
      const d = getDaysRemaining(a.salonId);
      return d > 0 && a.paymentStatus !== "Overdue";
    }).length,
    overdueCount: assignments.filter(a => a.paymentStatus === "Overdue" || getDaysRemaining(a.salonId) < 0).length,
    pendingRevenue: assignments.filter(a => a.paymentStatus === "Pending" || a.paymentStatus === "Overdue").reduce((s, a) => s + a.dueAmount, 0),
  };

  return (
    <SubscriptionContext.Provider value={{
      plans, salons, assignments, billingHistory,
      toastMsg,
      // Plan CRUD
      addPlan, updatePlan, deletePlan, togglePlanStatus,
      // Assignment
      assignPlan, updatePaymentStatus, renewSubscription,
      // Helpers
      getPlanById, getSalonById, getAssignmentBySalon,
      getBillingHistoryBySalon, getSubscriptionStatus,
      getDaysRemaining, hasAccess,
      revenueStats,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used inside <SubscriptionProvider>");
  return ctx;
}
