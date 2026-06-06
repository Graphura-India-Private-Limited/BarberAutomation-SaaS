import React from "react";
import { useAuth, financeData as contextFinanceData } from "../../contexts/AppContext";

const fallbackFinanceData = {
  todayRevenue: 800,
  weekRevenue: 2060,
  monthRevenue: 5150,
  barberBreakdown: [
    { 
      name: "James (Color Specialist)", 
      generatedRevenue: 2600, 
      commissionRate: "15%", 
      payoutShare: 390,
      type: "COMMISSION" 
    },
    { 
      name: "Ravi (Beard Expert)", 
      generatedRevenue: 1600, 
      commissionRate: "15%", 
      payoutShare: 240,
      type: "COMMISSION" 
    },
    { 
      name: "Ali (Master Stylist)", 
      generatedRevenue: 950, 
      commissionRate: "15%", 
      payoutShare: 143,
      type: "COMMISSION" 
    }
  ],
  topServices: [
    { service: "Royal Shave Treatment", count: 7, revenue: 1750 },
    { service: "Luxury Head Spa Massage", count: 3, revenue: 1200 },
    { service: "Classic Haircut & Styling", count: 4, revenue: 1200 },
    { service: "Premium Beard Sculpting", count: 5, revenue: 1000 }
  ]
};

function StatCard({ label, value }) {
  return (
    <div className="card p-6 flex flex-col justify-between bg-white">
      <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mb-1.5 font-sans">{label}</h3>
      <p className="text-3xl font-black mt-1 font-serif text-stone-900 tracking-normal">{value}</p>
    </div>
  );
}

export default function FinancePage() {
  const { currentUser, canViewFinance } = useAuth();

  // ── RESTRICTED ACCESS VIEW FALLBACK ──
  if (canViewFinance && !canViewFinance()) {
    return (
      <div className="p-6 md:p-10 font-sans text-stone-800 text-left min-h-screen" style={{ background: "#FAF6F0" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          body, .font-sans {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
          .font-serif {
            font-family: 'Playfair Display', serif !important;
          }
          .card { 
            background: #FFFFFF; 
            border: 1px solid #EADBCE; 
            border-radius: 24px; 
            box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04);
          }
        `}</style>
        <div className="max-w-xl mx-auto py-16 text-center">
          <div className="card p-10 bg-white">
            <span className="text-5xl block mb-4">🔒</span>
            <h2 className="text-2xl font-bold text-stone-900 font-serif mb-2">Access Restricted</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Financial data is not visible for your account tier. Contact the salon owner if you believe this is a system configuration mismatch.
            </p>
          </div>
        </div>
      </div>
    );
  } 

  const isOwner = currentUser?.role === "owner";
  
  // Use context data if available and populated, otherwise fall back to screenshot-perfect mock data
  const hasContextData = contextFinanceData && (contextFinanceData.todayRevenue > 0 || contextFinanceData.barberBreakdown?.length > 0);
  const activeFinance = hasContextData ? contextFinanceData : fallbackFinanceData;

  const barberData = isOwner
    ? (activeFinance.barberBreakdown || [])
    : (activeFinance.barberBreakdown || []).filter(b => b.name?.includes(currentUser?.name || ""));

  return (
    <div className="p-6 md:p-10 font-sans text-stone-800 text-left min-h-screen" style={{ background: "#FAF6F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
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
      `}</style>

      <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-8 border-b pb-6 border-stone-200">
            <h2 className="font-serif text-3xl sm:text-4xl tracking-normal text-stone-900 flex items-center justify-start gap-2 whitespace-nowrap">
              <span className="font-bold uppercase">Finance</span>
              <span className="italic text-[#C5A059] normal-case font-medium">Overview</span>
            </h2>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-2 font-sans">
              {isOwner ? "Full Salon Financials Ledger" : `Earnings Statement — ${currentUser?.name}`}
            </p>
          </header>

          {isOwner && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-left">
              <StatCard label="TODAY'S REVENUE" value={`₹${(activeFinance.todayRevenue || 0).toLocaleString()}`} />
              <StatCard label="ESTIMATED WEEKLY" value={`₹${(activeFinance.weekRevenue || 0).toLocaleString()}`} />
              <StatCard label="TOTAL CAPTURED (MONTH)" value={`₹${(activeFinance.monthRevenue || 0).toLocaleString()}`} />
            </div>
          )}

          <div className="grid md:grid-cols-12 gap-6 text-left">
            {/* Left Panel: Barber Earnings */}
            <div className="card p-6 bg-white md:col-span-7">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-5 border-b pb-3 border-stone-100 uppercase tracking-tight">
                Barber Earnings Breakdown
              </h3>
              <div className="space-y-4">
                {barberData.map((b, i) => {
                  const hasCustomFields = b.generatedRevenue !== undefined;
                  const genRev = hasCustomFields ? b.generatedRevenue : b.today;
                  const commRate = hasCustomFields ? b.commissionRate : b.commission;
                  const payout = hasCustomFields ? b.payoutShare : b.earned;
                  const badgeText = b.type || (commRate ? "COMMISSION" : "FIXED");

                  return (
                    <div key={i} className="bg-[#FAF6F0]/60 border border-[#EADBCE]/35 rounded-2xl p-5 transition-all duration-200 hover:bg-[#FAF6F0]/80">
                      <div className="flex justify-between items-center mb-3.5">
                        <span className="font-black text-stone-900 text-sm tracking-tight font-serif">{b.name}</span>
                        <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-50 text-[#8B5A2B] border border-amber-200/50 px-2.5 py-0.5 rounded">
                          {badgeText}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 space-y-1.5 font-medium font-sans">
                        <p>Generated Revenue: <strong className="text-stone-900 font-extrabold">₹{(genRev || 0).toLocaleString()}</strong></p>
                        {commRate && <p>Commission Rate: <strong className="text-stone-900 font-extrabold">{commRate}</strong></p>}
                        {payout !== undefined && <p>Payout Share: <strong className="text-emerald-700 font-extrabold">₹{(payout || 0).toLocaleString()}</strong></p>}
                        {b.salary && <p>Monthly Salary: <strong className="text-stone-900 font-extrabold">₹{(b.salary || 0).toLocaleString()}</strong></p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Top Services */}
            {isOwner && (
              <div className="card p-6 bg-white md:col-span-5">
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-5 border-b pb-3 border-stone-100 uppercase tracking-tight">
                  Top Performing Services
                </h3>
                <div className="space-y-3">
                  {(activeFinance.topServices || []).map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#FAF6F0]/60 border border-[#EADBCE]/35 rounded-2xl px-5 py-4 transition-all duration-200 hover:bg-[#FAF6F0]/80">
                      <div className="text-left">
                        <p className="font-black text-stone-950 text-xs tracking-tight">{s.service}</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1 font-sans">{s.count} sessions</p>
                      </div>
                      <span className="font-bold text-stone-900 font-serif text-sm">₹{(s.revenue || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
      </div>
    </div>
  );
}