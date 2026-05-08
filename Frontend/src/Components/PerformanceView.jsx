import React from "react";

const PerformanceView = ({ title = "Performance View", subtitle, metrics }) => {
  return (
    <section className="bg-white border border-[#EAD8C0] p-6 rounded-[2rem] shadow-sm">
      <div className="flex flex-col gap-1 mb-5">
        <p className="text-[9px] font-black uppercase tracking-[0.35em] text-[#C5A059]">
          Individual
        </p>
        <h2 className="text-lg font-black uppercase tracking-tight text-[#3E362E]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8D7B68]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-[#FFFBF2] border border-[#EAD8C0] rounded-2xl p-4">
            <p className="text-2xl font-black text-[#3E362E] leading-none">{metric.value}</p>
            <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-[#8D7B68]">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PerformanceView;
