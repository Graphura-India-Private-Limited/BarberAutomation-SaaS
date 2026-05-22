import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Search, Filter, X, Heart } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AllReviews() {
  const navigate = useNavigate();
  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [stats,      setStats]      = useState({ total: 0, avgSalon: 0, avgBarber: 0 });

  useEffect(() => {
    fetch(`${API}/review`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const all = d.reviews || [];
          setReviews(all);
          if (all.length) {
            const salonAvg  = all.reduce((s, r) => s + (r.salon_rating || 0), 0) / all.length;
            const barberAvg = all.reduce((s, r) => s + (r.barber_rating || 0), 0) / all.length;
            setStats({ total: all.length, avgSalon: salonAvg.toFixed(1), avgBarber: barberAvg.toFixed(1) });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ── Filter ── */
  const filtered = reviews.filter(r => {
    const matchSearch = !search ||
      r.customer_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.review_text?.toLowerCase().includes(search.toLowerCase());
    const maxRating = Math.max(r.salon_rating || 0, r.barber_rating || 0);
    const matchRating = !ratingFilter || maxRating === ratingFilter;
    return matchSearch && matchRating;
  });

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2A2620]" style={{ fontFamily:"'Manrope', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,500&family=Manrope:wght@300;400;500;600;700&display=swap');
        .font-display { font-family:'Playfair Display', serif; }
        .pill-btn { background:#9B7E5A; color:white; transition:all .35s ease; letter-spacing:.18em; }
        .pill-btn:hover { background:#7C6347; transform:translateY(-2px); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .fade-up { animation:fadeUp .6s ease forwards; }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header className="bg-white border-b border-[#EFE4D2] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase font-semibold text-[#2A2620] hover:text-[#9B7E5A] transition">
            <ArrowLeft className="w-4 h-4"/> Home
          </button>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#2A2620]">
            <em className="font-medium text-[#9B7E5A]">All</em> Reviews
          </h1>
          <button onClick={() => navigate("/write-review")}
            className="pill-btn inline-flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase font-semibold">
            <Heart className="w-3.5 h-3.5"/> <span className="hidden sm:inline">Write Review</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ═══ STATS STRIP ═══ */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-10">
          <div className="bg-white rounded-2xl p-5 md:p-6 text-center shadow-sm border border-[#EFE4D2]">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#9B7E5A] font-bold mb-2">Total Reviews</p>
            <p className="font-display text-4xl md:text-5xl text-[#2A2620]">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 md:p-6 text-center shadow-sm border border-[#EFE4D2]">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#9B7E5A] font-bold mb-2">Avg Salon</p>
            <div className="flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-[#9B7E5A] text-[#9B7E5A]"/>
              <p className="font-display text-4xl md:text-5xl text-[#2A2620]">{stats.avgSalon || "—"}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 md:p-6 text-center shadow-sm border border-[#EFE4D2]">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#9B7E5A] font-bold mb-2">Avg Barber</p>
            <div className="flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-[#9B7E5A] text-[#9B7E5A]"/>
              <p className="font-display text-4xl md:text-5xl text-[#2A2620]">{stats.avgBarber || "—"}</p>
            </div>
          </div>
        </div>

        {/* ═══ FILTERS ═══ */}
        <div className="bg-white rounded-2xl p-4 md:p-5 mb-8 shadow-sm border border-[#EFE4D2] flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#9B7E5A] absolute left-4 top-1/2 -translate-y-1/2"/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or content..."
              className="w-full pl-11 pr-4 py-3 bg-[#FAF6EE] border border-[#EFE4D2] rounded-xl text-sm outline-none focus:border-[#9B7E5A] transition"
            />
          </div>

          {/* Rating filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[#9B7E5A]"/>
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#9B7E5A] mr-1">Rating:</p>
            {[0, 5, 4, 3, 2, 1].map(r => (
              <button key={r}
                onClick={() => setRatingFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition ${
                  ratingFilter === r
                    ? "bg-[#9B7E5A] text-white"
                    : "bg-[#FAF6EE] text-[#9B7E5A] hover:bg-[#EFE4D2]"
                }`}>
                {r === 0 ? "All" : `${r}★`}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ REVIEWS GRID ═══ */}
        {loading ? (
          <div className="text-center py-20 text-[#9B7E5A] italic">Loading reviews...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-[#EFE4D2]">
            <Star className="w-10 h-10 text-[#9B7E5A] mx-auto mb-3 opacity-40"/>
            <p className="font-display italic text-xl mb-2">No reviews found</p>
            <p className="text-sm text-black/50 mb-6">
              {reviews.length === 0 ? "Be the first to share your experience!" : "Try adjusting your filters."}
            </p>
            <button onClick={() => navigate("/write-review")}
              className="pill-btn inline-flex items-center gap-2 px-8 py-3 text-[11px] uppercase font-semibold">
              <Heart className="w-3.5 h-3.5"/> Write the First Review
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(r => {
              const rating = Math.max(r.salon_rating || 0, r.barber_rating || 0);
              return (
                <div key={r._id}
                  onClick={() => setSelectedReview(r)}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-[#EFE4D2] fade-up">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, k) => (
                        <Star key={k} className={`w-3.5 h-3.5 ${k < rating ? "fill-[#9B7E5A] text-[#9B7E5A]" : "text-[#E5E0D0]"}`}/>
                      ))}
                    </div>
                    <span className="text-[9px] tracking-widest uppercase text-black/40 font-semibold">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                    </span>
                  </div>
                  <div className="text-[#9B7E5A] font-display text-4xl leading-none mb-2">"</div>
                  <p className="font-display italic text-base leading-[1.5] mb-5 text-[#2A2620] line-clamp-4">
                    {r.review_text || "(No written feedback)"}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[#EFE4D2]">
                    <div className="w-9 h-9 rounded-full bg-[#9B7E5A] flex items-center justify-center text-white font-bold text-xs">
                      {(r.customer_id?.name?.[0] || "?").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-sm truncate">{r.customer_id?.name || "Anonymous"}</p>
                      {r.barber_id?.name && (
                        <p className="text-[9px] tracking-widest uppercase text-black/40 font-semibold truncate">
                          Stylist: {r.barber_id.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══ MODAL ═══ */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedReview(null)}>
          <div className="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl border border-[#EFE4D2] fade-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#9B7E5A] flex items-center justify-center text-white font-bold text-lg">
                  {(selectedReview.customer_id?.name?.[0] || "?").toUpperCase()}
                </div>
                <div>
                  <p className="font-display font-bold text-lg">{selectedReview.customer_id?.name || "Anonymous"}</p>
                  <p className="text-[10px] tracking-widest uppercase text-black/50 font-semibold">
                    {new Date(selectedReview.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedReview(null)} className="text-black/40 hover:text-black">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {(selectedReview.salon_rating > 0 || selectedReview.barber_rating > 0) && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {selectedReview.salon_rating > 0 && (
                  <div className="bg-[#FAF6EE] rounded-xl p-3 text-center">
                    <p className="text-[9px] tracking-widest uppercase text-[#9B7E5A] font-bold mb-1">Salon</p>
                    <p className="text-2xl text-[#9B7E5A]">{"★".repeat(selectedReview.salon_rating)}<span className="text-[#E5E0D0]">{"★".repeat(5-selectedReview.salon_rating)}</span></p>
                  </div>
                )}
                {selectedReview.barber_rating > 0 && (
                  <div className="bg-[#FAF6EE] rounded-xl p-3 text-center">
                    <p className="text-[9px] tracking-widest uppercase text-[#9B7E5A] font-bold mb-1">Barber</p>
                    <p className="text-2xl text-[#9B7E5A]">{"★".repeat(selectedReview.barber_rating)}<span className="text-[#E5E0D0]">{"★".repeat(5-selectedReview.barber_rating)}</span></p>
                  </div>
                )}
              </div>
            )}

            <div className="text-[#9B7E5A] font-display text-5xl leading-none mb-2">"</div>
            <p className="font-display italic text-lg leading-[1.6] text-[#2A2620] mb-6">
              {selectedReview.review_text || "No written feedback"}
            </p>

            {selectedReview.barber_id?.name && (
              <p className="text-[11px] tracking-[0.2em] uppercase text-black/50 font-semibold mb-5">
                Stylist: <span className="text-[#9B7E5A]">{selectedReview.barber_id.name}</span>
              </p>
            )}

            <button onClick={() => setSelectedReview(null)}
              className="w-full pill-btn py-3.5 text-[11px] uppercase font-semibold tracking-[0.2em]">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}