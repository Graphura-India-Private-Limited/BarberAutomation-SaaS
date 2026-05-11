import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../../context/ServiceContext";
import { Search, Plus, Edit2, Trash2, Users, Clock, IndianRupee, X, Check, Star, Power } from "lucide-react";

/* ─── Service Form Modal ────────────────────────────────────────── */
function ServiceFormModal({ service, onClose, onSave }) {
  const { barbers } = useServices();
  const [form, setForm] = useState(service || {
    name: "", category: "Hair", price: "", duration: "", description: "",
    assignedTo: "all", assignedBarbers: [], icon: "✂️",
  });

  const categories = ["Hair", "Beard", "Spa", "Skin", "Combo", "Other"];
  const icons = ["✂️", "🧔", "💆", "🌿", "🔥", "💇", "🪒", "💅", "🎨"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (Number(form.price) <= 0) return;
    if (!form.duration) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-orange-100 px-6 py-5 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
              {service ? "Edit Service" : "Add New Service"}
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Service Management</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Icon Selector */}
          <div>
            <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block">
              Service Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {icons.map(ic => (
                <button key={ic} type="button"
                  onClick={() => setForm(f => ({ ...f, icon: ic }))}
                  className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-all
                    ${form.icon === ic
                      ? "bg-orange-500 scale-110 shadow-lg"
                      : "bg-orange-50 hover:bg-orange-100 border border-orange-200"}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block">
                Service Name *
              </label>
              <input required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Premium Haircut"
                className="w-full bg-[#faf8f5] border border-orange-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block">
                Category
              </label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-[#faf8f5] border border-orange-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block">
                Price (₹) *
              </label>
              <input required type="number" min="1"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="499"
                className="w-full bg-[#faf8f5] border border-orange-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block">
                Duration (mins) *
              </label>
              <input required type="number" min="1"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="45"
                className="w-full bg-[#faf8f5] border border-orange-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 block">
              Description (Optional)
            </label>
            <textarea rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the service..."
              className="w-full bg-[#faf8f5] border border-orange-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
            />
          </div>

          {/* Assignment */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-3 block">
              Assign to Barbers
            </label>
            
            {/* Assign to all checkbox */}
            <label className="flex items-center gap-3 mb-4 cursor-pointer group">
              <input type="checkbox"
                checked={form.assignedTo === "all"}
                onChange={e => setForm(f => ({
                  ...f,
                  assignedTo: e.target.checked ? "all" : "individual",
                  assignedBarbers: e.target.checked ? [] : f.assignedBarbers,
                }))}
                className="w-5 h-5 rounded border-2 border-orange-300 text-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition-colors">
                Assign to ALL barbers
              </span>
            </label>

            {/* Individual barber selection */}
            {form.assignedTo === "individual" && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-semibold mb-2">Select individual barbers:</p>
                {barbers.map(b => (
                  <label key={b.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox"
                      checked={form.assignedBarbers.includes(b.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setForm(f => ({ ...f, assignedBarbers: [...f.assignedBarbers, b.id] }));
                        } else {
                          setForm(f => ({ ...f, assignedBarbers: f.assignedBarbers.filter(id => id !== b.id) }));
                        }
                      }}
                      className="w-4 h-4 rounded border-2 border-orange-300 text-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer"
                    />
                    <img src={b.img} alt={b.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                      {b.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg transition-all">
              {service ? "Update Service" : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Assignment Modal ──────────────────────────────────────────── */
function AssignmentModal({ service, onClose }) {
  const { barbers, assignService } = useServices();
  const [assignedTo, setAssignedTo] = useState(service.assignedTo);
  const [assignedBarbers, setAssignedBarbers] = useState(service.assignedBarbers);

  const handleSave = () => {
    assignService(service.id, assignedTo, assignedBarbers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        
        <div className="border-b border-orange-100 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Assign Service</h2>
            <p className="text-xs text-gray-400 mt-1">{service.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox"
              checked={assignedTo === "all"}
              onChange={e => {
                setAssignedTo(e.target.checked ? "all" : "individual");
                if (e.target.checked) setAssignedBarbers([]);
              }}
              className="w-5 h-5 rounded border-2 border-orange-300 text-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer"
            />
            <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition-colors">
              Assign to ALL barbers
            </span>
          </label>

          {assignedTo === "individual" && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-gray-500 font-semibold mb-2">Select barbers:</p>
              {barbers.map(b => (
                <label key={b.id} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox"
                    checked={assignedBarbers.includes(b.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setAssignedBarbers(prev => [...prev, b.id]);
                      } else {
                        setAssignedBarbers(prev => prev.filter(id => id !== b.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-2 border-orange-300 text-orange-500 focus:ring-2 focus:ring-orange-200 cursor-pointer"
                  />
                  <img src={b.img} alt={b.name} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                    {b.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={onClose}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg transition-all">
              Save Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function ManageServices() {
  const navigate = useNavigate();
  const { services, barbers, toastMsg, addService, updateService, deleteService, toggleActive, togglePopular } = useServices();

  const [search, setSearch] = useState("");
  const [filterBarber, setFilterBarber] = useState("all");
  const [filterActive, setFilterActive] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editService, setEditService] = useState(null);
  const [assignModal, setAssignModal] = useState(null);

  /* ── Filtered services ────────────────────────────────────────── */
  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.category.toLowerCase().includes(search.toLowerCase());
    const matchBarber = filterBarber === "all" ||
                        s.assignedTo === "all" ||
                        s.assignedBarbers.includes(Number(filterBarber));
    const matchActive = filterActive === "all" ||
                        (filterActive === "active" && s.active) ||
                        (filterActive === "inactive" && !s.active);
    return matchSearch && matchBarber && matchActive;
  });

  /* ── Handlers ─────────────────────────────────────────────────── */
  const handleSave = (data) => {
    if (editService) {
      const success = updateService(editService.id, data);
      if (success) { setShowForm(false); setEditService(null); }
    } else {
      const success = addService(data);
      if (success) setShowForm(false);
    }
  };

  const handleEdit = (s) => {
    setEditService(s);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteService(id);
    }
  };

  const getAssignedNames = (s) => {
    if (s.assignedTo === "all") return "All Barbers";
    return s.assignedBarbers.map(id => barbers.find(b => b.id === id)?.name).filter(Boolean).join(", ") || "None";
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans">
      
      {/* Toast */}
      {toastMsg && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-in slide-in-from-top duration-300
          ${toastMsg.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {toastMsg.type === "success" ? <Check size={18} /> : <X size={18} />}
          {toastMsg.msg}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <ServiceFormModal
          service={editService}
          onClose={() => { setShowForm(false); setEditService(null); }}
          onSave={handleSave}
        />
      )}
      {assignModal && (
        <AssignmentModal service={assignModal} onClose={() => setAssignModal(null)} />
      )}

      {/* Header */}
      <div className="bg-white border-b border-orange-100 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate("/owner/dashboard")}
            className="text-[10px] font-black tracking-widest text-orange-500 mb-4 hover:underline uppercase">
            ← Back to Console
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tight">
                Service <span className="text-orange-500">Management</span>
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                Pricing, Assignment & Control
              </p>
            </div>
            <button onClick={() => { setEditService(null); setShowForm(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg transition-all">
              <Plus size={18} /> Add New Service
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-orange-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-12 pr-4 py-3 bg-[#faf8f5] border border-orange-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {/* Filter by barber */}
          <select
            value={filterBarber}
            onChange={e => setFilterBarber(e.target.value)}
            className="px-4 py-3 bg-[#faf8f5] border border-orange-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all">
            <option value="all">All Barbers</option>
            {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          {/* Filter by status */}
          <select
            value={filterActive}
            onChange={e => setFilterActive(e.target.value)}
            className="px-4 py-3 bg-[#faf8f5] border border-orange-200 rounded-xl text-sm font-semibold text-gray-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all">
            <option value="all">All Services</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✂️</div>
            <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">No services found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(s => (
              <div key={s.id}
                className="bg-white border border-orange-100 rounded-2xl p-5 hover:shadow-lg transition-all group">
                
                <div className="flex flex-col lg:flex-row gap-5">
                  
                  {/* Left: Icon + Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {s.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-black text-gray-800 truncate">{s.name}</h3>
                        {s.popular && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold">
                            <Star size={10} fill="currentColor" /> Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">{s.category}</p>
                      {s.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{s.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="flex gap-6 items-center">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                        <IndianRupee size={12} />
                        <span className="font-semibold uppercase tracking-wider">Price</span>
                      </div>
                      <p className="text-2xl font-black text-gray-800">₹{s.price}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                        <Clock size={12} />
                        <span className="font-semibold uppercase tracking-wider">Duration</span>
                      </div>
                      <p className="text-lg font-bold text-gray-700">{s.duration}m</p>
                    </div>
                    <div className="text-center min-w-[120px]">
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                        <Users size={12} />
                        <span className="font-semibold uppercase tracking-wider">Assigned</span>
                      </div>
                      <p className="text-xs font-bold text-gray-700 truncate">{getAssignedNames(s)}</p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex lg:flex-col gap-2 items-center justify-end">
                    {/* Active toggle */}
                    <button onClick={() => toggleActive(s.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all
                        ${s.active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                      <Power size={12} />
                      {s.active ? "Active" : "Inactive"}
                    </button>

                    {/* Popular toggle */}
                    <button onClick={() => togglePopular(s.id)}
                      className={`p-2 rounded-lg transition-all
                        ${s.popular ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400 hover:bg-yellow-50"}`}>
                      <Star size={14} fill={s.popular ? "currentColor" : "none"} />
                    </button>

                    {/* Edit */}
                    <button onClick={() => handleEdit(s)}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all">
                      <Edit2 size={14} />
                    </button>

                    {/* Assign */}
                    <button onClick={() => setAssignModal(s)}
                      className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-all">
                      <Users size={14} />
                    </button>

                    {/* Delete */}
                    <button onClick={() => handleDelete(s.id)}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
