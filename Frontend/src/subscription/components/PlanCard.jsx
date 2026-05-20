import React from "react";
import { Check, Star, Zap, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

/**
 * PlanCard — displays a subscription plan with actions.
 * Used in both the admin plan management view and the public pricing comparison.
 */
export default function PlanCard({ plan, onEdit, onDelete, onToggle, showActions = true, onSelect, selected = false }) {
  const isActive = plan.status === "Active";
  const isUnlimited = (v) => v === -1;

  return (
    <div
      className={`relative flex flex-col rounded-3xl border-2 transition-all duration-200 overflow-hidden
        ${plan.recommended
          ? "border-[#C5A059] shadow-xl shadow-[#C5A059]/20 scale-[1.02]"
          : "border-[#EAD8C0] hover:border-[#C5A059]/50 hover:shadow-lg"}
        ${!isActive ? "opacity-60" : ""}
        ${selected ? "ring-2 ring-[#C5A059] ring-offset-2" : ""}
        bg-white`}
    >
      {/* Recommended badge */}
      {plan.recommended && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <span className="bg-[#C5A059] text-white text-[9px] font-black uppercase tracking-widest px-6 py-1.5 rounded-b-xl flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-white" /> Recommended
          </span>
        </div>
      )}

      {/* Inactive badge */}
      {!isActive && (
        <div className="absolute top-3 right-3">
          <span className="bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            Inactive
          </span>
        </div>
      )}

      <div className={`p-6 ${plan.recommended ? "pt-10" : "pt-6"}`}>
        {/* Plan header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}20` }}>
                <Zap className="w-4 h-4" style={{ color: plan.color }} />
              </div>
              <h3 className="text-lg font-black text-[#3E362E] uppercase tracking-tight">{plan.name}</h3>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full
              ${plan.billingType === "Yearly"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-blue-100 text-blue-700"}`}>
              {plan.billingType}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-[#3E362E]">₹{plan.price.toLocaleString()}</span>
            <span className="text-[#8D7B68] text-sm font-semibold mb-1">
              /{plan.billingType === "Yearly" ? "yr" : "mo"}
            </span>
          </div>
          {plan.billingType === "Yearly" && (
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
              ≈ ₹{Math.round(plan.price / 12).toLocaleString()}/month · Save 20%
            </p>
          )}
        </div>

        {/* Limits */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="bg-[#FDF5E6] rounded-xl p-3 text-center">
            <p className="text-lg font-black text-[#3E362E]">
              {isUnlimited(plan.maxBarbers) ? "∞" : plan.maxBarbers}
            </p>
            <p className="text-[9px] text-[#8D7B68] font-bold uppercase tracking-widest">Barbers</p>
          </div>
          <div className="bg-[#FDF5E6] rounded-xl p-3 text-center">
            <p className="text-lg font-black text-[#3E362E]">
              {isUnlimited(plan.maxBookings) ? "∞" : plan.maxBookings}
            </p>
            <p className="text-[9px] text-[#8D7B68] font-bold uppercase tracking-widest">Bookings</p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#3E362E]">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{f}</span>
            </li>
          ))}
        </ul>

        {/* Support type */}
        <div className="flex items-center gap-2 mb-5 p-3 bg-[#FDF5E6] rounded-xl">
          <span className="text-[10px] font-black text-[#8D7B68] uppercase tracking-widest">Support:</span>
          <span className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">{plan.supportType}</span>
        </div>

        {/* CTA / Actions */}
        {onSelect && (
          <button
            onClick={() => onSelect(plan)}
            className={`w-full py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all
              ${plan.recommended
                ? "bg-[#C5A059] text-white hover:bg-[#b8924e] shadow-lg"
                : "bg-[#3E362E] text-white hover:bg-[#2A241F]"}`}
          >
            {selected ? "✓ Selected" : "Select Plan"}
          </button>
        )}

        {showActions && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit?.(plan)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#FDF5E6] border border-[#EAD8C0] rounded-xl text-[10px] font-black uppercase text-[#3E362E] hover:border-[#C5A059] transition-all"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => onToggle?.(plan.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all
                ${isActive
                  ? "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"}`}
            >
              {isActive ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
              {isActive ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => onDelete?.(plan.id)}
              className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
