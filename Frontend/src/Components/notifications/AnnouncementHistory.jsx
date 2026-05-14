import React from "react";
import { useNotification } from "../../context/NotificationContext";
import { Clock, Megaphone, Target, Tag, AlertTriangle, Calendar } from "lucide-react";

const getIconForType = (type) => {
  switch (type) {
    case "Offers": return <Tag className="w-4 h-4 text-green-500" />;
    case "Discounts": return <Tag className="w-4 h-4 text-green-500" />;
    case "Important Updates": return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    case "Holiday Notices": return <Calendar className="w-4 h-4 text-blue-500" />;
    default: return <Megaphone className="w-4 h-4 text-stone-500" />;
  }
};

export default function AnnouncementHistory() {
  const { announcements } = useNotification();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#EADDCA] h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#3E362E] uppercase tracking-widest">Past Announcements</h2>
          <p className="text-sm text-stone-500 mt-1">History of communication sent to customers.</p>
        </div>
        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-[#C5A059]" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 max-h-[350px] pr-2 custom-scrollbar">
        {announcements.length === 0 ? (
          <div className="text-center py-10">
            <Megaphone className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 text-sm font-semibold">No announcements sent yet.</p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div key={ann.id} className="p-4 rounded-2xl border border-[#EADDCA] bg-[#FDFBF7] hover:border-[#C5A059] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1.5 rounded-lg border border-[#EADDCA] shadow-sm">
                    {getIconForType(ann.type)}
                  </div>
                  <h3 className="font-bold text-[#3E362E] text-sm">{ann.title}</h3>
                </div>
                <span className="text-[10px] font-bold text-stone-400 bg-white px-2 py-1 rounded-md border border-[#EADDCA]">
                  {new Date(ann.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-stone-600 text-sm mb-3 pl-10 leading-relaxed">
                {ann.message}
              </p>
              <div className="flex items-center gap-4 pl-10 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  <Target className="w-3 h-3 text-[#C5A059]" /> {ann.audience}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  <Tag className="w-3 h-3 text-[#C5A059]" /> {ann.type}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
