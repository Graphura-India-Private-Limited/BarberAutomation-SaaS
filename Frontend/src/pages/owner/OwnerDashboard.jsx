import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const navigate = useNavigate();
  

  const [salonDetails] = useState({
    salonName: "The Royal Groom",
    ownerName: "Rahul Jagtap",
    address: "Koregaon Park, Pune",
    timing: "10:00 AM - 09:00 PM",
    status: "Approved"
  });


  const [services] = useState([
    { id: 1, name: "Premium Haircut", price: "499" },
    { id: 2, name: "Beard Styling", price: "299" }
  ]);


  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div className="min-h-screen bg-[#FFFBF2] p-4 md:p-10 font-sans text-[#3E362E]">
      
      {/* Top Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
            Owner <span className="text-[#C5A059]">Console</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${salonDetails.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8D7B68]">
              Salon Status: {salonDetails.status}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-[#EAD8C0] rounded-xl text-[10px] font-black tracking-widest hover:bg-[#FDF5E6] transition-all">
            VIEW ANALYTICS
          </button>
          <button className="flex-1 md:flex-none px-6 py-3 bg-[#3E362E] text-white rounded-xl text-[10px] font-black tracking-widest shadow-lg hover:opacity-90 transition-all">
            EDIT PROFILE
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Salon Info & Media */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Salon Details Card */}
          <div className="bg-white border border-[#EAD8C0] p-8 rounded-[2.5rem] shadow-sm">
            <h2 className="text-xl font-black uppercase mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#C5A059]"></span> Salon Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Business Name</label>
                <p className="font-bold text-[#3E362E] text-lg">{salonDetails.salonName}</p>
              </div>
              <div>
                <label className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Operating Hours</label>
                <p className="font-bold text-[#3E362E]">{salonDetails.timing}</p>
              </div>
              <div>
                <label className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest">Location</label>
                <p className="text-sm text-[#8D7B68] italic leading-relaxed">{salonDetails.address}</p>
              </div>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="bg-[#FDF5E6] border border-[#EAD8C0] p-8 rounded-[2.5rem]">
            <h2 className="text-xl font-black uppercase mb-2">Shop Gallery</h2>
            <p className="text-[10px] text-[#8D7B68] mb-6 leading-relaxed italic">Showcase your workspace to build trust.</p>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Add Button Placeholder */}
              <label className="aspect-square bg-white border-2 border-dashed border-[#C5A059]/30 rounded-2xl flex items-center justify-center text-[#C5A059] cursor-pointer hover:border-[#C5A059] transition-all">
                <span className="text-2xl font-light">+</span>
                <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
              
              {imagePreviews.map((url, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-sm border border-white">
                  <img src={url} alt={`salon-preview-${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Services & Pricing */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#EAD8C0] p-6 md:p-10 rounded-[3rem] shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black uppercase tracking-tight">Services <span className="text-[#C5A059]">& Pricing</span></h2>
              <button 
                onClick={() => navigate("/owner/manage-services")}
                className="text-[10px] font-black text-[#C5A059] border-b-2 border-[#C5A059] pb-1 hover:text-[#3E362E] hover:border-[#3E362E] transition-all"
              >
                MANAGE LIST
              </button>
            </div>

            <div className="space-y-4 flex-grow">
              {services.map((service) => (
                <div key={service.id} className="flex justify-between items-center p-6 bg-[#FFFBF2] rounded-2xl border border-[#EAD8C0]/50 hover:border-[#C5A059] transition-all group">
                  <div>
                    <h3 className="font-bold text-[#3E362E] group-hover:text-[#C5A059] transition-colors">{service.name}</h3>
                    <p className="text-[10px] text-[#8D7B68] uppercase tracking-widest mt-1">Standard Service</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#3E362E]">₹{service.price}</p>
                    <button className="text-[8px] font-black text-[#C5A059] mt-1 uppercase hover:underline">Edit</button>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-8 border-2 border-dashed border-[#EAD8C0] rounded-[2rem] flex flex-col items-center justify-center text-center bg-[#FDF5E6]/30">
               <div className="text-2xl mb-2">✂️</div>
               <p className="text-xs font-bold text-[#8D7B68] mb-4">Expand your menu with more premium services.</p>
               <button className="px-10 py-4 bg-[#3E362E] text-white rounded-xl font-black text-[9px] tracking-[0.2em] uppercase hover:scale-105 transition-transform active:scale-95 shadow-md">
                  ADD NEW SERVICE
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OwnerDashboard;