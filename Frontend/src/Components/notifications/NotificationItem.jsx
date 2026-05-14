import React from "react";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays, DollarSign, Clock, Tag, Info, Check } from "lucide-react";

const iconMap = {
  booking: <CalendarDays className="w-4 h-4 text-blue-500" />,
  payment: <DollarSign className="w-4 h-4 text-green-500" />,
  queue: <Clock className="w-4 h-4 text-yellow-500" />,
  promotional: <Tag className="w-4 h-4 text-purple-500" />,
  system: <Info className="w-4 h-4 text-gray-500" />,
};

const bgMap = {
  booking: "bg-blue-50",
  payment: "bg-green-50",
  queue: "bg-yellow-50",
  promotional: "bg-purple-50",
  system: "bg-gray-50",
};

export default function NotificationItem({ notification, onMarkRead }) {
  const { id, title, message, time, type, read } = notification;

  return (
    <div className={`p-4 border-b border-[#EADDCA]/30 flex gap-3 transition-colors ${read ? "opacity-60 bg-white" : "bg-[#FDFBF7]"}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${bgMap[type] || "bg-gray-50"}`}>
        {iconMap[type] || iconMap.system}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`text-sm truncate ${read ? "font-medium text-stone-600" : "font-bold text-[#3E362E]"}`}>
            {title}
          </h4>
          <span className="text-[10px] text-[#8D7B68] whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(time), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed">{message}</p>
      </div>
      {!read && (
        <button 
          onClick={() => onMarkRead(id)} 
          className="flex-shrink-0 self-center text-[#C5A059] hover:bg-[#FEF3E2] p-1.5 rounded-full transition-colors"
          title="Mark as read"
        >
          <Check className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
