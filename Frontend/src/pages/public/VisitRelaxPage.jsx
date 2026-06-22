import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { 
  ChevronLeft, 
  Sparkles, 
  Scissors, 
  Clock, 
  Users, 
  BookOpen, 
  Star, 
  Coffee, 
  Compass, 
  HelpCircle,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  RefreshCw
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function VisitRelaxPage() {
  const navigate = useNavigate();
  
  // Simulated booking queue tracker
  const [hasBooking, setHasBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchActiveBooking = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      checkLocalStorageFallback();
      if (!isBackground) setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API}/queue/customer/active`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && data.active && data.queue) {
        const q = data.queue;
        setHasBooking(true);
        setBookingDetails({
          salonName: q.salon?.salon_name || "Premium Salon",
          serviceName: q.services?.map(s => s.service_name).join(", ") || "Grooming Ritual",
          barberName: q.barber?.name || "Next Available Barber",
          position: q.position || 1,
          waitTime: q.estimated_wait === 0 ? "Now" : `${q.estimated_wait} Mins`,
          status: q.status === "in-progress" ? "In Chair" : "Waiting"
        });
      } else {
        checkLocalStorageFallback();
      }
    } catch (err) {
      console.error("Error fetching active booking queue:", err);
      checkLocalStorageFallback();
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const checkLocalStorageFallback = () => {
    const savedSalonId = localStorage.getItem("selectedSalonId");
    const savedSalonName = localStorage.getItem("selectedSalonName");
    if (savedSalonId && savedSalonName) {
      setHasBooking(true);
      setBookingDetails({
        salonName: savedSalonName,
        serviceName: "Signature Haircut & Style",
        barberName: "Rahul Sharma",
        position: 3,
        waitTime: "24 Mins",
        status: "Confirmed Slot"
      });
    } else {
      setHasBooking(false);
    }
  };

  useEffect(() => {
    fetchActiveBooking(false);

    // Set up polling interval to check active queue updates every 15 seconds
    const interval = setInterval(() => {
      fetchActiveBooking(true);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const TRENDING_STYLES = [
    {
      name: "Mid Skin Fade with Crop",
      category: "Men's Cuts",
      img: "https://i.pinimg.com/1200x/ad/ab/19/adab19435d74cd2ba6f7cd13bf25c45c.jpg",
      desc: "A highly architectural cut featuring blended skin textures and a clean textured fringe on top. Perfect for hot climates."
    },
    {
      name: "Caramel Balayage Highlights",
      category: "Women's Colour",
      img: "https://i.pinimg.com/736x/d9/b8/d3/d9b8d3829e277c0d92f00d941409e8f8.jpg",
      desc: "Bespoke hand-painted sun-kissed caramel ribbons that lift dark bases and add rich three-dimensional hair texture."
    },
    {
      name: "Royal Beard Sculpture",
      category: "Men's Grooming",
      img: "https://i.pinimg.com/1200x/a8/6d/5c/a86d5c56f775b111272b8a095db82135.jpg",
      desc: "Precision hot-towel skin prep followed by custom razor outline alignment matching facial geometry."
    },
    {
      name: "Korean Wolf Cut Styling",
      category: "Women's Styling",
      img: "https://i.pinimg.com/736x/ff/0b/10/ff0b100cd3e9e3e6dd4e097955885056.jpg",
      desc: "A modern shaggy structure featuring wispy layers and soft feather blowouts that cradle the chin beautifully."
    }
  ];

  const BLOGS = [
    {
      title: "How to Maintain a Sharp Fade",
      readTime: "3 min read",
      snippet: "Discover the golden rules of hair health, styling wax selections, and barber visit schedules to keep your fade crisp.",
      img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80",
      content: `Maintaining a pristine fade requires consistency, the right products, and healthy habits. 

Here are the golden rules directly from our master barbers:

1. **Schedule Regular Touch-ups:** A sharp fade starts to lose its clean lines after 7 to 10 days. Book a quick 'maintenance trim' every 2 weeks to keep the blend seamless and clean.
2. **Choose the Right Styling Product:** For a textured crop or messy top, use a matte clay or fiber pomade. For classic slicked-back looks, opt for water-soluble pomades that offer hold without build-up.
3. **Keep Your Scalp Hydrated:** Close fades expose the scalp to the elements. Use a light, non-comedogenic scalp moisturizer or oil to prevent dryness, redness, and flaking.
4. **Gentle Cleansing:** Wash your hair with sulfate-free shampoo to avoid stripping natural oils, and always rinse thoroughly after using styling products.

With these simple steps, your fade will remain crisp, clean, and healthy from one visit to the next.`
    },
    {
      title: "Why Scalp Care is the New Skincare",
      readTime: "4 min read",
      snippet: "A healthy style starts at the roots. We explain the benefits of tea tree oil detox, exfoliation, and hot steam spa rituals.",
      img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80",
      content: `Just like great makeup requires a clear canvas, great hair relies on a healthy, nourished scalp. Product build-up, dry skin, and excess sebum can clog follicles, leading to thinning and dullness.

Our scalp care guide explains how to revitalize your roots:

1. **Exfoliate Weekly:** Use a gentle physical or chemical scalp scrub once a week. This lifts dead skin cells and removes stubborn silicone and product build-up.
2. **Tea Tree Oil Detox:** Tea tree oil has natural antiseptic properties. Shampoos or serums containing tea tree oil help soothe itchy scalps and regulate sebum production.
3. **Steam Spa Rituals:** Regular steam treatments open up the hair follicles, allowing deep conditioners and essential oils to penetrate the roots. This improves blood circulation and promotes healthier growth.
4. **Massage Daily:** A simple 2-minute fingertip massage every night stimulates blood flow to the follicles, promoting thicker and stronger hair.

Invest in your scalp health today, and you'll see the difference in your style's volume and shine.`
    },
    {
      title: "Selecting the Perfect Beard Shape",
      readTime: "5 min read",
      snippet: "Round, square, oval, or heart? Read our master stylists guide on tailoring beard cheeklines to match your jaw shape.",
      img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80",
      content: `Your beard is one of your most defining features, but one shape does not fit all. By matching your beard style to your facial geometry, you can enhance your best features and create a balanced profile.

Here is how to select your perfect shape:

1. **Round Face:** Goal is to elongate the face. Keep the sides short and trimmed, and let the beard grow longer at the chin. Choose angular cheeklines to define the jaw.
2. **Square Face:** Focus on softening the strong jawline. Keep the sides tidy and grow the chin hair in a slightly rounded shape to add gentle curves.
3. **Oval Face:** The most versatile shape. You can pull off almost any style, from a rugged full beard to a clean-cut corporate beard. Focus on neat necklines.
4. **Heart/Triangle Face:** Add bulk to the bottom. A fuller beard on the sides and chin helps fill out a narrower jawline, creating a balanced and masculine look.

Always keep your neckline clean—trimming two fingers above your Adam's apple is the golden rule.`
    }
  ];

  const UPGRADES = [
    { name: "Therapeutic Hot Towel Treatment", price: "₹149", desc: "Soaked in essential eucalyptus oils to open pores and soothe skin." },
    { name: "Premium Charcoal Scrub", price: "₹249", desc: "Active carbon exfoliation to clear blackheads and revitalize skin glow." },
    { name: "Rejuvenating Head Massage", price: "₹199", desc: "15-minute signature acupressure massage with cold-pressed oils." },
    { name: "Beard Moisture Nourish Boost", price: "₹129", desc: "Deep conditioning argan balm application with steaming therapy." }
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3E362E] font-sans flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1613] via-[#2A241F] to-[#3E362E] pt-32 pb-24 text-center select-none">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
            alt="Customer Relax Lounge Background"
            className="w-full h-full object-cover opacity-20 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A241F]/40 to-black/20" />
        </div>

        <div className="absolute top-[-100px] left-[-100px] w-[320px] h-[320px] bg-[#C5A059]/25 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] bg-white/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FFE6A7] hover:text-[#C5A059] transition cursor-pointer border-none bg-transparent mb-6"
          >
            <ChevronLeft size={14} className="stroke-[2.5px]" /> Back to Home
          </button>

          <span className="block text-[11px] font-black uppercase tracking-[0.35em] text-[#C5A059] mb-2">Customer Lounge</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight bg-gradient-to-r from-[#C5A059] via-[#FFE6A7] to-[#C5A059] bg-clip-text text-transparent leading-tight font-serif">
            Visit & Relax
          </h1>
          <div className="w-20 h-[3px] bg-gradient-to-r from-[#C5A059] to-[#FFE6A7] mx-auto mt-5 rounded-full" />
          <p className="mt-6 text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Welcome to the Lounge. Here you can scout trending styles, read care blogs, check add-on seat upgrades, or track your live queue status.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl w-full mx-auto px-6 py-16 space-y-20">

        {/* ── SECTION 1: LIVE QUEUE RADAR / ACTIVE BOOKING ── */}
        <section className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#C5A059]/10 blur-[90px] rounded-full pointer-events-none" />
          
          <div className="max-w-3xl mx-auto bg-white border border-[#E8DCCB] rounded-[2.5rem] p-6 sm:p-10 shadow-sm text-left space-y-6 relative z-10">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="font-serif text-xl sm:text-2xl font-black text-[#2A241F] flex items-center gap-2">
                <Compass className="text-[#C5A059]" size={22} />
                Booking Status Radar
              </h2>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => fetchActiveBooking(false)}
                  className="p-1.5 hover:bg-stone-100 rounded-full transition-all duration-200 border-none bg-transparent cursor-pointer text-[#C5A059] flex items-center justify-center"
                  title="Refresh status"
                >
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                </button>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Live Status
                </span>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-stone-400 text-xs tracking-wider animate-pulse">Syncing status with lounge radar...</p>
              </div>
            ) : hasBooking && bookingDetails ? (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <span className="block text-[9px] uppercase font-black tracking-wider text-stone-400">Selected Studio</span>
                    <h3 className="text-lg font-black text-[#3E362E]">{bookingDetails.salonName}</h3>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-black tracking-wider text-stone-400">Requested Ritual</span>
                    <p className="text-sm font-semibold text-[#3E362E]">{bookingDetails.serviceName}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="block text-[9px] uppercase font-black tracking-wider text-stone-400">Stylist Assigned</span>
                      <p className="text-sm font-semibold text-[#3E362E]">{bookingDetails.barberName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF6F0] rounded-2xl p-5 border border-[#E8DCCB] flex flex-col justify-center items-center text-center space-y-3">
                  <Clock className="text-[#C5A059] animate-pulse" size={28} />
                  <div>
                    <span className="block text-[9px] uppercase font-black tracking-wider text-stone-400">Est. Wait Time</span>
                    <h4 className="text-2xl font-black text-[#3E362E] font-mono">{bookingDetails.waitTime}</h4>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                    <Users size={12} />
                    <span>Position in queue: <strong className="text-[#3E362E]">{bookingDetails.position}</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-[#C5A059]/50 mx-auto stroke-[1.5px]" />
                <h3 className="text-base font-extrabold text-[#3E362E]">No Active Booking Detected</h3>
                <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  It looks like you do not have an active booking session stored in this browser. Book a session or view our approved salons to see wait times.
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => navigate("/nearby")} 
                    className="px-6 py-3 border border-[#E8DCCB] hover:border-[#C5A059] bg-white text-[#3E362E] text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    View Salons
                  </button>
                  <button 
                    onClick={() => navigate("/customer/services")} 
                    className="px-6 py-3 bg-[#3E362E] hover:bg-[#2A241F] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer border-none shadow-xs"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            )}

            {/* Visit guidelines */}
            <div className="pt-4 border-t border-stone-100 grid gap-3 sm:grid-cols-2 text-xs font-semibold text-stone-500">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="text-[#C5A059] shrink-0 mt-0.5" size={14} />
                <span>Arrive 5-10 minutes prior to your slot for complimentary beverage serving.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="text-[#C5A059] shrink-0 mt-0.5" size={14} />
                <span>Show booking QR code/SMS to receptionist upon entry.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: LOOKBOOK STYLE SCOUT ── */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">Style Lookbook</span>
            <h2 className="text-3xl font-serif font-black text-[#2C241E]">Trending Styling Templates</h2>
            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto" />
            <p className="text-stone-400 text-xs sm:text-sm max-w-md mx-auto">
              Show these exact templates to your styling therapist. Tap to book.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRENDING_STYLES.map((style, i) => (
              <div 
                key={i} 
                className="group bg-white rounded-2xl border border-[#E8DCCB] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img 
                    src={style.img} 
                    alt={style.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur border border-stone-200 text-[#C5A059] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg">
                    {style.category}
                  </div>
                </div>
                <div className="p-5 text-left space-y-2 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-[#3E362E] text-sm group-hover:text-[#C5A059] transition-colors">{style.name}</h3>
                    <p className="text-stone-500 text-[11px] leading-relaxed line-clamp-3">{style.desc}</p>
                  </div>
                  <button 
                    onClick={() => navigate("/customer/services")}
                    className="w-full mt-4 py-2 border border-dashed border-[#E8DCCB] text-[#3E362E] hover:border-[#C5A059] hover:text-[#C5A059] text-[9px] font-black uppercase tracking-wider rounded-lg transition bg-transparent cursor-pointer"
                  >
                    Select this look
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: WALK-IN SEAT UPGRADES ── */}
        <section className="grid lg:grid-cols-12 gap-8 items-start">
          {/* List of upgrades */}
          <div className="lg:col-span-8 bg-white border border-[#E8DCCB] rounded-[2.5rem] p-6 sm:p-8 text-left space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-serif text-xl font-black text-[#2A241F] flex items-center gap-2">
                <Coffee className="text-[#C5A059]" size={20} />
                Chairside Add-ons & Upgrades
              </h3>
              <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Walk-in prices</span>
            </div>

            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
              Add any of these express therapies directly at the styling chair when you meet your stylist. No pre-booking required!
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {UPGRADES.map((upg, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl bg-[#FAF6F0]/60 border border-[#E8DCCB]/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-[#3E362E] text-xs sm:text-sm">{upg.name}</h4>
                    <span className="font-mono font-black text-stone-900 text-xs sm:text-sm">{upg.price}</span>
                  </div>
                  <p className="text-stone-500 text-[11px] leading-relaxed">{upg.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick FAQ / Info sidebar */}
          <div className="lg:col-span-4 bg-white border border-[#E8DCCB] rounded-[2.5rem] p-6 sm:p-8 text-left space-y-6">
            <h3 className="font-serif text-xl font-black text-[#2A241F] flex items-center gap-2">
              <HelpCircle className="text-[#C5A059]" size={20} />
              Visit FAQs
            </h3>
            <div className="w-8 h-[2px] bg-[#C5A059]" />

            <div className="space-y-4 text-xs font-semibold text-stone-500">
              <div className="space-y-1">
                <p className="text-[#3E362E] font-extrabold">Can I request a specific barber?</p>
                <p className="text-stone-500 leading-relaxed">Yes, you can specify your barber during booking, or ask the receptionist for availability when you arrive.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#3E362E] font-extrabold">What if I'm running late?</p>
                <p className="text-stone-500 leading-relaxed">We hold slots for up to 10 minutes. Afterwards, you might experience a minor position fallback in the smart queue.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#3E362E] font-extrabold">Can I pay at the salon?</p>
                <p className="text-stone-500 leading-relaxed">Only a small booking token is collected online to confirm your queue position. The balance can be paid via UPI, card, or cash at the counter.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: GROOMING BLOG & GUIDES ── */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#C5A059]">Stylist Blog</span>
            <h2 className="text-3xl font-serif font-black text-[#2C241E]">Styling & Hair Care Scout</h2>
            <div className="w-16 h-[2px] bg-[#C5A059] mx-auto" />
            <p className="text-stone-400 text-xs sm:text-sm max-w-md mx-auto">
              Read tips and guides straight from our Pune network styling professionals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {BLOGS.map((blog, i) => (
              <article 
                key={i} 
                onClick={() => setSelectedArticle(blog)}
                className="group bg-white rounded-2xl border border-[#E8DCCB] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 text-left flex flex-col justify-between cursor-pointer"
              >
                <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                  <img 
                    src={blog.img} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-[#FAF6F0] border border-stone-200 px-2.5 py-1 rounded-lg text-[9px] font-bold text-stone-500 flex items-center gap-1 shadow-3xs">
                    <BookOpen size={10} className="text-[#C5A059]" />
                    {blog.readTime}
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-[#3E362E] text-base group-hover:text-[#C5A059] transition-colors">{blog.title}</h3>
                    <p className="text-stone-500 text-xs leading-relaxed line-clamp-3">{blog.snippet}</p>
                  </div>
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticle(blog);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#C5A059] pt-4 border-t border-stone-100/60 mt-4 group-hover:gap-2 transition-all cursor-pointer font-extrabold"
                  >
                    Read Article <ArrowRight size={10} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      <Footer />

      {/* ── ARTICLE MODAL ── */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white border border-[#E8DCCB] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            {/* Header Image */}
            <div className="relative h-60 bg-stone-100 overflow-hidden shrink-0">
              <img 
                src={selectedArticle.img} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white text-[#3E362E] rounded-full border border-stone-200 shadow-md transition cursor-pointer select-none border-none font-bold"
                aria-label="Close"
              >
                ✕
              </button>
              
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="bg-[#C5A059] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {selectedArticle.readTime}
                </span>
                <h3 className="text-2xl font-serif font-black text-white mt-2 leading-tight">
                  {selectedArticle.title}
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 overflow-y-auto text-left space-y-4 text-[#3E362E] leading-relaxed text-sm">
              {selectedArticle.content.split("\n\n").map((para, idx) => {
                if (para.startsWith("1.") || para.startsWith("2.") || para.startsWith("3.") || para.startsWith("4.")) {
                  return (
                    <div key={idx} className="pl-4 border-l-2 border-[#C5A059] py-0.5 my-2">
                      <p className="font-semibold text-[#3E362E]">{para}</p>
                    </div>
                  );
                }
                return <p key={idx}>{para}</p>;
              })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-100 bg-[#FAF6F0]/60 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-3 bg-[#3E362E] hover:bg-[#2A241F] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer border-none shadow-xs"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
