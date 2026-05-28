import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Image, Sparkles } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const BARBER_LOOKS_DATABASE = {
  // --- 👩 WOMEN SECTIONS ---
  styling: [
    { id: "wh1", name: "Premium Layer Cut & Blow Dry", img: "https://i.pinimg.com/1200x/79/1b/d4/791bd40e7756ad08631dbb79b6600e95.jpg" },
    { id: "wh2", name: "Luxury Feather Cut Look", img: "https://i.pinimg.com/736x/40/74/1c/40741c14e86e555444044a7fc5c73667.jpg" },
    { id: "wh3", name: "Classic Bob Styling", img: "https://i.pinimg.com/1200x/bb/db/62/bbdb6220af39cd2ce5e4fde1271babc7.jpg" },
    { id: "wh4", name: "Soft Curl Blowout", img: "https://i.pinimg.com/1200x/86/55/da/8655da48743eeb8a7d6418ffdc8104ca.jpg" },
    { id: "wh5", name: "Korean Wolf Cut Styling", img: "https://i.pinimg.com/736x/ff/0b/10/ff0b100cd3e9e3e6dd4e097955885056.jpg" },
    { id: "wh6", name: "Luxury Straight Hair Finish", img: "https://i.pinimg.com/1200x/2f/b8/72/2fb8722cd56fc94c01424fa12785641e.jpg" },
    { id: "wh7", name: "Textured Wavy Styling", img: "https://i.pinimg.com/736x/1d/77/07/1d77071c06be4c6c861511fca8260837.jpg" },
    { id: "wh8", name: "Elegant U-Cut Hair Style", img: "https://i.pinimg.com/736x/58/4d/15/584d151c34e2767f013cbcd38a4103cc.jpg" },
    { id: "wh9", name: "Silky Smooth Rebond Styling", img: "https://i.pinimg.com/736x/f3/20/ad/f320ad568c178911c0df440181ad0955.jpg" },
    { id: "wh10", name: "Party Glam Hair Styling", img: "https://i.pinimg.com/736x/1f/40/f1/1f40f1ff92767d608252cb554a34ccb5.jpg" }
  ],
  color: [
    { id: "wc1", name: "Global Golden Brown Couture", img: "https://i.pinimg.com/1200x/04/c5/b2/04c5b2b30680f2b5932ca7e6d80f7702.jpg" },
    { id: "wc3", name: "Jet Black", img: "https://i.pinimg.com/1200x/44/46/a2/4446a28a6f30eae2f008d243d6ff460b.jpg" },
    { id: "wc4", name: "Chocolate Brown Luxe", img: "https://i.pinimg.com/1200x/3e/56/86/3e56867afc33e00ee0ca9d5ae850fc0c.jpg" },
    { id: "wc5", name: "Honey Blonde Glow", img: "https://i.pinimg.com/736x/7a/ad/00/7aad00b196e28483ad3b2bc6d5ccd818.jpg" },
    { id: "wc6", name: "Burgundy Wine Finish", img: "https://i.pinimg.com/736x/d3/7f/85/d37f854123209471bdca3ff76040abdc.jpg" },
    { id: "wc7", name: "Ash Grey Smokey", img: "https://i.pinimg.com/1200x/ed/65/ee/ed65eef9616d21b73dea4ebc08bbc43a.jpg" },
    { id: "wc8", name: "Rose Gold Shine", img: "https://i.pinimg.com/736x/e4/0c/b4/e40cb4654373af49b862f4ef2b4fb177.jpg" },
    { id: "wc10", name: "Platinum Ice Blonde", img: "https://i.pinimg.com/736x/c6/ba/ab/c6baab82e30b1b0a520b65a67a0cb932.jpg" }
  ],
  highlights_balayage: [
    { id: "wc2", name: "Balayage Highlights Premium", img: "https://i.pinimg.com/originals/4f/ef/f1/4feff1a0e38a764d93cdbdef21f99a2d.png" },
    { id: "wc9", name: "Caramel Balayage", img: "https://i.pinimg.com/736x/d9/b8/d3/d9b8d3829e277c0d92f00d941409e8f8.jpg" },
    { id: "wc10", name: "Honey Blonde Balayage", img: "https://i.pinimg.com/736x/79/96/9f/79969f6e343085df302aa95acf7366ef.jpg" },
    { id: "wc11", name: "Ash Brown Balayage", img: "https://i.pinimg.com/1200x/b9/f5/85/b9f585a7958223110af3451d55e0181a.jpg" }
  ],
  spa: [
    { id: "ws1", name: "Deep Nourishing Keratin Spa", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600" },
    { id: "ws2", name: "Advanced Scalp Therapy", img: "https://res.klook.com/image/upload/w_750,h_469,c_fill,q_85/activities/fchn5h7dfr2mmbbw3nq4.jpg?w=600" },
    { id: "ws3", name: "Luxury Hair Rejuvenation Spa", img: "https://i.pinimg.com/736x/50/8a/b7/508ab7b56e410e7701cb056e4e6a027a.jpg" },
    { id: "ws4", name: "Argan Oil Smoothening Spa", img: "https://i.pinimg.com/1200x/3e/e4/36/3ee4366fbe905d991236d88793e799c8.jpg" },
    { id: "ws5", name: "Protein Repair Hair Spa", img: "https://i.pinimg.com/236x/4c/1a/43/4c1a430b006b6fdd7e4625c56bc27c07.jpg" },
    { id: "ws6", name: "Anti-Dandruff Detox Spa", img: "https://i.pinimg.com/736x/7e/ce/a3/7ecea3ac6a931c1c172f8b96a5c8b4a0.jpg" },
    { id: "ws7", name: "Silky Shine Hair Spa", img: "https://i.pinimg.com/736x/68/3d/fa/683dfac1e306bfc72b28e8921888aa55.jpg" },
    { id: "ws8", name: "Aloe Vera Hydration Spa", img: "https://i.pinimg.com/736x/5d/5f/03/5d5f038359f0389ac924bf75f479e5d3.jpg" },
    { id: "ws9", name: "Moroccan Oil Therapy Spa", img: "https://i.pinimg.com/1200x/bb/0d/ff/bb0dff7adbd80c5ae3322f070bc562ed.jpg" },
    { id: "ws10", name: "Premium Bridal Hair Spa", img: "https://i.pinimg.com/736x/e3/75/d1/e375d1620704dd730c3d6fe887811b36.jpg" }
  ],

  // --- 👨 MEN SECTIONS ---
  haircut: [
    { id: "hc1", name: "Premium Mid Fade", img: "https://i.pinimg.com/1200x/3d/f3/ea/3df3ea1f0e7d4a6ab894ebb1e0c8865f.jpg" },
    { id: "hc2", name: "Luxury Textured Crop", img: "https://i.pinimg.com/736x/b3/ea/18/b3ea185ab96b4a271553798a00c14831.jpg" },
    { id: "hc3", name: "Classic Taper Fade", img: "https://i.pinimg.com/736x/54/85/53/548553592ddd5d7b8e0e7d5343b5a2f5.jpg" },
    { id: "hc4", name: "Modern Pompadour Style", img: "https://i.pinimg.com/1200x/0b/26/91/0b269149af68bb40573fe09be9eb8931.jpg" },
    { id: "hc5", name: "Luxury Slick Back", img: "https://i.pinimg.com/736x/9a/63/a5/9a63a518f58d46f62a456454dc79261c.jpg" },
    { id: "hc7", name: "High & Tight Military Fade", img: "https://i.pinimg.com/1200x/54/c3/ff/54c3fff8470d25cd040d72e876999d49.jpg" },
    { id: "hc8", name: "Messy Quiff Style", img: "https://i.pinimg.com/736x/be/de/12/bede12391e3193808afd86fccb518cc3.jpg" },
    { id: "hc9", name: "Modern Buzz Cut with Slit", img: "https://i.pinimg.com/736x/65/06/1f/65061fae181be208c1c9a452882568ed.jpg" }
  ],
  skin_fade: [
    { id: "sf1", name: "High Skin Fade Drop", img: "https://i.pinimg.com/736x/86/3c/0d/863c0ddfb402f94c7ed11d91ad0c438e.jpg" },
    { id: "sf2", name: "Mid Skin Fade with Crop Top", img: "https://i.pinimg.com/1200x/ad/ab/19/adab19435d74cd2ba6f7cd13bf25c45c.jpg" },
    { id: "sf3", name: "Low Skin Fade Blend", img: "https://i.pinimg.com/1200x/49/57/c0/4957c018732cfb85f921295da1a84380.jpg" },
    { id: "sf4", name: "Skin Fade Pompadour Luxe", img: "https://i.pinimg.com/736x/31/e5/e0/31e5e0c6f5a3c8202d89867e8a665e1b.jpg" }
  ],
  beard: [
    { id: "bd1", name: "Sharp Lineup & Fade", img: "https://i.pinimg.com/736x/26/f0/df/26f0dff49dcde4fb06d9161351eefb7a.jpg" },
    { id: "bd2", name: "Royal Beard Sculpt", img: "https://i.pinimg.com/1200x/a8/6d/5c/a86d5c56f775b111272b8a095db82135.jpg" },
    { id: "bd3", name: "Premium Full Beard Trim", img: "https://i.pinimg.com/736x/53/68/da/5368da011515917a966738b72d79b40d.jpg" },
    { id: "bd4", name: "Luxury Beard Fade", img: "https://i.pinimg.com/736x/12/51/e5/1251e51301afa8100a459e41e1eb8acc.jpg" }
  ],
  hot_towel_shave: [
    { id: "bd5", name: "Hot Towel Royal Shave", img: "https://i.pinimg.com/736x/af/11/fc/af11fce5bd7c0ae9183ac57558aa5472.jpg" },
    { id: "bd6", name: "Classic Hot Towel Beard Shave", img: "https://i.pinimg.com/1200x/67/a3/74/67a374a79533ce703f034ce17b02c804.jpg" },
    { id: "bd7", name: "Luxury Foam & Towel Shave", img: "https://i.pinimg.com/1200x/83/17/75/831775720cb642376ee34c64ada61202.jpg" }
  ],
  default: [
    { id: "df1", name: "Signature Salon Ritual", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600" },
    { id: "df2", name: "Premium Hair Spa Experience", img: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600" },
    { id: "df3", name: "Luxury Grooming Session", img: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600" }
  ]
}; 

export default function SelectLook() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedService = location.state?.service;
  const selectedBarber = location.state?.barber;
  const [selectedLook, setSelectedLook] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!selectedBarber) {
      navigate(-1);
    }
  }, [selectedBarber, navigate]);

  const getServiceCategory = () => {
    if (!selectedService) return "default";
    
    if (selectedService.subCategory && BARBER_LOOKS_DATABASE[selectedService.subCategory]) {
      return selectedService.subCategory;
    }

    const serviceName = selectedService.name?.toLowerCase() || "";

    if (serviceName.includes("highlights") || serviceName.includes("balayage") || serviceName.includes("हायलाइट्स")) {
      return "highlights_balayage";
    }

    if (serviceName.includes("hot towel") || serviceName.includes("shave")) {
      return "hot_towel_shave";
    }

    if (serviceName.includes("skin fade") || serviceName.includes("fade")) {
      return "skin_fade";
    }

    if (selectedService.category === "hair") {
      return "haircut";
    }

    if (selectedService.category && BARBER_LOOKS_DATABASE[selectedService.category]) {
      return selectedService.category;
    }

    if (serviceName.includes("haircut") || serviceName.includes("hair") || serviceName.includes("कट")) {
      return "haircut";
    } 
    if (serviceName.includes("beard") || serviceName.includes("दाढी")) {
      return "beard";
    }
    
    return "default";
  };

  const currentCategory = getServiceCategory();
  const availableLooks = BARBER_LOOKS_DATABASE[currentCategory] || BARBER_LOOKS_DATABASE.default;

  const handleContinue = () => {
    if (!selectedLook) return;
    navigate("/customer/details", {
      state: {
        service: selectedService,
        barber: selectedBarber,
        look: selectedLook
      }
    });
  };

  return (
    <>
      <Navbar />

      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white pb-36">
        
        {/* Header / Sub-navigation */}
        <div className="bg-white/80 backdrop-blur-md border-b border-[#EADDCA] sticky top-0 z-40 px-4 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#FAF6F0] rounded-full transition-colors group cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-[#3E362E] group-hover:text-[#C5A059] transition-colors" />
            </button>
            <span className="font-serif font-bold text-lg">Back to Stylists</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          
          {/* Gallery Content Box */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#EADDCA] shadow-sm mb-16">
            
            <div className="mb-8 flex flex-col gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059] flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 fill-[#C5A059]" /> Portfolio Catalogue — {selectedBarber?.name}
                </span>
                <h2 className="font-serif font-black text-3xl md:text-4xl text-[#3E362E] uppercase tracking-tight">
                  Select Your Custom <span className="text-[#C5A059] italic normal-case">Desired Look</span>
                </h2>
                <p className="text-xs text-stone-400 font-light mt-1">
                 Click on your favorite look below. Our expert stylist {selectedBarber?.name} will craft this exact look perfectly for you.
                </p>
              </div>
              
              <div className="bg-[#FAF6F0] px-4 py-2 rounded-xl border border-[#EADDCA] text-xs font-bold text-[#3E362E] flex items-center gap-2 self-start mt-2">
                <Image className="w-4 h-4 text-[#C5A059]" />
                <span className="capitalize">{currentCategory.replace(/_/g, " ")} Catalogue References</span>
              </div>
            </div>

            {/* Lookbook Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableLooks.map((look) => {
                const isLookSelected = selectedLook?.id === look.id;
                return (
                  <div 
                    key={look.id}
                    onClick={() => setSelectedLook(look)}
                    className={`group/look relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                      isLookSelected 
                        ? "border-[#C5A059] shadow-lg ring-4 ring-[#C5A059]/10 scale-[0.98]" 
                        : "border-transparent hover:border-[#EADDCA] hover:shadow-md"
                    }`}
                  >
                    <div className="h-80 bg-stone-100 overflow-hidden relative">
                      <img 
                        src={look.img} 
                        alt={look.name} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/look:scale-105"
                      />
                      {/* Gradient overlay gets slightly darker on select */}
                      <div className={`absolute inset-0 transition-colors duration-300 ${isLookSelected ? 'bg-black/40' : 'bg-gradient-to-t from-black/90 via-black/30 to-transparent'}`} />
                      
                      {isLookSelected && (
                        <div className="absolute top-4 right-4 bg-[#C5A059] text-white p-1 rounded-full shadow-md animate-in zoom-in duration-200">
                          <CheckCircle2 className="w-5 h-5 fill-[#3E362E] text-white" />
                        </div>
                      )}

                      <div className="absolute bottom-5 left-5 right-5 text-white z-10">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#EADDCA] mb-0.5">Style Template</p>
                        <h4 className="font-serif font-bold text-lg leading-tight transition-colors duration-300 group-hover/look:text-[#EADDCA]">{look.name}</h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 🔘 Premium Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#EADDCA] py-5 px-6 z-50 shadow-[0_-10px_30px_rgba(62,54,46,0.06)] transition-all duration-300">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              {selectedLook ? (
                <>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-black">Selected Style</p>
                  <p className="font-serif font-bold text-lg text-[#3E362E]">
                    {selectedLook.name}
                  </p>
                </>
              ) : (
                <p className="text-sm text-stone-500 font-light italic">
                 Please select a look from the catalog above to proceed...
                </p>
              )}
            </div>
            
            <button
              onClick={handleContinue}
              disabled={!selectedLook}
              className={`w-full sm:w-auto font-black text-[11px] tracking-[0.25em] uppercase px-10 py-4 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                selectedLook 
                  ? "bg-[#3E362E] text-white hover:bg-[#C5A059] hover:text-[#2A241F] cursor-pointer hover:scale-[1.03]" 
                  : "bg-stone-200 text-stone-400 cursor-not-allowed opacity-60"
              }`}
            >
              Continue to Details & Booking →
            </button>
          </div>
        </div>

      </div>
      <Footer />
    </> 
  );
}