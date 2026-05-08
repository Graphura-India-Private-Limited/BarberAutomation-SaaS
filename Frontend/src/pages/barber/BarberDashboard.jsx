import React, { useState } from "react";
import PerformanceView from "../../Components/PerformanceView";

function BarberDashboard() {
  const [serviceHistory, setServiceHistory] = useState([
    { id: 101, customer: "Nikhil Patil", service: "Classic Cut", duration: 28, rating: 4.8 },
    { id: 102, customer: "Manav Shah", service: "Beard Styling", duration: 22, rating: 4.6 },
    { id: 103, customer: "Aarav Mehta", service: "Hair Spa", duration: 45, rating: 4.9 },
    { id: 104, customer: "Kabir Rao", service: "Premium Haircut", duration: 34, rating: 4.7 },
  ]);
 
  const [appointments, setAppointments] = useState([
    { id: 1, customer: "Rahul Jagtap", service: "Premium Haircut", time: "10:30 AM", status: "Pending", duration: 32, rating: 4.8 },
    { id: 2, customer: "Aryan", service: "Kid's Styling", time: "11:15 AM", status: "In-Progress", duration: 25, rating: 4.6 },
    { id: 3, customer: "Snehal", service: "Hair Spa", time: "01:00 PM", status: "Upcoming", duration: 45, rating: 4.9 },
  ]);

  const updateStatus = (id, newStatus) => {
    const appointment = appointments.find(app => app.id === id);

    setAppointments(appointments.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    ));

    if (newStatus === "Completed" && appointment?.status !== "Completed") {
      setServiceHistory(history => [
        ...history,
        {
          id: Date.now(),
          customer: appointment.customer,
          service: appointment.service,
          duration: appointment.duration,
          rating: appointment.rating,
        },
      ]);
    }
  };

  const completedServices = serviceHistory.length;
  const averageServiceTime = completedServices
    ? Math.round(serviceHistory.reduce((total, service) => total + service.duration, 0) / completedServices)
    : 0;
  const averageRating = completedServices
    ? (serviceHistory.reduce((total, service) => total + service.rating, 0) / completedServices).toFixed(1)
    : "N/A";

  const performanceMetrics = [
    { label: "Customers Served", value: completedServices },
    { label: "Avg Service Time", value: `${averageServiceTime}m` },
    { label: "Completed Services", value: completedServices },
    { label: "Customer Rating", value: averageRating === "N/A" ? "N/A" : `${averageRating}/5` },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF2] p-4 md:p-10 font-sans text-[#3E362E]">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-[#EAD8C0] pb-8">
          <div>
            <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-[0.4em] mb-2">Staff Terminal</p>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
              Barber <span className="text-[#C5A059]">Dashboard</span>
            </h1>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-[#EAD8C0] shadow-sm">
            <p className="text-[9px] font-bold text-[#8D7B68] uppercase tracking-widest">Total Bookings Today</p>
            <p className="text-2xl font-black text-[#C5A059]">{appointments.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Quick Stats & Profile Summary */}
          <div className="space-y-6">
            <div className="bg-[#3E362E] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-sm font-black uppercase tracking-widest text-[#C5A059] mb-4">My Profile</h2>
                <p className="text-xl font-bold">Sameer Khan</p>
                <p className="text-xs text-white/60 mt-1 italic">Senior Stylist • The Royal Groom</p>
                <div className="mt-6 flex gap-2">
                   <span className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-bold uppercase">Haircut Expert</span>
                   <span className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-bold uppercase">Beard Pro</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M6 15C7.65685 15 9 13.6569 9 12C9 11.3321 8.7818 10.715 8.4121 10.2148L11.5 12L14.5879 13.7852C14.2182 14.285 14 14.9019 14 15.5645C14 17.2213 15.3431 18.5645 17 18.5645C18.6569 18.5645 20 17.2213 20 15.5645C20 14.2964 19.2155 13.2117 18.102 12.7751L15.3 11.1574L18.102 9.53974C19.2155 9.10313 20 8.01844 20 6.75032C20 5.09347 18.6569 3.75032 17 3.75032C15.3431 3.75032 14 5.09347 14 6.75032C14 7.41292 14.2182 8.02983 14.5879 8.52959L11.5 10.3148L8.4121 8.5322C8.7818 8.03198 9 7.41492 9 6.74731C9 5.09046 7.65685 3.74731 6 3.74731C4.34315 3.74731 3 5.09046 3 6.74731C3 8.40417 4.34315 9.74731 6 9.74731C6.66508 9.74731 7.2798 9.53039 7.7788 9.16335L10.8667 10.9485L7.7788 12.7337C7.2798 12.3667 6.66508 12.1497 6 12.1497C4.34315 12.1497 3 13.4929 3 15.1497C3 16.8066 4.34315 18.1497 6 18.1497V15Z" /></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-[#EAD8C0] shadow-sm">
                <h3 className="text-[10px] font-black uppercase text-[#8D7B68] mb-4 tracking-widest">Shift Status</h3>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Duty On</span>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                    </div>
                </div>
            </div>

            <PerformanceView
              title="Performance View"
              subtitle="Sameer Khan"
              metrics={performanceMetrics}
            />
          </div>

          {/* Right: Appointment Queue */}
          <div className="lg:col-span-2">
            <div className="bg-white/50 backdrop-blur-sm border border-[#EAD8C0] p-6 md:p-8 rounded-[3rem] shadow-sm">
              <h2 className="text-xl font-black uppercase mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#C5A059]"></span> Today's Queue
              </h2>
              
              <div className="space-y-4">
                {appointments.map((app) => (
                  <div key={app.id} className="bg-white border border-[#EAD8C0] p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center group hover:border-[#C5A059] transition-all">
                    <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                      <div className="w-12 h-12 rounded-xl bg-[#FDF5E6] flex items-center justify-center font-black text-[#C5A059] text-sm shadow-inner">
                        {app.time.split(':')[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#3E362E]">{app.customer}</h4>
                        <p className="text-[10px] font-bold text-[#8D7B68] uppercase tracking-widest">{app.service}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right mr-4">
                        <p className="text-[9px] font-black uppercase text-[#C5A059]">{app.time}</p>
                        <p className={`text-[10px] font-bold ${app.status === 'In-Progress' ? 'text-blue-500' : 'text-[#8D7B68]'}`}>
                          {app.status}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {app.status !== 'Completed' && (
                          <button 
                            onClick={() => updateStatus(app.id, 'In-Progress')}
                            className="px-4 py-2 bg-[#FDF5E6] text-[#3E362E] rounded-lg text-[9px] font-black uppercase hover:bg-[#C5A059] hover:text-white transition-all"
                          >
                            Start
                          </button>
                        )}
                        <button 
                          onClick={() => updateStatus(app.id, 'Completed')}
                          className="px-4 py-2 bg-[#3E362E] text-white rounded-lg text-[9px] font-black uppercase hover:bg-black transition-all"
                        >
                          Finish
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {appointments.length === 0 && (
                <div className="text-center py-10 italic text-[#8D7B68]">No more appointments for today.</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BarberDashboard;
