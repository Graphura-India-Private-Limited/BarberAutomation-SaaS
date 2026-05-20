import React from "react";
import { AlertTriangle, Lock, RefreshCw } from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";

/**
 * AccessGuard — wraps protected content.
 * When a salon's subscription is expired/unpaid, shows a restriction overlay
 * with a blurred preview of the underlying content.
 *
 * Usage:
 *   <AccessGuard salonId="s1" onRenew={handleRenew}>
 *     <ProtectedContent />
 *   </AccessGuard>
 */
export default function AccessGuard({ salonId, children, onRenew }) {
  const { hasAccess, getSubscriptionStatus, getAssignmentBySalon, getPlanById } = useSubscription();

  const status     = getSubscriptionStatus(salonId);
  const canAccess  = hasAccess(salonId);
  const assignment = getAssignmentBySalon(salonId);
  const plan       = assignment ? getPlanById(assignment.planId) : null;

  if (canAccess) return <>{children}</>;

  return (
    <div className="relative min-h-[400px] flex items-center justify-center overflow-hidden rounded-3xl">
      {/* Blurred background */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="opacity-20 blur-sm scale-95 pointer-events-none">
          {children}
        </div>
      </div>

      {/* Overlay card */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-md bg-white/95 backdrop-blur-md rounded-3xl border-2 border-red-200 shadow-2xl mx-4">
        <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mb-5 shadow-lg">
          <Lock className="w-10 h-10 text-red-500" />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <h2 className="text-xl font-black text-[#3E362E] uppercase tracking-tight">Access Restricted</h2>
        </div>

        <p className="text-[#8D7B68] text-sm font-medium mb-2 leading-relaxed">
          {status === "expired"
            ? "⚠️ Subscription expired. Renew to continue using services."
            : status === "none"
            ? "No active subscription found. Subscribe to unlock all features."
            : "Payment is pending. Complete payment to restore access."}
        </p>

        {plan && (
          <p className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest mb-5">
            Last Plan: {plan.name} · ₹{plan.price.toLocaleString()}/{plan.billingType === "Yearly" ? "yr" : "mo"}
          </p>
        )}

        {/* Disabled features */}
        <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 text-left">
          <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-3">Disabled Features</p>
          {["Dashboard Access", "Booking Management", "Queue Management", "Staff Management", "Analytics & Reports"].map(f => (
            <div key={f} className="flex items-center gap-2 py-1">
              <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-[8px] font-black">✕</span>
              </div>
              <span className="text-xs text-red-700 font-medium">{f}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onRenew?.(salonId)}
          className="w-full py-4 bg-[#C5A059] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#b8924e] shadow-lg transition-all flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Renew Subscription
        </button>

        <p className="text-[10px] text-[#8D7B68] mt-3 font-medium">
          You can still access Billing &amp; Settings pages
        </p>
      </div>
    </div>
  );
}
