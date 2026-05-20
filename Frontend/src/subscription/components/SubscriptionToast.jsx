import React, { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";

const TYPE_CFG = {
  success: { bg: "bg-emerald-600", icon: CheckCircle },
  error:   { bg: "bg-red-600",     icon: XCircle },
  warning: { bg: "bg-amber-500",   icon: AlertTriangle },
  info:    { bg: "bg-blue-600",    icon: Info },
};

/** Single toast pill */
function ToastPill({ toast, onClose }) {
  const cfg  = TYPE_CFG[toast.type] || TYPE_CFG.info;
  const Icon = cfg.icon;

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl min-w-[260px] max-w-sm ${cfg.bg} animate-slide-up`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{toast.msg}</span>
      <button onClick={onClose} className="p-0.5 hover:opacity-70 transition-opacity flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * SubscriptionToast — renders toasts from SubscriptionContext.
 * Mount once near the root (inside SubscriptionProvider).
 */
export default function SubscriptionToast() {
  const { toastMsg } = useSubscription();
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    if (toastMsg) setVisible(toastMsg);
  }, [toastMsg]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center">
      <ToastPill toast={visible} onClose={() => setVisible(null)} />
    </div>
  );
}
