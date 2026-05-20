import React, { useState } from "react";
import { Check, X, Star, Zap, ArrowRight } from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";

/**
 * PricingComparison — modern pricing cards with monthly/yearly toggle
 * and a feature comparison table.
 */
export default function PricingComparison({ onSelect, currentPlanId = null }) {
  const { plans } = useSubscription();
  const [billingType, setBillingType] = useState("Monthly");

  const activePlans = plans.filter(p => p.status === "Active");
  const filtered    = activePlans.filter(p => p.billingType === billingType);

  // Build unified feature list for comparison table
  const allFeatures = [...new Set(activePlans.flatMap(p => p.features))];

  return (
    <div className="space-y-8">
      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl p-1">
          {["Monthly", "Yearly"].map(t => (
            <button key={t}
              onClick={() => setBillingType(t)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all
                ${billingType === t ? "bg-[#3E362E] text-white shadow-md" : "text-[#8D7B68] hover:text-[#3E362E]"}`}>
              {t}
              {t === "Yearly" && (
                <span className="ml-2 text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-black">
                  Save 20%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#EAD8C0]">
          <p className="font-bold text-[#8D7B68]">No {billingType} plans available</p>
          <p className="text-sm text-[#8D7B68] mt-1">Switch to the other billing period or ask your admin to create plans.</p>
        </div>
      ) : (
        <div className={`grid gap-6
          ${filtered.length === 1 ? "max-w-sm mx-auto" :
            filtered.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto" :
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {filtered.map(plan => {
            const isCurrent = plan.id === currentPlanId;
            return (
              <div key={plan.id}
                className={`relative flex flex-col rounded-3xl border-2 overflow-hidden transition-all duration-200 bg-white
                  ${plan.recommended
                    ? "border-[#C5A059] shadow-2xl shadow-[#C5A059]/20"
                    : "border-[#EAD8C0] hover:border-[#C5A059]/50 hover:shadow-lg"}`}>

                {/* Recommended ribbon */}
                {plan.recommended && (
                  <div className="bg-gradient-to-r from-[#C5A059] to-[#E8C07A] text-white text-[9px] font-black uppercase tracking-widest text-center py-2 flex items-center justify-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" /> Most Popular
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${plan.color}20` }}>
                      <Zap className="w-5 h-5" style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#3E362E] uppercase">{plan.name}</h3>
                      <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest">{plan.supportType} Support</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-black text-[#3E362E]">₹{plan.price.toLocaleString()}</span>
                      <span className="text-[#8D7B68] font-semibold mb-1.5">/{plan.billingType === "Yearly" ? "yr" : "mo"}</span>
                    </div>
                    {plan.billingType === "Yearly" && (
                      <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                        ≈ ₹{Math.round(plan.price / 12).toLocaleString()}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* Limits */}
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="bg-[#FDF5E6] rounded-xl p-2.5 text-center">
                      <p className="text-base font-black text-[#3E362E]">
                        {plan.maxBarbers === -1 ? "∞" : plan.maxBarbers}
                      </p>
                      <p className="text-[9px] text-[#8D7B68] font-bold uppercase">Barbers</p>
                    </div>
                    <div className="bg-[#FDF5E6] rounded-xl p-2.5 text-center">
                      <p className="text-base font-black text-[#3E362E]">
                        {plan.maxBookings === -1 ? "∞" : plan.maxBookings}
                      </p>
                      <p className="text-[9px] text-[#8D7B68] font-bold uppercase">Bookings</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[#3E362E] font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrent ? (
                    <div className="w-full py-3.5 bg-[#FDF5E6] border-2 border-[#C5A059] rounded-2xl text-center text-sm font-black text-[#C5A059] uppercase tracking-widest">
                      ✓ Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelect?.(plan)}
                      className={`w-full py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                        ${plan.recommended
                          ? "bg-[#C5A059] text-white hover:bg-[#b8924e] shadow-lg"
                          : "bg-[#3E362E] text-white hover:bg-[#2A241F]"}`}>
                      {currentPlanId ? "Switch Plan" : "Get Started"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feature comparison table — only when 2+ plans visible */}
      {filtered.length > 1 && (
        <div className="bg-white rounded-3xl border border-[#EAD8C0] overflow-hidden">
          <div className="p-5 border-b border-[#EAD8C0]">
            <h3 className="font-black text-[#3E362E] text-base uppercase tracking-tight">Feature Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FDF5E6] border-b border-[#EAD8C0]">
                  <th className="px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-[#8D7B68]">Feature</th>
                  {filtered.map(p => (
                    <th key={p.id} className="px-5 py-3 text-center text-[9px] font-black uppercase tracking-widest" style={{ color: p.color }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C0]/50">
                {allFeatures
                  .filter(f => filtered.some(p => p.features.includes(f)))
                  .map(feature => (
                    <tr key={feature} className="hover:bg-[#FFFBF2] transition-colors">
                      <td className="px-5 py-3 text-sm text-[#3E362E] font-medium">{feature}</td>
                      {filtered.map(p => (
                        <td key={p.id} className="px-5 py-3 text-center">
                          {p.features.includes(feature)
                            ? <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                            : <X className="w-4 h-4 text-gray-300 mx-auto" />}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
