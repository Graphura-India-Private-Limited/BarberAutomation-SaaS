
import React from "react";
import { useAuth, financeData } from "../../contexts/AppContext";
import Navbar from "../../components/layout/Navbar";

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-orange-200 rounded-xl p-5 shadow-sm">
      <div className="text-2xl font-bold text-orange-900">{value}</div>
      <div className="text-sm font-semibold text-gray-600 mt-1">{label}</div>
    </div>
  );
}

export default function FinancePage() {
  const { currentUser, canViewFinance } = useAuth();

  if (!canViewFinance()) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-orange-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">
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
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-orange-900 mb-1">Finance Overview</h2>
        <p className="text-sm text-gray-500 mb-6">
          {isOwner ? "Full salon financials" : `Your earnings — ${currentUser?.name}`}
        </p>

        {isOwner && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Today" value={`₹${financeData.todayRevenue.toLocaleString()}`} />
            <StatCard label="This Week" value={`₹${financeData.weekRevenue.toLocaleString()}`} />
            <StatCard label="This Month" value={`₹${financeData.monthRevenue.toLocaleString()}`} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {isOwner ? "Barber Earnings" : "Your Earnings"}
            </h3>
            <div className="space-y-4">
              {barberData.map((b, i) => (
                <div key={i} className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">{b.name}</span>
                    <span className="text-xs bg-orange-200 text-orange-800 font-semibold px-2 py-0.5 rounded-full">
                      {b.type || (b.commission ? "Commission" : "Fixed")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Today's Revenue: <strong className="text-gray-900">₹{b.today.toLocaleString()}</strong></p>
                    {b.commission && <p>Commission Rate: <strong className="text-gray-900">{b.commission}</strong></p>}
                    {b.earned && <p>Earned Today: <strong className="text-green-700">₹{b.earned.toLocaleString()}</strong></p>}
                    {b.salary && <p>Monthly Salary: <strong className="text-gray-900">₹{b.salary.toLocaleString()}</strong></p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isOwner && (
            <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Top Services</h3>
              <div className="space-y-3">
                {financeData.topServices.map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-orange-50 rounded-lg px-4 py-3 border border-orange-100">
                    <div>
                      <p className="font-semibold text-gray-800">{s.service}</p>
                      <p className="text-xs text-gray-500">{s.count} sessions</p>
                    </div>
                    <span className="font-bold text-orange-700">₹{s.revenue.toLocaleString()}</span>
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