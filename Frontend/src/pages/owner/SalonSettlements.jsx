
import React, { useEffect, useMemo, useState } from "react";
import {
  IndianRupee, Search, ShieldCheck, CreditCard, Sparkles, X,
  PlusCircle, RefreshCw, Download
} from "lucide-react";
import CustomSelect from "../../components/common/CustomSelect";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const money = val => `₹${Number(val || 0).toLocaleString("en-IN")}`;

export default function SalonSettlements() {
  const token = localStorage.getItem("token") || localStorage.getItem("ownerToken");
  const [toast, setToast] = useState("");
  const showToast = (msg) => setToast(msg);

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [settlingPayment, setSettlingPayment] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settlements, setSettlements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, methodFilter, statusFilter, settlements]);

  const fetchSettlements = async () => {
    setRefreshing(true);
    const startTime = Date.now();
    try {
      const res = await fetch(`${API}/payment/owner/settlements`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      const elapsed = Date.now() - startTime;
      const minDelay = 600;
      if (elapsed < minDelay) {
        await new Promise(r => setTimeout(r, minDelay - elapsed));
      }

      if (data.success) {
        setSettlements(data.settlements || []);
        showToast("Ledger updated successfully!");
      } else {
        showToast(data.message || "Failed to load settlements");
      }
    } catch (err) {
      console.error("Error loading settlements:", err);
      showToast("Error loading settlements");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const totals = useMemo(() => {
    let settledSum = 0, cashSum = 0, onlineSum = 0, pendingSum = 0, settledCount = 0, pendingCount = 0;
    settlements.forEach(s => {
      if (s.status === "SETTLED") {
        settledSum += s.balancePaid;
        settledCount++;
        if (s.method === "CASH") cashSum += s.balancePaid;
        else onlineSum += s.balancePaid;
      } else {
        pendingSum += (s.totalAmount - s.tokenPaid);
        pendingCount++;
      }
    });
    return { settledSum, cashSum, onlineSum, pendingSum, settledCount, pendingCount };
  }, [settlements]);

  const filteredSettlements = useMemo(() => {
    return settlements.filter(s => {
      const customerName = s.customerName || "";
      const mobile = s.mobile || "";
      const id = String(s.id || "");
      const matchesSearch = customerName.toLowerCase().includes(search.toLowerCase()) ||
                            mobile.includes(search) ||
                            id.toLowerCase().includes(search.toLowerCase());
      const matchesMethod = methodFilter === "ALL" ||
                            (methodFilter === "CASH" && s.method === "CASH") ||
                            (methodFilter === "ONLINE" && s.method !== "CASH");
      const matchesStatus = statusFilter === "ALL" ||
                            s.status === statusFilter ||
                            (statusFilter === "PENDING_BALANCE" && (s.status === "PENDING" || s.status === "PENDING_BALANCE"));
      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [settlements, search, methodFilter, statusFilter]);

  const paginatedSettlements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSettlements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSettlements, currentPage]);

  const handleSettle = async (paymentMethod) => {
    if (!settlingPayment) return;
    try {
      const res = await fetch(`${API}/payment/${settlingPayment.id}/settle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ method: paymentMethod })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully settled full balance for ${settlingPayment.customerName}!`);
        setSettlingPayment(null);
        fetchSettlements();
      } else {
        showToast(data.message || "Failed to settle dues");
      }
    } catch (err) {
      console.error("Error settling dues:", err);
      showToast("Error settling dues");
    }
  };

  const handleRefresh = () => {
    fetchSettlements();
  };

  const exportToCSV = () => {
    if (filteredSettlements.length === 0) {
      showToast("No settlements to export.");
      return;
    }

    const headersList = [
      "Settlement ID", "Customer Name", "Customer Mobile", "Barber Name",
      "Services", "Total Bill (INR)", "Token Paid (INR)", "Counter Settled (INR)",
      "Method", "Status", "Date & Time"
    ];

    const rows = filteredSettlements.map(s => [
      `="${s.id}"`,
      `"${s.customerName}"`,
      `="${s.mobile}"`,
      `"${s.barberName}"`,
      `"${s.services}"`,
      s.totalAmount,
      s.tokenPaid,
      s.balancePaid,
      `"${s.method}"`,
      `"${s.status}"`,
      `"${s.timestamp}"`
    ]);

    const BOM = "\uFEFF";
    const csvContent = BOM + "sep=,\n" + [
      headersList.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `settlements_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Ledger exported successfully!");
  };

  return (
    <div className="p-6 md:p-10 font-sans text-stone-850 selection:bg-amber-100 min-h-screen animate-in fade-in duration-200" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }

        .card {
          background: #FFFFFF;
          border: 1px solid #EADBCE;
          border-radius: 24px;
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.03);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -4px rgba(28, 25, 23, 0.06);
          border-color: #C5A059;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #EADBCE; border-radius: 10px; }
      `}</style>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="relative rounded-3xl p-6 md:p-8 mb-6 overflow-hidden bg-white border border-[#EADBCE] text-left card hover:transform-none">
          <div className="relative z-10">
            <p className="font-extrabold uppercase tracking-widest text-[11px] text-[#C5A059] mb-1.5">
              Finances &amp; Counter Sales
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
              <span className="font-bold uppercase">Salon</span>
              <span className="italic text-[#C5A059] normal-case font-medium">Settlements</span>
            </h2>
            <p className="text-stone-600 text-sm font-normal leading-relaxed mt-2 max-w-2xl">
              One place to reconcile everything money-related — counter cash / UPI / card settlements.
            </p>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 transform rotate-12 pointer-events-none hidden md:block">
            <CreditCard className="w-32 h-32 text-stone-900" />
          </div>
        </header>

        {/* Actions row */}
        <div className="flex justify-end gap-2.5 mb-4">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold tracking-wider uppercase text-[#3E362E] bg-white border border-[#EADBCE] shadow-sm hover:bg-stone-50 transition-all duration-200 cursor-pointer"
          >
            <Download size={14} className="text-[#C5A059]" /> Export CSV
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold tracking-wider uppercase text-white shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer hover:opacity-90"
            style={{ background: CHARCOAL }}
          >
            <RefreshCw size={14} color={GOLD} className={refreshing ? "animate-spin" : ""} /> Refresh Ledger
          </button>
        </div>

        {/* Dashboard Statistics Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 text-left">
          <div className="bg-white border border-[#EADBCE] rounded-2xl p-5 shadow-3xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Total Settled at Salon</p>
            <h3 className="text-2xl font-mono font-black text-stone-850">{money(totals.settledSum)}</h3>
            <p className="text-[10px] text-[#C5A059] font-bold mt-1 uppercase tracking-wider">{totals.settledCount} transactions</p>
          </div>

          <div className="bg-white border border-[#EADBCE] rounded-2xl p-5 shadow-3xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Cash Settlements</p>
            <h3 className="text-2xl font-mono font-black text-emerald-700">{money(totals.cashSum)}</h3>
            <p className="text-[10px] text-stone-500 font-bold mt-1 uppercase tracking-wider">In-Hand Cash Drawer</p>
          </div>

          <div className="bg-white border border-[#EADBCE] rounded-2xl p-5 shadow-3xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Online / UPI at Salon</p>
            <h3 className="text-2xl font-mono font-black text-sky-700">{money(totals.onlineSum)}</h3>
            <p className="text-[10px] text-stone-500 font-bold mt-1 uppercase tracking-wider">QR & POS Card Terminal</p>
          </div>

          <div className="bg-white border border-[#EADBCE] rounded-2xl p-5 shadow-3xs bg-amber-50/20 border-amber-200/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Pending Studio Dues</p>
            <h3 className="text-2xl font-mono font-black text-amber-700">{money(totals.pendingSum)}</h3>
            <p className="text-[10px] text-amber-800 font-bold mt-1 uppercase tracking-wider">{totals.pendingCount} bookings remaining</p>
          </div>
        </section>

        {/* Filters and Search Utility bar */}
        <section className="mb-6 grid gap-4 p-5 rounded-2xl border border-[#EADBCE] bg-white text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-0.5">Search Counter Payments</span>
            <div className="flex items-center gap-2 rounded-xl border border-[#EADBCE] bg-stone-50/50 px-3 h-10 hover:bg-white focus-within:border-[#C5A059] focus-within:bg-white transition-all">
              <Search size={14} className="text-[#C5A059] shrink-0" />
              <input
                type="text"
                placeholder="Name, mobile or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs outline-none text-stone-850 font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-0.5">Payment Method</span>
            <CustomSelect
              value={methodFilter}
              onChange={setMethodFilter}
              options={[
                { value: "ALL", label: "All Methods" },
                { value: "CASH", label: "Cash Only" },
                { value: "ONLINE", label: "Online (UPI / Card)" }
              ]}
              size="sm"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-0.5">Settlement Status</span>
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "ALL", label: "All Statuses" },
                { value: "SETTLED", label: "Settled Full" },
                { value: "PENDING_BALANCE", label: "Pending Balance" }
              ]}
              size="sm"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => { setSearch(""); setMethodFilter("ALL"); setStatusFilter("ALL"); }}
              className="w-full h-10 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-400 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </section>

        {/* Quick action */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              const firstPending = settlements.find(s => s.status === "PENDING" || s.status === "PENDING_BALANCE");
              if (firstPending) setSettlingPayment(firstPending);
              else showToast("No pending balances left to settle!");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold tracking-wider uppercase text-white shadow-md transition-all duration-200 bg-[#3E362E] hover:opacity-90 cursor-pointer shrink-0"
          >
            <PlusCircle size={14} color={GOLD} /> Settle Counter Dues
          </button>
        </div>

        {/* Ledger Table */}
        <section className="bg-white border border-[#EADBCE] rounded-3xl overflow-hidden text-left shadow-2xs">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Transaction ID</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Customer</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Barber & Services</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Token Paid</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Counter Settled</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-right">Total Bill</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {paginatedSettlements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-400 text-sm italic">
                      No matching settlement transactions found.
                    </td>
                  </tr>
                ) : (
                  paginatedSettlements.map(s => {
                    const isPending = s.status === "PENDING" || s.status === "PENDING_BALANCE";
                    return (
                      <tr key={s.id} className="hover:bg-stone-50/20 transition-colors group">
                        <td className="py-5 px-6">
                          <p className="font-bold text-sm text-stone-900 tracking-tight font-mono">{s.id}</p>
                          <p className="text-[10px] text-stone-400 font-mono mt-0.5">{s.timestamp}</p>
                        </td>

                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center font-bold text-[10px] text-stone-500 font-serif">
                              {s.customerName ? s.customerName[0] : "?"}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-stone-900 tracking-tight">{s.customerName}</p>
                              <p className="text-[10px] text-stone-400 font-mono mt-0.5">{s.mobile}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-5 px-6">
                          <p className="text-xs font-bold text-stone-800">{s.barberName}</p>
                          <p className="text-[10px] text-[#C5A059] font-medium mt-0.5 truncate max-w-[180px]">{s.services}</p>
                        </td>

                        <td className="py-5 px-6 text-center">
                          <span className="font-mono font-bold text-stone-600 text-sm">{money(s.tokenPaid)}</span>
                          <span className="block text-[8px] font-black uppercase text-stone-400 mt-0.5">Online</span>
                        </td>

                        <td className="py-5 px-6 text-center">
                          {isPending ? (
                            <span className="font-mono font-bold text-amber-700 text-sm">—</span>
                          ) : (
                            <>
                              <span className="font-mono font-bold text-emerald-700 text-sm">{money(s.balancePaid)}</span>
                              <span className="block text-[8px] font-black uppercase text-emerald-600 mt-0.5">{s.method}</span>
                            </>
                          )}
                        </td>

                        <td className="py-5 px-6 text-right">
                          <span className="font-mono font-bold text-stone-900 text-sm">{money(s.totalAmount)}</span>
                        </td>

                        <td className="py-5 px-6 text-center">
                          {isPending ? (
                            <button
                              onClick={() => setSettlingPayment(s)}
                              className="rounded-lg bg-amber-50 hover:bg-[#C5A059] border border-amber-200/60 hover:border-transparent text-amber-800 hover:text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer"
                            >
                              Settle Dues
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">
                              <ShieldCheck size={10} /> Fully Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pagination Controls */}
        {(() => {
          const totalPages = Math.ceil(filteredSettlements.length / itemsPerPage) || 1;
          if (totalPages <= 1) return null;
          return (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 bg-white border border-[#EADBCE] rounded-3xl px-6 py-4 card hover:transform-none gap-4">
              <span className="text-xs text-stone-500 font-semibold">
                Showing <span className="text-stone-900 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="text-stone-900 font-bold">
                  {Math.min(currentPage * itemsPerPage, filteredSettlements.length)}
                </span>{" "}
                of <span className="text-stone-900 font-bold">{filteredSettlements.length}</span> transactions
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4.5 py-2.5 text-xs font-black uppercase tracking-wider border border-[#EADBCE] rounded-xl hover:bg-stone-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer text-[#3E362E] disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-xs font-bold text-stone-700 min-w-[80px] text-center">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4.5 py-2.5 text-xs font-black uppercase tracking-wider border border-[#EADBCE] rounded-xl hover:bg-stone-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer text-[#3E362E] disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          );
        })()}

        {/* Settle Balance Dialog Modal */}
        {settlingPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#C5A059]" />
                  <h3 className="font-serif text-lg font-bold text-stone-950">Settle Counter Balance</h3>
                </div>
                <button
                  onClick={() => setSettlingPayment(null)}
                  className="rounded-xl border border-stone-100 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-[#FAF6F0]/65 p-4 rounded-2xl border border-[#EADBCE]/40">
                  <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider mb-1">Customer Profile</p>
                  <p className="font-bold text-stone-900 text-sm">{settlingPayment.customerName} ({settlingPayment.mobile})</p>
                  <p className="text-xs text-stone-500 mt-1">{settlingPayment.services}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{settlingPayment.barberName}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-stone-200 rounded-xl p-3 bg-stone-50">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Total Bill</p>
                    <p className="font-mono font-bold text-stone-900 text-sm">{money(settlingPayment.totalAmount)}</p>
                  </div>
                  <div className="border border-stone-200 rounded-xl p-3 bg-stone-50">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">Token Paid</p>
                    <p className="font-mono font-bold text-stone-600 text-sm">{money(settlingPayment.tokenPaid)}</p>
                  </div>
                  <div className="border border-amber-200 bg-amber-50/20 rounded-xl p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700 mb-0.5">Due Balance</p>
                    <p className="font-mono font-bold text-amber-700 text-sm">{money(settlingPayment.totalAmount - settlingPayment.tokenPaid)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2">Select Counter Settlement Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleSettle("CASH")}
                      className="flex flex-col items-center justify-center p-4 border border-[#EADBCE] rounded-2xl bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer group text-center"
                    >
                      <span className="text-xl mb-1 group-hover:scale-105 transition-transform">💵</span>
                      <span className="text-[10px] font-bold text-stone-700 font-sans">Cash</span>
                    </button>

                    <button
                      onClick={() => handleSettle("UPI (SALON QR)")}
                      className="flex flex-col items-center justify-center p-4 border border-[#EADBCE] rounded-2xl bg-white hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer group text-center"
                    >
                      <span className="text-xl mb-1 group-hover:scale-105 transition-transform">📱</span>
                      <span className="text-[10px] font-bold text-stone-700 font-sans">UPI / QR</span>
                    </button>

                    <button
                      onClick={() => handleSettle("CARD (SALON POS)")}
                      className="flex flex-col items-center justify-center p-4 border border-[#EADBCE] rounded-2xl bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group text-center"
                    >
                      <span className="text-xl mb-1 group-hover:scale-105 transition-transform">💳</span>
                      <span className="text-[10px] font-bold text-stone-700 font-sans">Card POS</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-stone-100">
                <button
                  onClick={() => setSettlingPayment(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className="fixed right-4 top-6 z-50 rounded-xl bg-stone-900 px-5 py-3.5 text-xs font-extrabold tracking-wider uppercase text-white shadow-xl font-sans">{message}</div>;
}
