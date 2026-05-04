import React, { useState } from 'react';

const ScissorIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="6" cy="6" r="3" stroke="currentColor"></circle>
    <circle cx="6" cy="18" r="3" stroke="currentColor"></circle>
    <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor"></line>
    <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor"></line>
    <line x1="8.12" y1="8.12" x2="12" y2="12" stroke="currentColor"></line>
  </svg>
);

const ReviewSystem = ({ bookingData }) => {
  const [salonRating, setSalonRating] = useState(0);
  const [barberRating, setBarberRating] = useState(0);
  const [salonHover, setSalonHover] = useState(0);
  const [barberHover, setBarberHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const barberName = bookingData?.barberName || "Professional Barber";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-10 font-sans relative">
      
      {/* Fixed Background Image Layer */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/src/assets/adminlogin.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Luxury Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Fixed Logo Section (Top Left) */}
      <div className="fixed top-6 left-6 md:top-10 md:left-10 z-50">
        <div className="flex flex-col items-start group">
          <h1 className="text-xl md:text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
            <ScissorIcon className="w-6 h-6 text-[#C5A059] stroke-[1.5px]" />
            Barber <span className="text-white">Pro</span>
          </h1>
          <div className="h-[1px] w-full bg-[#C5A059] mt-1 opacity-50"></div>
          <p className="text-[8px] text-[#FDFBF0] tracking-[0.4em] uppercase mt-1 opacity-70">Premium Grooming</p>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-lg bg-[#FDFBF0] rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 animate-fade-in">
        
        <div className="p-8 md:p-12">
          {/* Scissor Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#FAF6E9] p-4 rounded-2xl border border-[#F2EDE0] shadow-sm">
              <ScissorIcon className="w-8 h-8 text-[#A68942] stroke-[1.2px]" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2D2926] text-center mb-2 italic">Review Session</h2>
          <p className="text-[#A68942] text-center text-[10px] uppercase tracking-[0.25em] mb-10 font-bold opacity-80">
            Share your elite experience
          </p>

          <div className="space-y-8">
            {/* Salon Rating */}
            <div className="space-y-3">
              <label className="text-[#8C8475] text-[9px] uppercase font-black tracking-widest block text-center">Salon Ambience</label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setSalonHover(star)}
                    onMouseLeave={() => setSalonHover(0)}
                    onClick={() => setSalonRating(star)}
                    className="transition-transform duration-200 hover:scale-125 focus:outline-none"
                  >
                    <span className={`text-4xl ${star <= (salonHover || salonRating) ? "text-[#A68942]" : "text-[#E5E0D0]"}`}>★</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Barber Rating */}
            <div className="space-y-3">
              <label className="text-[#8C8475] text-[9px] uppercase font-black tracking-widest block text-center">Stylist: {barberName}</label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setBarberHover(star)}
                    onMouseLeave={() => setBarberHover(0)}
                    onClick={() => setBarberRating(star)}
                    className="transition-transform duration-200 hover:scale-125 focus:outline-none"
                  >
                    <span className={`text-4xl ${star <= (barberHover || barberRating) ? "text-[#A68942]" : "text-[#E5E0D0]"}`}>★</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Luxury Text Area */}
          <div className="mt-10 mb-8">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Your feedback matters..."
              className="w-full bg-[#FAF6E9] border border-[#E5E0D0] rounded-2xl p-5 text-[#2D2926] focus:border-[#A68942] focus:ring-0 outline-none transition-all h-28 resize-none placeholder-[#BDB7AB] text-sm shadow-inner"
            />
          </div>

          {/* Primary Action */}
          <button className="w-full bg-[#3C3530] hover:bg-[#2D2926] text-white font-bold py-5 rounded-2xl transition-all shadow-xl uppercase tracking-widest text-[10px] active:scale-[0.98]">
            Submit Review
          </button>

          <p className="text-center text-[#8C8475] text-[8px] mt-8 uppercase tracking-[0.3em] opacity-60">
            Professional Grooming Standards
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}} />
    </div>
  );
};

export default ReviewSystem;