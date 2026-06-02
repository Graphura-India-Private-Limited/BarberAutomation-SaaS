import React, { useState } from "react";
import {
  Users, UserPlus, UserSquare, UserX, Calendar, CalendarDays, Scissors,
  CreditCard, Star, Radio, Store, Eye, MoreHorizontal, Trash2,
  IndianRupee, CheckCircle, Clock, Search, Filter, ChevronDown, Plus, X,
} from "lucide-react";
import {
  ADMIN_C as C,
  AdminAvatar,
  StatusPill,
  StatCardsRow,
  ActionToolbar,
  AdminDataTable,
  TableEmptyRow,
  TablePagination,
  usePagination,
  PAGE_SIZE,
  AdminPageShell, StatusBadge,
} from "../../components/admin/AdminUIKit";



const formatJoined = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const isThisMonth = (value) => {
  if (!value) return false;
  const d = new Date(value);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

const barberActive = (b) => b.status === "available" || b.status === "busy";
const barberImg = (i) => [
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&q=80",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=200&q=80",
  "https://images.unsplash.com/photo-1621605815841-aa33c5447a33?w=200&q=80",
][i % 3];

const salonStatusColor = (s) =>
  s === "approved" ? C.green : s === "pending" ? C.orange : s === "rejected" ? C.red : C.muted;

/* ── CUSTOMERS ── */
export function CustomersModule({ customers, loading, customerSearch, setCustomerSearch, blockCustomer, stats }) {
  const [page, setPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const filtered = customers.filter((c) => {
    if (!customerSearch) return true;
    const q = customerSearch.toLowerCase();
    return [c.name, c.email, c.mobile, c.phone].filter(Boolean).some((v) => v.toLowerCase().includes(q));
  });

  const { paged, pageSafe, totalPages, total } = usePagination(filtered, page, setPage);

  const statCards = [
    { label: "Total Customers", value: stats?.customers ?? customers.length, sub: "Registered users", subColor: C.gold, icon: Users, iconBg: C.goldLight, iconColor: C.gold },
    { label: "New This Month", value: customers.filter((c) => isThisMonth(c.createdAt || c.created_at)).length, sub: "New customers", subColor: C.green, icon: UserPlus, iconBg: C.greenLight, iconColor: C.green },
    { label: "Active Customers", value: customers.filter((c) => !c.blocked).length, sub: "Active users", subColor: C.purple, icon: UserPlus, iconBg: C.purpleLight, iconColor: C.purple },
    { label: "Inactive Customers", value: customers.filter((c) => c.blocked).length, sub: "Inactive users", subColor: C.orange, icon: UserX, iconBg: C.orangeLight, iconColor: C.orange },
  ];

  return (
    <AdminPageShell>
      <StatCardsRow cards={statCards} loading={loading} />
      <ActionToolbar search={customerSearch} onSearchChange={(v) => { setCustomerSearch(v); setPage(1); }} placeholder="Search customers..." addLabel="Add Customer" />
      <AdminDataTable
        columns={["CUSTOMER NAME", "EMAIL", "PHONE", "JOINED ON", "STATUS", "ACTIONS"]}
        loading={loading}
        loadingText="Loading customers…"
        footer={<TablePagination total={total} pageSafe={pageSafe} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />}
      >
        {!loading && paged.length === 0 ? (
          <TableEmptyRow colSpan={6} icon={Users} title="No customers found" subtitle="New customer registrations will appear here" />
        ) : (
          paged.map((customer) => {
            const active = !customer.blocked;
            const photo = customer.avatar || customer.profile_image || customer.profileImage;
            return (
              <tr key={customer._id || customer.email || customer.phone} className="border-t" style={{ borderColor: C.border }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <AdminAvatar name={customer.name || "C"} src={photo} size={36} />
                    <span className="font-sans text-sm font-semibold" style={{ color: C.ink }}>{customer.name || "Anonymous"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-sans text-sm font-normal" style={{ color: C.ink }}>{customer.email || "—"}</td>
                <td className="px-6 py-4 font-sans text-sm font-normal" style={{ color: C.ink }}>{customer.phone || customer.mobile || "—"}</td>
                <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{formatJoined(customer.createdAt || customer.created_at)}</td>
                <td className="px-6 py-4"><StatusPill active={active} /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 relative">
                    <button type="button" className="p-2 rounded-md hover:bg-gray-50" style={{ color: C.muted }}><Eye size={18} /></button>
                    <button type="button" onClick={() => setMenuOpenId(menuOpenId === customer._id ? null : customer._id)} className="p-2 rounded-md hover:bg-gray-50" style={{ color: C.muted }}>
                      <MoreHorizontal size={18} />
                    </button>
                    {menuOpenId === customer._id && (
                      <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] rounded-md border bg-white py-1 shadow-lg" style={{ borderColor: C.border }}>
                        <button type="button" onClick={() => { blockCustomer(customer._id, !customer.blocked); setMenuOpenId(null); }}
                          className="w-full px-4 py-2 text-left font-sans text-sm font-normal hover:bg-gray-50" style={{ color: C.ink }}>
                          {customer.blocked ? "Mark as active" : "Mark as inactive"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </AdminDataTable>
    </AdminPageShell>
  );
}

/* ── SALON MANAGEMENT ── */
export function SalonsModule({
  salons, customers, bookings, stats, loading, pendingBookings, revenueDisplay, updateSalonStatus, addSalon,
}) {
  const [salonTab, setSalonTab] = useState("requests");
  const [salonSearch, setSalonSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCityFilter, setShowCityFilter] = useState(false);
  const [selectedCity, setSelectedCity] = useState("all");
  const [adding, setAdding] = useState(false);
  const [newSalon, setNewSalon] = useState({
    salon_name: "",
    owner_name: "",
    email: "",
    mobile: "",
    address: "",
    status: "approved",
    opening_time: "09:00",
    closing_time: "21:00",
    basic_pricing: "",
    support_number: "",
    salary_model: "commission",
    commission_percent: "10",
    gstin: "",
    license_number: "",
    about: "",
    images: []
  });

  const cities = ["all", ...new Set(salons.map((s) => s.salon_city || s.city || s.address?.split(",").pop()?.trim()).filter(Boolean))];

  const filtered = salons
    .filter((s) =>
      salonTab === "requests" ? s.status === "pending" :
        salonTab === "approved" ? s.status === "approved" : s.status === "rejected"
    )
    .filter((s) => {
      if (selectedCity === "all") return true;
      const city = (s.salon_city || s.city || s.address?.split(",").pop()?.trim() || "").toLowerCase();
      return city.includes(selectedCity.toLowerCase());
    })
    .filter((s) => {
      if (!salonSearch) return true;
      const q = salonSearch.toLowerCase();
      return [s.salon_name, s.owner_name, s.email, s.owner_email, s.phone, s.mobile].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
    });

  const { paged, pageSafe, totalPages, total } = usePagination(filtered, page, setPage);
  const approvedCount = salons.filter((s) => s.status === "approved").length;

  const statCards = [
    { label: "Total Customers", value: stats?.customers ?? customers.length, sub: "Registered users", subColor: C.blue, icon: Users, iconBg: C.goldLight, iconColor: C.gold },
    { label: "Active Salons", value: stats?.salons ?? approvedCount, sub: "Approved & live", subColor: C.green, icon: Store, iconBg: C.greenLight, iconColor: C.green },
    { label: "Total Bookings", value: stats?.bookings ?? bookings.length, sub: `${pendingBookings} pending`, subColor: C.purple, icon: CalendarDays, iconBg: C.purpleLight, iconColor: C.purple },
    { label: "Revenue", value: revenueDisplay, sub: "Total collected", subColor: C.orange, icon: IndianRupee, iconBg: C.orangeLight, iconColor: C.orange },
  ];

  const tabCounts = {
    requests: salons.filter((s) => s.status === "pending").length,
    approved: approvedCount,
    rejected: salons.filter((s) => s.status === "rejected").length,
  };

  return (
    <AdminPageShell>
      <StatCardsRow cards={statCards} loading={loading} />
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {["requests", "approved", "rejected"].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => { setSalonTab(key); setPage(1); }}
              className="admin-tab-btn px-4 py-2 rounded-md font-sans text-[11px] font-extrabold uppercase tracking-widest"
              style={{
                background: salonTab === key ? C.brown : "#fff",
                color: salonTab === key ? "#fff" : C.brown,
                border: `1px solid ${C.brown}`,
              }}
            >
              {key.toUpperCase()} ({tabCounts[key]})
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-1 sm:justify-end">
          <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 w-full sm:max-w-md" style={{ borderColor: C.border }}>
            <Search size={16} color={C.brown} />
            <input value={salonSearch} onChange={(e) => { setSalonSearch(e.target.value); setPage(1); }}
              placeholder="Search salon..." className="bg-transparent outline-none font-sans text-sm font-normal w-full" />
          </div>
          <button type="button" onClick={() => setShowCityFilter(!showCityFilter)} className="flex items-center gap-2 rounded-md border bg-white px-4 py-2 font-sans text-xs font-extrabold uppercase tracking-wider whitespace-nowrap" style={{ borderColor: C.border, color: C.ink }}>
            <Filter size={16} color={C.brown} /> Filters <ChevronDown size={14} color={C.muted} className={`transition-transform ${showCityFilter ? 'rotate-180' : ''}`} />
          </button>
          <button type="button" onClick={() => setShowAddModal(true)} className="flex items-center gap-2 rounded-md px-4 py-2 font-sans text-xs font-extrabold uppercase tracking-wider text-white whitespace-nowrap" style={{ background: C.brown }}>
            <Plus size={16} /> Add Salon
          </button>
        </div>
      </div>

      {showCityFilter && (
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border animate-fade-in" style={{ borderColor: C.border }}>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Filter by City:</span>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => { setSelectedCity(city); setPage(1); }}
                className="px-3 py-1 rounded-full text-xs font-medium capitalize border transition-all"
                style={{
                  background: selectedCity === city ? C.goldLight : "#fff",
                  color: selectedCity === city ? C.gold : C.muted,
                  borderColor: selectedCity === city ? C.gold : C.border,
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl border shadow-2xl p-6 w-full max-w-2xl mx-4 text-left animate-fade-in flex flex-col max-h-[90vh]" style={{ borderColor: C.border }}>
            <div className="flex justify-between items-center pb-4 border-b mb-4 shrink-0" style={{ borderColor: C.border }}>
              <div>
                <h3 className="font-sans text-xl font-bold uppercase tracking-wide" style={{ color: C.ink }}>Add New Salon</h3>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: C.muted }}>Provide basic, legal, and operational details for onboarding.</p>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full hover:bg-stone-100 transition-colors" style={{ color: C.muted }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newSalon.salon_name || !newSalon.owner_name || !newSalon.mobile) {
                alert("Please fill in all required fields.");
                return;
              }
              setAdding(true);
              const success = await addSalon({
                ...newSalon,
                basic_pricing: newSalon.basic_pricing ? Number(newSalon.basic_pricing) : 0,
                commission_percent: newSalon.commission_percent ? Number(newSalon.commission_percent) : 10
              });
              setAdding(false);
              if (success) {
                setShowAddModal(false);
                setNewSalon({
                  salon_name: "",
                  owner_name: "",
                  email: "",
                  mobile: "",
                  address: "",
                  status: "approved",
                  opening_time: "09:00",
                  closing_time: "21:00",
                  basic_pricing: "",
                  support_number: "",
                  salary_model: "commission",
                  commission_percent: "10",
                  gstin: "",
                  license_number: "",
                  about: "",
                  images: []
                });
              }
            }} className="space-y-5 overflow-y-auto flex-1 pr-2">
              
              {/* SECTION 1: REQUIRED CONTACT DETAILS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest pb-1 border-b" style={{ color: C.gold, borderColor: `${C.gold}30` }}>1. Core Contact Info (Required)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Salon Name *</label>
                    <input className="inp" required placeholder="e.g. Royal Cuts Studio" value={newSalon.salon_name} onChange={(e) => setNewSalon({ ...newSalon, salon_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Owner Name *</label>
                    <input className="inp" required placeholder="e.g. Karan Shah" value={newSalon.owner_name} onChange={(e) => setNewSalon({ ...newSalon, owner_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Mobile / Phone *</label>
                    <input className="inp" type="tel" required placeholder="10 digit number" value={newSalon.mobile} onChange={(e) => setNewSalon({ ...newSalon, mobile: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Owner Email</label>
                    <input className="inp" type="email" placeholder="e.g. owner@email.com" value={newSalon.email} onChange={(e) => setNewSalon({ ...newSalon, email: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* SECTION 2: BUSINESS CONFIGURATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest pb-1 border-b" style={{ color: C.gold, borderColor: `${C.gold}30` }}>2. Operational & Pricing Settings (Optional)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Starting / Basic Price (₹)</label>
                    <input className="inp" type="number" placeholder="e.g. 150" value={newSalon.basic_pricing} onChange={(e) => setNewSalon({ ...newSalon, basic_pricing: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Support Hotline</label>
                    <input className="inp" type="tel" placeholder="e.g. 9898765432" value={newSalon.support_number} onChange={(e) => setNewSalon({ ...newSalon, support_number: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Salary Model</label>
                    <select className="inp" value={newSalon.salary_model} onChange={(e) => setNewSalon({ ...newSalon, salary_model: e.target.value })}>
                      <option value="commission">Commission Based</option>
                      <option value="salary">Fixed Salary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Commission (%)</label>
                    <input className="inp" type="number" placeholder="e.g. 10" value={newSalon.commission_percent} onChange={(e) => setNewSalon({ ...newSalon, commission_percent: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Opening Time</label>
                    <input className="inp" type="time" value={newSalon.opening_time} onChange={(e) => setNewSalon({ ...newSalon, opening_time: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Closing Time</label>
                    <input className="inp" type="time" value={newSalon.closing_time} onChange={(e) => setNewSalon({ ...newSalon, closing_time: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Address</label>
                    <input className="inp" placeholder="e.g. CG Road, Near Stadium, Ahmedabad" value={newSalon.address} onChange={(e) => setNewSalon({ ...newSalon, address: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>About / Description</label>
                    <textarea className="inp min-h-[60px] resize-y" placeholder="Describe the studio aesthetics, specialization..." value={newSalon.about} onChange={(e) => setNewSalon({ ...newSalon, about: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* SECTION 3: LEGAL COMPLIANCE */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest pb-1 border-b" style={{ color: C.gold, borderColor: `${C.gold}30` }}>3. Legal & Tax Identification (Optional)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>GSTIN / Tax ID</label>
                    <input className="inp" placeholder="e.g. 24AAAAB1234C1Z1" value={newSalon.gstin} onChange={(e) => setNewSalon({ ...newSalon, gstin: e.target.value.toUpperCase() })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Business Registration / License</label>
                    <input className="inp" placeholder="e.g. LIC-2026-98765" value={newSalon.license_number} onChange={(e) => setNewSalon({ ...newSalon, license_number: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* SECTION 4: STUDIO PHOTO */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest pb-1 border-b" style={{ color: C.gold, borderColor: `${C.gold}30` }}>4. Studio Image (Optional)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Upload Salon Photo</label>
                    <div className="border border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-stone-50 transition-colors" style={{ borderColor: C.border }}
                      onClick={() => document.getElementById("salon-photo-input")?.click()}>
                      <p className="text-xs" style={{ color: C.muted }}>Click to browse image file</p>
                    </div>
                    <input id="salon-photo-input" type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setNewSalon((prev) => ({ ...prev, images: [ev.target.result] }));
                      };
                      reader.readAsDataURL(file);
                    }} />
                  </div>
                  <div>
                    {newSalon.images && newSalon.images.length > 0 ? (
                      <div className="relative rounded-lg overflow-hidden border card-shadow h-24 w-full" style={{ borderColor: C.border }}>
                        <img src={newSalon.images[0]} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setNewSalon((prev) => ({ ...prev, images: [] }))}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="border rounded-lg bg-stone-50/50 h-24 w-full flex items-center justify-center text-xs border-dashed" style={{ borderColor: C.border, color: C.muted }}>
                        No Image selected
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: STATUS */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider mb-1" style={{ color: C.muted }}>Onboarding Status *</label>
                    <select className="inp" value={newSalon.status} onChange={(e) => setNewSalon({ ...newSalon, status: e.target.value })}>
                      <option value="approved">Approved & Live</option>
                      <option value="pending">Pending Approval</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 shrink-0">
                <button type="submit" disabled={adding} className="w-full py-3.5 rounded-lg text-white font-sans text-xs font-extrabold uppercase tracking-widest disabled:opacity-50 shadow-md" style={{ background: C.brown }}>
                  {adding ? "Onboarding Salon..." : "Complete & Register Studio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminDataTable
        columns={["SALON NAME", "OWNER NAME", "EMAIL", "PHONE", "STATUS", "REQUESTED ON", "ACTIONS"]}
        loading={loading}
        loadingText="Loading salons…"
        footer={<TablePagination total={total} pageSafe={pageSafe} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />}
      >
        {!loading && paged.length === 0 ? (
          <TableEmptyRow colSpan={7} icon={Store} title={salonTab === "requests" ? "No requests salons" : `No ${salonTab} salons`} subtitle="New salon requests will appear here" />
        ) : (
          paged.map((s) => (
            <tr key={s._id} className="border-t" style={{ borderColor: C.border }}>
              <td className="px-6 py-4 font-sans text-sm font-semibold" style={{ color: C.ink }}>{s.salon_name || "—"}</td>
              <td className="px-6 py-4 font-sans text-sm font-semibold" style={{ color: C.ink }}>{s.owner_name || "—"}</td>
              <td className="px-6 py-4 font-sans text-sm font-normal" style={{ color: C.ink }}>{s.owner_email || s.email || "—"}</td>
              <td className="px-6 py-4 font-sans text-sm font-normal" style={{ color: C.ink }}>{s.mobile || s.phone || "—"}</td>
              <td className="px-6 py-4"><StatusBadge label={s.status || "unknown"} color={salonStatusColor(s.status)} /></td>
              <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{formatJoined(s.requested_on || s.createdAt || s.created_at)}</td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {s.status === "pending" && (
                    <>
                      <button type="button" onClick={() => updateSalonStatus(s._id, "approved")} className="px-3 py-1.5 rounded-full font-sans text-[11px] font-extrabold tracking-wider bg-green-50 text-green-700">Approve</button>
                      <button type="button" onClick={() => updateSalonStatus(s._id, "rejected")} className="px-3 py-1.5 rounded-full font-sans text-[11px] font-extrabold tracking-wider bg-red-50 text-red-700">Reject</button>
                    </>
                  )}
                  {s.status === "rejected" && (
                    <button type="button" onClick={() => updateSalonStatus(s._id, "pending")} className="px-3 py-1.5 rounded-full font-sans text-[11px] font-extrabold tracking-wider bg-gray-100 text-gray-700">Reconsider</button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </AdminDataTable>
    </AdminPageShell>
  );
}

/* ── BARBERS ── */
export function BarbersModule({ barbers, loading, onSetTab, changeBarberStatus, removeBarber }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState(null);

  const filtered = barbers.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [b.name, b.email, b.mobile, b.specialization, b.salon_id?.salon_name]
      .filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
  });

  const activeCount = barbers.filter((b) => barberActive(b)).length;
  const inactiveCount = barbers.length - activeCount;
  const onDuty = barbers.filter((b) => b.status === "available" || b.status === "busy").length;
  const newMonth = barbers.filter((b) => isThisMonth(b.createdAt || b.created_at)).length;

  const { paged, pageSafe, totalPages, total } = usePagination(filtered, page, setPage);

  const statCards = [
    { label: "Total Barbers", value: barbers.length, sub: "All barbers", subColor: C.gold, icon: UserSquare, iconBg: C.goldLight, iconColor: C.gold },
    { label: "Active This Month", value: newMonth || activeCount, sub: "Active barbers", subColor: C.green, icon: UserPlus, iconBg: C.greenLight, iconColor: C.green },
    { label: "On Duty Now", value: onDuty, sub: "Currently working", subColor: C.purple, icon: Radio, iconBg: C.purpleLight, iconColor: C.purple },
    { label: "Inactive Barbers", value: inactiveCount, sub: "Offline barbers", subColor: C.orange, icon: UserX, iconBg: C.orangeLight, iconColor: C.orange },
  ];

  return (
    <AdminPageShell>
      <StatCardsRow cards={statCards} loading={loading} />
      <ActionToolbar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search barbers..."
        addLabel="Add Barber"
        onAdd={() => onSetTab("addbarber")}
      />
      <AdminDataTable
        columns={["BARBER NAME", "EMAIL", "PHONE", "SPECIALTY", "EXPERIENCE", "STATUS", "ACTIONS"]}
        loading={loading}
        loadingText="Loading barbers…"
        footer={
          <TablePagination
            total={total}
            pageSafe={pageSafe}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        }
      >
        {!loading && paged.length === 0 ? (
          <TableEmptyRow colSpan={7} icon={UserSquare} title="No barbers found" subtitle="Add barbers to see them listed here" />
        ) : (
          paged.map((b, i) => {
            const active = barberActive(b);
            return (
              <tr key={b._id} className="border-t" style={{ borderColor: C.border }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <AdminAvatar name={b.name} src={b.photo || barberImg(i)} size={36} />
                    <span className="font-sans text-sm font-semibold" style={{ color: C.ink }}>{b.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-sans text-sm font-normal" style={{ color: C.ink }}>{b.email || "—"}</td>
                <td className="px-6 py-4 font-sans text-sm font-normal" style={{ color: C.ink }}>{b.mobile || "—"}</td>
                <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{b.specialization || "—"}</td>
                <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{b.experience != null ? `${b.experience} yrs` : "—"}</td>
                <td className="px-6 py-4"><StatusPill active={active} label={active ? "Active" : "Inactive"} /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 relative">
                    <button type="button" className="p-2 rounded-md hover:bg-gray-50" style={{ color: C.muted }}><Eye size={18} /></button>
                    <button type="button" onClick={() => setMenuId(menuId === b._id ? null : b._id)} className="p-2 rounded-md hover:bg-gray-50" style={{ color: C.muted }}>
                      <MoreHorizontal size={18} />
                    </button>
                    {menuId === b._id && (
                      <div className="absolute right-0 top-full mt-1 z-10 min-w-[160px] rounded-md border bg-white py-1 shadow-lg" style={{ borderColor: C.border }}>
                        {["available", "break", "offline"].map((s) => (
                          <button key={s} type="button" onClick={() => { changeBarberStatus(b._id, s); setMenuId(null); }}
                            className="w-full px-4 py-2 text-left font-sans text-sm font-normal hover:bg-gray-50 capitalize" style={{ color: C.ink }}>
                            Set {s}
                          </button>
                        ))}
                        <button type="button" onClick={() => { removeBarber(b._id); setMenuId(null); }}
                          className="w-full px-4 py-2 text-left font-sans text-sm font-normal hover:bg-red-50 text-red-600">
                          Remove barber
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </AdminDataTable>
    </AdminPageShell>
  );
}

/* ── ADD BARBER ── */
export function AddBarberModule({ salons, newBarber, setNewBarber, addBarber, busy, addedBarbers, photoRef, docRef, handlePhotoChange, handleDocChange }) {
  const approved = salons.filter((s) => s.status === "approved");
  return (
    <AdminPageShell>
      <div className="w-full bg-white rounded-xl border card-shadow p-8" style={{ borderColor: C.border }}>
        <h2 className="font-sans font-black uppercase text-4xl tracking-tight text-stone-900 mb-1">Add New Barber</h2>
        <p className="font-sans text-sm font-normal leading-relaxed text-stone-600 mb-6">Credentials will be saved and the barber can log in at /barber/login</p>
        <div className="rounded-lg p-4 mb-6 font-sans text-sm font-normal leading-relaxed" style={{ background: C.blueLight, border: `1px solid ${C.blue}30`, color: C.blue }}>
          After adding, they can sign in with mobile number + password below.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>Profile Photo</label>
            <div className="border border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50" style={{ borderColor: C.border }}
              onClick={() => photoRef.current?.click()}>
              {newBarber.photoPreview ? (
                <img src={newBarber.photoPreview} alt="" className="h-28 w-full object-cover rounded-lg" />
              ) : (
                <p className="font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>Click to upload photo</p>
              )}
            </div>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div>
            <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>ID / Document</label>
            <div className="border border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 min-h-[120px] flex items-center justify-center" style={{ borderColor: C.border }}
              onClick={() => docRef.current?.click()}>
              <p className="font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{newBarber.documentName || "Upload ID / Aadhar"}</p>
            </div>
            <input ref={docRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleDocChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "name", label: "Full Name *", placeholder: "Arun Kumar", type: "text" },
            { key: "mobile", label: "Mobile *", placeholder: "10 digit mobile", type: "tel" },
            { key: "password", label: "Password *", placeholder: "Login password", type: "password" },
            { key: "specialization", label: "Specialty", placeholder: "Haircut & Styling", type: "text" },
            { key: "experience", label: "Experience (yrs)", placeholder: "5", type: "number" },
            { key: "email", label: "Email", placeholder: "barber@email.com", type: "email" },
          ].map((f) => (
            <div key={f.key}>
              <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>{f.label}</label>
              <input className="inp w-full" type={f.type} placeholder={f.placeholder}
                value={newBarber[f.key]} onChange={(e) => setNewBarber((p) => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="font-sans text-[11px] font-extrabold uppercase tracking-widest mb-2 block" style={{ color: C.muted }}>Assign Salon *</label>
            <select className="inp w-full" value={newBarber.salon_id} onChange={(e) => setNewBarber((p) => ({ ...p, salon_id: e.target.value }))}>
              <option value="">Select approved salon…</option>
              {approved.map((s) => <option key={s._id} value={s._id}>{s.salon_name}</option>)}
            </select>
          </div>
        </div>
        <button type="button" disabled={!newBarber.name || !newBarber.mobile || !newBarber.password || busy}
          onClick={addBarber}
          className="mt-6 w-full py-3 rounded-lg font-sans text-xs font-extrabold uppercase tracking-wider text-white disabled:opacity-50"
          style={{ background: C.brown }}>
          {busy ? "Adding…" : "Add Barber to Platform"}
        </button>
      </div>
      {addedBarbers.length > 0 && (
        <div className="bg-white rounded-xl border p-6" style={{ borderColor: C.border }}>
          <h3 className="font-sans text-[11px] font-extrabold uppercase tracking-widest mb-4" style={{ color: C.ink }}>Added this session — login credentials</h3>
          {addedBarbers.map((b, i) => (
            <div key={i} className="rounded-lg p-4 mb-2 font-sans text-sm font-normal leading-relaxed" style={{ background: C.greenLight, border: `1px solid ${C.green}30` }}>
              <div className="font-semibold">{b.name} · {b.salon}</div>
              <div className="mt-1 font-sans text-sm font-normal" style={{ color: C.muted }}>Mobile: {b.mobile} · Password: <span className="font-mono text-red-600">{b.password}</span></div>
            </div>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}

/* ── APPOINTMENTS ── */
export function AppointmentsModule({ bookings, loading, changeBookingStatus }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pending = bookings.filter((b) => b.status === "pending").length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [b.customer_id?.name, b.barber_id?.name, b.salon_id?.salon_name, b.services?.[0]?.service_name]
      .filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
  });

  const { paged, pageSafe, totalPages, total } = usePagination(filtered, page, setPage);

  const statCards = [
    { label: "Total Bookings", value: bookings.length, sub: "All appointments", subColor: C.gold, icon: Calendar, iconBg: C.goldLight, iconColor: C.gold },
    { label: "Pending", value: pending, sub: "Awaiting action", subColor: C.orange, icon: Clock, iconBg: C.orangeLight, iconColor: C.orange },
    { label: "Completed", value: completed, sub: "Finished", subColor: C.green, icon: CheckCircle, iconBg: C.greenLight, iconColor: C.green },
    { label: "This Month", value: bookings.filter((b) => isThisMonth(b.created_at || b.createdAt)).length, sub: "Recent bookings", subColor: C.purple, icon: CalendarDays, iconBg: C.purpleLight, iconColor: C.purple },
  ];

  return (
    <AdminPageShell>
      <StatCardsRow cards={statCards} loading={loading} />
      <ActionToolbar search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search appointments..." addLabel={null} />
      <AdminDataTable
        columns={["CUSTOMER", "SERVICE", "BARBER", "SALON", "DATE", "AMOUNT", "STATUS", "ACTIONS"]}
        loading={loading}
        footer={<TablePagination total={total} pageSafe={pageSafe} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />}
      >
        {!loading && paged.length === 0 ? (
          <TableEmptyRow colSpan={8} icon={Calendar} title="No appointments yet" subtitle="Bookings will appear here" />
        ) : (
          paged.map((b) => (
            <tr key={b._id} className="border-t" style={{ borderColor: C.border }}>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <AdminAvatar name={b.customer_id?.name || "C"} size={32} color={C.blue} bg={C.blueLight} />
                  <span className="font-sans text-sm font-semibold" style={{ color: C.ink }}>{b.customer_id?.name || "—"}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{b.services?.[0]?.service_name || "—"}</td>
              <td className="px-6 py-4 font-sans text-sm font-normal" style={{ color: C.ink }}>{b.barber_id?.name || "—"}</td>
              <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{b.salon_id?.salon_name || "—"}</td>
              <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{formatJoined(b.created_at || b.createdAt)}</td>
              <td className="px-6 py-4 font-sans text-sm font-semibold" style={{ color: C.ink }}>₹{b.total_amount || 0}</td>
              <td className="px-6 py-4"><StatusPill label={b.status} active={b.status === "completed"} /></td>
              <td className="px-6 py-4">
                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => changeBookingStatus(b._id, "confirmed")} className="px-2 py-1 rounded-full font-sans text-[11px] font-extrabold tracking-wider bg-green-50 text-green-700">Confirm</button>
                    <button onClick={() => changeBookingStatus(b._id, "cancelled")} className="px-2 py-1 rounded-full font-sans text-[11px] font-extrabold tracking-wider bg-red-50 text-red-700">Cancel</button>
                  </div>
                )}
              </td>
            </tr>
          ))
        )}
      </AdminDataTable>
    </AdminPageShell>
  );

}

/*----SERVICES----- */

export function ServicesModule({ 
  services = [], 
  salons = [], 
  loading, 
  newService, 
  setNewService, 
  addService, 
  toggleService, 
  deleteService 
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  // ── ✅ ACTIONS AND DROPDOWN DRAWER STATES ──
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const active = services.filter((s) => s.is_active).length;

  // ── ✅ DYNAMIC OPTION POOL FOR PREMIUM DROPDOWN OVERLAY ──
  const serviceDropdownOptions = [
    { value: "all", label: "All Categories" },
    { value: "men", label: "Men's Segment" },
    { value: "women", label: "Women's Segment" },
    { value: "addon", label: "Addon Extras" }
  ];

  // ── ✅ COMPREHENSIVE FILTER SYSTEM ENGINE ──
  const filtered = services.filter((s) => {
    // 1. Intercept Category Selection State Mismatches
    if (categoryFilter !== "all" && s.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    // 2. Evaluate Text Query Inputs
    if (!search) return true;
    const q = search.toLowerCase();
    return [s.name, s.category, s.salon_id?.salon_name]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q));
  });

  // Ensure pagination functions re-evaluate data states safely on row changes
  const { paged, pageSafe, totalPages, total } = usePagination(filtered, page, setPage);
  const approved = salons.filter((s) => s.status === "approved");

  const statCards = [
    { label: "Total Services", value: services.length, sub: "All services", subColor: C.gold, icon: Scissors, iconBg: C.goldLight, iconColor: C.gold },
    { label: "Active", value: active, sub: "Enabled services", subColor: C.green, icon: CheckCircle, iconBg: C.greenLight, iconColor: C.green },
    { label: "Inactive", value: services.length - active, sub: "Disabled", subColor: C.red, icon: UserX, iconBg: C.redLight, iconColor: C.red },
    { label: "Salons", value: approved.length, sub: "With services", subColor: C.purple, icon: Store, iconBg: C.purpleLight, iconColor: C.purple },
  ];

  const handleAddServiceWrapper = async () => {
    await addService();
    setShowAddDrawer(false); 
  };

  return (
    <AdminPageShell>
      <StatCardsRow cards={statCards} loading={loading} />
      
      {/* QUICK ADD EXTENSION PANEL ACCORDION DRAWER */}
      {showAddDrawer && (
        <div className="bg-white rounded-xl border p-5 card-shadow mb-6 animate-fadeIn text-left" style={{ borderColor: C.border }}>
          <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest mb-3" style={{ color: C.ink }}>Quick add service</p>
          <div className="flex flex-wrap gap-2">
            <input className="inp flex-1 min-w-[140px]" placeholder="Service name" value={newService.name} onChange={(e) => setNewService((p) => ({ ...p, name: e.target.value }))} />
            <select className="inp" value={newService.category} onChange={(e) => setNewService((p) => ({ ...p, category: e.target.value }))}>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="addon">Addon</option>
            </select>
            <input className="inp w-24" type="number" placeholder="₹" value={newService.price} onChange={(e) => setNewService((p) => ({ ...p, price: e.target.value }))} />
            <input className="inp w-24" type="number" placeholder="Min" value={newService.duration} onChange={(e) => setNewService((p) => ({ ...p, duration: e.target.value }))} />
            <select className="inp" value={newService.salon_id} onChange={(e) => setNewService((p) => ({ ...p, salon_id: e.target.value }))}>
              <option value="">Salon…</option>
              {approved.map((s) => <option key={s._id} value={s._id}>{s.salon_name}</option>)}
            </select>
            <button type="button" onClick={handleAddServiceWrapper} className="px-4 py-2 rounded-md font-sans text-xs font-extrabold uppercase tracking-wider text-white border-none cursor-pointer hover:opacity-90 transition-opacity" style={{ background: C.brown }}>Add</button>
          </div>
        </div>
      )}

      {/* GLOBAL MANAGEMENT ACTION TOOLBAR INTERFACE CONTROL */}
      <ActionToolbar 
        search={search} 
        onSearchChange={(v) => { setSearch(v); setPage(1); }} 
        placeholder="Search services..." 
        addLabel={showAddDrawer ? "✕ Close Panel" : "+ Add Service"} 
        onAdd={() => setShowAddDrawer(!showAddDrawer)} 
        filterValue={categoryFilter}
        onFilterChange={(cat) => { setCategoryFilter(cat); setPage(1); }}
        filterOptions={serviceDropdownOptions} // ✅ FIXED: WIRES DOWN THE MOUNT OPTIONS
      />

      {/* CORE ADMIN SERVICES GRID DATA LAYOUT */}
      <AdminDataTable
        columns={["SERVICE", "SALON", "CATEGORY", "PRICE", "DURATION", "STATUS", "ACTIONS"]}
        loading={loading}
        footer={<TablePagination total={total} pageSafe={pageSafe} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />}
      >
        {!loading && paged.length === 0 ? (
          <TableEmptyRow colSpan={7} icon={Scissors} title="No services yet" subtitle="No services match the active filters" />
        ) : (
          paged.map((s) => (
            <tr key={s._id} className="border-t text-left" style={{ borderColor: C.border }}>
              <td className="px-6 py-4 font-sans text-sm font-semibold" style={{ color: C.ink }}>{s.name}</td>
              <td className="px-6 py-4 font-sans text-sm font-normal" style={{ color: C.gold }}>{s.salon_id?.salon_name || "—"}</td>
              <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed capitalize" style={{ color: C.muted }}>{s.category}</td>
              <td className="px-6 py-4 font-sans text-sm font-semibold" style={{ color: C.ink }}>₹{s.price}</td>
              <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{s.duration} min</td>
              <td className="px-6 py-4"><StatusPill active={s.is_active} label={s.is_active ? "Active" : "Inactive"} /></td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button onClick={() => toggleService(s._id, !s.is_active)} className="px-3 py-1.5 rounded-full font-sans text-[11px] font-extrabold tracking-wider bg-amber-50 text-amber-800 border-none cursor-pointer hover:bg-amber-100 transition-colors">{s.is_active ? "Disable" : "Enable"}</button>
                  <button onClick={() => deleteService(s._id)} className="p-1.5 rounded-md hover:bg-red-50 text-red-600 border-none bg-transparent cursor-pointer transition-colors"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))
        )}
      </AdminDataTable>
    </AdminPageShell>
  );
}

/* ── PAYMENTS ── */
export function PaymentsModule({ payments, loading }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  // ── ✅ STEP 1: ADD LOCAL PAYMENT STATUS FILTER STATE ──
  const [statusFilter, setStatusFilter] = useState("all");

  const captured = payments.filter((p) => p.status === "captured").reduce((a, b) => a + (b.amount || 0), 0);

  // ── ✅ STEP 2: DEFINE PREMIUM OPTIONS MATCHING PAYMENT DATABASE SCHEMAS ──
  const paymentOptions = [
    { value: "all", label: "All Statuses" },
    { value: "captured", label: "Captured" },
    { value: "pending", label: "Pending" },
    { value: "refunded", label: "Refunded" }
  ];

  // ── ✅ STEP 3: UPDATE FILTER ENGINE TO INTERCEPT SELECTED STATUS OPTIONS ──
  const filtered = payments.filter((p) => {
    // 1. Validate custom dropdown choice selection
    if (statusFilter !== "all" && p.status?.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    // 2. Validate standard text search field inputs
    if (!search) return true;
    const q = search.toLowerCase();
    return [p.customer_id?.name, p.salon_id?.salon_name, p.status]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q));
  });

  const { paged, pageSafe, totalPages, total } = usePagination(filtered, page, setPage);

  const statCards = [
    { label: "Collected", value: `₹${captured.toLocaleString("en-IN")}`, sub: "Captured payments", subColor: C.green, icon: IndianRupee, iconBg: C.greenLight, iconColor: C.green },
    { label: "Pending", value: payments.filter((p) => p.status === "pending" || p.status === "PENDING").length, sub: "Awaiting", subColor: C.orange, icon: CreditCard, iconBg: C.orangeLight, iconColor: C.orange },
    { label: "Refunded", value: payments.filter((p) => p.status === "refunded" || p.status === "REFUNDED").length, sub: "Returned", subColor: C.red, icon: UserX, iconBg: C.redLight, iconColor: C.red },
    { label: "Total", value: payments.length, sub: "All transactions", subColor: C.gold, icon: CreditCard, iconBg: C.goldLight, iconColor: C.gold },
  ];

  return (
    <AdminPageShell>
      <StatCardsRow cards={statCards} loading={loading} />
      
      {/* ── ✅ STEP 4: PASS CONFIGURATIONS DIRECTLY TO THE TOOLBAR COMPONENT ── */}
      <ActionToolbar 
        search={search} 
        onSearchChange={(v) => { setSearch(v); setPage(1); }} 
        placeholder="Search payments..." 
        addLabel={null} 
        
        // Dynamic alignment wires:
        filterValue={statusFilter}
        onFilterChange={(status) => { setStatusFilter(status); setPage(1); }}
        filterOptions={paymentOptions}
      />

      <AdminDataTable
        columns={["CUSTOMER", "SALON", "AMOUNT", "TYPE", "STATUS", "DATE"]}
        loading={loading}
        footer={<TablePagination total={total} pageSafe={pageSafe} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />}
      >
        {!loading && paged.length === 0 ? (
          <TableEmptyRow colSpan={6} icon={CreditCard} title="No payments yet" subtitle="Transactions will appear here" />
        ) : (
          paged.map((p) => (
            <tr key={p._id} className="border-t" style={{ borderColor: C.border }}>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <AdminAvatar name={p.customer_id?.name || "C"} size={32} color={C.purple} bg={C.purpleLight} />
                  <span className="font-sans text-sm font-semibold" style={{ color: C.ink }}>{p.customer_id?.name || "—"}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-sans text-sm font-normal" style={{ color: C.gold }}>{p.salon_id?.salon_name || "—"}</td>
              <td className="px-6 py-4 font-sans text-sm font-semibold" style={{ color: C.ink }}>₹{(p.amount || 0).toLocaleString("en-IN")}</td>
              <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed capitalize" style={{ color: C.muted }}>{p.payment_type || "token"}</td>
              <td className="px-6 py-4"><StatusPill label={p.status} active={p.status === "captured" || p.status === "SUCCESS"} /></td>
              <td className="px-6 py-4 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{formatJoined(p.created_at || p.createdAt)}</td>
            </tr>
          ))
        )}
      </AdminDataTable>
    </AdminPageShell>
  );
}

/* ── REVIEWS ── */
export function ReviewsModule({ reviews, loading, deleteReview }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  // ── ✅ STEP 1: ADD LOCAL RATING FILTER STATE ──
  const [ratingFilter, setRatingFilter] = useState("all");

  const avg = reviews.length ? (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1) : "0";

  // ── ✅ STEP 2: DEFINE PORTRAIT RATING CHOICES ──
  const reviewDropdownOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars Only" },
    { value: "4", label: "4 Stars & Above" },
    { value: "3", label: "3 Stars & Above" },
    { value: "2", label: "Critical (2★ & Below)" }
  ];

  // ── ✅ STEP 3: INTERCEPT SELECTION IN THE FILTER STREAM ──
  const filtered = reviews.filter((r) => {
    // 1. Process Star Rating Dropdown Selections
    if (ratingFilter !== "all") {
      const actualRating = r.rating || 0;
      if (ratingFilter === "5" && actualRating !== 5) return false;
      if (ratingFilter === "4" && actualRating < 4) return false;
      if (ratingFilter === "3" && actualRating < 3) return false;
      if (ratingFilter === "2" && actualRating > 2) return false;
    }

    // 2. Process Standard Text Input Queries
    if (!search) return true;
    const q = search.toLowerCase();
    return [r.customer_id?.name, r.salon_id?.salon_name, r.review_text]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q));
  });

  const { paged, pageSafe, totalPages, total } = usePagination(filtered, page, setPage);

  const statCards = [
    { label: "Total Reviews", value: reviews.length, sub: "All reviews", subColor: C.gold, icon: Star, iconBg: C.goldLight, iconColor: C.gold },
    { label: "Avg Rating", value: avg, sub: "Platform average", subColor: C.orange, icon: Star, iconBg: C.orangeLight, iconColor: C.orange },
    { label: "5 Star", value: reviews.filter((r) => r.rating >= 5).length, sub: "Top ratings", subColor: C.green, icon: Star, iconBg: C.greenLight, iconColor: C.green },
    { label: "Low Ratings", value: reviews.filter((r) => r.rating <= 2).length, sub: "Needs attention", subColor: C.red, icon: Star, iconBg: C.redLight, iconColor: C.red },
  ];

  return (
    <AdminPageShell>
      <StatCardsRow cards={statCards} loading={loading} />
      
      {/* ── ✅ STEP 4: PASS CONFIGURATIONS TO WIRED TOOLBAR PROPS ── */}
      <ActionToolbar 
        search={search} 
        onSearchChange={(v) => { setSearch(v); setPage(1); }} 
        placeholder="Search reviews..." 
        addLabel={null} 
        
        // Dynamic Wires:
        filterValue={ratingFilter}
        onFilterChange={(rating) => { setRatingFilter(rating); setPage(1); }}
        filterOptions={reviewDropdownOptions}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-16 text-center font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>Loading reviews…</div>
        ) : paged.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border p-14 text-center" style={{ borderColor: C.border }}>
            <Star size={32} className="mx-auto mb-4" color="#A66527" />
            <p className="font-sans text-sm font-semibold" style={{ color: C.ink }}>No reviews match the active filters</p>
          </div>
        ) : (
          paged.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border p-5 card-shadow text-left" style={{ borderColor: C.border }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <AdminAvatar name={r.customer_id?.name || "C"} size={36} color={C.purple} bg={C.purpleLight} />
                  <div>
                    <div className="font-sans text-sm font-semibold" style={{ color: C.ink }}>{r.customer_id?.name || "Customer"}</div>
                    <div className="font-sans text-xs font-normal" style={{ color: C.gold }}>{r.salon_id?.salon_name || "—"}</div>
                  </div>
                </div>
                <button type="button" onClick={() => deleteReview(r._id)} className="p-1.5 rounded-md hover:bg-red-50 text-red-600 border-none bg-transparent cursor-pointer transition-colors"><Trash2 size={16} /></button>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: s <= (r.rating || 0) ? C.gold : "#D1C5BA" }}>★</span>
                ))}
              </div>
              <p className="font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>{r.review_text || "No comment"}</p>
              <p className="font-sans text-xs font-normal mt-3" style={{ color: C.muted }}>{formatJoined(r.created_at || r.createdAt)}</p>
            </div>
          ))
        )}
      </div>
      {!loading && filtered.length > 0 && (
        <TablePagination total={total} pageSafe={pageSafe} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />
      )}
    </AdminPageShell>
  );
}

/* ── LIVE MONITORING ── */
export function LiveMonitoringModule({ barbers, loading, changeBarberStatus }) {
  const onDuty = barbers.filter((b) => b.status === "available" || b.status === "busy").length;
  const statCards = [
    { label: "Barbers Tracked", value: barbers.length, sub: "On platform", subColor: C.gold, icon: UserSquare, iconBg: C.goldLight, iconColor: C.gold },
    { label: "On Duty", value: onDuty, sub: "Live now", subColor: C.green, icon: Radio, iconBg: C.greenLight, iconColor: C.green },
    { label: "On Break", value: barbers.filter((b) => b.status === "break").length, sub: "Paused", subColor: C.blue, icon: Clock, iconBg: C.blueLight, iconColor: C.blue },
    { label: "Offline", value: barbers.filter((b) => b.status === "offline").length, sub: "Not available", subColor: C.muted, icon: UserX, iconBg: "#F5F5F4", iconColor: C.muted },
  ];

  return (
    <AdminPageShell>
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg border w-fit bg-white" style={{ borderColor: C.border }}>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-green-700">Live Monitoring Active</span>
        <span className="font-sans text-xs font-normal" style={{ color: C.muted }}>{barbers.length} barbers tracked</span>
      </div>
      <StatCardsRow cards={statCards} loading={loading} />
      {loading ? (
        <p className="text-center py-12 font-sans text-sm font-normal leading-relaxed" style={{ color: C.muted }}>Loading…</p>
      ) : barbers.length === 0 ? (
        <div className="bg-white rounded-xl border p-14 text-center" style={{ borderColor: C.border }}>
          <Radio size={32} className="mx-auto mb-4" color="#A66527" />
          <p className="font-sans text-sm font-semibold" style={{ color: C.ink }}>No barbers to monitor</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {barbers.map((b, i) => (
            <div key={b._id} className="bg-white rounded-xl border overflow-hidden card-shadow" style={{ borderColor: b.status === "available" ? `${C.green}40` : C.border, borderWidth: 2 }}>
              <div className="h-36 relative overflow-hidden">
                <img src={barberImg(i)} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="font-sans text-sm font-semibold">{b.name}</div>
                  <div className="font-sans text-xs font-normal opacity-80">{b.specialization || "Barber"}</div>
                </div>
                <div className="absolute top-3 right-3"><StatusPill label={b.status} active={b.status === "available"} /></div>
              </div>
              <div className="p-4">
                <p className="font-sans text-xs font-normal mb-3" style={{ color: C.muted }}>Salon: <span className="font-semibold" style={{ color: C.gold }}>{b.salon_id?.salon_name || "—"}</span></p>
                <div className="flex gap-2">
                  {["available", "break", "offline"].map((s) => (
                    <button key={s} type="button" disabled={b.status === s} onClick={() => changeBarberStatus(b._id, s)}
                      className="flex-1 py-1.5 rounded-md font-sans text-[10px] font-extrabold tracking-wider disabled:opacity-60 capitalize"
                      style={{ background: b.status === s ? C.greenLight : "#F5F5F4", color: b.status === s ? C.green : C.muted, border: `1px solid ${C.border}` }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}

/* ── SETTINGS ── */
export function SettingsModule({ onSave }) {
  const fields = [
    { label: "Platform Name", key: "platform", placeholder: "Barber Pro", type: "text" },
    { label: "Support Email", key: "email", placeholder: "support@barberpro.com", type: "email" },
    { label: "Support Mobile", key: "mobile", placeholder: "+91 9999999999", type: "tel" },
    { label: "Commission %", key: "commission", placeholder: "10", type: "number" },
    { label: "Token Payment %", key: "token", placeholder: "20", type: "number" },
    { label: "Opening Time", key: "open", placeholder: "09:00 AM", type: "text" },
    { label: "Closing Time", key: "close", placeholder: "09:00 PM", type: "text" },
    { label: "GST %", key: "gst", placeholder: "18", type: "number" },
  ];
  const [values, setValues] = useState(Object.fromEntries(fields.map((f) => [f.key, ""])));

  return (
    <AdminPageShell>
      <div className="max-w-2xl bg-white rounded-xl border overflow-hidden card-shadow" style={{ borderColor: C.border }}>
        <div className="px-6 py-4 border-b font-sans text-[11px] font-extrabold uppercase tracking-widest" style={{ borderColor: C.border, color: C.ink }}>System Settings</div>
        {fields.map((f) => (
          <div key={f.key} className="flex flex-col sm:flex-row sm:items-center gap-2 px-6 py-4 border-b" style={{ borderColor: C.border }}>
            <label className="font-sans text-sm font-normal leading-relaxed sm:w-44 shrink-0" style={{ color: C.ink }}>{f.label}</label>
            <input className="inp flex-1" type={f.type} placeholder={f.placeholder}
              value={values[f.key]} onChange={(e) => setValues((p) => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div className="p-6">
          <button type="button" onClick={() => onSave?.()} className="w-full py-3 rounded-lg font-sans text-xs font-extrabold uppercase tracking-wider text-white" style={{ background: C.brown }}>
            Save Settings
          </button>
        </div>
      </div>
    </AdminPageShell>
  );
}