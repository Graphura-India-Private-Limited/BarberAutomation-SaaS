import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔑 1. Bring in the navigation router hook
import { Play, CheckCircle, Clock, History, Scissors, TrendingUp, IndianRupee, PlusCircle, Sparkles } from 'lucide-react';

const ServiceConsole = () => {
  const navigate = useNavigate(); // 🔑 2. Initialize the navigation control launcher
  const [status, setStatus] = useState('Available');
  const [seconds, setSeconds] = useState(0);
  const [currentCustomer, setCurrentCustomer] = useState("Rahul Sharma");
  const [totalServices, setTotalServices] = useState(12);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Consultation", "Haircut", "Head Massage", "Payment"];

  const [showServices, setShowServices] = useState(false);
  
  const extraServices = [
    { name: "Beard Shape", price: 150 },
    { name: "Head Massage (Oil)", price: 100 },
    { name: "Face D-Tan", price: 350 },
    { name: "Hair Color (Black)", price: 500 }
  ];

  useEffect(() => {
    let interval = null;
    if (status === 'Busy') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        if (seconds > 0 && seconds % 10 === 0 && activeStep < steps.length - 1) {
          setActiveStep(prev => prev + 1);
        }
      }, 1000);
    } 
    return () => { if (interval) clearInterval(interval); };
  }, [status, seconds, activeStep]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStatus('Busy');
    setActiveStep(0);
  };

  const handleComplete = () => {
    setStatus('Available');
    setSeconds(0);
    setActiveStep(0);
    setTotalServices(prev => prev + 1);
    setCurrentCustomer("Ankit Verma"); 
  };

  return (
    <div 
      className="min-h-screen font-serif relative overflow-hidden flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(250, 249, 246, 0.82), rgba(250, 249, 246, 0.96)), url('image_f16fd9.jpg')`,
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="absolute top-[-5%] left-[-5%] w-80 h-80 bg-[#C5A059]/15 rounded-full blur-[110px] animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-[#3E362E]/10 rounded-full blur-[130px]"></div>

      {/* --- HEADER --- */}
      <header className="p-6 fixed top-0 left-0 z-50 w-full flex justify-between items-start">
        
        {/* 🔑 3. FIXED CLICK ACTION: Routes directly to your specific layout window */}
        <div 
          onClick={() => navigate("/barber/live-session")} 
          className="flex flex-col items-start group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Scissors className="w-5 h-5 text-[#C5A059] group-hover:rotate-[-30deg] transition-transform duration-300" />
            <h1 className="text-xl font-bold text-[#3E362E] tracking-[0.2em] uppercase italic">
              BARBER <span className="text-[#C5A059] not-italic">PRO</span>
            </h1>
          </div>
          <div className="h-[1px] w-full bg-[#C5A059] opacity-20 mt-1"></div>
        </div>

        {/* --- LOCALIZED REVENUE DASHBOARD --- */}
        <div className="hidden md:flex items-center gap-6 bg-white/30 backdrop-blur-2xl p-2 px-6 rounded-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(197,160,89,0.1)] ring-1 ring-black/[0.03]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C5A059]/10 rounded-xl">
              <IndianRupee size={16} className="text-[#C5A059]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-black text-[#8D7B68]/60 tracking-[0.2em] leading-none mb-1">Total Revenue</span>
              <span className="text-sm font-black text-[#3E362E] flex items-center">
                ₹8,420.<span className="text-[10px] opacity-50">00</span>
              </span>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-[#C5A059]/20 to-transparent"></div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3E362E]/5 rounded-xl">
              <TrendingUp size={16} className="text-[#8D7B68]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-black text-[#8D7B68]/60 tracking-[0.2em] leading-none mb-1">Daily Goal</span>
              <span className="text-sm font-black text-[#3E362E]">84<span className="text-[10px] opacity-50">%</span></span>
            </div>
          </div>
        </div>
      </header>

      {/* SHINY TITLE SECTION */}
      <div className="text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-[#C5A059]/10 blur-[50px] -z-10"></div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[9px] font-black text-[#C5A267] tracking-[0.25em] uppercase mb-6 shadow-[0_4px_12px_rgba(197,160,89,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A267] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A267]"></span>
          </span>
          Terminal Active • IST
        </div>

        <div className="relative">
          <h1 className="text-6xl font-black tracking-[-0.04em] uppercase leading-none flex items-center justify-center gap-3">
            <span className="relative inline-block bg-gradient-to-br from-[#3D3631] via-[#8D7B68] to-[#3D3631] bg-clip-text text-transparent">
              Live
              <svg className="absolute -bottom-2 -left-2 w-12 h-3 text-[#C5A059]/30 transform scale-x-[-1]" viewBox="0 0 100 20">
                <path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="relative inline-block text-[#C5A059] italic font-serif font-light lowercase tracking-normal">
              Session
              <svg className="absolute -bottom-2 -right-4 w-12 h-3 text-[#C5A059]/30" viewBox="0 0 100 20">
                <path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C5A059]/40"></div>
            <div className="h-1 w-1 rounded-full bg-[#C5A059] animate-pulse"></div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C5A059]/40"></div>
          </div>
        </div>
      </div>

      {/* MAIN CONSOLE CARD */}
      <div className="max-w-xl w-full px-6 relative z-10">
        <div className="bg-white/70 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(62,54,46,0.15)] relative overflow-hidden">
          
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[#C5A267] text-[10px] uppercase font-bold tracking-widest mb-1">Current Client</p>
              <h3 className="text-3xl font-bold text-[#3D3631] tracking-tight">{currentCustomer}</h3>
            </div>
            <div className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest border transition-all duration-700 ${
              status === 'Busy' ? "bg-[#3D3631] text-[#C5A267] border-[#C5A267] animate-pulse" : "bg-white text-gray-300 border-gray-100"
            }`}>
              {status.toUpperCase()}
            </div>
          </div>

          <div className="flex justify-between mb-12 relative px-2">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -z-10"></div>
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${
                  index <= activeStep ? "bg-[#C5A267] border-[#C5A267] scale-125 shadow-lg shadow-[#C5A267]/40" : "bg-white border-gray-200"
                }`}></div>
                <span className={`text-[8px] font-bold uppercase tracking-tighter transition-colors ${
                  index <= activeStep ? "text-[#3D3631]" : "text-gray-300"
                }`}>{step}</span>
              </div>
            ))}
          </div>

          <div className="relative flex items-center justify-center mb-12">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle cx="128" cy="128" r="118" stroke="rgba(0,0,0,0.03)" strokeWidth="2" fill="transparent" />
              <circle 
                cx="128" cy="128" r="118" stroke="currentColor" strokeWidth="6" fill="transparent" 
                strokeDasharray="741" 
                strokeDashoffset={741 - (Math.min(seconds, 1800) / 1800) * 741}
                className={`transition-all duration-1000 ease-linear ${status === 'Busy' ? 'text-[#C5A267]' : 'text-gray-100'}`} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-[#C5A267] tracking-[0.4em] mb-1">ELAPSED</span>
              <div className={`text-6xl font-light tracking-tighter transition-all duration-500 font-mono ${status === 'Busy' ? 'text-[#3D3631]' : 'text-gray-200'}`}>
                {formatTime(seconds)}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 relative">
            {status === 'Available' ? (
              <button
                type="button"
                onClick={handleStart}
                className="w-full group relative flex items-center justify-center gap-4 bg-[#3D3631] text-white py-6 rounded-2xl font-black text-xs tracking-[0.2em] transition-all hover:scale-[1.01] hover:shadow-2xl active:scale-95 cursor-pointer"
              >
                <Play size={18} fill="#C5A267" className="text-[#C5A267]" /> START SESSION
              </button>
            ) : (
              <div className="grid grid-cols-5 gap-3">
                <button
                  type="button"
                  onClick={handleComplete}
                  className="col-span-4 flex items-center justify-center gap-4 bg-[#C5A267] text-white py-6 rounded-2xl font-black text-xs tracking-[0.2em] transition-all hover:bg-[#b08e56] active:scale-95 shadow-xl shadow-[#C5A267]/20 cursor-pointer"
                >
                  <CheckCircle size={20} /> COMPLETE & BILL
                </button>
                <button 
                  type="button"
                  onClick={() => setShowServices(!showServices)}
                  className={`flex items-center justify-center border rounded-2xl transition-all shadow-sm cursor-pointer ${showServices ? 'bg-[#3D3631] text-white border-[#3D3631]' : 'bg-white border-gray-100 text-[#3D3631] hover:bg-gray-50'}`}
                >
                  <PlusCircle size={24} strokeWidth={1.5} className={showServices ? 'rotate-45 transition-transform' : 'transition-transform'} />
                </button>

                {showServices && (
                  <div className="absolute bottom-24 right-0 w-56 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                    <p className="text-[10px] font-black text-[#C5A267] mb-3 uppercase tracking-widest border-b pb-2">Extra Services (₹)</p>
                    <div className="flex flex-col gap-2">
                      {extraServices.map((service, i) => (
                        <button 
                          key={i}
                          type="button"
                          onClick={() => {
                            alert(`${service.name} added to bill!`);
                            setShowServices(false);
                          }}
                          className="flex justify-between items-center text-[11px] font-bold text-[#3D3631] hover:bg-[#C5A267]/10 p-2 rounded-xl transition-colors cursor-pointer"
                        >
                          <span>{service.name}</span>
                          <span className="text-[#C5A267]">₹{service.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 flex flex-col items-center gap-4">
          <div className="px-4 py-2 bg-white/40 rounded-full flex items-center gap-6 border border-white/50 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-[#8D7B68] tracking-widest uppercase">Server: Mumbai-1</span>
            </div>
            <div className="w-[1px] h-3 bg-gray-200"></div>
            <span className="text-[8px] font-black text-[#8D7B68] tracking-widest uppercase">Digital India • 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ServiceConsole;