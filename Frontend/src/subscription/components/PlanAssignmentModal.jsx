import React, { useState, useEffect } from "react";
import { X, Building2, Calendar, RefreshCw } from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";

const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

export default function PlanAssignmentModal({ onClose, preselectedSalonId = null }) {
  const { plans, salons, assignments, assignPlan, getAssignmentBySalon, getPlanById } = useSubscription();

  const [salonId,    setSalonId]    = useState(preselectedSalonId || "");
  const [planId,     setPlanId]     = useState("");
  const [startDate,  setStartDate]  = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState(addDays(30));
  const [autoRenew,  setAutoRenew]  = useState(false);
  const [errors,     setErrors]     = useState({});

  const activePlans = plans.filter(p => p.status === "Active");

  // When salon changes, pre-fill existing assignment
  useEffect(() => {
    if (!salonId) return;
    const existing = getAssignmentBySalon(salonId);
    if (existing) {
      setPlanId(String(existing.planId));
      setStartDate(existing.startDate);
      setExpiryDate(existing.expiryDate);
      setAutoRenew(existing.autoRenew);
    } else {
      setPlanId("");
      setStartDate(new Date().toISOString().split("T")[0]);
      setExpiryDate(addDays(30));
      setAutoRenew(false);
    }
  }, [salonId, getAssignmentBySalon]);

  // Auto-set expiry when plan changes
  useEffect(() => {
    if (!planId) return;
    const plan = getPlanById(Number(planId));
    if (plan) {
      setExpiryDate(addDays(plan.billingType === "Yearly" ? 365 : 30));
    }
  }, [planId, getPlanById]);

  const validate = () => {
    const e = {};
    if (!salonId) e.salonId = "Select a salon";
    if (!planId)  e.planId  = "Select a plan";
    if (!startDate)  e.startDate  = "Required";
    if (!expiryDate) e.expiryDate = "Required";
    if (expiryDate <= startDate) e.expiryDate = "Expiry must be after start date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const plan = getPlanById(Number(planId));
    assignPlan({
      salonId,
      planId: Number(planId),
      startDate,
      expiryDate,
      paymentStatus: "Pending",
      amountPaid: 0,
      dueAmount: plan?.price || 0,
      nextBillingDate: expiryDate,
      autoRenew,
      trialPeriod: false,
    });
    onClose();
  };

  const inputCls = (key) =>
    `w-full px-4 py-3 bg-[#FDF5E6] border rounded-2xl text-[#3E362E] outline-none focus:bg-white transition-all text-sm font-medium
    ${errors[key] ? "border-red-400" : "border-[#EAD8C0] focus:border-[#C5A059]"}`;

  const labelCls = "block mb-1.5 text-[10px] font-black uppercase tracking-widest text-[#8D7B68]";

  const existingAssignment = salonId ? getAssignmentBySalon(salonId) : null;
  const existingPlan = existingAssignment ? getPlanById(existingAssignment.planId) : null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#EAD8C0]">
        {/* Header */}
        <div className="border-b border-[#EAD8C0] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#3E362E] uppercase tracking-tight">Assign Plan</h2>
            <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest mt-0.5">
              Assign or upgrade a subscription plan to a salon
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#FDF5E6] text-[#8D7B68] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Existing plan notice */}
          {existingAssignment && existingPlan && (
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <RefreshCw className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs font-bold text-amber-700">
                This salon currently has <strong>{existingPlan.name}</strong> plan.
                Saving will upgrade/downgrade it.
              </p>
            </div>
          )}

          {/* Salon selector */}
          <div>
            <label className={labelCls}>
              <Building2 className="w-3 h-3 inline mr-1" /> Salon *
            </label>
            <select
              value={salonId} onChange={e => setSalonId(e.target.value)}
              className={inputCls("salonId")}
              disabled={!!preselectedSalonId}
            >
              <option value="">Select a salon...</option>
              {salons.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.owner}</option>
              ))}
            </select>
            {errors.salonId && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.salonId}</p>}
          </div>

          {/* Plan selector */}
          <div>
            <label className={labelCls}>Subscription Plan *</label>
            <div className="grid grid-cols-1 gap-2">
              {activePlans.map(p => (
                <button key={p.id} type="button"
                  onClick={() => setPlanId(String(p.id))}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 text-left transition-all
                    ${String(planId) === String(p.id)
                      ? "border-[#C5A059] bg-[#FDF5E6]"
                      : "border-[#EAD8C0] hover:border-[#C5A059]/50"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${p.color}20` }}>
                      <span className="text-xs font-black" style={{ color: p.color }}>{p.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-black text-[#3E362E] text-sm">{p.name}</p>
                      <p className="text-[10px] text-[#8D7B68]">{p.billingType} · {p.maxBarbers === -1 ? "Unlimited" : p.maxBarbers} barbers</p>
                    </div>
                  </div>
                  <p className="font-black text-[#3E362E]">₹{p.price.toLocaleString()}</p>
                </button>
              ))}
            </div>
            {errors.planId && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.planId}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>
                <Calendar className="w-3 h-3 inline mr-1" /> Start Date *
              </label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls("startDate")} />
              {errors.startDate && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.startDate}</p>}
            </div>
            <div>
              <label className={labelCls}>
                <Calendar className="w-3 h-3 inline mr-1" /> Expiry Date *
              </label>
              <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className={inputCls("expiryDate")} />
              {errors.expiryDate && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.expiryDate}</p>}
            </div>
          </div>

          {/* Auto renew */}
          <div className="flex items-center justify-between p-3 bg-[#FDF5E6] rounded-2xl border border-[#EAD8C0]">
            <div>
              <p className="text-sm font-black text-[#3E362E]">Auto Renew</p>
              <p className="text-[10px] text-[#8D7B68] font-medium">Automatically renew before expiry</p>
            </div>
            <button type="button"
              onClick={() => setAutoRenew(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-all ${autoRenew ? "bg-[#C5A059]" : "bg-gray-200"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${autoRenew ? "left-6" : "left-1"}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3.5 border-2 border-[#EAD8C0] rounded-2xl text-[#8D7B68] text-sm font-black uppercase tracking-widest hover:border-[#C5A059] transition-all">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3.5 bg-[#3E362E] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#2A241F] shadow-lg transition-all">
              {existingAssignment ? "Update Assignment" : "Assign Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
