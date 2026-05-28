import React, { useState } from "react";
import { useAuth, users as initialUsers, SALARY_MODELS } from "../../contexts/AppContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer"; // ✅ Imported your premium custom footer component

function StatCard({ label, value }) {
  return (
    <div className="card p-6 flex flex-col justify-between">
      <h3 className="text-xs font-bold text-zinc-500 font-sans normal-case mb-1">{label}</h3>
      <p className="text-2xl sm:text-3xl font-bold mt-1 font-serif tracking-normal text-zinc-900">{value}</p>
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [barbers, setBarbers] = useState(initialUsers.filter(u => u.role === "barber"));
  const [saved, setSaved] = useState(false);

  // ── NON-OWNER ACCESS RESTRICTION BANNER (WITH FOOTER) ──
  if (currentUser?.role !== "owner") {
    return (
      <div className="min-h-screen font-sans text-zinc-800 flex flex-col justify-between" style={{ background: "var(--bg)" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
          :root { 
            --bg: #FAF6F0; 
            --bg2: #FFFFFF; 
            --border: #EADBCE; 
          }
          body, .font-sans {
            font-family: 'Plus Jakarta Sans', sans-serif !important;
          }
          .font-serif {
            font-family: 'Playfair Display', serif !important;
          }
          .card { 
            background: var(--bg2); 
            border: 1px solid var(--border); 
            border-radius: 24px; 
            box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04), 0 2px 8px -1px rgba(28, 25, 23, 0.02);
          }
        `}</style>
        
        <div>
          <Navbar />
          <main className="max-w-xl mx-auto px-4 py-16 text-center">
            <div className="card p-10 mt-10 bg-white">
              <span className="text-5xl block mb-4">🔒</span>
              <h2 className="text-2xl font-bold text-zinc-900 font-serif mb-2">Owner Only</h2>
              <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
                Only the salon owner can access settings configurations.
              </p>
            </div>
          </main>
        </div>

        {/* ✅ Render footer at absolute baseline for restricted view */}
        <Footer />
      </div>
    );
  }

  const toggleFinance = (id) => {
    setBarbers(bs => bs.map(b => b.id === id ? { ...b, showFinance: !b.showFinance } : b));
    setSaved(false);
  };

  const changeSalaryModel = (id, model) => {
    setBarbers(bs => bs.map(b => b.id === id ? { ...b, salaryModel: model } : b));
    setSaved(false);
  };

  return (
    /* ✅ Structural flex setting guarantees layout stability with the footer */
    <div className="min-h-screen font-sans text-zinc-800 flex flex-col justify-between" style={{ background: "var(--bg)" }}>
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

      <div>
        <Navbar />

        {/* ── MAIN LAYOUT WORKSPACE CONTROLLER ── */}
        <main className="max-w-4xl mx-auto px-4 pb-12 pt-8 sm:px-8 text-left">
          <p className="text-amber-700 font-sans font-bold tracking-[2px] text-xs sm:text-sm uppercase mb-1">
            Salon Preferences
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 font-serif mb-1">Salon Settings</h2>
          <p className="text-sm text-zinc-500 font-sans mb-6">Manage barber access and salary configurations.</p>

          <div className="card p-6 mb-6 bg-white">
            <h3 className="text-lg font-bold font-serif text-zinc-900 mb-1">Barber Access Control</h3>
            <p className="text-sm text-zinc-500 font-sans mb-5 leading-relaxed">
              Control which barbers can view financial data. Barbers on a <strong>Fixed Salary</strong> model will remain restricted from financial analytics regardless of this state override toggle.
            </p>

            <div className="space-y-4">
              {barbers.map(barber => {
                const isFixed = barber.salaryModel === SALARY_MODELS.FIXED;
                const effectiveFinanceAccess = barber.showFinance && !isFixed;

                return (
                  <div key={barber.id} className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 transition-all duration-200 hover:bg-amber-50">
                    <div className="flex items-center justify-between mb-4 border-b border-amber-200/20 pb-3">
                      <div>
                        <p className="font-bold text-zinc-900">{barber.name}</p>
                        <p className="text-xs text-zinc-400 font-sans mt-0.5">{barber.email}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        effectiveFinanceAccess ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
                      }`}>
                        Finance: {effectiveFinanceAccess ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">Salary Model</label>
                        <select
                          value={barber.salaryModel}
                          onChange={e => changeSalaryModel(barber.id, e.target.value)}
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-800 outline-none hover:border-amber-600/50 focus:border-amber-600 transition cursor-pointer"
                        >
                          <option value={SALARY_MODELS.COMMISSION}>Commission</option>
                          <option value={SALARY_MODELS.FIXED}>Fixed Salary</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">Show Finance</label>
                        <div className="flex items-center gap-3 mt-1.5">
                          <button
                            type="button"
                            onClick={() => toggleFinance(barber.id)}
                            disabled={isFixed}
                            className={`relative inline-flex w-11 h-6 rounded-full transition ${
                              isFixed ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                            } ${barber.showFinance && !isFixed ? "bg-amber-600" : "bg-zinc-300"}`}
                          >
                            <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition mt-0.5 ${
                              barber.showFinance && !isFixed ? "translate-x-5" : "translate-x-0.5"
                            }`} />
                          </button>
                          {isFixed && (
                            <span className="text-xs text-amber-700 font-bold">Disabled (Fixed model)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setSaved(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Save Settings
            </button>
            {saved && <span className="text-emerald-700 text-sm font-bold animate-fade-in">Saved successfully!</span>}
          </div>
        </main>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 mb-12">
          <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 text-sm text-zinc-700 text-left">
            <strong className="text-zinc-900 font-bold">Access Rules:</strong>
            <ul className="mt-2 space-y-1.5 list-disc list-inside text-zinc-600 font-sans">
              <li>Each barber can only see their assigned salon's data logs.</li>
              <li>Each barber can only see their unique custom execution queue viewport.</li>
              <li>Finance paths are automatically locked for personnel on a Fixed Salary model, regardless of explicit toggles.</li>
              <li>The absolute owner retains full clearance to evaluate all dataset layers.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── ✅ THE PIECE INJECTION: Your premium custom footer safely mounted here at the base ── */}
      <Footer />

    </div>
  );
}