import { useServices } from "../context/ServiceContext";
import { Clock, IndianRupee, Star } from "lucide-react";

const CATEGORY_COLORS = {
  Hair:  { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  Beard: { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  Spa:   { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Skin:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  },
  Combo: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Other: { bg: "bg-gray-50",   text: "text-gray-700",   border: "border-gray-200"   },
};

/**
 * BarberServiceList
 * Props:
 *   barberId  — number, the barber's ID (from DEFAULT_BARBERS in ServiceContext)
 *   compact   — boolean, renders a smaller inline version (for dashboard widgets)
 */
export default function BarberServiceList({ barberId, compact = false }) {
  const { getServicesForBarber } = useServices();
  const services = getServicesForBarber(barberId);

  if (services.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <div className="text-3xl mb-2">✂️</div>
        <p className="text-xs font-bold uppercase tracking-widest">No services assigned yet</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {services.map(s => (
          <div key={s.id}
            className="flex items-center gap-3 px-3 py-2.5 bg-orange-50/60 border border-orange-100 rounded-xl hover:border-orange-300 transition-all">
            <span className="text-base flex-shrink-0">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{s.name}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-0.5">
                <Clock size={11} className="text-orange-400" /> {s.duration}m
              </span>
              <span className="text-orange-600 font-black">₹{s.price}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {services.map(s => {
        const cat = CATEGORY_COLORS[s.category] || CATEGORY_COLORS.Other;
        return (
          <div key={s.id}
            className="bg-white border border-orange-100 rounded-2xl p-4 hover:shadow-md hover:border-orange-300 transition-all group">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-gray-800 text-sm truncate">{s.name}</h4>
                  {s.popular && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold flex-shrink-0">
                      <Star size={9} fill="currentColor" /> Popular
                    </span>
                  )}
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.bg} ${cat.text} ${cat.border}`}>
                  {s.category}
                </span>
                {s.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{s.description}</p>
                )}
              </div>

              {/* Price & Duration */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="flex items-center gap-1 text-orange-600 font-black text-lg">
                  <IndianRupee size={14} />
                  {s.price}
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs font-semibold">
                  <Clock size={11} />
                  {s.duration} mins
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
