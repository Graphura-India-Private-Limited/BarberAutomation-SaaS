import React from "react";
import { X, CheckCircle, Info, AlertTriangle, Bell, DollarSign, CalendarDays } from "lucide-react";

const typeStyles = {
  system: { bg: "bg-gray-800", text: "text-white", icon: <Info className="w-5 h-5 text-gray-400" /> },
  booking: { bg: "bg-blue-600", text: "text-white", icon: <CalendarDays className="w-5 h-5 text-blue-200" /> },
  payment: { bg: "bg-green-600", text: "text-white", icon: <DollarSign className="w-5 h-5 text-green-200" /> },
  queue: { bg: "bg-yellow-500", text: "text-white", icon: <AlertTriangle className="w-5 h-5 text-yellow-100" /> },
  promotional: { bg: "bg-purple-600", text: "text-white", icon: <Bell className="w-5 h-5 text-purple-200" /> },
  success: { bg: "bg-emerald-500", text: "text-white", icon: <CheckCircle className="w-5 h-5 text-emerald-100" /> }
};

export default function ToastAlert({ toast, onClose }) {
  const style = typeStyles[toast.type] || typeStyles.system;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl transition-all duration-300 ease-in-out transform translate-y-0 opacity-100 ${style.bg} ${style.text} min-w-[300px]`}>
      <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-bold">{toast.title}</h4>
        <p className="text-xs opacity-90 mt-1">{toast.message}</p>
      </div>
      <button onClick={onClose} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
