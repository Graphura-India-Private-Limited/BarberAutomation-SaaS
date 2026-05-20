import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, Users, TrendingUp, AlertTriangle,
  Plus, LayoutDashboard, Settings, LogOut,
  IndianRupee, BarChart2, Bell, Menu, X,
  Layers, Building2, History, Star,
} from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";
import PlanCard from "../components/PlanCard";
import PlanFormModal from "../components/PlanFormModal";
import SubscriptionTable from "../components/SubscriptionTable";
import BillingHistory from "../components/BillingHistory";
import PlanAssignmentModal from "../components/PlanAssignmentModal";
import PricingComparison from "../components/PricingComparison";
import SubscriptionToast from "../components/SubscriptionToast";

const NAV = [
  { id: "overview",   label: "Overview",       icon: LayoutDashboard },
  { id: "plans",      label: "Manage Plans",   icon: Layers },
  { id: "salons",     label: "Salon Billing",  icon: Building2 },
  { id: "history",    label: "Payment History",icon: History },
  { id: "pricing",    label: "Pricing Page",   icon: Star },
];

export default function AdminSubscriptionDashboard() {
  const navigate = useNavigate();
  const {
    plans, revenueStats,
    addPlan, updatePlan, deletePlan, togglePlanStatus,
    renewSubscription,
  } = useSubscription();

  const [activeTab,    setActiveTab]    = useState("overview");
  const [sideOpen,     setSideOpen]     = useState(false);
  const [planModal,    setPlanModal]    = useState(false);
  const [editPlan,     setEditPlan]     = useState(null);
  const [assignModal,  setAssignModal]  = useState(false);
  const [assignSalon,  setAssignSalon]  = useState(null);
  const [deleteConfirm,setDeleteConfirm]= useState(null);

  /* ── Plan handlers ── */
  const handleSavePlan = (data) => {
    const ok = editPlan ? updatePlan(editPlan.id, data) : addPlan(data);
    if (ok) { setPlanModal(false); setEditPlan(null); }
  };

  const handleEdit = (plan) => { setEditPlan(plan); setPlanModal(true); };

  const handleDelete = (id) => {
    const ok = deletePlan(id);
    if (ok) setDeleteConfirm(null);
  };

  const handleAssign = (salonId = null) => {
    setAssignSalon(salonId);
    setAssignModal(true);
  };

  const handleRenew = (salonId) => renewSubscription(salonId);

  /* ── Stat cards ── */
  const STATS = [
    { label: "Total Revenue",         value: `₹${revenueStats.totalRevenue.toLocaleString()}`,    icon: IndianRupee, color: "#C5A059",  bg: "bg-[#FDF5E6]" },
    { label: "Active Subscriptions",  value: revenueStats.activeSubscriptions,                    icon: Users,       color: "#10B981",  bg: "bg-emerald-50" },
    { label: "Overdue / Expired",     value: revenueStats.overdueCount,                           icon: AlertTriangle,color: "#EF4444", bg: "bg-red-50" },
    { label: "Pending Revenue",       value: `₹${revenueStats.pendingRevenue.toLocaleString()}`,  icon: TrendingUp,  color: "#3B82F6",  bg: "bg-blue-50" },
  ];

  return (
    <div className="flex min-h-screen bg-[#faf8f5] font-sans">
      <SubscriptionToast />

      {/* ═══ SIDEBAR ═══ */}
      {sideOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSideOpen(false)} />
      )}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-56 xl:w-60 bg-[#1e1a14] text-white flex flex-col
        transition-transform duration-300
        ${sideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="flex flex-col items-center py-7 px-4 border-b border-white/10">
          <div className="w-14 h-14 bg-[#C5A059]/20 border border-[#C5A059]/30 rounded-2xl flex items-center justify-center text-2xl mb-3">
            <CreditCard className="w-7 h-7 text-[#C5A059]" />
          </div>
          <p className="text-sm font-black text-white uppercase tracking-wide">Subscription</p>
          <p className="text-[10px] tracking-[3px] text-[#C5A059] font-bold uppercase mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id}
              onClick={() => { setActiveTab(id); setSideOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left
                ${activeTab === id
                  ? "bg-[#C5A059] text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Back to admin */}
        <div className="px-3 py-5 border-t border-white/10 space-y-1">
          <button
            onClick={() => navigate("/admin/requests")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white transition-all">
            <LayoutDashboard size={17} /> Admin Panel
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="bg-[#faf8f5] border-b border-orange-100 px-4 sm:px-6 xl:px-8 py-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-xl border border-orange-100 text-gray-600 hover:bg-orange-50"
              onClick={() => setSideOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase leading-tight">
                <span className="text-gray-800">Subscription </span>
                <span className="text-[#C5A059]">&amp; Billing</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                B2B SaaS Platform Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAssign()}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#C5A059] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#b8924e] shadow-md transition-all">
              <Plus size={16} /> Assign Plan
            </button>
            <button
              onClick={() => { setEditPlan(null); setPlanModal(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1e1a14] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all">
              <Plus size={16} /> New Plan
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 xl:p-7 space-y-6">

          {/* ════ OVERVIEW ════ */}
          {activeTab === "overview" && (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s, i) => (
                  <div key={i} className={`${s.bg} border border-[#EAD8C0] rounded-3xl p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <s.icon className="w-5 h-5" style={{ color: s.color }} />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-[#3E362E]">{s.value}</p>
                    <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Plans preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-[#3E362E] uppercase tracking-tight">Active Plans</h2>
                  <button onClick={() => setActiveTab("plans")}
                    className="text-[10px] font-black text-[#C5A059] hover:underline uppercase tracking-widest">
                    Manage All →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {plans.filter(p => p.status === "Active").map(plan => (
                    <PlanCard key={plan.id} plan={plan}
                      onEdit={handleEdit}
                      onDelete={(id) => setDeleteConfirm(id)}
                      onToggle={togglePlanStatus}
                    />
                  ))}
                </div>
              </div>

              {/* Recent billing */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-[#3E362E] uppercase tracking-tight">Recent Payments</h2>
                  <button onClick={() => setActiveTab("history")}
                    className="text-[10px] font-black text-[#C5A059] hover:underline uppercase tracking-widest">
                    View All →
                  </button>
                </div>
                <BillingHistory />
              </div>
            </>
          )}

          {/* ════ MANAGE PLANS ════ */}
          {activeTab === "plans" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#3E362E] uppercase tracking-tight">Subscription Plans</h2>
                  <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest mt-0.5">
                    {plans.length} plans · {plans.filter(p => p.status === "Active").length} active
                  </p>
                </div>
                <button
                  onClick={() => { setEditPlan(null); setPlanModal(true); }}
                  className="flex items-center gap-2 px-5 py-3 bg-[#3E362E] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#2A241F] shadow-md transition-all">
                  <Plus size={16} /> Create Plan
                </button>
              </div>

              {plans.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#EAD8C0]">
                  <CreditCard className="w-12 h-12 text-[#EAD8C0] mx-auto mb-4" />
                  <p className="font-black text-[#3E362E] text-lg">No plans yet</p>
                  <p className="text-[#8D7B68] text-sm mt-1">Create your first subscription plan</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan}
                      onEdit={handleEdit}
                      onDelete={(id) => setDeleteConfirm(id)}
                      onToggle={togglePlanStatus}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ════ SALON BILLING ════ */}
          {activeTab === "salons" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#3E362E] uppercase tracking-tight">Salon Subscriptions</h2>
                  <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest mt-0.5">
                    Manage plan assignments and payment status
                  </p>
                </div>
                <button
                  onClick={() => handleAssign()}
                  className="flex items-center gap-2 px-5 py-3 bg-[#C5A059] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#b8924e] shadow-md transition-all">
                  <Plus size={16} /> Assign Plan
                </button>
              </div>
              <SubscriptionTable onAssign={handleAssign} onRenew={handleRenew} />
            </>
          )}

          {/* ════ PAYMENT HISTORY ════ */}
          {activeTab === "history" && (
            <>
              <div>
                <h2 className="text-xl font-black text-[#3E362E] uppercase tracking-tight">Payment History</h2>
                <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest mt-0.5">
                  All invoices and transactions across all salons
                </p>
              </div>
              <BillingHistory />
            </>
          )}

          {/* ════ PRICING PAGE ════ */}
          {activeTab === "pricing" && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-[#3E362E] uppercase tracking-tight">Choose Your Plan</h2>
                <p className="text-[#8D7B68] mt-2 font-medium">Simple, transparent pricing for every salon</p>
              </div>
              <PricingComparison onSelect={(plan) => {
                setAssignSalon(null);
                setAssignModal(true);
              }} />
            </>
          )}

        </main>
      </div>

      {/* ═══ MODALS ═══ */}
      {planModal && (
        <PlanFormModal
          plan={editPlan}
          onClose={() => { setPlanModal(false); setEditPlan(null); }}
          onSave={handleSavePlan}
        />
      )}

      {assignModal && (
        <PlanAssignmentModal
          preselectedSalonId={assignSalon}
          onClose={() => { setAssignModal(false); setAssignSalon(null); }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border border-[#EAD8C0] text-center">
            <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-black text-[#3E362E] uppercase mb-2">Delete Plan?</h3>
            <p className="text-sm text-[#8D7B68] mb-6">This action cannot be undone. Plans assigned to salons cannot be deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border-2 border-[#EAD8C0] rounded-2xl text-[#8D7B68] font-black uppercase text-sm hover:border-[#C5A059] transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-black uppercase text-sm hover:bg-red-700 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
