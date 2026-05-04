import React, { useState } from "react";
import adminBg from "../../assets/adminlogin.jpg"; 

const ScissorIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 11.3321 8.7818 10.715 8.4121 10.2148L11.5 12L14.5879 13.7852C14.2182 14.285 14 14.9019 14 15.5645C14 17.2213 15.3431 18.5645 17 18.5645C18.6569 18.5645 20 17.2213 20 15.5645C20 14.2964 19.2155 13.2117 18.102 12.7751L15.3 11.1574L18.102 9.53974C19.2155 9.10313 20 8.01844 20 6.75032C20 5.09347 18.6569 3.75032 17 3.75032C15.3431 3.75032 14 5.09347 14 6.75032C14 7.41292 14.2182 8.02983 14.5879 8.52959L11.5 10.3148L8.4121 8.5322C8.7818 8.03198 9 7.41492 9 6.74731C9 5.09046 7.65685 3.74731 6 3.74731C4.34315 3.74731 3 5.09046 3 6.74731C3 8.40417 4.34315 9.74731 6 9.74731C6.66508 9.74731 7.2798 9.53039 7.7788 9.16335L10.8667 10.9485L7.7788 12.7337C7.2798 12.3667 6.66508 12.1497 6 12.1497C4.34315 12.1497 3 13.4929 3 15.1497C3 16.8066 4.34315 18.1497 6 18.1497V15Z" />
  </svg>
);

function AdminOnboarding() {
  const [requests, setRequests] = useState([
    { id: 1, salonName: "Vintage Velvet", ownerName: "Rahul Sharma", mobile: "9823456789", address: "Kothrud, Pune", services: "Haircut, Beard Trim", date: "2026-04-20", status: "Pending" },
    { id: 2, salonName: "The Groom Room", ownerName: "Amit Verma", mobile: "9123450011", address: "Baner, Pune", services: "Facial, Hair Color", date: "2026-04-21", status: "Approved" },
    { id: 3, salonName: "Sharp Styles", ownerName: "Vikram Singh", mobile: "8877665544", address: "Hinjewadi, Pune", services: "Styling, Shave", date: "2026-04-19", status: "Rejected", reason: "Invalid Business License" }
  ]);

  const [modal, setModal] = useState({ show: false, id: null, reason: "" });

  const updateStatus = (id, newStatus, reason = "") => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus, reason: reason } : req
    ));
    setModal({ show: false, id: null, reason: "" });
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 font-sans relative overflow-x-hidden bg-[#3E362E]">
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat fixed"
        style={{ 
            backgroundImage: `url(${adminBg})`,
            filter: "brightness(0.3)" 
        }}
      ></div>

      {/* Responsive Logo Section */}
      <div className="relative md:absolute top-0 md:top-8 md:left-8 z-20 flex flex-col items-center md:items-start mb-10 md:mb-0">
        <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
          <ScissorIcon className="w-6 h-6 text-[#3E362E] fill-[#C5A059] stroke-[#C5A059] stroke-[1px]" />
          Barber <span className="text-white">Pro</span>
        </h1>
        <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-40"></div>
        <p className="text-[9px] text-[#EAD8C0] tracking-[0.4em] uppercase mt-1 text-center w-full">Est. 2026</p>
      </div>

      {/* Main Content Layer */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section - Adjusted Margins for Logo */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 mt-4 md:mt-32">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 w-full md:w-auto text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex flex-col md:flex-row items-center gap-3 text-white">
              <span className="flex items-center gap-3">
                <ScissorIcon className="w-8 h-8 md:w-10 md:h-10 fill-[#C5A059]" />
                Onboarding
              </span>
              <span className="text-[#C5A059]">Requests</span>
            </h1>
            <p className="text-[#EAD8C0] text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Platform Control Panel</p>
          </div>
          
          <div className="bg-white/90 px-8 py-4 rounded-3xl border border-[#C5A059] shadow-lg min-w-[150px] text-center">
            <p className="text-[10px] font-black uppercase text-[#8D7B68]">Total Entries</p>
            <p className="text-2xl font-black text-[#3E362E]">{requests.length}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/95 backdrop-blur-lg rounded-[2rem] md:rounded-[3rem] border border-white shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-[#3E362E] text-[#FFFBF2]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Salon & Address</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Owner Details</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Services & Date</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD8C0]/50">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FFFBF2] transition-colors">
                    <td className="p-6">
                      <p className="font-black text-[#3E362E] text-sm uppercase">{req.salonName}</p>
                      <p className="text-[11px] text-[#8D7B68] mt-1">{req.address}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-sm text-[#3E362E]">{req.ownerName}</p>
                      <p className="text-[11px] text-[#C5A059] font-black mt-1 uppercase">+91 {req.mobile}</p>
                    </td>
                    <td className="p-6 text-[11px] font-bold text-[#8D7B68]">
                      <span className="block uppercase tracking-tighter">{req.services}</span>
                      <span className="text-[9px] opacity-60 italic mt-1">{req.date}</span>
                    </td>
                    <td className="p-6">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        req.status === "Approved" ? "bg-green-100 text-green-700" : 
                        req.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-[#FDF5E6] text-[#C5A059]"
                      }`}>
                        {req.status}
                      </span>
                      {req.status === "Rejected" && (
                        <p className="text-[8px] text-red-500 mt-2 font-bold uppercase tracking-tighter max-w-[120px]">⚠️ {req.reason}</p>
                      )}
                    </td>
                    <td className="p-6">
                      {req.status === "Pending" ? (
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => updateStatus(req.id, "Approved")} className="bg-[#3E362E] text-[#FFFBF2] px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:scale-105 transition-all shadow-md">Approve</button>
                          <button onClick={() => setModal({ show: true, id: req.id, reason: "" })} className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-red-50 transition-all">Reject</button>
                        </div>
                      ) : (
                        <div className="text-center">
                           <span className="text-[10px] font-black text-[#C5A059] uppercase opacity-50 tracking-widest">Locked</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Rejection Code */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl border border-white animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-[#3E362E] uppercase text-center mb-6">Rejection Reason</h3>
            <textarea 
              className="w-full h-32 p-4 bg-[#FDF5E6] border border-[#EAD8C0] rounded-2xl outline-none focus:border-red-400 text-sm font-medium"
              placeholder="Enter reason..."
              value={modal.reason}
              onChange={(e) => setModal({ ...modal, reason: e.target.value })}
            />
            <div className="flex gap-4 mt-8">
              <button onClick={() => setModal({ show: false, id: null, reason: "" })} className="flex-1 py-4 text-[10px] font-black uppercase text-[#8D7B68]">Cancel</button>
              <button disabled={!modal.reason.trim()} onClick={() => updateStatus(modal.id, "Rejected", modal.reason)} className="flex-1 py-4 bg-red-600 text-white text-[10px] font-black uppercase rounded-2xl shadow-lg disabled:opacity-50">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOnboarding;