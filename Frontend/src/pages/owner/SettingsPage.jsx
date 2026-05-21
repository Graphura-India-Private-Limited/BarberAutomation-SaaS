
import React, { useState } from "react";
import { useAuth, users as initialUsers, SALARY_MODELS } from "../../contexts/AppContext";
import Navbar from "../../components/layout/Navbar";

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [barbers, setBarbers] = useState(initialUsers.filter(u => u.role === "barber"));
  const [saved, setSaved] = useState(false);

  if (currentUser?.role !== "owner") {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-orange-900">Owner Only</h2>
          <p className="text-gray-500 mt-2">Only the salon owner can access settings.</p>
        </div>
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
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-orange-900 mb-1">Salon Settings</h2>
        <p className="text-sm text-gray-500 mb-6">Manage barber access and salary configuration.</p>

        <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Barber Access Control</h3>
          <p className="text-sm text-gray-500 mb-4">
            Control which barbers can view financial data. Barbers on a <strong>Fixed Salary</strong> model will never see financial data regardless of this setting.
          </p>

          <div className="space-y-4">
            {barbers.map(barber => {
              const isFixed = barber.salaryModel === SALARY_MODELS.FIXED;
              const effectiveFinanceAccess = barber.showFinance && !isFixed;

              return (
                <div key={barber.id} className="bg-orange-50 rounded-xl border border-orange-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{barber.name}</p>
                      <p className="text-xs text-gray-500">{barber.email}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      effectiveFinanceAccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      Finance: {effectiveFinanceAccess ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Salary Model</label>
                      <select
                        value={barber.salaryModel}
                        onChange={e => changeSalaryModel(barber.id, e.target.value)}
                        className="w-full border border-orange-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        <option value={SALARY_MODELS.COMMISSION}>Commission</option>
                        <option value={SALARY_MODELS.FIXED}>Fixed Salary</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Show Finance</label>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => toggleFinance(barber.id)}
                          disabled={isFixed}
                          className={`relative inline-flex w-11 h-6 rounded-full transition ${
                            isFixed ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                          } ${barber.showFinance && !isFixed ? "bg-orange-500" : "bg-gray-300"}`}
                        >
                          <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition mt-0.5 ${
                            barber.showFinance && !isFixed ? "translate-x-5" : "translate-x-0.5"
                          }`} />
                        </button>
                        {isFixed && (
                          <span className="text-xs text-orange-600 font-medium">Disabled (Fixed model)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setSaved(true)}
            className="mt-5 bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-lg transition text-sm"
          >
            Save Settings
          </button>
          {saved && <span className="ml-3 text-green-600 text-sm font-semibold">Saved!</span>}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Access Rules:</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside text-amber-700">
            <li>Each barber can only see their assigned salon's data.</li>
            <li>Each barber can only see their own queue.</li>
            <li>Finance is hidden for barbers on a Fixed Salary model, regardless of toggle.</li>
            <li>Owner has full access to all data.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}