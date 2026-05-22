import React from "react";
import { useNavigate } from "react-router-dom";
import { Scissors } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-[#595959] border-b border-stone-600 shadow-md">
      <div className="flex w-full items-center justify-between pl-5 pr-10 py-4 max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <div className="flex flex-col items-start cursor-pointer font-serif" onClick={() => navigate("/")}>
          <div className="flex items-center gap-2.5">
            <Scissors className="w-5 h-5浏览 text-[#C5A059]" />
            <h1 className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase italic text-stone-200">
              BARBER <span className="text-[#C5A059] not-italic">PRO</span>
            </h1>
          </div>
          <span className="text-[8px] text-stone-400 tracking-[0.3em] uppercase font-bold mt-1">Est. 2026</span>
        </div>

        {/* Navigation Core Items Links */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-black tracking-widest text-stone-300">
          <button onClick={() => navigate("/")} className="hover:text-[#C5A059] transition">HOME</button>
          <button onClick={() => navigate("/customer/services")} className="hover:text-[#C5A059] transition">SERVICES</button>
          <button onClick={() => navigate("/nearby")} className="hover:text-[#C5A059] transition">BARBERS</button>
          <button onClick={() => navigate("/about")} className="hover:text-[#C5A059] transition">ABOUT</button>
          <button onClick={() => navigate("/contact")} className="hover:text-[#C5A059] transition">CONTACT</button>
        </div>

        {/* Core Gateway Call Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/login")} 
            className="text-[10px] font-bold uppercase tracking-widest text-stone-300 border border-stone-500 px-4 py-2 rounded-lg hover:bg-white/5 transition"
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/customer/services")} 
            className="rounded-lg bg-[#3E362E] px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-md border border-[#C5A059]/30 hover:bg-[#2A241F] transition"
          >
            Book Now
          </button>
        </div>

      </div>
    </nav>
  );
}