import React, { useState, useMemo } from "react";
import { 
  IndianRupee, Search, ShieldCheck, CheckCircle2, 
  Clock, CreditCard, ChevronRight, User, Sparkles, X, PlusCircle, 
  HelpCircle, Download
} from "lucide-react";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const money = val => `₹${Number(val || 0).toLocaleString("en-IN")}`;

export default function SalonSettlements() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [settlingPayment, setSettlingPayment] = useState(null);
  const [toast, setToast] = useState("");

  // 1. Initial Mock Settlement Database (Token-paid partials & settled payments)
  const [settlements, setSettlements] = useState([
    {
      id: "SET-8821",
      customerName: "Vansh Test3",
      mobile: "98765 43211",
      services: "Beard Trim, Beard Trim",
      barberName: "Ali (Master Stylist)",
      totalAmount: 450,
      tokenPaid: 100,
      balancePaid: 350,
      method: "CASH",
      status: "SETTLED",
      timestamp: "28 Jun 2026, 4:22 pm"
    },
    {
      id: "SET-8822",
      customerName: "Vijay Patel",
      mobile: "99112 23344",
      services: "Classic Haircut & Styling",
      barberName: "Ravi (Beard Expert)",
      totalAmount: 300,
      tokenPaid: 100,
      balancePaid: 200,
      method: "UPI (SALON QR)",
      status: "SETTLED",
      timestamp: "28 Jun 2026, 3:15 pm"
    },
    {
      id: "SET-8823",
      customerName: "Karan Johar",
      mobile: "98765 00000",
      services: "Royal Shave Treatment",
      barberName: "James (Color Specialist)",
      totalAmount: 250,
      tokenPaid: 100,
      balancePaid: 150,
      method: "CARD (SALON POS)",
      status: "SETTLED",
      timestamp: "27 Jun 2026, 6:40 pm"
    },
    // Pending Balance / Token Only Bookings
    {
      id: "SET-8824",
      customerName: "Vjhoi",
      mobile: "99223 34455",
      services: "Beard Trim, Beard Trim",
      barberName: "Ali (Master Stylist)",
      totalAmount: 450,
      tokenPaid: 100,
      balancePaid: 0,
      method: "PENDING",
      status: "PENDING_BALANCE",
      timestamp: "28 Jun 2026, 3:52 pm"
    },
    {
      id: "SET-8825",
      customerName: "Amit Sharma",
      mobile: "98877 66554",
      services: "Luxury Head Spa Massage",
      barberName: "Ravi (Beard Expert)",
      totalAmount: 600,
      tokenPaid: 150,
      balancePaid: 0,
      method: "PENDING",
      status: "PENDING_BALANCE",
      timestamp: "28 Jun 2026, 5:10 pm"
    }
  ]);

  // Derived Summary Totals
  const totals = useMemo(() => {
    let settledSum = 0;
    let cashSum = 0;
    let onlineSum = 0;
    let pendingSum = 0;
    let settledCount = 0;
    let pendingCount = 0;

    settlements.forEach(s => {
      if (s.status === "SETTLED") {
        settledSum += s.balancePaid;
        settledCount++;
        if (s.method === "CASH") {
          cashSum += s.balancePaid;
        } else {
          onlineSum += s.balancePaid;
        }
      } else {
        pendingSum += (s.totalAmount - s.tokenPaid);
        pendingCount++;
      }
    });

    return { settledSum, cashSum, onlineSum, pendingSum, settledCount, pendingCount };
  }, [settlements]);

  // Filtering Logic
  const filteredSettlements = useMemo(() => {
    return settlements.filter(s => {
      const matchesSearch = s.customerName.toLowerCase().includes(search.toLowerCase()) || 
                            s.mobile.includes(search) || 
                            s.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesMethod = methodFilter === "ALL" || 
                            (methodFilter === "CASH" && s.method === "CASH") ||
                            (methodFilter === "ONLINE" && s.method !== "CASH" && s.method !== "PENDING");
      
      const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [settlements, search, methodFilter, statusFilter]);

  // Handle Mark Settled Action
  const handleSettle = (paymentMethod) => {
    if (!settlingPayment) return;

    setSettlements(prev => prev.map(s => {
      if (s.id === settlingPayment.id) {
        const bal = s.totalAmount - s.tokenPaid;
        return {
          ...s,
          balancePaid: bal,
          method: paymentMethod,
          status: "SETTLED",
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }) + ", Today"
        };
      }
      return s;
    }));

    showToast(`Successfully settled full balance for ${settlingPayment.customerName}!`);
    setSettlingPayment(null);
  };

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="p-6 md:p-10 font-sans text-stone-850 selection:bg-amber-100 min-h-screen animate-in fade-in duration-200" style={{ background: "#FAF6F0" }}>
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3 rounded-xl text-white font-bold text-xs shadow-2xl z-50 animate-in slide-in-from-right bg-emerald-600 flex items-center gap-2">
          <CheckCircle2 size={14} />
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        
        {/* Header Block */}
        <header className="relative rounded-3xl p-6 md:p-8 mb-8 overflow-hidden bg-white border border-[#EADBCE] text-left">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="font-extrabold uppercase tracking-widest text-[11px] text-[#C5A059] mb-1.5">
                COUNTER SALES & BALANCE SETTLEMENTS
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 flex-wrap sm:whitespace-nowrap">
                <span className="font-bold uppercase">Salon</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Settlements</span>
              </h2>
              <p className="text-stone-600 text-sm font-normal leading-relaxed mt-2">
                Manage counter payments, second-installment cash/UPI deposits, and verify that partial online bookings are fully paid at checkout.
              </p>
            </div>
            
            {/* Settle Quick Action Trigger */}
            <button 
              onClick={() => {
                const firstPending = settlements.find(s => s.status === "PENDING_BALANCE");
                if (firstPending) {
                  setSettlingPayment(firstPending);
                } else {
                  showToast("No pending balances left to settle!");
                }
              }} 
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold tracking-wider uppercase text-white shadow-md transition-all duration-200 self-start md:self-center bg-[#3E362E] hover:opacity-90 cursor-pointer"
            >
              <PlusCircle size={14} color={GOLD} /> Settle Counter Dues
            </button>
          </div>
        </header>

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
        <section className="mb-6 grid gap-4 p-5 rounded-2xl border border-[#EADBCE] bg-white text-left md:grid-cols-4">
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
            <select 
              value={methodFilter} 
              onChange={e => setMethodFilter(e.target.value)}
              className="w-full rounded-xl border border-[#EADBCE] bg-stone-50/50 px-3 h-10 text-xs font-bold text-stone-700 outline-none focus:border-[#C5A059] focus:bg-white transition-all"
            >
              <option value="ALL">All Methods</option>
              <option value="CASH">Cash Only</option>
              <option value="ONLINE">Online (UPI / Card)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] pl-0.5">Settlement Status</span>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-[#EADBCE] bg-stone-50/50 px-3 h-10 text-xs font-bold text-stone-700 outline-none focus:border-[#C5A059] focus:bg-white transition-all"
            >
              <option value="ALL">All Statuses</option>
              <option value="SETTLED">Settled Full</option>
              <option value="PENDING_BALANCE">Pending Balance</option>
            </select>
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

        {/* Ledger Table */}
        <section className="bg-white border border-[#EADBCE] rounded-3xl overflow-hidden text-left">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Transaction details</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059]">Stylist & Services</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Token Paid</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Counter Settled</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-right">Total Bill</th>
                  <th className="py-4 px-6 text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] text-center">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredSettlements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400 text-sm italic">
                      No matching settlement transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredSettlements.map(s => {
                    const isPending = s.status === "PENDING_BALANCE";
                    return (
                      <tr key={s.id} className="hover:bg-stone-50/20 transition-colors group">
                        <td className="py-4.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center font-bold text-[10px] text-stone-500 font-serif">
                              {s.customerName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-stone-900 tracking-tight">{s.customerName}</p>
                              <p className="text-[10px] text-stone-400 font-mono mt-0.5">{s.id} • {s.timestamp}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4.5 px-6">
                          <p className="text-xs font-bold text-stone-800 truncate max-w-[180px]">{s.services}</p>
                          <p className="text-[10px] text-[#C5A059] font-medium mt-0.5">{s.barberName}</p>
                        </td>

                        <td className="py-4.5 px-6 text-center">
                          <span className="font-mono font-bold text-stone-600 text-sm">{money(s.tokenPaid)}</span>
                          <span className="block text-[8px] font-black uppercase text-stone-400 mt-0.5">Online</span>
                        </td>

                        <td className="py-4.5 px-6 text-center">
                          {isPending ? (
                            <span className="font-mono font-bold text-amber-700 text-sm">—</span>
                          ) : (
                            <>
                              <span className="font-mono font-bold text-emerald-700 text-sm">{money(s.balancePaid)}</span>
                              <span className="block text-[8px] font-black uppercase text-emerald-600 mt-0.5">{s.method}</span>
                            </>
                          )}
                        </td>

                        <td className="py-4.5 px-6 text-right">
                          <span className="font-mono font-bold text-stone-900 text-sm">{money(s.totalAmount)}</span>
                        </td>

                        <td className="py-4.5 px-6 text-center">
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

      </div>

      {/* Settle Balance Dialog Modal */}
      {settlingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 shadow-2xl text-left">
            
            {/* Modal Header */}
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

            {/* Modal Content */}
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
  );
}
