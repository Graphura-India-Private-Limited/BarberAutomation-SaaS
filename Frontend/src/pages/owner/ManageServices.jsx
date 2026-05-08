import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerformanceView from "../../Components/PerformanceView";

function ManageServices() {
  const navigate = useNavigate();

  const [servicePerformance, setServicePerformance] = useState([
    { serviceId: 1, customersServed: 46, averageTime: 42, completed: 44, rating: 4.8 },
    { serviceId: 2, customersServed: 38, averageTime: 27, completed: 36, rating: 4.6 },
    { serviceId: 3, customersServed: 21, averageTime: 58, completed: 20, rating: 4.9 },
  ]);

  const [services, setServices] = useState([
    { id: 1, name: "Premium Haircut", price: "499", duration: "45 min" },
    { id: 2, name: "Beard Styling", price: "299", duration: "30 min" },
    { id: 3, name: "Hair Spa & Massage", price: "899", duration: "60 min" }
  ]);

  const [newService, setNewService] = useState({ name: "", price: "", duration: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddService = (e) => {
    e.preventDefault();
    if (newService.name && newService.price) {
      const serviceId = Date.now();
      setServices([...services, { id: serviceId, ...newService }]);
      setServicePerformance([
        ...servicePerformance,
        { serviceId, customersServed: 0, averageTime: 0, completed: 0, rating: "N/A" },
      ]);
      setNewService({ name: "", price: "", duration: "" });
      setIsAdding(false);
    }
  };

  const deleteService = (id) => {
    setServices(services.filter(s => s.id !== id));
    setServicePerformance(servicePerformance.filter(performance => performance.serviceId !== id));
  };

  const logCompletedService = (service) => {
    const durationValue = parseInt(service.duration, 10) || 30;

    setServicePerformance(servicePerformance.map(performance => {
      if (performance.serviceId !== service.id) return performance;

      const nextCompleted = performance.completed + 1;
      const nextCustomersServed = performance.customersServed + 1;
      const nextAverageTime = Math.round(
        ((performance.averageTime || durationValue) * performance.completed + durationValue) / nextCompleted
      );
      const currentRating = typeof performance.rating === "number" ? performance.rating : 4.5;
      const nextRating = Number((((currentRating * performance.completed) + 4.8) / nextCompleted).toFixed(1));

      return {
        ...performance,
        customersServed: nextCustomersServed,
        averageTime: nextAverageTime,
        completed: nextCompleted,
        rating: nextRating,
      };
    }));
  };

  const getServicePerformance = (serviceId) => {
    return servicePerformance.find(performance => performance.serviceId === serviceId) || {
      customersServed: 0,
      averageTime: 0,
      completed: 0,
      rating: "N/A",
    };
  };

  const visiblePerformance = services.map(service => getServicePerformance(service.id));
  const ratedPerformance = visiblePerformance.filter(performance => typeof performance.rating === "number");
  const timedPerformance = visiblePerformance.filter(performance => performance.completed > 0);

  const totalCustomersServed = visiblePerformance.reduce(
    (total, performance) => total + performance.customersServed,
    0
  );
  const completedServices = visiblePerformance.reduce(
    (total, performance) => total + performance.completed,
    0
  );
  const averageServiceTime = timedPerformance.length
    ? Math.round(
        timedPerformance.reduce((total, performance) => total + performance.averageTime, 0) /
          timedPerformance.length
      )
    : 0;
  const averageRating = ratedPerformance.length
    ? (
        ratedPerformance.reduce((total, performance) => total + performance.rating, 0) /
        ratedPerformance.length
      ).toFixed(1)
    : "N/A";

  const performanceMetrics = [
    { label: "Customers Served", value: totalCustomersServed },
    { label: "Avg Service Time", value: `${averageServiceTime}m` },
    { label: "Completed Services", value: completedServices },
    { label: "Customer Rating", value: averageRating === "N/A" ? "N/A" : `${averageRating}/5` },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF2] p-4 md:p-10 font-sans text-[#3E362E]">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <button
          onClick={() => navigate("/owner/dashboard")}
          className="text-[10px] font-black tracking-widest text-[#C5A059] mb-8 flex items-center gap-2 hover:translate-x-[-5px] transition-all"
        >
          ← BACK TO CONSOLE
        </button>

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
              Manage <span className="text-[#C5A059]">Services</span>
            </h1>
            <p className="text-[10px] font-bold text-[#8D7B68] uppercase tracking-[0.4em] mt-2 text-center md:text-left">
              Menu & Pricing Control
            </p>
          </div>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full md:w-auto px-8 py-4 bg-[#3E362E] text-white rounded-2xl font-black text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all"
            >
              + ADD NEW CATEGORY
            </button>
          )}
        </div>

        {/* Add Service Form (Requirement 2.2) */}
        {isAdding && (
          <div className="bg-white border-2 border-[#C5A059] p-8 rounded-[2.5rem] mb-12 animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-black uppercase mb-6">New Service Details</h2>
            <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Service Name</label>
                <input
                  required
                  placeholder="e.g. Hair Coloring"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full bg-[#FFFBF2] border border-[#EAD8C0] p-4 rounded-xl outline-none focus:border-[#C5A059] font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Price (₹)</label>
                <input
                  required
                  type="number"
                  placeholder="999"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  className="w-full bg-[#FFFBF2] border border-[#EAD8C0] p-4 rounded-xl outline-none focus:border-[#C5A059] font-bold text-sm"
                />
              </div>
              <div className="flex items-end gap-3">
                <button type="submit" className="flex-1 bg-[#C5A059] text-white py-4 rounded-xl font-black text-[10px] tracking-widest hover:bg-[#A68648]">
                  SAVE
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-4 bg-red-50 text-red-500 rounded-xl font-black text-[10px] tracking-widest"
                >
                  X
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-8">
          <PerformanceView
            title="Service Performance"
            subtitle="All active services"
            metrics={performanceMetrics}
          />
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service) => {
            const performance = getServicePerformance(service.id);

            return (
              <div
                key={service.id}
                className="bg-white border border-[#EAD8C0] p-6 rounded-[2rem] group hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="w-14 h-14 bg-[#FDF5E6] rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:rotate-6 transition-transform">
                      ✂️
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#3E362E]">{service.name}</h3>
                      <p className="text-[10px] text-[#8D7B68] font-bold uppercase tracking-widest">Estimated: {service.duration || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#3E362E]">₹{service.price}</p>
                      <p className="text-[9px] text-[#C5A059] font-black tracking-widest uppercase">Base Price</p>
                    </div>
                    <button
                      onClick={() => logCompletedService(service)}
                      className="px-4 py-3 bg-[#FDF5E6] text-[#3E362E] rounded-xl hover:bg-[#C5A059] hover:text-white transition-all font-black text-[9px] tracking-widest uppercase"
                    >
                      Log Complete
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-[#EAD8C0] pt-5">
                  <div>
                    <p className="text-sm font-black text-[#3E362E]">{performance.customersServed}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#8D7B68]">Customers</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#3E362E]">{performance.averageTime}m</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#8D7B68]">Avg Time</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#3E362E]">{performance.completed}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#8D7B68]">Completed</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#3E362E]">
                      {performance.rating === "N/A" ? "N/A" : `${performance.rating}/5`}
                    </p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#8D7B68]">Rating</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {services.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <p className="text-sm font-black uppercase tracking-[0.3em]">No services added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageServices;
