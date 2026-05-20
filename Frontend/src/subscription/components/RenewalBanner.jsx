import React, { useState } from "react";
import { AlertTriangle, X, RefreshCw, Clock } from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";

/**
 * RenewalBanner — sticky warning banner shown when subscription is expiring or expired.
 * Place at the top of owner/barber dashboards.
 */
export default function RenewalBanner({ salonId, onRenew }) {
  const [dismissed, setDismissed] = useState(false);
  const { getSubscriptionStatus, getDaysRemaining, getAssignmentBySalon, getPlanById } = useSubscription();

  const status   = getSubscriptionStatus(salonId);
  const daysLeft = getDaysRemaining(salonId);
  const assignment = getAssignmentBySalon(salonId);
  const plan     = assignment ? getPlanById(assignment.planId) : null;

  if (dismissed || (status !== "expiring" && status !== "expired")) return null;

  const isExpired = status === "expired";

  return (
    <div className={`relative flex items-center gap-3 px-4 py-3 text-sm font-semibold
      ${isExpired
        ? "bg-red-600 text-white"
        : "bg-amber-500 text-white"}`}>

      {/* Icon */}
      <div className="flex-shrink-0">
        {isExpired
          ? <AlertTriangle className="w-5 h-5" />
          : <Clock className="w-5 h-5" />}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        {isExpired ? (
          <span>
            ⚠️ <strong>Subscription expired.</strong> Renew to continue using services.
            Dashboard access is restricted.
          </span>
        ) : (
          <span>
            ⏰ Your <strong>{plan?.name}</strong> subscription expires in{" "}
            <strong>{daysLeft} day{daysLeft !== 1 ? "s" : ""}.</strong>{" "}
            Renew now to avoid service interruption.
          </span>
        )}
      </div>

      {/* Renew CTA */}
      <button
        onClick={() => onRenew?.(salonId)}
        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
          ${isExpired
            ? "bg-white text-red-600 hover:bg-red-50"
            : "bg-white text-amber-700 hover:bg-amber-50"}`}
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Renew Now
      </button>

      {/* Dismiss (only for expiring, not expired) */}
      {!isExpired && (
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
