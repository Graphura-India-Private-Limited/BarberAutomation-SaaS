import React from "react";
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";

/**
 * SubscriptionStatusCard — shows current plan status for a salon.
 * Used in owner dashboard and billing page.
 */
export default function SubscriptionStatusCard({ salonId, onRenew, compact = false }) {
  const { getAssignmentBySalon, getPlanById, getSubscriptionStatus, getDaysRemaining } = useSubscription();

  const assignment = getAssignmentBySalon(salonId);
  const plan       = assignment ? getPlanById(assignment.planId) : null;
  const status     = getSubscriptionStatus(salonId);
  const daysLeft   = getDaysRemaining(salonId);

  const STATUS_CONFIG = {
    active: {
      bg: "bg-emerald-50 border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
      icon: CheckCircle,
      iconColor: "text-emerald-500",
      label: "Active",
      barColor: "bg-emerald-500",
    },
    expiring: {
      bg: "bg-amber-50 border-amber-200",
      badge: "bg-amber-100 text-amber-700",
      icon: Clock,
      iconColor: "text-amber-500",
      label: "Expiring Soon",
      barColor: "bg-amber-500",
    },
    expired: {
      bg: "bg-red-50 border-red-200",
      badge: "bg-red-100 text-red-700",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      label: "Expired",
      barColor: "bg-red-500",
    },
    none: {
      bg: "bg-gray-50 border-gray-200",
      badge: "bg-gray-100 text-gray-600",
      icon: Zap,
      iconColor: "text-gray-400",
      label: "No Plan",
      barColor: "bg-gray-300",
    },
  };

  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  const totalDays = plan?.billingType === "Yearly" ? 365 : 30;
  const progressPct = Math.min(100, Math.max(0, (daysLeft / totalDays) * 100));

  if (!assignment || !plan) {
    return (
      <div className={`rounded-2xl border p-4 ${cfg.bg}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="font-black text-gray-700 text-sm">No Active Subscription</p>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">Subscribe to unlock all features</p>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`rounded-2xl border p-4 ${cfg.bg} flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${cfg.iconColor} flex-shrink-0`} />
          <div>
            <p className="font-black text-[#3E362E] text-sm">{plan.name} Plan</p>
            <p className="text-[10px] text-[#8D7B68] font-medium">
              {status === "expired" ? "Expired" : `${daysLeft} days remaining`}
            </p>
          </div>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.badge}`}>
          {cfg.label}
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border-2 p-6 ${cfg.bg}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cfg.badge}`}>
            <Icon className={`w-6 h-6 ${cfg.iconColor}`} />
          </div>
          <div>
            <h3 className="font-black text-[#3E362E] text-base">{plan.name} Plan</h3>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-[#3E362E]">₹{plan.price.toLocaleString()}</p>
          <p className="text-[10px] text-[#8D7B68] font-bold">/{plan.billingType === "Yearly" ? "year" : "month"}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-black text-[#8D7B68] uppercase tracking-widest">Days Remaining</span>
          <span className={`text-sm font-black ${status === "expired" ? "text-red-600" : status === "expiring" ? "text-amber-600" : "text-emerald-600"}`}>
            {status === "expired" ? "Expired" : `${daysLeft} / ${totalDays} days`}
          </span>
        </div>
        <div className="h-2 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/60 rounded-xl p-3">
          <p className="text-[9px] font-black text-[#8D7B68] uppercase tracking-widest mb-1">Renewal Date</p>
          <p className="text-sm font-black text-[#3E362E]">
            {new Date(assignment.nextBillingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="bg-white/60 rounded-xl p-3">
          <p className="text-[9px] font-black text-[#8D7B68] uppercase tracking-widest mb-1">Payment</p>
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full
            ${assignment.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" :
              assignment.paymentStatus === "Overdue" ? "bg-red-100 text-red-700" :
              "bg-amber-100 text-amber-700"}`}>
            {assignment.paymentStatus}
          </span>
        </div>
        <div className="bg-white/60 rounded-xl p-3">
          <p className="text-[9px] font-black text-[#8D7B68] uppercase tracking-widest mb-1">Auto Renew</p>
          <p className="text-sm font-black text-[#3E362E]">{assignment.autoRenew ? "✓ Enabled" : "✗ Disabled"}</p>
        </div>
        <div className="bg-white/60 rounded-xl p-3">
          <p className="text-[9px] font-black text-[#8D7B68] uppercase tracking-widest mb-1">Billing</p>
          <p className="text-sm font-black text-[#3E362E]">{plan.billingType}</p>
        </div>
      </div>

      {/* Renew button */}
      {(status === "expired" || status === "expiring" || assignment.paymentStatus !== "Paid") && (
        <button
          onClick={() => onRenew?.(salonId)}
          className="w-full py-3.5 bg-[#C5A059] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#b8924e] shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {status === "expired" ? "Renew Subscription" : "Pay & Renew"}
        </button>
      )}
    </div>
  );
}
