import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const SUPPORT_TYPES = ["Email", "Chat", "Priority", "Dedicated"];
const BILLING_TYPES = ["Monthly", "Yearly"];
const PLAN_COLORS   = ["#6B7280", "#F5C842", "#C5A059", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444"];

const EMPTY = {
  name: "", billingType: "Monthly", price: "", features: [""],
  maxBarbers: "", maxBookings: "", supportType: "Email",
  recommended: false, color: "#C5A059",
};

export default function PlanFormModal({ plan, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plan) {
      setForm({
        ...plan,
        price: String(plan.price),
        maxBarbers: plan.maxBarbers === -1 ? "unlimited" : String(plan.maxBarbers),
        maxBookings: plan.maxBookings === -1 ? "unlimited" : String(plan.maxBookings),
        features: plan.features.length ? plan.features : [""],
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [plan]);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const setFeature = (i, val) => {
    const f = [...form.features];
    f[i] = val;
    setForm(prev => ({ ...prev, features: f }));
  };

  const addFeature    = () => setForm(f => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (i) => setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())                          e.name = "Plan name is required";
    if (!form.price || Number(form.price) <= 0)     e.price = "Price must be greater than 0";
    if (!form.maxBarbers)                           e.maxBarbers = "Required";
    if (!form.maxBookings)                          e.maxBookings = "Required";
    if (form.maxBarbers !== "unlimited" && isNaN(Number(form.maxBarbers))) e.maxBarbers = "Enter a number or 'unlimited'";
    if (form.maxBookings !== "unlimited" && isNaN(Number(form.maxBookings))) e.maxBookings = "Enter a number or 'unlimited'";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      price: Number(form.price),
      maxBarbers:  form.maxBarbers  === "unlimited" ? -1 : Number(form.maxBarbers),
      maxBookings: form.maxBookings === "unlimited" ? -1 : Number(form.maxBookings),
      features: form.features.filter(f => f.trim()),
    };
    onSave(payload);
  };

  const inputCls = (key) =>
    `w-full px-4 py-3 bg-[#FDF5E6] border rounded-2xl text-[#3E362E] outline-none focus:bg-white transition-all text-sm font-medium
    ${errors[key] ? "border-red-400 focus:border-red-500" : "border-[#EAD8C0] focus:border-[#C5A059]"}`;

  const labelCls = "block mb-1.5 text-[10px] font-black uppercase tracking-widest text-[#8D7B68]";

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EAD8C0]">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#EAD8C0] px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="text-lg font-black text-[#3E362E] uppercase tracking-tight">
              {plan ? "Edit Plan" : "Create New Plan"}
            </h2>
            <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest mt-0.5">
              {plan ? "Update plan details" : "Define a new subscription tier"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#FDF5E6] text-[#8D7B68] hover:text-[#3E362E] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Name + Billing Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Plan Name *</label>
              <input
                type="text" placeholder="e.g. Starter, Pro, Enterprise"
                value={form.name} onChange={e => set("name", e.target.value)}
                className={inputCls("name")}
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.name}</p>}
            </div>
            <div>
              <label className={labelCls}>Billing Type *</label>
              <div className="flex gap-2">
                {BILLING_TYPES.map(t => (
                  <button key={t} type="button"
                    onClick={() => set("billingType", t)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                      ${form.billingType === t
                        ? "bg-[#3E362E] text-white shadow-md"
                        : "bg-[#FDF5E6] border border-[#EAD8C0] text-[#8D7B68] hover:border-[#C5A059]"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Price + Support */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price (₹) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059] font-black text-sm">₹</span>
                <input
                  type="number" min="1" placeholder="999"
                  value={form.price} onChange={e => set("price", e.target.value)}
                  className={`${inputCls("price")} pl-8`}
                />
              </div>
              {errors.price && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.price}</p>}
            </div>
            <div>
              <label className={labelCls}>Support Type *</label>
              <select
                value={form.supportType} onChange={e => set("supportType", e.target.value)}
                className={inputCls("supportType")}
              >
                {SUPPORT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3: Max Barbers + Max Bookings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Max Barbers *</label>
              <input
                type="text" placeholder="e.g. 3 or unlimited"
                value={form.maxBarbers} onChange={e => set("maxBarbers", e.target.value)}
                className={inputCls("maxBarbers")}
              />
              {errors.maxBarbers && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.maxBarbers}</p>}
            </div>
            <div>
              <label className={labelCls}>Max Bookings/Month *</label>
              <input
                type="text" placeholder="e.g. 200 or unlimited"
                value={form.maxBookings} onChange={e => set("maxBookings", e.target.value)}
                className={inputCls("maxBookings")}
              />
              {errors.maxBookings && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.maxBookings}</p>}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className={labelCls}>Plan Color</label>
            <div className="flex gap-2 flex-wrap">
              {PLAN_COLORS.map(c => (
                <button key={c} type="button"
                  onClick={() => set("color", c)}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-[#3E362E] scale-110" : "hover:scale-105"}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls}>Features Included</label>
              <button type="button" onClick={addFeature}
                className="flex items-center gap-1 text-[10px] font-black text-[#C5A059] hover:text-[#b8924e] uppercase tracking-widest transition-all">
                <Plus className="w-3 h-3" /> Add Feature
              </button>
            </div>
            <div className="space-y-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text" placeholder={`Feature ${i + 1}`}
                    value={f} onChange={e => setFeature(i, e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-[#FDF5E6] border border-[#EAD8C0] rounded-xl text-[#3E362E] outline-none focus:border-[#C5A059] focus:bg-white transition-all text-sm"
                  />
                  {form.features.length > 1 && (
                    <button type="button" onClick={() => removeFeature(i)}
                      className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-500 hover:bg-red-100 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended toggle */}
          <div className="flex items-center justify-between p-4 bg-[#FDF5E6] rounded-2xl border border-[#EAD8C0]">
            <div>
              <p className="text-sm font-black text-[#3E362E]">Mark as Recommended</p>
              <p className="text-[10px] text-[#8D7B68] font-medium mt-0.5">Highlights this plan with a special badge</p>
            </div>
            <button type="button"
              onClick={() => set("recommended", !form.recommended)}
              className={`relative w-12 h-6 rounded-full transition-all ${form.recommended ? "bg-[#C5A059]" : "bg-gray-200"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.recommended ? "left-7" : "left-1"}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3.5 border-2 border-[#EAD8C0] rounded-2xl text-[#8D7B68] text-sm font-black uppercase tracking-widest hover:border-[#C5A059] hover:text-[#3E362E] transition-all">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3.5 bg-[#3E362E] text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#2A241F] shadow-lg transition-all">
              {plan ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
