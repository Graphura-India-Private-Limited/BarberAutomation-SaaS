import React, { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Smartphone,
  Shield,
} from "lucide-react";

import barberImage from "../../assets/login.jpg";

const ScissorIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 11.3321 8.7818 10.715 8.4121 10.2148L11.5 12L14.5879 13.7852C14.2182 14.285 14 14.9019 14 15.5645C14 17.2213 15.3431 18.5645 17 18.5645C18.6569 18.5645 20 17.2213 20 15.5645C20 14.2964 19.2155 13.2117 18.102 12.7751L15.3 11.1574L18.102 9.53974C19.2155 9.10313 20 8.01844 20 6.75032C20 5.09347 18.6569 3.75032 17 3.75032C15.3431 3.75032 14 5.09347 14 6.75032C14 7.41292 14.2182 8.02983 14.5879 8.52959L11.5 10.3148L8.4121 8.5322C8.7818 8.03198 9 7.41492 9 6.74731C9 5.09046 7.65685 3.74731 6 3.74731C4.34315 3.74731 3 5.09046 3 6.74731C3 8.40417 4.34315 9.74731 6 9.74731C6.66508 9.74731 7.2798 9.53039 7.7788 9.16335L10.8667 10.9485L7.7788 12.7337C7.2798 12.3667 6.66508 12.1497 6 12.1497C4.34315 12.1497 3 13.4929 3 15.1497C3 16.8066 4.34315 18.1497 6 18.1497V15Z" />
  </svg>
);

function BarberLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#FFFBF2]">
      {/* MOBILE LOGO */}
      <div className="md:hidden flex flex-col items-center pt-10">
        <h1 className="text-xl font-black text-[#C5A059] tracking-[0.2em] uppercase flex items-center gap-2">
          <ScissorIcon className="w-5 h-5 fill-[#C5A059]" />
          Barber <span className="text-[#3E362E]">Pro</span>
        </h1>

        <div className="h-[1.5px] w-32 bg-[#C5A059] mt-1 opacity-50"></div>

        <p className="text-[8px] text-[#8D7B68] tracking-[0.3em] uppercase mt-1">
          Est. 2026
        </p>
      </div>

      {/* LEFT SIDE */}
      <div
        className="hidden md:flex relative bg-cover bg-center"
        style={{ backgroundImage: `url(${barberImage})` }}
      >
        <div className="absolute inset-0 bg-[#3E362E]/40 backdrop-blur-[1px]"></div>

        {/* LOGO */}
        <div className="absolute top-8 left-8 z-10 flex flex-col items-start">
          <h1 className="text-2xl font-black text-[#C5A059] tracking-[0.2em] uppercase leading-none flex items-center gap-2">
            <ScissorIcon className="w-6 h-6 fill-[#C5A059]" />
            Barber <span className="text-white">Pro</span>
          </h1>

          <div className="h-[2px] w-full bg-[#C5A059] mt-1 opacity-70"></div>

          <p className="text-[10px] text-gray-200 tracking-[0.4em] uppercase mt-1 text-center w-full">
            Est. 2026
          </p>
        </div>

        {/* TEXT */}
        <div className="relative z-10 flex flex-col justify-end p-12 w-full pb-20">
          <h1 className="text-[#C5A059] text-6xl font-black tracking-tighter uppercase leading-none">
            Barber <br />
            <span className="text-white">Portal</span>
          </h1>

          <div className="h-[2px] w-24 bg-[#C5A059] my-4 opacity-100"></div>

          <p className="text-gray-100 max-w-xs border-l-2 border-[#C5A059] pl-4 italic font-medium">
            Manage your daily schedule and clients through your personalized
            salon station.
          </p>
        </div>
      </div>

      {/* =========================================================
          RIGHT LOGIN SECTION
      ========================================================= */}
      <div className="bg-[#f8f4ee] flex items-center justify-center px-2 py-3 lg:px-4">

        {/* LOGIN CARD */}
        <div className="w-full max-w-[560px] bg-white border border-[#eadfce] rounded-[24px] shadow-[0_6px_24px_rgba(0,0,0,0.05)] px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* TOP ICON */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-[18px] bg-[#f6f0e6] flex items-center justify-center shadow-inner border border-[#eee2cf]">
              <span className="text-[#c59b49] text-lg">✂</span>
            </div>
          </div>

          {/* HEADING */}
          <div className="text-center mb-6">
            <h2 className="text-[26px] font-black text-[#1f1a14] leading-none">
              Welcome back 👋
            </h2>

            <p className="text-[#8f8374] text-[13px] mt-3">
              Sign in with your salon-assigned credentials
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-4">

            {/* LOGIN */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-[#1d1813] mb-2">
                Login ID / Email
              </label>

              <div className="h-[46px] bg-white border border-[#e9dfd1] rounded-[14px] px-4 flex items-center gap-2 focus-within:border-[#c59b49] transition-all">
                <User className="w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  placeholder="e.g. B-102 or email"
                  className="flex-1 bg-transparent outline-none text-[13px] text-[#1a1612] placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1d1813]">
                  Password
                </label>

                <button
                  type="button"
                  className="text-[#c59b49] font-bold text-[11px] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="h-[46px] bg-white border border-[#e9dfd1] rounded-[14px] px-4 flex items-center gap-2 focus-within:border-[#c59b49] transition-all">
                <Lock className="w-4 h-4 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-[13px] text-[#1a1612] placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4 text-gray-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* KEEP SIGNED */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-gray-300 accent-[#1f1a14]"
              />

              <span className="text-[12px] text-[#52493e]">
                Keep me signed in
              </span>
            </label>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full h-[48px] rounded-[14px] bg-[#2a211b] hover:bg-[#1f1813] text-white text-[14px] font-black transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
            >
              Access Portal
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* DIVIDER */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#eadfce]" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] font-bold text-[#a08f7d] uppercase">
                  OR
                </span>
              </div>
            </div>

            {/* OTP BUTTON */}
            <button
              type="button"
              className="w-full h-[48px] rounded-[14px] border border-[#e9dfd1] bg-white hover:bg-[#faf6ef] text-[#2e241d] text-[13px] font-bold transition-all flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              Login with Google
            </button>
          </form>

          {/* FOOTER */}
          <div className="text-center mt-6">
            <p className="text-[#9f9383] text-[11px]">
              Don’t have access?
              <span className="text-[#c59b49] font-black ml-1 cursor-pointer hover:underline">
                Contact your Salon Manager
              </span>
            </p>

            <p className="flex items-center justify-center gap-1 text-[10px] text-[#b3a89a] mt-4">
              <Shield className="w-3 h-3" />
              Protected by salon-level authentication • Staff only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarberLogin;