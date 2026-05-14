import React from "react";
import { Tag, Sparkles, Megaphone, Info, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const iconMap = {
  "Offers": <Tag className="w-5 h-5 text-purple-600" />,
  "Discounts": <Sparkles className="w-5 h-5 text-yellow-600" />,
  "Important Updates": <Megaphone className="w-5 h-5 text-red-600" />,
  "Holiday Notices": <Calendar className="w-5 h-5 text-blue-600" />,
  "System": <Info className="w-5 h-5 text-gray-600" />,
};

const bgMap = {
  "Offers": "from-purple-50 to-white border-purple-100",
  "Discounts": "from-yellow-50 to-white border-yellow-100",
  "Important Updates": "from-red-50 to-white border-red-100",
  "Holiday Notices": "from-blue-50 to-white border-blue-100",
  "System": "from-gray-50 to-white border-gray-100",
};

export default function AnnouncementCard({ announcement }) {
  const { title, message, type, date } = announcement;
  const bgClass = bgMap[type] || bgMap["System"];
  const icon = iconMap[type] || iconMap["System"];

  return (
    <div className={`relative p-5 rounded-2xl border bg-gradient-to-br ${bgClass} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        {icon}
      </div>
      <div className="flex gap-4 relative z-10">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-[#3E362E] text-sm md:text-base">{title}</h3>
            <span className="text-[10px] text-stone-500 font-medium whitespace-nowrap ml-3">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </span>
          </div>
          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-white shadow-sm mb-2 text-stone-600">
            {type}
          </span>
          <p className="text-sm text-stone-600 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
