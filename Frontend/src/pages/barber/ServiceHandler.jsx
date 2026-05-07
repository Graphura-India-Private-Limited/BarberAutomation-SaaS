import React, { useState } from 'react';
import { Clock, Check, ChevronRight, Sparkles, Star, ArrowLeft, Lightbulb } from 'lucide-react';

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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcf8f1] p-4 lg:p-12">
      <div className="bg-[#fdf5e6] text-[#4a3728] p-6 md:p-10 rounded-[3.5rem] border border-[#e8dcc4] w-full max-w-5xl shadow-[0_40px_120px_-20px_rgba(74,55,40,0.18)] font-sans relative overflow-hidden transition-all duration-500">
        
        {step === 2 && (
          <button onClick={() => {setStep(1); setSelectedService(null);}} className="absolute top-8 right-8 p-3 bg-white/50 hover:bg-white rounded-full transition-all border border-[#e8dcc4] z-20">
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="mb-10 flex flex-col gap-3">
          <h2 className="text-3xl md:text-5xl font-black text-[#3d2b1f] tracking-tight leading-none">
            {step === 1 ? "Choose Your " : "Select "}
            <span className="text-[#c5a385]">{step === 1 ? "Expert." : "Service."}</span>
          </h2>
          <p className="text-[#8b7355] text-xs md:text-sm font-medium flex items-center gap-2">
            <Star size={16} fill="#c5a385" className="text-[#c5a385]" /> 
            {step === 1 ? "Top-rated professionals for every style" : `Specialists available for ${selectedGender}`}
          </p>
        </div>

        {/* STEP 1: 4 EXPERT CATEGORIES */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-500">
            {expertCategories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => { setSelectedGender(cat.title); setStep(2); }}
                className="group cursor-pointer relative overflow-hidden rounded-[2.5rem] border-2 border-[#ede0c8] bg-white hover:border-[#4a3728] transition-all duration-500 hover:shadow-xl"
              >
                <div className="h-48 md:h-60 overflow-hidden">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">{cat.title}</h3>
                  <p className="text-[9px] font-bold text-[#c5a385] uppercase tracking-widest mt-1">{cat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 2: SERVICES GRID */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-10 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {serviceCatalog.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`relative cursor-pointer p-3 rounded-[2rem] border-2 transition-all duration-500 group ${
                    selectedService?.id === service.id ? 'border-[#4a3728] bg-white shadow-xl scale-[1.02] z-10' : 'border-[#ede0c8] bg-white/50 hover:border-[#4a3728]'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="w-full aspect-square rounded-[1.2rem] overflow-hidden shadow-inner border border-[#ede0c8]">
                      <img src={service.img} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    <div className="px-1 pb-1">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-black text-sm md:text-base leading-tight tracking-tight">{service.name}</p>
                        <p className="font-bold text-sm text-[#c5a385]">{service.price}</p>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-[9px] font-bold uppercase text-[#8b7355] tracking-widest flex items-center gap-1">
                          <Clock size={10} /> {service.time} MIN
                        </p>
                        {selectedService?.id === service.id && <Check size={14} className="text-[#4a3728]" strokeWidth={4} />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="min-h-[140px] flex items-center">
              {selectedService ? (
                <div className="w-full bg-[#4a3728] text-[#fdf5e6] p-6 rounded-[2.5rem] shadow-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/5">
                      <Lightbulb size={14} className="text-yellow-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Barber: {selectedService.bestBarber}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Estimated Completion</p>
                      <p className="text-4xl font-black tabular-nums">{getEstimatedFinishTime(selectedService.time)}</p>
                    </div>
                    <button className="bg-[#c5a385] hover:bg-white hover:text-[#4a3728] p-4 rounded-2xl transition-all shadow-xl active:scale-95 group">
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full text-center py-8 border-2 border-dashed border-[#ede0c8] rounded-[2.5rem] bg-white/10">
                  <Sparkles size={24} className="mx-auto text-[#c5a385] mb-2 animate-pulse" />
                  <p className="text-[#8b7355] text-[10px] font-black uppercase tracking-[0.15em] italic">Pick a service to check availability</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHandler;