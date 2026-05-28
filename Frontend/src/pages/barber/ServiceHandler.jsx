import React, { useState } from 'react';
import { Clock, Check, ChevronRight, Sparkles, Star, ArrowLeft, Lightbulb } from 'lucide-react';
import Header from "../../components/layout/Header";

const ServiceHandler = () => {
  const [step, setStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const serviceCatalog = [
    { id: 's1', name: 'Premium Haircut', time: 30, price: '₹500', intensity: 70, bestBarber: "Amit", img: 'https://i.pinimg.com/736x/7e/7d/b6/7e7db69384f023cf935f954d09e5f5c3.jpg' },
    { id: 's2', name: 'Beard Grooming', time: 15, price: '₹200', intensity: 40, bestBarber: "Vicky", img: 'https://i.pinimg.com/1200x/7f/c5/a2/7fc5a2bfa31be902b66a6049d8f4b890.jpg' },
    { id: 's3', name: 'Face Clean-up', time: 20, price: '₹400', intensity: 30, bestBarber: "Rahul", img: 'https://i.pinimg.com/736x/f5/74/dc/f574dc0a7ae5e8937e0d923b95fdbfa4.jpg' },
    { id: 's5', name: 'Signature Styling', time: 25, price: '₹600', intensity: 80, bestBarber: "Sahil", img: 'https://i.pinimg.com/736x/c4/af/f7/c4aff7cfc65e4a207eb6d58bbfdb37a2.jpg' },
    { id: 's6', name: 'Head Massage & Spa', time: 40, price: '₹700', intensity: 50, bestBarber: "Sameer", img: 'https://i.pinimg.com/736x/24/0f/56/240f567877004691c5f56df55ab368d2.jpg' },
    { id: 's4', name: 'Full Grooming Combo', time: 50, price: '₹800', intensity: 95, bestBarber: "Asif", img: 'https://i.pinimg.com/1200x/69/03/4b/69034b21f1c6a462bc242526af9455bd.jpg' },
  ];

  const expertCategories = [
    { id: 'gent', title: 'Gentlemen', sub: 'Classic & Modern Cuts', img: 'https://i.pinimg.com/736x/44/75/cf/4475cf227f367f74d7dfe6d7e3a64086.jpg' },
    { id: 'lady', title: 'Ladies', sub: 'Premium Styling & Care', img: 'https://i.pinimg.com/736x/1d/4b/93/1d4b938c2be5d8cac2c40116795291e5.jpg' },
    { id: 'master', title: 'Senior Master', sub: 'Elite Grooming Expert', img: 'https://i.pinimg.com/736x/68/42/21/6842217cdd12a7e73b0c6fd4d347240f.jpg' },
    { id: 'kid', title: 'Kids Specialist', sub: 'Patient & Fun Styling', img: 'https://i.pinimg.com/736x/1f/46/b1/1f46b1993f85aed2698535c310a6baac.jpg' }
  ];

  const getEstimatedFinishTime = (minutes) => {
    const now = new Date();
    const finishTime = new Date(now.getTime() + minutes * 60000);
    return finishTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const handleConfirmSelection = () => {
  if (!selectedService) return;
  
  // 🚀 Connect this to your database, local context pipeline, or router navigate:
  alert(`Successfully confirmed ${selectedService.name} with ${selectedService.bestBarber}!`);
  
  // Example: Navigate to the final checkout or checkout log page
  // navigate('/checkout', { state: { service: selectedService } });
};

 return (
    <div className="min-h-screen w-full bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col overflow-x-hidden">
      
      {/* ✂️ GLOBAL EXECUTIVE SYSTEM NAVIGATION HEADER */}
      <Header 
        title={step === 1 ? "Choose Expert" : "Select Treatment"} 
        subtitle={step === 1 ? "Top-rated professionals for every style" : `Specialists available for ${selectedGender}`} 
      />

      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-grow relative flex flex-col justify-start">
        
        {/* 🧭 Back Button Control */}
        {step === 2 && (
          <div className="w-full text-left mb-6">
            <button 
              type="button"
              onClick={() => { setStep(1); setSelectedService(null); }} 
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} className="stroke-[2.5px]" /> Return to Experts
            </button>
          </div>
        )}

        {/* 🏷️ NEW: ADDED AN INTENTIONAL HEADING ZONE TO REMOVE BLANDNESS */}
        {step === 1 && (
          <div className="text-left mb-10 space-y-2 border-b border-stone-200/40 pb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A37B58]">
              Personalized Grooming
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900 uppercase">
              Choose Your <span className="italic font-serif font-medium lowercase text-[#A37B58]">Stylist</span>
            </h2>
            <p className="text-xs text-stone-400 font-medium max-w-md leading-relaxed">
              Select a specialized master artisan to view their real-time treatment catalogs, session capacities, and current queue intervals.
            </p>
          </div>
        )}

        {/* STEP 1: 4 EXPERT CATEGORIES CONTAINER */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {expertCategories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => { setSelectedGender(cat.title); setStep(2); }}
                className="group cursor-pointer relative overflow-hidden rounded-[2rem] bg-white border border-stone-200/60 shadow-3xs hover:shadow-xl hover:border-stone-400 transition-all duration-500 flex flex-col"
              >
                <div className="h-64 overflow-hidden relative bg-stone-100 flex-shrink-0">
                  <img 
                    src={cat.img} 
                    alt={cat.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent mix-blend-multiply opacity-60" />
                </div>
                <div className="p-5 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-stone-900 tracking-tight uppercase">{cat.title}</h3>
                    <p className="text-[10px] font-black text-[#A37B58] uppercase tracking-widest mt-1.5 leading-normal">{cat.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: SERVICES SELECTION FLOW DISPLAY */}
        {step === 2 && (
          <div className="w-full space-y-8 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceCatalog.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`relative cursor-pointer p-4 rounded-[2rem] border-2 transition-all duration-300 group flex flex-col bg-white ${
                    selectedService?.id === service.id 
                      ? 'border-[#3E362E] shadow-md scale-[1.01]' 
                      : 'border-stone-200/60 shadow-3xs hover:border-stone-400'
                  }`}
                >
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="w-full aspect-video rounded-xl overflow-hidden relative bg-stone-100 border border-stone-100 flex-shrink-0">
                      <img 
                        src={service.img} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
                      />
                    </div>
                    <div className="flex flex-col flex-grow justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <p className="font-extrabold text-stone-900 text-base tracking-tight leading-snug">{service.name}</p>
                        <p className="font-mono font-black text-stone-900 text-sm whitespace-nowrap">{service.price}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4 border-t border-stone-50 pt-3">
                        <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest inline-flex items-center gap-1.5">
                          <Clock size={12} className="text-[#A37B58]" /> {service.time} MIN
                        </p>
                        {selectedService?.id === service.id && (
                          <div className="w-5 h-5 rounded-full bg-[#3E362E] flex items-center justify-center text-white">
                            <Check size={12} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* LOWER BOTTOM ACTION FOOTER PANEL */}
            <div className="min-h-[120px] pt-4 w-full">
              {selectedService ? (
                <div className="w-full bg-white border border-stone-200/80 p-6 rounded-[2rem] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 animate-fade-in">
                  <div className="space-y-3 text-left">
                    <div className="inline-flex items-center gap-1.5 bg-[#FAF6F0] border border-stone-200/60 px-3 py-1.5 rounded-lg text-stone-600">
                      <Lightbulb size={12} className="text-[#C5A059]" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Recommended: {selectedService.bestBarber}</span>
                    </div>
                    <div>
                      <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Estimated Completion Slot</p>
                      <p className="text-4xl font-extrabold text-stone-900 tracking-tight font-mono mt-1">{getEstimatedFinishTime(selectedService.time)}</p>
                    </div>
                  </div>

                  
                  <button 
                    type="button"
                    onClick={handleConfirmSelection}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer group active:scale-[0.99]"
                     >
  <span>Confirm Selection</span>
  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform stroke-[2.5px]" />
</button>
                </div>
              ) : (
                <div className="w-full text-center py-10 border border-dashed border-stone-300 rounded-[2rem] bg-white/40">
                  <Sparkles size={20} className="mx-auto text-[#A37B58] mb-2 animate-pulse" />
                  <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">Select a specialized service up top to verify execution logs</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ServiceHandler;