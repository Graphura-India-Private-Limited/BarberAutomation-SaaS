import React, { useState } from "react";
import { Download, RefreshCw, Eye, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { useSubscription } from "../../context/SubscriptionContext";

const STATUS_CFG = {
  Paid:    { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle },
  Pending: { bg: "bg-amber-100",   text: "text-amber-700",   icon: Clock },
  Failed:  { bg: "bg-red-100",     text: "text-red-700",     icon: XCircle },
  Overdue: { bg: "bg-orange-100",  text: "text-orange-700",  icon: AlertTriangle },
};

export default function BillingHistory({ salonId = null }) {
  const { billingHistory, getSalonById } = useSubscription();
  const [filter, setFilter] = useState("all");

  const records  = salonId ? billingHistory.filter(b => b.salonId === salonId) : billingHistory;
  const filtered = records.filter(b => filter === "all" ? true : b.status.toLowerCase() === filter);

  const handleDownload = (inv) => alert(`Downloading invoice ${inv.id}…`);
  const handleRetry    = (inv) => alert(`Retrying payment for invoice ${inv.id}…`);

  return (
    <div className="bg-white rounded-3xl border border-[#EAD8C0] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#EAD8C0] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="font-black text-[#3E362E] text-base uppercase tracking-tight">Payment History</h3>
          <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest mt-0.5">
            {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "paid", "pending", "failed"].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${filter === f ? "bg-[#3E362E] text-white" : "bg-[#FDF5E6] text-[#8D7B68] hover:bg-[#EAD8C0]"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-[#FDF5E6] border-b border-[#EAD8C0]">
              {["Invoice ID", "Salon", "Plan", "Amount", "Payment Date", "Status", "Actions"].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-[9px] font-black uppercase tracking-widest text-[#8D7B68]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAD8C0]/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[#8D7B68] text-sm font-medium">
                  No billing records found
                </td>
              </tr>
            ) : filtered.map(inv => {
              const salon = getSalonById(inv.salonId);
              const cfg   = STATUS_CFG[inv.status] || STATUS_CFG.Pending;
              const Icon  = cfg.icon;
              return (
                <tr key={inv.id} className="hover:bg-[#FFFBF2] transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-black text-[#3E362E] text-sm font-mono">{inv.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    {salonId ? (
                      <p className="text-sm text-gray-400">—</p>
                    ) : (
                      <div>
                        <p className="font-bold text-[#3E362E] text-sm">{salon?.name}</p>
                        <p className="text-[10px] text-[#8D7B68]">{salon?.owner}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#3E362E]">{inv.planName}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-black text-[#3E362E] text-sm">₹{inv.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[#3E362E]">
                      {new Date(inv.paymentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.text}`}>
                      <Icon className="w-3 h-3" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleDownload(inv)}
                        className="p-2 bg-[#FDF5E6] border border-[#EAD8C0] rounded-xl text-[#8D7B68] hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                        title="Download Invoice">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {inv.status === "Failed" && (
                        <button onClick={() => handleRetry(inv)}
                          className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-600 hover:bg-amber-100 transition-all"
                          title="Retry Payment">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-100 transition-all"
                        title="View Details">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#EAD8C0] bg-[#FFFBF2] flex items-center justify-between">
        <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest">{filtered.length} records</p>
        <p className="text-[10px] font-black text-[#3E362E] uppercase tracking-widest">
          Total Collected: ₹{filtered.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
