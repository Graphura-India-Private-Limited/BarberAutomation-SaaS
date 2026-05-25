import React from "react";
import { useAuth, financeData } from "../../contexts/AppContext";
import Navbar from "../../components/layout/Navbar";

function StatCard({ label, value }) {
  return (
    <div className="card p-6 flex flex-col justify-between">
      <h3 className="text-xs font-bold text-zinc-500 font-sans normal-case mb-1">{label}</h3>
      <p className="text-2xl sm:text-3xl font-bold mt-1 font-serif tracking-normal text-zinc-900">{value}</p>
    </div>
  );
}

export default function FinancePage() {
  const { currentUser, canViewFinance } = useAuth();

  if (!canViewFinance()) {
    return (
      <div className="min-h-screen p-4 sm:p-8 font-sans text-zinc-800" style={{ background: "var(--bg)" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          :root { 
            --gold: #D97706; 
            --gold2: #B45309; 
            --bg: #FAF6F0; 
            --bg2: #FFFFFF; 
            --border: #EADBCE; 
          }
          body, .font-sans {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          }
          .font-serif {
            font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
          }
          .card { 
            background: var(--bg2); 
            border: 1px solid var(--border); 
            border-radius: 24px; 
            box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          }
        `}</style>
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center card mt-10">
          <span className="text-5xl block mb-4">🔒</span>
          <h2 className="text-2xl font-bold text-zinc-900 font-serif mb-2">Access Restricted</h2>
          <p className="text-zinc-500 text-sm">
            Financial data is not visible for your account. Contact the salon owner if you believe this is a mistake.
          </p>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.role === "owner";
  const barberData = isOwner
    ? financeData.barberBreakdown
    : financeData.barberBreakdown.filter(b => b.name === currentUser?.name);

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans text-zinc-800" style={{ background: "var(--bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        :root { 
          --gold: #D97706; 
          --gold2: #B45309; 
          --bg: #FAF6F0; 
          --bg2: #FFFFFF; 
          --bg3: #FDFBF7; 
          --border: #EADBCE; 
          --text: #1C1917; 
          --muted: #78716C; 
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
        .card { 
          background: var(--bg2); 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -4px rgba(28, 25, 23, 0.06), 0 4px 12px -2px rgba(28, 25, 23, 0.03);
          border-color: #D6C4AE;
        }
      `}</style>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-amber-700 font-sans normal-case font-bold tracking-[2px] text-xs sm:text-sm uppercase mb-1">
          Salon Financial Administration
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif tracking-normal mb-1">Finance Overview</h2>
        <p className="text-sm text-zinc-500 font-sans normal-case mb-6">
          {isOwner ? "Full salon financials" : `Your earnings — ${currentUser?.name}`}
        </p>

        {isOwner && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard label="Today" value={`₹${financeData.todayRevenue.toLocaleString()}`} />
            <StatCard label="This Week" value={`₹${financeData.weekRevenue.toLocaleString()}`} />
            <StatCard label="This Month" value={`₹${financeData.monthRevenue.toLocaleString()}`} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-zinc-900 font-serif mb-4">
              {isOwner ? "Barber Earnings" : "Your Earnings"}
            </h3>
            <div className="space-y-4">
              {barberData.map((b, i) => (
                <div key={i} className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 transition-all duration-200 hover:bg-amber-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-zinc-900">{b.name}</span>
                    <span className="text-xs bg-amber-100 text-amber-800 font-bold border border-amber-200/60 px-2..5 py-0.5 rounded-full">
                      {b.type || (b.commission ? "Commission" : "Fixed")}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-600 space-y-1">
                    <p>Today's Revenue: <strong className="text-zinc-950 font-bold">₹{b.today.toLocaleString()}</strong></p>
                    {b.commission && <p>Commission Rate: <strong className="text-zinc-950 font-bold">{b.commission}</strong></p>}
                    {b.earned && <p>Earned Today: <strong className="text-emerald-700 font-bold">₹{b.earned.toLocaleString()}</strong></p>}
                    {b.salary && <p>Monthly Salary: <strong className="text-zinc-950 font-bold">₹{b.salary.toLocaleString()}</strong></p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isOwner && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-zinc-900 font-serif mb-4">Top Services</h3>
              <div className="space-y-3">
                {financeData.topServices.map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-amber-50/50 rounded-xl px-4 py-3 border border-amber-200/50 transition-all duration-200 hover:bg-amber-50">
                    <div>
                      <p className="font-bold text-zinc-900">{s.service}</p>
                      <p className="text-xs text-zinc-500 font-sans">{s.count} sessions</p>
                    </div>
                    <span className="font-bold text-amber-700 font-serif">₹{s.revenue.toLocaleString()}</span>
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