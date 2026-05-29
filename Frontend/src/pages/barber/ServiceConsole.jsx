import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, PlusCircle, ArrowLeft, User 
} from 'lucide-react';

export default function ServiceConsole() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('busy');
  const [seconds, setSeconds] = useState(720);
  const [currentCustomer] = useState("Vikram Singh");
  const [activeStep] = useState(1);
  const [showServices, setShowServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]); // State for added services
  
  const steps = ["Consultation", "Haircut", "Head Massage", "Payment"];
  const salonInfo = { salonName: "The Royal Cuts", initials: "SK" };

  const extraServices = [
    { name: "Beard Shape", price: 150 },
    { name: "Head Massage (Oil)", price: 100 },
    { name: "Face D-Tan", price: 350 },
    { name: "Hair Color (Black)", price: 500 }
  ];

  useEffect(() => {
    let interval = null;
    if (status === 'busy') {
      interval = setInterval(() => { setSeconds((prev) => prev + 1); }, 1000);
    } 
    return () => { if (interval) clearInterval(interval); };
  }, [status]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteService = () => {
    // Here you would typically send data to your backend
    console.log("Finalizing bill with extra services:", selectedServices);
    setStatus('available');
    navigate('/barber/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3E362E] font-sans antialiased flex flex-col">
      {/* ─── LUXURY HEADER ─── */}
      <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 bg-[#1A1A1A] border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="text-zinc-400" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h1 className="text-white font-bold text-lg font-serif">Live Console</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{salonInfo.salonName}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-xl w-full bg-white border border-[#EADDCA] rounded-[24px] p-8 shadow-sm space-y-8">
          
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-black text-[#A37B58]">In Salon Chair</span>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-stone-400" />
                <h3 className="text-2xl font-bold text-stone-900 font-serif">{currentCustomer}</h3>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#FAF6F0] text-[#A37B58] border border-[#EADDCA]">
              {status}
            </div>
          </div>

          {/* Timer Display */}
          <div className="flex justify-center py-4">
            <div className="relative w-48 h-48 flex items-center justify-center border-4 border-[#FAF6F0] rounded-full">
              <div className="text-center">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Elapsed</p>
                <div className="text-4xl font-black text-stone-900 font-mono">{formatTime(seconds)}</div>
                <p className="text-[9px] text-[#A37B58] font-bold mt-1">ACTIVE SESSION</p>
              </div>
            </div>
          </div>

          {/* Action Area with Pop-up */}
          <div className="relative">
            {showServices && (
              <div className="absolute bottom-full mb-4 w-full bg-white border border-[#EADDCA] rounded-2xl shadow-xl p-4 animate-in slide-in-from-bottom-4">
                <p className="text-[10px] font-black uppercase text-stone-400 mb-3">Add Extra Service</p>
                <div className="space-y-2">
                  {extraServices.map((service, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        setSelectedServices([...selectedServices, service]);
                        setShowServices(false);
                      }}
                      className="w-full flex justify-between px-3 py-2 text-xs font-bold bg-stone-50 rounded-lg hover:bg-[#A37B58]/10 transition-colors"
                    >
                      {service.name} <span>₹{service.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-6 gap-3">
              <button
                onClick={handleCompleteService}
                className="col-span-5 flex items-center justify-center gap-2 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-[#3E362E] hover:bg-[#2A241F] transition-all"
              >
                <CheckCircle size={16} /> Complete & Bill
              </button>
              <button 
                onClick={() => setShowServices(!showServices)}
                className={`col-span-1 flex items-center justify-center border rounded-xl transition-all ${
                  showServices ? "bg-[#3E362E] text-white" : "border-[#EADDCA] text-[#3E362E] hover:bg-stone-50"
                }`}
              >
                <PlusCircle size={22} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}