import React from "react";
import * as Icons from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Icons check
  const Instagram = Icons.Instagram || Icons.Camera; 
  const Twitter = Icons.Twitter || Icons.Bird;
  const Mail = Icons.Mail;
  const MapPin = Icons.MapPin;
  const Phone = Icons.Phone;
  const Scissors = Icons.Scissors;
  const ExternalLink = Icons.ExternalLink;

  return (
    <footer className="relative bg-[#1A1612] text-[#FDFBF7] pt-20 pb-10 px-6 overflow-hidden border-t border-[#C5A059]/20">
      
      {/* BACKGROUND SHINE EFFECT - लग्झरी फीलसाठी */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-50"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#C5A059]/5 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* BRANDING - Shiny Gold Effect */}
          <div className="space-y-6">
            <div className="group cursor-default">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#C5A059]/10 rounded-lg group-hover:rotate-12 transition-transform duration-500">
                   {Scissors && <Scissors className="text-[#C5A059] w-6 h-6" />}
                </div>
                <h2 className="text-2xl font-black tracking-[0.2em] uppercase italic">
                  BARBER <span className="text-[#C5A059] not-italic drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]">PRO</span>
                </h2>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed font-serif italic border-l-2 border-[#C5A059]/30 pl-4 mt-4">
                "Where tradition meets precision. Redefining grooming excellence since 2026."
              </p>
            </div>

            {/* SOCIALS - Glow on Hover */}
            <div className="flex gap-4">
              {[Instagram, Twitter, Mail].map((Icon, idx) => (
                Icon && (
                  <a key={idx} href="#" className="p-3 rounded-xl bg-stone-800/40 border border-stone-700/50 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-[#1A1612] hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-500 group">
                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                  </a>
                )
              ))}
            </div>
          </div>

          {/* QUICK LINKS - Animated Underline */}
          <div>
            <h3 className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#C5A059]"></span> Navigation
            </h3>
            <ul className="space-y-4">
              {["Services", "Our Masters", "Membership", "Privacy Policy"].map((item) => (
                <li key={item} className="group overflow-hidden">
                  <a href="#" className="text-sm text-stone-300 hover:text-[#C5A059] flex items-center gap-2 transition-all duration-300">
                    <span className="w-0 h-[1px] bg-[#C5A059] group-hover:w-4 transition-all duration-500"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* WORKING HOURS - Glass Card Style */}
          <div className="bg-stone-800/20 p-6 rounded-2xl border border-stone-700/30 backdrop-blur-sm shadow-xl">
            <h3 className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#C5A059]"></span> Availability
            </h3>
            <div className="space-y-4 text-sm font-serif italic">
              <div className="flex justify-between items-center border-b border-stone-700/50 pb-2 hover:translate-x-1 transition-transform">
                <span className="text-stone-400">Mon - Fri</span>
                <span className="text-[#FDFBF7] font-sans not-italic">09:00 - 21:00</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-700/50 pb-2 hover:translate-x-1 transition-transform">
                <span className="text-stone-400">Saturday</span>
                <span className="text-[#FDFBF7] font-sans not-italic">10:00 - 19:00</span>
              </div>
              <div className="flex justify-between items-center text-[#C5A059] pt-1">
                <span>Sunday</span>
                <span className="font-sans font-bold tracking-tighter uppercase text-[10px] bg-[#C5A059]/10 px-2 py-1 rounded">Vip Only</span>
              </div>
            </div>
          </div>

          {/* CONTACT & LOCATION - Shiny Button */}
          <div>
            <h3 className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#C5A059]"></span> The Sanctuary
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4 group">
                <div className="mt-1 p-1.5 bg-stone-800 rounded group-hover:text-[#C5A059] transition-colors">
                  {MapPin && <MapPin size={16} />}
                </div>
                <p className="text-sm text-stone-400 leading-relaxed group-hover:text-stone-200 transition-colors">
                  123 Luxury Row, Koregaon Park,<br />Pune, MH 411001
                </p>
              </div>
              
              <button className="relative w-full group overflow-hidden bg-transparent border border-[#C5A059] px-6 py-4 rounded-xl transition-all duration-500">
                {/* Shine Animation Effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
                
                <span className="relative z-10 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059] group-hover:text-white transition-colors">
                  Get Directions {ExternalLink && <ExternalLink size={14} />}
                </span>
                
                {/* Background Fill on Hover */}
                <div className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-0"></div>
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className="pt-10 border-t border-stone-800/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] text-stone-500 uppercase tracking-[0.4em]">
            © {currentYear} <span className="text-[#C5A059]">Barber Pro</span> Studio. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-3">
             <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C5A059]/30"></div>
             <span className="text-[10px] text-[#C5A059] font-serif italic font-bold">Handcrafted Excellence</span>
             <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C5A059]/30"></div>
          </div>
        </div>
      </div>
      
      {/* Tailwind Config मध्ये 'shine' animation ॲड करायला विसरू नका */}
    </footer>
  );
};

export default Footer;