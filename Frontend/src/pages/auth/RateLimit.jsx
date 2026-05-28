import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  Clock3,  
  ShieldAlert,
  ArrowRight,
  Home,
  ChevronLeft,
} from "lucide-react";

// Fixed relative paths to go up two directories from src/pages/auth/
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

export default function RateLimit() {
  const [secs, setSecs] = useState(59);
  const [ready, setReady] = useState(false);
  const [clicked, setClicked] = useState(false);

  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    ref.current = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          clearInterval(ref.current);
          setReady(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(ref.current);
  }, []);

  function fmt(s) {
    return `00:${s < 10 ? "0" + s : s}`;
  }

  function handleRetry() {
    if (!ready) return;

    setClicked(true);

    setTimeout(() => {
      navigate("/customer/services");
    }, 1200);
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FAF7F2] relative overflow-hidden flex items-center justify-center px-4 py-12 md:py-20 lg:py-28">
        
        {/* Background Glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[320px] h-[320px] bg-[#C5A059]/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-[#EAD8C0]/40 blur-3xl rounded-full" />

        {/* --- BACK BUTTON (Top Left Corner - Directs to Home) --- */}
<div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20">
  <button
    onClick={() => navigate("/")} 
    className="inline-flex items-center justify-center gap-1.5 bg-white/90 backdrop-blur-md border border-[#E7D9C9] text-[#3E362E] px-3 py-2 rounded-xl font-black uppercase text-[10px] tracking-[0.15em] hover:bg-[#3E362E] hover:text-white transition-all hover:scale-105 shadow-sm cursor-pointer"
    title="Go to Home"
  >
    <ChevronLeft className="w-4 h-4" />
    <span className="hidden sm:inline">Back</span> 
  </button>
</div>

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-[1050px] rounded-[24px] sm:rounded-[34px] overflow-hidden border border-[#E7D9C9] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)] mt-6 sm:mt-4">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT SIDE */}
            <div className="relative bg-[#3E362E] p-6 sm:p-10 md:p-12 lg:p-14 overflow-hidden flex flex-col justify-between">

              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#C5A059]/20 rounded-full blur-3xl" />

              {/* Brand & Info */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#C5A059] flex items-center justify-center shadow-xl">
                    <Scissors className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>

                  <div>
                    <h2 className="text-white text-xl sm:text-2xl font-black tracking-wide">
                      BarberPro
                    </h2>

                    <p className="text-[#EAD8C0] text-[10px] sm:text-xs uppercase tracking-[0.3em]">
                      Premium Salon
                    </p>
                  </div>
                </div>

                <div className="mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#F4E6D4] px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold mb-4 sm:mb-5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Security Protection
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight uppercase">
                    Too Many
                    <span className="block text-[#C5A059] italic font-serif normal-case">
                      Requests
                    </span>
                  </h1>

                  <p className="text-[#DDD3C7] text-xs sm:text-sm md:text-base leading-relaxed mt-4 max-w-md">
                    Our system temporarily blocked repeated booking attempts
                    to maintain smooth performance and fair access for all
                    customers.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    "Maximum 5 booking requests per minute",
                    "Automatic retry available after timer ends",
                    "Your booking information remains safe",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start sm:items-center gap-3 text-[#F6F0E8]"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#C5A059] mt-1.5 sm:mt-0 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-stone-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stylist Profile */}
              <div className="relative z-10 mt-8 sm:mt-10 hidden lg:flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80"
                  alt="Stylist"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover border border-white/20"
                />

                <div>
                  <p className="text-white font-bold text-sm">
                    Rahul Sharma
                  </p>

                  <p className="text-[#C5A059] text-[10px] sm:text-xs uppercase tracking-widest">
                    Senior Stylist
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative p-5 sm:p-8 md:p-12 lg:p-14 flex items-center justify-center bg-[#FCFAF7]">

              <div className="w-full max-w-md">

                {/* Timer Card */}
                <div className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-[#EAD8C0] bg-white shadow-xl p-5 sm:p-8 text-center">

                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/5 via-transparent to-[#3E362E]/5" />

                  <div className="relative z-10">

                    {/* Timer Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[24px] bg-[#F7EFE3] mx-auto flex items-center justify-center shadow-inner border border-[#EAD8C0] mb-4 sm:mb-6">
                      <Clock3 className="w-8 h-8 sm:w-10 sm:h-10 text-[#C5A059]" />
                    </div>

                    <p className="text-[10px] sm:text-[11px] font-black tracking-[0.35em] uppercase text-[#C5A059] mb-2 sm:mb-3">
                      Please Wait
                    </p>

                    {/* Countdown Display */}
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#3E362E] tracking-tight">
                      {fmt(secs)}
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-500 mt-2 sm:mt-3 leading-relaxed">
                      You can try booking again after the countdown finishes.
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-6 sm:mt-8">
                      <div className="w-full h-2.5 sm:h-3 bg-[#EFE7DC] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#C5A059] to-[#8D6748] transition-all duration-1000"
                          style={{
                            width: `${((59 - secs) / 59) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Warning Alert Box */}
                    <div className="mt-6 sm:mt-8 bg-[#FFF7F0] border border-[#F3D3C1] rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E26D5A] flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                          !
                        </div>

                        <div>
                          <h4 className="font-black text-[#3E362E] text-xs sm:text-sm uppercase tracking-wide mb-1">
                            Booking Limit Reached
                          </h4>

                          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                            Too many booking attempts were detected in a short
                            time. Please wait until the timer completes.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Container */}
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">

                      {/* Action Button: Retry */}
                      <button
                        onClick={handleRetry}
                        disabled={!ready || clicked}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-[11px] tracking-[0.2em] transition-all duration-300 ${
                          ready && !clicked
                            ? "bg-[#3E362E] text-white hover:bg-[#C5A059] hover:scale-[1.02] shadow-lg cursor-pointer"
                            : "bg-stone-200 text-stone-400 cursor-not-allowed"
                        }`}
                      >
                        {clicked ? (
                          "Redirecting..."
                        ) : (
                          <>
                            Try Again
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Action Button: Return Home */}
                      <button
                        onClick={() => navigate("/")}
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-[#EAD8C0] text-[#3E362E] py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-[11px] tracking-[0.2em] hover:border-[#C5A059] hover:text-[#C5A059] transition-all cursor-pointer bg-white"
                      >
                        <Home className="w-4 h-4" />
                        Home
                      </button>

                    </div>
                  </div>
                </div>

                {/* Bottom Footer Protection Text */}
                <p className="text-center text-[10px] sm:text-xs text-stone-400 mt-5 sm:mt-6 uppercase tracking-[0.2em] font-bold">
                  BarberPro Premium Booking Protection
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}