import React, { useState } from "react";
import { 
  Star, MessageSquare, Award, ThumbsUp, Filter, Calendar, 
  Heart, ShieldCheck, Menu, Bell // <--- Menu और Bell यहाँ इम्पोर्ट किए गए
} from "lucide-react";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

// Mock Data
const MOCK_REVIEW_STATS = {
  averageRating: 4.9,
  totalReviews: 124,
  fiveStars: 112,
  fourStars: 10,
  threeStars: 2,
};

const MOCK_REVIEWS_LIST = [
  { id: "REV-801", client: "Mayur K.", rating: 5, date: "Today", service: "Classic Haircut + Beard Styling", text: "Best haircut experience in town! Sameer has insane precision with hair fades.", helpfulCount: 12, verified: true },
];

export default function BarberReviews() {
  const [reviews] = useState(MOCK_REVIEWS_LIST);
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // परिभाषित किए गए स्टेट और ऑब्जेक्ट
  const [sideOpen, setSideOpen] = useState(false);
  const profile = { salonName: "Master Barber Lounge", initials: "MB" };

  const filteredReviews = reviews.filter(rev => {
    if (selectedFilter === "five") return rev.rating === 5;
    if (selectedFilter === "four") return rev.rating === 4;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col justify-between">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 bg-[#1A1A1A] border-b border-[#D4AF37]/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-zinc-400" onClick={() => setSideOpen(!sideOpen)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h1 className="text-white font-bold text-xl font-serif">Reviews</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{profile.salonName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-zinc-400 bg-white/5 rounded-lg border border-white/10"><Bell className="w-4 h-4" /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F5C842] to-[#E8A020] flex items-center justify-center text-xs font-bold text-black">
            {profile.initials}
          </div>
        </div>
      </header>
        
      <div>
        {/* ── MAIN WORKSPACE CONTENT CANVAS ── */}
        <main className="max-w-6xl mx-auto w-full px-5 py-10 text-left">
          
          {/* Header Description Title Blocks */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-stone-200/60 pb-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">
                Client <span className="text-[#C5A059]">Reviews</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#A37B58] mt-1.5">
                Verified Customer Feedback & Quality Satisfaction Matrix
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-stone-200/80 shadow-3xs w-fit">
              <MessageSquare size={13} className="text-[#C5A059]" />
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 font-mono">
                {MOCK_REVIEW_STATS.totalReviews} Global Client Reviews Checked
              </span>
            </div>
          </div>

          {/* ── RATING OVERVIEW DATA PARAMETERS BLOCK ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            
            {/* Total Big Score Widget Box */}
            <div className="col-span-12 md:col-span-4 card p-6 bg-white flex flex-col items-center justify-center text-center">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Quality Index</h3>
              <div className="text-5xl font-black font-serif text-stone-900 tracking-tight flex items-baseline gap-1">
                {MOCK_REVIEW_STATS.averageRating} <span className="text-xl text-stone-400 font-sans font-medium">/ 5</span>
              </div>
              <div className="flex gap-1 my-2.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill={GOLD} stroke="none" />
                ))}
              </div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">98% Satisfaction Share</p>
            </div>

            {/* Density Progress Line Allocation Share */}
            <div className="col-span-12 md:col-span-8 card p-6 bg-white flex flex-col justify-center space-y-3.5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 border-b pb-2 border-stone-50">Density Distribution</h4>
              
              {[
                { label: "5 Stars", val: MOCK_REVIEW_STATS.fiveStars, w: "90%", color: "bg-[#C5A059]" },
                { label: "4 Stars", val: MOCK_REVIEW_STATS.fourStars, w: "8%", color: "bg-[#3E362E]" },
                { label: "3 Stars", val: MOCK_REVIEW_STATS.threeStars, w: "2%", color: "bg-stone-300" }
              ].map(row => (
                <div key={row.label} className="flex items-center gap-4 text-xs font-bold">
                  <span className="w-14 text-stone-500 shrink-0">{row.label}</span>
                  <div className="flex-1 bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div className={`${row.color} h-full rounded-full transition-all duration-500`} style={{ width: row.w }} />
                  </div>
                  <span className="w-8 text-right font-mono text-stone-900">{row.val}</span>
                </div>
              ))}
            </div>

          </div>

          {/* ── FILTER SWITCHER STRIP BAR ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-stone-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Sort Feed:</span>
            </div>
            
            <div className="flex gap-2">
              {[
                { id: "all", label: "All Reviews" },
                { id: "five", label: "5-Star Ratings" },
                { id: "four", label: "4-Star Ratings" }
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedFilter(btn.id)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                    selectedFilter === btn.id
                      ? "text-white shadow-xs"
                      : "bg-white text-stone-500 border border-stone-200/80 hover:border-stone-400"
                  }`}
                  style={{ backgroundColor: selectedFilter === btn.id ? CHARCOAL : "" }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── FEEDBACK CARDS STREAM INTERFACE ── */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-16 bg-white border border-stone-200/50 rounded-2xl text-stone-400 text-xs font-black uppercase tracking-widest">
                📭 No verified customer reviews currently scale this subset filter.
              </div>
            ) : (
              filteredReviews.map(rev => (
                <div key={rev.id} className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-3xs hover:shadow-md transition-all space-y-4">
                  
                  {/* Card Header Profile Metrics Row */}
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center font-serif font-black text-stone-900 text-sm shadow-3xs">
                        {rev.client.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-stone-900 text-md tracking-tight leading-none">{rev.client}</span>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50">
                              <ShieldCheck size={9} /> Verified Client
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-[#A37B58] uppercase tracking-wider mt-1">{rev.service}</p>
                      </div>
                    </div>

                    {/* Stars and Date Line */}
                    <div className="text-left sm:text-right space-y-1">
                      <div className="flex sm:justify-end gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={11} fill={GOLD} stroke="none" />
                        ))}
                        {[...Array(5 - rev.rating)].map((_, i) => (
                          <Star key={i} size={11} fill="#EFEBE4" stroke="none" />
                        ))}
                      </div>
                      <p className="text-[9px] font-bold text-stone-400 font-mono tracking-wide flex items-center sm:justify-end gap-1">
                        <Calendar size={10} /> {rev.date} · <span className="font-bold uppercase">{rev.id}</span>
                      </p>
                    </div>
                  </div>

                  {/* Testimonial Quote Text Entry Block */}
                  <p className="text-sm font-medium text-stone-600 leading-relaxed text-left pt-1 pl-0.5">
                    "{rev.text}"
                  </p>

                  {/* Card bottom action row */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-50 text-[10px] font-black uppercase tracking-wider text-stone-400">
                    <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200/30">
                      <Heart size={10} className="text-rose-500 fill-rose-500" />
                      <span>Stylist Core Score Impact</span>
                    </div>

                    <button type="button" className="flex items-center gap-1 hover:text-stone-900 transition-colors cursor-pointer">
                      <ThumbsUp size={11} /> Helpful ({rev.helpfulCount})
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </main>
      </div>

    </div>
  );
}