import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { Search, Filter, Store, Users, Calendar, Plus } from "lucide-react";

export default function SalonManagement() {
  const [tab, setTab] = useState("requests");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // For the screenshot match we show empty requests list
  const requests = [];

  const counts = {
    totalCustomers: 0,
    activeSalons: 0,
    totalBookings: 0,
    revenue: 0,
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] text-[#1f2937]">
      <Sidebar />

      <main className="lg:ml-[260px] px-6 lg:px-12 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Salon Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage salons, requests and revenue</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Sat, 24 May, 2026</div>
            <button className="bg-white border border-[#E8DCD0] px-4 py-2 rounded-lg shadow-sm text-sm">Refresh</button>
            <button className="flex items-center gap-2 bg-[#8a5b2a] text-white px-4 py-2 rounded-lg shadow-md">
              <Plus size={16} /> Add Salon
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Total Customers</p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="text-2xl font-bold">{counts.totalCustomers}</div>
                <div className="text-sm text-[#6b7280]">Registered users</div>
              </div>
              <div className="bg-[#F6EBD8] p-3 rounded-lg">
                <Users size={22} className="text-[#8a5b2a]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Active Salons</p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="text-2xl font-bold">{counts.activeSalons}</div>
                <div className="text-sm text-[#6b7280]">Approved & live</div>
              </div>
              <div className="bg-[#EAF6EE] p-3 rounded-lg">
                <Store size={22} className="text-[#16a34a]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="text-2xl font-bold">{counts.totalBookings}</div>
                <div className="text-sm text-[#6b7280]">0 pending</div>
              </div>
              <div className="bg-[#EEF2FF] p-3 rounded-lg">
                <Calendar size={22} className="text-[#7c3aed]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-gray-500">Revenue</p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <div className="text-2xl font-bold">₹{counts.revenue}</div>
                <div className="text-sm text-[#6b7280]">Total collected</div>
              </div>
              <div className="bg-[#FFF6EB] p-3 rounded-lg">
                <div className="text-[#b25e1c] font-bold">₹</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + Controls */}
        <div className="mt-6 bg-white rounded-xl p-4 flex items-center justify-between border">
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('requests')} className={`px-4 py-2 rounded-lg ${tab==='requests' ? 'bg-[#8a5b2a] text-white' : 'text-gray-600'}`}>
              Requests (0)
            </button>
            <button onClick={() => setTab('approved')} className={`px-4 py-2 rounded-lg ${tab==='approved' ? 'bg-[#8a5b2a] text-white' : 'text-gray-600'}`}>
              Approved (0)
            </button>
            <button onClick={() => setTab('rejected')} className={`px-4 py-2 rounded-lg ${tab==='rejected' ? 'bg-[#8a5b2a] text-white' : 'text-gray-600'}`}>
              Rejected (0)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#FBF8F5] border rounded-lg px-3 py-2 w-[340px]">
              <Search className="text-[#8a5b2a] mr-3" />
              <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search salon..." className="bg-transparent outline-none w-full" />
            </div>

            <button onClick={()=>setShowFilters(!showFilters)} className="bg-white border px-3 py-2 rounded-lg flex items-center gap-2">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Table / Empty state */}
        <div className="mt-6 bg-white rounded-xl p-6 border min-h-[320px] flex flex-col">
          <div className="overflow-x-auto">
            {requests.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="bg-[#F7EDE0] p-6 rounded-full mb-6">
                  <Store size={42} className="text-[#c89a5a]" />
                </div>
                <h3 className="text-xl font-semibold">No requests salons</h3>
                <p className="text-sm text-gray-500 mt-2">New salon requests will appear here</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="py-3">Salon Name</th>
                    <th>Owner Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Requested On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* rows */}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-500">Showing 0 of 0 results</div>

          <div className="mt-4 flex justify-end gap-3">
            <button className="px-4 py-2 bg-white border rounded-lg">Previous</button>
            <button className="px-4 py-2 bg-white border rounded-lg">Next</button>
          </div>
        </div>
      </main>
    </div>
  );
}
