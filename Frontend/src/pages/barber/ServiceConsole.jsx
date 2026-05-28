import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, CheckCircle, Scissors, TrendingUp, IndianRupee, 
  PlusCircle, Sparkles, ArrowLeft, Clock, Zap, ChevronRight, User
} from 'lucide-react';

export default function ServiceConsole() {
  const navigate = useNavigate(); 
  const [status, setStatus] = useState('busy'); // Default to busy to sync with dashboard active state
  const [seconds, setSeconds] = useState(720); // Syncing with dashboard's 12-minute pre-elapsed time
  const [currentCustomer, setCurrentCustomer] = useState("Vikram Singh"); // Matches active dashboard client
  const [activeStep, setActiveStep] = useState(1); // Defaulting to Haircut step
  
  const steps = ["Consultation", "Haircut", "Head Massage", "Payment"];
  const [showServices, setShowServices] = useState(false);
  
  const extraServices = [
    { name: "Beard Shape", price: 150 },
    { name: "Head Massage (Oil)", price: 100 },
    { name: "Face D-Tan", price: 350 },
    { name: "Hair Color (Black)", price: 500 }
  ];

  // Global Time Counter matching parent state intervals
  useEffect(() => {
    let interval = null;
    if (status === 'busy') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } 
    return () => { if (interval) clearInterval(interval); };
  }, [status]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setStatus('busy');
    setSeconds(0);
    setActiveStep(0);
  };

  const handleComplete = () => {
    setStatus('available');
    setSeconds(0);
    setActiveStep(0);
    // Automatically routes back safely to dashboard view on system closure
    navigate('/barber/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans normal-case" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        :root { 
          --gold: #D97706; 
          --gold2: #B45309; 
          --bg: #FAF6F0; 
          --bg2: #FFFFFF; 
          --bg3: #FDFBF7; 
          --border: #EADBCE; 
          --text: #1C1917; 
          --muted: #78716C; 
        }
        .font-sans {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
        .font-serif {
          font-family: 'Playfair Display', Georgia, serif !important;
        }
        .console-card { 
          background: var(--bg2); 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          box-shadow: 0 4px 20px -2px rgba(28, 25, 23, 0.04);
        }
        .step-line {
          background: var(--border);
        }
        .step-line-active {
          background: var(--gold);
        }
      `}</style>

      {/* ─── HEADER BAR ─── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-4"
        style={{ background: "rgba(250,246,240,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 transition flex items-center justify-center"
            style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-zinc-900 font-bold text-base font-serif tracking-normal leading-none">Live Console</h1>
            <p className="text-[11px] mt-1 font-sans text-amber-600 font-semibold tracking-wider uppercase">Active Workout Terminal</p>
          </div>
        </div>

        {/* Sync Localized Metric Widgets */}
        <div className="flex items-center gap-4 bg-white px-4 py-1.5 rounded-xl border border-[#EADBCE]">
          <div className="flex items-center gap-2">
            <IndianRupee size={14} className="text-amber-600" />
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-400 font-semibold uppercase tracking-wider leading-none">Today's Revenue</span>
              <span className="text-xs font-bold text-zinc-800 mt-0.5">₹8,450</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── TERMINAL CONSOLE CORE ─── */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-xl w-full console-card p-6 md:p-8 space-y-8 relative overflow-hidden">
          
          {/* Subtle Elegance Sparkle Indicator */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent pointer-events-none rounded-bl-full" />

          {/* Client Details Meta Block */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-600 font-sans">In Salon Chair</span>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-zinc-400" />
                <h3 className="text-2xl font-bold text-zinc-900 font-serif tracking-normal">{currentCustomer}</h3>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
              status === 'busy' 
                ? "bg-amber-50 text-amber-600 border-amber-200" 
                : "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}>
              {status}
            </div>
          </div>

          {/* Interactive Flow Stepper */}
          <div className="relative px-2">
            <div className="absolute top-3.5 left-0 w-full h-[2px] step-line -z-10" />
            <div 
              className="absolute top-3.5 left-0 h-[2px] step-line-active -z-10 transition-all duration-500" 
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
            
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <button 
                  key={index} 
                  onClick={() => status === 'busy' && setActiveStep(index)}
                  className="flex flex-col items-center gap-2 focus:outline-none"
                >
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    index <= activeStep 
                      ? "bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20" 
                      : "bg-white border-zinc-200 text-zinc-400"
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-[9px] font-bold tracking-tight uppercase ${
                    index <= activeStep ? "text-zinc-800" : "text-zinc-400"
                  }`}>{step}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Radial Process Timer Display */}
          <div className="flex flex-col items-center justify-center relative py-4">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 absolute">
                <circle cx="112" cy="112" r="102" stroke="rgba(217, 119, 6, 0.04)" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="112" cy="112" r="102" stroke="var(--gold)" strokeWidth="5" fill="transparent" 
                  strokeDasharray="640" 
                  strokeDashoffset={640 - (Math.min(seconds, 1800) / 1800) * 640}
                  className="transition-all duration-1000 ease-linear" 
                />
              </svg>
              <div className="text-center z-10 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block">Elapsed Time</span>
                <div className="text-5xl font-bold tracking-tight text-zinc-800 font-mono">
                  {formatTime(seconds)}
                </div>
                <span className="text-[9px] text-zinc-500 font-medium flex items-center justify-center gap-1">
                  <Zap size={10} className="text-amber-500" /> Layer Action
                </span>
              </div>
            </div>
          </div>

          {/* Core Action Engine Grid Blocks */}
          <div className="relative pt-2">
            {status === 'available' ? (
              <button
                type="button"
                onClick={handleStart}
                className="w-full flex items-center justify-center gap-3 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all bg-zinc-900 hover:bg-zinc-800 shadow-lg cursor-pointer"
              >
                <Play size={16} fill="white" /> INITIALIZE NEXT CHAIR SESSION
              </button>
            ) : (
              <div className="grid grid-cols-6 gap-3">
                <button
                  type="button"
                  onClick={handleComplete}
                  className="col-span-5 flex items-center justify-center gap-3 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md cursor-pointer"
                  style={{ background: "linear-gradient(135deg, var(--gold), var(--gold2))" }}
                >
                  <CheckCircle size={18} /> COMPLETE & PUSH BILL
                </button>
                
                <button 
                  type="button"
                  onClick={() => setShowServices(!showServices)}
                  className={`col-span-1 flex items-center justify-center border rounded-xl transition-all cursor-pointer ${
                    showServices ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'
                  }`}
                >
                  <PlusCircle size={22} className={showServices ? 'rotate-45 transition-transform' : 'transition-transform'} />
                </button>

                {/* Upsell Dropdown List Overlay matching architecture */}
                {showServices && (
                  <div className="absolute bottom-20 right-0 w-64 bg-white border border-zinc-200 rounded-2xl p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <p className="text-[10px] font-bold text-amber-600 mb-2 uppercase tracking-wider pb-1.5 border-b border-zinc-100 flex items-center gap-1">
                      <Sparkles size={12} /> Add Extra Addon Services
                    </p>
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                      {extraServices.map((service, i) => (
                        <button 
                          key={i}
                          type="button"
                          onClick={() => {
                            alert(`${service.name} updated to live dashboard queue state!`);
                            setShowServices(false);
                          }}
                          className="flex justify-between items-center text-xs font-semibold text-zinc-700 hover:bg-amber-50 hover:text-amber-800 p-2 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>{service.name}</span>
                          <span className="text-amber-600">+₹{service.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}