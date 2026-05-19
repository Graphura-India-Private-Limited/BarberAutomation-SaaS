
import React, { useState } from "react";
import { useAuth, useQueue } from "../../AppContext";
import Navbar from "../../Components/Navbar";

const STATUS_COLORS = {
  "waiting": "bg-orange-100 text-orange-800 border-orange-300",
  "in-progress": "bg-green-100 text-green-800 border-green-300",
  "done": "bg-gray-100 text-gray-600 border-gray-300",
};

const SERVICES = ["Haircut", "Shave", "Hair Colour", "Haircut + Shave", "Beard Trim"];

export default function QueuePage() {
  const { currentUser } = useAuth();
  const { queue, updateStatus, addToQueue, removeFromQueue } = useQueue();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ customer: "", service: SERVICES[0], time: "" });

  const isOwner = currentUser?.role === "owner";
  const visibleQueue = isOwner ? queue : queue.filter(q => q.barber === currentUser?.name);

  const handleAdd = () => {
    if (!form.customer || !form.time) return;
    addToQueue({ ...form, barber: currentUser.name });
    setForm({ customer: "", service: SERVICES[0], time: "" });
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-orange-900">Queue Management</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isOwner ? "All barbers' queues" : `Your queue — ${currentUser?.name}`}
            </p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition"
          >
            + Add Customer
          </button>
        </div>

        {showAdd && (
          <div className="bg-white border border-orange-200 rounded-2xl p-5 mb-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">New Queue Entry</h3>
            <div className="grid grid-cols-3 gap-3">
              <input
                className="border border-orange-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Customer name"
                value={form.customer}
                onChange={e => setForm({ ...form, customer: e.target.value })}
              />
              <select
                className="border border-orange-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.service}
                onChange={e => setForm({ ...form, service: e.target.value })}
              >
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
              <input
                type="time"
                className="border border-orange-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handleAdd} className="bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-orange-700">
                Add
              </button>
              <button onClick={() => setShowAdd(false)} className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {visibleQueue.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No customers in queue.</div>
          )}
          {visibleQueue.map(item => (
            <div key={item.id} className="bg-white border rounded-xl px-5 py-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-bold text-gray-900">{item.customer}</p>
                <p className="text-sm text-gray-500">{item.service} · {item.time}</p>
                {isOwner && <p className="text-xs text-orange-600 font-medium">Barber: {item.barber}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_COLORS[item.status]}`}>
                  {item.status}
                </span>
                {item.status !== "done" && (
                  <select
                    className="text-xs border border-orange-300 rounded-lg px-2 py-1 text-gray-700 focus:outline-none"
                    value={item.status}
                    onChange={e => updateStatus(item.id, e.target.value)}
                  >
                    <option value="waiting">Waiting</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                )}
                {isOwner && (
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}