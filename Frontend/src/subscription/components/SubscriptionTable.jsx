import React, { useState } from "react";
import { RefreshCw, Edit2, AlertTriangle, CheckCircle, Clock, XCircle, ChevronDown } from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";

const PAYMENT_STATUS_CONFIG = {
  Paid:      { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle },
  Pending:   { bg: "bg-amber-100",   text: "text-amber-700",   icon: Clock },
  Overdue:   { bg: "bg-red-100",     text: "text-red-700",     icon: AlertTriangle },
  Cancelled: { bg: "bg-gray-100",    text: "text-gray-600",    icon: XCircle },
};

const SUB_STATUS_CONFIG = {
  active:   { bg: "bg-emerald-50", text: "text-emerald-700", label: "Active" },
  expiring: { bg: "bg-amber-50",   text: "text-amber-700",   label: "Expiring" },
  expired:  { bg: "bg-red-50",     text: "text-red-700",     label: "Expired" },
  none:     { bg: "bg-gray-50",    text: "text-gray-600",    label: "No Plan" },
};

export default function SubscriptionTable({ onAssign, onRenew }) {
  const {
    assignments, salons, plans,
    getSalonById, getPlanById,
    getSubscriptionStatus, getDaysRemaining,
    updatePaymentStatus,
  } = useSubscription();

  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [statusMenu, setStatusMenu] = useState(null); // assignmentId

  const FILTERS = [
    { key: "all",      label: "All" },
    { key: "active",   label: "Active" },
    { key: "expiring", label: "Expiring Soon" },
    { key: "expired",  label: "Expired" },
    { key: "pending",  label: "Pending Payment" },
  ];

  const filtered = assignments.filter(a => {
    const salon  = getSalonById(a.salonId);
    const status = getSubscriptionStatus(a.salonId);
    const matchSearch = !search || salon?.name.toLowerCase().includes(search.toLowerCase()) || salon?.owner.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all"      ? true :
      filter === "active"   ? status === "active" :
      filter === "expiring" ? status === "expiring" :
      filter === "expired"  ? status === "expired" :
      filter === "pending"  ? (a.paymentStatus === "Pending" || a.paymentStatus === "Overdue") :
      true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="bg-white rounded-3xl border border-[#EAD8C0] overflow-hidden">
      {/* Table header / filters */}
      <div className="p-5 border-b border-[#EAD8C0] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${filter === f.key
                  ? "bg-[#3E362E] text-white"
                  : "bg-[#FDF5E6] text-[#8D7B68] hover:bg-[#EAD8C0]"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text" placeholder="Search salon or owner..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 bg-[#FDF5E6] border border-[#EAD8C0] rounded-xl text-sm text-[#3E362E] outline-none focus:border-[#C5A059] w-full sm:w-56"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#FDF5E6] border-b border-[#EAD8C0]">
              {["Salon", "Current Plan", "Amount Paid", "Due Amount", "Next Billing", "Payment Status", "Sub Status", "Actions"].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-[9px] font-black uppercase tracking-widest text-[#8D7B68]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAD8C0]/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-[#8D7B68] text-sm font-medium">
                  No subscriptions found
                </td>
              </tr>
            ) : filtered.map(a => {
              const salon  = getSalonById(a.salonId);
              const plan   = getPlanById(a.planId);
              const status = getSubscriptionStatus(a.salonId);
              const days   = getDaysRemaining(a.salonId);
              const pCfg   = PAYMENT_STATUS_CONFIG[a.paymentStatus] || PAYMENT_STATUS_CONFIG.Pending;
              const sCfg   = SUB_STATUS_CONFIG[status];
              const PIcon  = pCfg.icon;

              return (
                <tr key={a.id} className="hover:bg-[#FFFBF2] transition-colors">
                  {/* Salon */}
                  <td className="px-5 py-4">
                    <p className="font-black text-[#3E362E] text-sm">{salon?.name}</p>
                    <p className="text-[10px] text-[#8D7B68] mt-0.5">{salon?.owner}</p>
                  </td>

                  {/* Plan */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${plan?.color}20` }}>
                        <span className="text-[9px] font-black" style={{ color: plan?.color }}>{plan?.name?.[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#3E362E] text-sm">{plan?.name}</p>
                        <p className="text-[9px] text-[#8D7B68]">{plan?.billingType}</p>
                      </div>
                    </div>
                  </td>

                  {/* Amount Paid */}
                  <td className="px-5 py-4">
                    <p className="font-black text-emerald-700 text-sm">₹{a.amountPaid.toLocaleString()}</p>
                  </td>

                  {/* Due Amount */}
                  <td className="px-5 py-4">
                    <p className={`font-black text-sm ${a.dueAmount > 0 ? "text-red-600" : "text-gray-400"}`}>
                      {a.dueAmount > 0 ? `₹${a.dueAmount.toLocaleString()}` : "—"}
                    </p>
                  </td>

                  {/* Next Billing */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#3E362E]">
                      {new Date(a.nextBillingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {days > 0 && (
                      <p className="text-[9px] text-[#8D7B68] mt-0.5">{days} days left</p>
                    )}
                  </td>

                  {/* Payment Status */}
                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setStatusMenu(statusMenu === a.id ? null : a.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${pCfg.bg} ${pCfg.text}`}
                      >
                        <PIcon className="w-3 h-3" />
                        {a.paymentStatus}
                        <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                      </button>
                      {statusMenu === a.id && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-[#EAD8C0] rounded-2xl shadow-xl z-20 overflow-hidden min-w-[140px]">
                          {Object.keys(PAYMENT_STATUS_CONFIG).map(s => (
                            <button key={s}
                              onClick={() => { updatePaymentStatus(a.id, s); setStatusMenu(null); }}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 text-[10px] font-black uppercase hover:bg-[#FDF5E6] transition-all
                                ${PAYMENT_STATUS_CONFIG[s].text}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Sub Status */}
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest ${sCfg.bg} ${sCfg.text}`}>
                      {sCfg.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAssign?.(a.salonId)}
                        className="p-2 bg-[#FDF5E6] border border-[#EAD8C0] rounded-xl text-[#8D7B68] hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                        title="Edit Assignment"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {(status === "expired" || status === "expiring" || a.paymentStatus !== "Paid") && (
                        <button
                          onClick={() => onRenew?.(a.salonId)}
                          className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 hover:bg-emerald-100 transition-all"
                          title="Renew"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="px-5 py-3 border-t border-[#EAD8C0] bg-[#FFFBF2]">
        <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest">
          Showing {filtered.length} of {assignments.length} subscriptions
        </p>
      </div>
    </div>
  );
}
