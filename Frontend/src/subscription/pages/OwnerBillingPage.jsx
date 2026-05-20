import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, ArrowLeft, RefreshCw, LayoutDashboard,
  History, Star, Bell, ChevronRight,
} from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";
import SubscriptionStatusCard from "../components/SubscriptionStatusCard";
import BillingHistory from "../components/BillingHistory";
import PricingComparison from "../components/PricingComparison";
import RenewalBanner from "../components/RenewalBanner";
import SubscriptionToast from "../components/SubscriptionToast";
import PlanAssignmentModal from "../components/PlanAssignmentModal";

const TABS = [
  { id: "status",  label: "My Subscription", icon: CreditCard },
  { id: "history", label: "Payment History",  icon: History },
  { id: "plans",   label: "Upgrade Plan",     icon: Star },
];

export default function OwnerBillingPage() {
  const navigate  = useNavigate();
  // In production, get salonId from auth context / localStorage
  const salonId   = localStorage.getItem("salonId") || "s1";

  const { renewSubscription, getSubscriptionStatus, getAssignmentBySalon, getPlanById } = useSubscription();

  const [activeTab,   setActiveTab]   = useState("status");
  const [upgradeModal,setUpgradeModal]= useState(false);

  const status     = getSubscriptionStatus(salonId);
  const assignment = getAssignmentBySalon(salonId);
  const plan       = assignment ? getPlanById(assignment.planId) : null;

  const handleRenew = (sid) => renewSubscription(sid);

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans">
      <SubscriptionToast />

      {/* Renewal banner */}
      <RenewalBanner salonId={salonId} onRenew={handleRenew} />

      {/* Header */}
      <header className="bg-white border-b border-orange-100 px-4 sm:px-6 xl:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/owner/dashboard")}
            className="p-2 rounded-xl border border-orange-100 text-gray-600 hover:bg-orange-50 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase text-gray-800">
              Billing <span className="text-[#C5A059]">&amp; Subscription</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              Manage your plan and payments
            </p>
          </div>
        </div>

        {/* Quick status pill */}
        <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest
          ${status === "active"   ? "bg-emerald-100 text-emerald-700" :
            status === "expiring" ? "bg-amber-100 text-amber-700" :
            status === "expired"  ? "bg-red-100 text-red-700" :
            "bg-gray-100 text-gray-600"}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse
            ${status === "active"   ? "bg-emerald-500" :
              status === "expiring" ? "bg-amber-500" :
              status === "expired"  ? "bg-red-500" :
              "bg-gray-400"}`} />
          {status === "active" ? "Active" : status === "expiring" ? "Expiring Soon" : status === "expired" ? "Expired" : "No Plan"}
        </div>
      </header>

      {/* Tab nav */}
      <div className="bg-white border-b border-orange-100 px-4 sm:px-6 xl:px-8">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap border-b-2 transition-all
                ${activeTab === id
                  ? "border-[#C5A059] text-[#C5A059]"
                  : "border-transparent text-gray-400 hover:text-gray-700"}`}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 xl:p-8 space-y-6">

        {/* ── MY SUBSCRIPTION ── */}
        {activeTab === "status" && (
          <>
            <SubscriptionStatusCard salonId={salonId} onRenew={handleRenew} />

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Upgrade Plan",
                  desc: "Switch to a higher tier",
                  icon: Star,
                  color: "#C5A059",
                  action: () => setActiveTab("plans"),
                },
                {
                  label: "Payment History",
                  desc: "View all invoices",
                  icon: History,
                  color: "#3B82F6",
                  action: () => setActiveTab("history"),
                },
                {
                  label: "Renew Now",
                  desc: "Extend your subscription",
                  icon: RefreshCw,
                  color: "#10B981",
                  action: () => handleRenew(salonId),
                },
              ].map((a, i) => (
                <button key={i} onClick={a.action}
                  className="flex items-center gap-4 p-4 bg-white border border-[#EAD8C0] rounded-2xl hover:border-[#C5A059] hover:shadow-md transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${a.color}15` }}>
                    <a.icon className="w-5 h-5" style={{ color: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#3E362E] text-sm">{a.label}</p>
                    <p className="text-[10px] text-[#8D7B68] font-medium mt-0.5">{a.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#C5A059] transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Plan features summary */}
            {plan && (
              <div className="bg-white border border-[#EAD8C0] rounded-3xl p-6">
                <h3 className="font-black text-[#3E362E] text-base uppercase tracking-tight mb-4">
                  Your Plan Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-[#FDF5E6] rounded-xl">
                      <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-600 text-[10px] font-black">✓</span>
                      </span>
                      <span className="text-sm text-[#3E362E] font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PAYMENT HISTORY ── */}
        {activeTab === "history" && (
          <BillingHistory salonId={salonId} />
        )}

        {/* ── UPGRADE PLAN ── */}
        {activeTab === "plans" && (
          <>
            <div className="text-center mb-2">
              <h2 className="text-2xl font-black text-[#3E362E] uppercase tracking-tight">Choose a Plan</h2>
              <p className="text-[#8D7B68] mt-1 font-medium text-sm">Upgrade or switch your subscription</p>
            </div>
            <PricingComparison
              currentPlanId={assignment?.planId}
              onSelect={(selectedPlan) => {
                setUpgradeModal(true);
              }}
            />
          </>
        )}
      </main>

      {upgradeModal && (
        <PlanAssignmentModal
          preselectedSalonId={salonId}
          onClose={() => setUpgradeModal(false)}
        />
      )}
    </div>
  );
}
