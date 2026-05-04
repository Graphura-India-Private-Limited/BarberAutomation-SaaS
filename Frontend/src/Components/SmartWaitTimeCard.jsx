import React, { useState, useEffect, useRef } from 'react';

// Animated number transition hook
function useAnimatedNumber(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);

  useEffect(() => {
    const start = prev.current;
    const end = target;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
      else prev.current = end;
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return display;
}

export default function SmartWaitTimeCard({ queueLength = 4, barbers = 2, avgServiceTime = 20 }) {
  const [extraService, setExtraService] = useState(0);
  const [loading, setLoading] = useState(true);

  const effectiveServiceTime = avgServiceTime + extraService * 10;
  const waitTime = Math.round((queueLength * effectiveServiceTime) / barbers);
  const finishTime = new Date(Date.now() + waitTime * 60 * 1000);
  const finishHHMM = finishTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const animatedWait = useAnimatedNumber(waitTime);
  const animatedService = useAnimatedNumber(effectiveServiceTime);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const addExtraService = () => setExtraService((s) => s + 1);

  if (loading) {
    return (
      <div className="bg-white border border-[#EAD8C0] rounded-[2rem] p-6 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#FFFBF2] to-[#FDF5E6] border border-[#EAD8C0] rounded-[2rem] p-6 shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">🤖</span>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C5A059]">AI Wait Prediction</h3>
      </div>

      {/* Main wait time */}
      <div className="flex items-end gap-2 mb-6">
        <span className="text-5xl font-black text-[#3E362E] transition-all duration-500">
          {animatedWait}
        </span>
        <span className="text-lg font-bold text-[#8D7B68] mb-1">mins</span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl p-3 border border-[#EAD8C0] text-center">
          <p className="text-[9px] text-[#8D7B68] uppercase font-bold tracking-wider mb-1">⏳ Est. Wait</p>
          <p className="text-lg font-black text-[#3E362E]">{animatedWait}m</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#EAD8C0] text-center">
          <p className="text-[9px] text-[#8D7B68] uppercase font-bold tracking-wider mb-1">✂️ Service</p>
          <p className="text-lg font-black text-[#3E362E]">{animatedService}m</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-[#EAD8C0] text-center">
          <p className="text-[9px] text-[#8D7B68] uppercase font-bold tracking-wider mb-1">🕒 Done by</p>
          <p className="text-base font-black text-[#3E362E]">{finishHHMM}</p>
        </div>
      </div>

      {/* Queue info pills */}
      <div className="flex gap-2 flex-wrap mb-5">
        <span className="px-3 py-1 bg-[#3E362E] text-white text-[9px] font-bold rounded-full uppercase">
          👥 {queueLength} in queue
        </span>
        <span className="px-3 py-1 bg-[#C5A059]/20 text-[#C5A059] text-[9px] font-bold rounded-full uppercase border border-[#C5A059]/30">
          ✂️ {barbers} barbers active
        </span>
        {extraService > 0 && (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-[9px] font-bold rounded-full uppercase border border-orange-200">
            +{extraService} extra service{extraService > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Add extra service button */}
      <button
        onClick={addExtraService}
        className="w-full py-3 border-2 border-dashed border-[#C5A059]/40 rounded-xl text-[10px] font-black text-[#C5A059] uppercase tracking-widest hover:bg-[#C5A059]/10 hover:border-[#C5A059] transition-all duration-200 active:scale-95"
      >
        + Add Extra Service
      </button>
    </div>
  );
}

