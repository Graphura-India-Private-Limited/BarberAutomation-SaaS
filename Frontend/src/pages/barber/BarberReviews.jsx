import React, { useState } from "react";
import { 
  Star, MessageSquare, Award, ThumbsUp, Filter, Calendar, 
  Heart, ShieldCheck, Menu, Bell 
} from "lucide-react";

const GOLD = "#C5A059";
const CHARCOAL = "#3E362E";

const MOCK_REVIEW_STATS = {
  averageRating: 4.9,
  totalReviews: 124,
  fiveStars: 112,
  fourStars: 10,
  threeStars: 2,
};

const MOCK_REVIEWS_LIST = [
  { 
    id: "REV-801", 
    client: "Mayur K.", 
    rating: 5, 
    date: "Today", 
    service: "Classic Haircut + Beard Styling", 
    text: "Best haircut experience in town! Sameer has insane precision with hair fades.", 
    helpfulCount: 12, 
    verified: true 
  },
  { 
    id: "REV-794", 
    client: "Rohan M.", 
    rating: 5, 
    date: "Yesterday", 
    service: "Skin Fade Expert + Luxury Hot Towel Shave", 
    text: "Absolute masterclass profile. The razor lining is clean and the hot towel massage is incredibly relaxing.", 
    helpfulCount: 8, 
    verified: true 
  },
  { 
    id: "REV-789", 
    client: "Arvinder Singh", 
    rating: 4, 
    date: "2 days ago", 
    service: "Premium Executive Grooming", 
    text: "Excellent service and grooming routine. Spacing was great and the staff is highly professional. Will book again.", 
    helpfulCount: 4, 
    verified: true 
  },
  { 
    id: "REV-772", 
    client: "Vikramaditya R.", 
    rating: 5, 
    date: "4 days ago", 
    service: "Complete Grooming + Monthly Skin Detox", 
    text: "Pure luxury experience. The attention to detail on my beard trim matches upscale premium standards. Worth every single rupee.", 
    helpfulCount: 15, 
    verified: true 
  },
  { 
    id: "REV-756", 
    client: "Kabir J.", 
    rating: 4, 
    date: "1 week ago", 
    service: "Classic Haircut", 
    text: "Great haircut and crisp styling. Took slightly longer than expected but the precision and finish look absolutely stellar.", 
    helpfulCount: 2, 
    verified: false 
  }
];

export default function BarberReviews() {
  // ✅ FIX: Reviews must sit in local state to mutate helpful numbers dynamically
  const [reviews, setReviews] = useState(MOCK_REVIEWS_LIST);
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Track liked review elements locally to prevent double voting spam
  const [clickedHelpful, setClickedHelpful] = useState({});
  const [sideOpen, setSideOpen] = useState(false);
  const profile = { salonName: "Master Barber Lounge", initials: "MB" };

  // ── ✅ NEW INTERACTIVE FUNCTIONALITY ENGINE ──
  const handleHelpfulClick = (id) => {
    if (clickedHelpful[id]) return; // Safeguard configuration block

    setReviews(prevReviews => 
      prevReviews.map(rev => 
        rev.id === id ? { ...rev, helpfulCount: rev.helpfulCount + 1 } : rev
      )
    );
    setClickedHelpful(prev => ({ ...prev, [id]: true }));
  };

  const filteredReviews = reviews.filter(rev => {
    if (selectedFilter === "five") return rev.rating === 5;
    if (selectedFilter === "four") return rev.rating === 4;
    return true;
  });

  return (
    /* ✅ FIX: Removed 'justify-between' structure and enforced 'h-auto overflow-y-auto' layout blueprint so you can see all elements clearly when scrolling down */
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 font-sans antialiased flex flex-col h-auto overflow-y-auto pb-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .font-serif { font-family: 'Playfair Display', serif !important; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 bg-[#1A1A1A] border-b border-[#D4AF37]/20 flex items-center justify-between shrink-0">
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
        
      <div className="w-full flex-grow">
        {/* ── MAIN WORKSPACE CONTENT CANVAS ── */}
        <main className="max-w-6xl mx-auto w-full px-5 py-10 text-left">
          
          {/* Header Description Title Blocks */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-stone-200/60 pb-6">
            <div>
              {/* Rule 1: Clean Section Header Configuration layout split alignment */}
             <h1 className="text-3xl font-black tracking-tight text-stone-900 uppercase font-serif">
  Client <span className="text-[#C5A059]">Reviews</span>
</h1>
              {/* Rule 2: Minor tag headings trackers formatting */}
              <p className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-[#C5A059] mt-2">
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
            <div className="col-span-12 md:col-span-4 card p-6 bg-white flex flex-col items-center justify-center text-center rounded-2xl border border-stone-200/60 shadow-3xs">
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
            <div className="col-span-12 md:col-span-8 card p-6 bg-white flex flex-col justify-center space-y-3.5 rounded-2xl border border-stone-200/60 shadow-3xs">
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

                  {/* Rule 3: Testimonial Quote Text Entry Descriptor Block */}
                  <p className="text-sm font-normal leading-relaxed text-stone-600 text-left pt-1 pl-0.5">
                    "{rev.text}"
                  </p>

                  {/* Card bottom action row */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-50 text-[10px] font-black uppercase tracking-wider text-stone-400">
                    <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200/30">
                      <Heart size={10} className="text-rose-500 fill-rose-500" />
                      <span>Stylist Core Score Impact</span>
                    </div>

                    {/* Rule 4: Primary dynamic action link dispatch button */}
                    <button 
                      type="button" 
                      onClick={() => handleHelpfulClick(rev.id)}
                      className={`flex items-center gap-1.5 transition-all duration-200 font-sans text-xs font-extrabold uppercase tracking-wider bg-transparent border-none outline-none select-none ${
                        clickedHelpful[rev.id] ? "text-emerald-600 scale-[1.02]" : "text-stone-400 hover:text-stone-900 cursor-pointer"
                      }`}
                    >
                      <ThumbsUp size={11} className={clickedHelpful[rev.id] ? "text-emerald-600 fill-emerald-100" : ""} /> 
                      <span>{clickedHelpful[rev.id] ? "Voted Helpful" : "Helpful"} ({rev.helpfulCount})</span>
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