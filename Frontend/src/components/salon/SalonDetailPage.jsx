import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import defaultShopImage from "../../assets/shop.jpg";

import {
  ArrowLeft,
  CalendarClock,
  Clock,
  MapPin,
  Phone,
  Scissors,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
  Image as ImageIcon,
  ImageOff,
  Info,
  Mail,
  ChevronDown
} from "lucide-react";
import CustomSelect from "../common/CustomSelect";

const demoSalons = [
  {
    id: "1",
    name: "The Royal Groom",
    address: "MG Road, Nashik",
    phone: "+91 98765 43210",
    rating: 4.9,
    reviews: 128,
    distance: "0.8 km",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1400",
    hours: "10:00 AM - 9:00 PM",
  },
  {
    id: "2",
    name: "Vintage Scissors",
    address: "College Road, Nashik",
    phone: "+91 98765 44321",
    rating: 4.7,
    reviews: 96,
    distance: "1.5 km",
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1400",
    hours: "9:30 AM - 8:30 PM",
  },
  {
    id: "3",
    name: "Urban Edge Barber",
    address: "Gangapur Road, Nashik",
    phone: "+91 98765 45432",
    rating: 4.5,
    reviews: 82,
    distance: "2.3 km",
    image:
      "https://img.magnific.com/free-photo/handsome-man-barber-shop-styling-hair_1303-20978.jpg?semt=ais_hybrid&w=740&q=80",
    hours: "10:30 AM - 9:30 PM",
  },
];

const services = [
  { name: "Classic Haircut", duration: "30 min", price: 249 },
  { name: "Beard Trim & Shape", duration: "20 min", price: 149 },
  { name: "Hair Spa", duration: "45 min", price: 599 },
  { name: "Premium Grooming", duration: "60 min", price: 899 },
];

export default function SalonDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [salon, setSalon] = useState(null);
  const [servicesList, setServicesList] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeImage, setActiveImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [servicesPage, setServicesPage] = useState(1);

  useEffect(() => {
    if (id) {
      localStorage.setItem("selectedSalonId", id);
      navigate("/salon", { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        let targetId = id || localStorage.getItem("selectedSalonId");

        let salonData = null;
        if (targetId) {
          try {
            const salonRes = await fetch(`${API}/salon/${targetId}`);
            salonData = await salonRes.json();
          } catch (e) {
            console.error("Failed fetching specific salon:", e);
          }
        }

        // If specific salon was not found/provided, fallback to the first approved salon in the database
        if (!salonData || !salonData.success) {
          try {
            const salonsRes = await fetch(`${API}/salon`);
            const salonsData = await salonsRes.json();
            if (salonsData.success && salonsData.salons && salonsData.salons.length > 0) {
              targetId = salonsData.salons[0]._id;
              const fallbackRes = await fetch(`${API}/salon/${targetId}`);
              salonData = await fallbackRes.json();
            }
          } catch (e) {
            console.error("Failed fetching approved salons fallback:", e);
          }
        }

        if (salonData && salonData.success) {
          const s = salonData.salon;
          const mappedSalon = {
            id: s._id,
            name: s.salon_name,
            address: s.address || "Address not listed",
            phone: s.support_number || s.mobile || "No contact info",
            email: s.email || "contact@barberpro.com",
            rating: s.rating || 4.5,
            reviews: s.total_reviews || 0,
            distance: "Nearby",
            image: s.images?.[0] || defaultShopImage,
            hours: `${s.opening_time || "09:00"} - ${s.closing_time || "21:00"}`,
            about: s.about || "Premium grooming, experienced stylists, and luxury comfort — all designed for a smooth modern booking experience.",
            images: s.images || [],
            owner_name: s.owner_name || "Valued Partner",
            approved_at: s.approved_at
          };
          setSalon(mappedSalon);
          setActiveImage(mappedSalon.image);

          // Fetch Salon services
          const servicesRes = await fetch(`${API}/services/${targetId}`);
          const servicesData = await servicesRes.json();
          if (servicesData.success) {
            setServicesList(servicesData.services);
          }

          // Fetch Salon barbers
          const barbersRes = await fetch(`${API}/barber/salon/${targetId}`);
          const barbersData = await barbersRes.json();
          if (barbersData.success) {
            setBarbers(barbersData.barbers);
          }
        } else {
          setError("No approved salons are currently live.");
        }
      } catch (err) {
        console.error("Error fetching salon details:", err);
        setError("Network error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalonData();
  }, [id]);

  useEffect(() => {
    setServicesPage(1);
  }, [selectedCategory]);

  const handleBookVisit = () => {
    if (!salon) return;
    localStorage.setItem("selectedSalonId", salon.id);
    localStorage.setItem("selectedSalonName", salon.name);
    navigate("/customer/services");
  };

  const getServiceImage = (service) => {
    if (service.image && service.image.trim() !== "") return service.image;
    const name = service.name.toLowerCase();
    const cat = (service.category || "").toLowerCase();
    if (name.includes("cut") || name.includes("hair") || name.includes("shamp") || name.includes("trim")) {
      return "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600";
    }
    if (name.includes("beard") || name.includes("shave") || name.includes("mustache")) {
      return "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600";
    }
    if (name.includes("facial") || name.includes("massage") || name.includes("spa") || name.includes("clean") || name.includes("scrub") || name.includes("face")) {
      return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600";
    }
    if (name.includes("colour") || name.includes("color") || name.includes("dye") || name.includes("highlight")) {
      return "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600";
    }
    if (cat === "women") {
      return "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600";
    }
    return "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=600";
  };

  const filteredServices = servicesList.filter((service) => {
    if (selectedCategory === "all") return true;
    return (service.category || "").toLowerCase() === selectedCategory.toLowerCase();
  });

  const SERVICES_PER_PAGE = 6;
  const totalServicesPages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE) || 1;
  const servicesStartIndex = (servicesPage - 1) * SERVICES_PER_PAGE;
  const paginatedServices = filteredServices.slice(servicesStartIndex, servicesStartIndex + SERVICES_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalServicesPages <= maxVisible) {
      for (let i = 1; i <= totalServicesPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, servicesPage - 1);
      let end = Math.min(totalServicesPages - 1, servicesPage + 1);
      if (servicesPage <= 3) {
        end = 4;
      } else if (servicesPage >= totalServicesPages - 2) {
        start = totalServicesPages - 3;
      }
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalServicesPages - 1) pages.push("...");
      pages.push(totalServicesPages);
    }
    return pages;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF6F0] text-[#1A1612] font-sans antialiased flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-20">
          <div className="text-center">
            <Clock className="animate-spin text-[#C5A059] mx-auto mb-4" size={36} />
            <p className="text-[#3E362E] font-black uppercase tracking-widest text-xs">Loading Studio Details...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !salon) {
    return (
      <main className="min-h-screen bg-[#FAF6F0] text-[#1A1612] font-sans antialiased flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-20 px-6">
          <div className="max-w-md w-full bg-white border border-[#E8DCCB] rounded-3xl p-8 text-center shadow-sm">
            <Scissors className="text-red-500 mx-auto mb-4 stroke-[1.5px]" size={48} />
            <h2 className="text-xl font-black text-[#3E362E] mb-2">Studio Not Found</h2>
            <p className="text-stone-500 text-sm mb-6">{error || "This studio profile is currently not live."}</p>
            <button
              onClick={() => navigate(-1)}
              className="w-full rounded-xl bg-[#3E362E] hover:bg-[#2A241F] text-[#C5A059] font-black text-xs uppercase tracking-widest py-4 transition"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF6F0] text-[#3E362E] font-sans antialiased flex flex-col">
      <Navbar />

      {/* 📸 EDITORIAL SHOWCASE HERO DISPLAY */}
      <section className="relative bg-[#FAF6F0] pt-28 pb-8 px-6 sm:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Salon Info */}
          <div className="lg:col-span-7 text-left space-y-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8A7B6A] hover:text-[#C5A059] transition cursor-pointer border-none bg-transparent"
            >
              <ArrowLeft size={14} className="stroke-[2.5px]" /> Back to Studios
            </button>

            {/* Premium Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#E8DCCB] px-3.5 py-2 shadow-3xs">
                <Star
                  size={12}
                  className="fill-[#C5A059] text-[#C5A059]"
                />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3E362E]">
                  {salon.rating} Rating
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#E8DCCB] px-3.5 py-2 shadow-3xs">
                <MapPin
                  size={12}
                  className="text-[#C5A059]"
                />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3E362E]">
                  {salon.distance} Away
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-250 px-3.5 py-2 shadow-3xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                  ● LIVE QUEUE ACTIVE
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-[#3E362E]">
              {salon.name}
            </h1>

            {/* Description */}
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed font-medium max-w-xl">
              {salon.about}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleBookVisit}
                className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] hover:from-[#bfa05d] hover:to-[#bfa05d] text-[#2A241F] text-[10px] font-black uppercase tracking-[0.22em] shadow-md hover:scale-[1.02] transition duration-300 cursor-pointer border-none"
              >
                Book Appointment
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById("popular-services");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-7 py-4 rounded-xl border border-[#E8DCCB] bg-white hover:bg-stone-50 text-[#3E362E] text-[10px] font-black uppercase tracking-[0.22em] hover:scale-[1.02] transition duration-300 cursor-pointer"
              >
                Explore Services
              </button>
            </div>
          </div>

          {/* Right Side: Showcase Image Frame */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-[2rem] overflow-hidden border border-[#E8DCCB] bg-stone-100 shadow-xl group">
              <img
                src={activeImage || salon.image}
                alt={salon.name}
                onError={(e) => {
                  e.currentTarget.src = defaultShopImage;
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 📊 QUICK CONTEXT INFO TILES ROW — spans full width below hero banner */}
      <section className="mx-auto max-w-7xl w-full px-6 sm:px-8 lg:px-10 pt-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <InfoTile icon={MapPin} label="Address" value={salon.address} />
          <InfoTile icon={Clock} label="Hours" value={salon.hours} />
          <InfoTile icon={Phone} label="Phone" value={salon.phone} />
        </div>
      </section>

      {/* 🧱 DATA PROFILE DETAILS LAYOUT COLUMNS GRID */}
      <section className="mx-auto grid max-w-7xl w-full gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10 flex-1">
        <div className="space-y-8">
          {/* 📸 Gallery Section */}
          <div className="rounded-2xl border border-[#E8DCCB] bg-white p-6 shadow-sm text-left text-[#3E362E]">
            <div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-[#3E362E] flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase text-[17px] sm:text-[19px]">Studio</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Gallery Vault</span>
              </h2>
              <ImageIcon className="text-[#C5A059]" size={18} />
            </div>
            {salon.images && salon.images.length > 0 ? (
              <div>
                <p className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider mb-3">Click on any photo to set it as storefront background image</p>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {salon.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-video rounded-xl overflow-hidden bg-black/5 group border cursor-pointer transition-all duration-300 ${
                        activeImage === img ? "border-[#C5A059] ring-2 ring-[#C5A059]/20" : "border-[#E8DCCB] hover:border-[#C5A059]"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${salon.name} Gallery ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = defaultShopImage;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-[#FAF6F0]/50 rounded-xl border border-[#E8DCCB]/60">
                <ImageOff className="mx-auto text-[#8A7B6A] mb-2" size={32} />
                <p className="text-xs font-semibold text-stone-400">No custom photos uploaded yet.</p>
                <div className="mt-4 max-w-xs mx-auto aspect-video rounded-xl overflow-hidden border border-[#E8DCCB]">
                  <img src={defaultShopImage} alt={salon.name} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* 💈 Services Section with Horizontal Tabs and Dropdown */}
          <div id="popular-services" className="rounded-2xl border border-[#E8DCCB] bg-white p-6 shadow-sm text-left">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-[#3E362E] flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase text-[17px] sm:text-[19px]">Available</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Services Menu</span>
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#B58B67] sm:mb-0">Filter By Category:</p>
                
                {/* Dropdown Selector for Category Filtering */}
                <div className="w-full sm:w-auto min-w-[200px]">
                  <CustomSelect
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={[
                      { value: "all", label: "All Services" },
                      { value: "men", label: "Men Services" },
                      { value: "women", label: "Women Services" },
                      { value: "addon", label: "Addon Services" }
                    ]}
                    className="!text-[10px] !font-black !uppercase !tracking-widest !bg-[#FAF6F0] !text-[#3E362E] !border-[#E8DCCB] !rounded-xl !h-10"
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              {filteredServices.length === 0 ? (
                <div className="py-12 text-center bg-[#FAF6F0]/50 rounded-2xl border border-dashed border-[#E8DCCB]">
                  <Scissors className="text-stone-300 mx-auto mb-2 animate-pulse" size={32} />
                  <p className="text-sm font-bold text-stone-505">No services listed for this category.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedServices.map((service) => (
                      <div
                        key={service._id}
                        className="group rounded-2xl border border-[#E8DCCB] bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-[#C5A059]/55 transition-all duration-300 flex flex-col justify-between"
                      >
                        {/* Service Image Section */}
                        <div className="relative h-36 bg-stone-100 overflow-hidden">
                          <img
                            src={getServiceImage(service)}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Duration Badge */}
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur px-2.5 py-1 rounded-lg text-white text-[9px] font-bold">
                            {service.duration} min
                          </div>
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 bg-[#FEF3E2]/95 backdrop-blur text-[#9E7452] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#EEDBCA]">
                            {service.category === "addon" ? "Addon" : service.category === "women" ? "Women" : "Men"}
                          </div>
                        </div>

                        {/* Card details */}
                        <div className="p-4 flex-grow flex flex-col justify-between text-left">
                          <div>
                            <h3 className="font-extrabold text-[#3E362E] text-sm tracking-tight leading-tight mb-1">{service.name}</h3>
                            <div className="flex items-center gap-1 mb-2">
                              <div className="flex text-[#C5A059]">
                                <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                                <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                                <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                                <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                                <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                              </div>
                              <span className="text-[10px] text-stone-400 font-semibold">(5.0)</span>
                            </div>
                            <p className="text-[11px] text-stone-505 font-medium leading-relaxed line-clamp-2 mb-4">
                              {service.description || `Premium ${service.name} service tailored to provide a professional result.`}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2.5 border-t border-stone-100">
                            <span className="font-black text-stone-900 font-mono text-sm">
                              ₹ {service.price}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                localStorage.setItem("selectedSalonId", salon.id);
                                localStorage.setItem("selectedSalonName", salon.name);
                                navigate("/customer/services");
                              }}
                              className="rounded-xl bg-[#3E362E] hover:bg-[#2A241F] text-white font-black text-[10px] uppercase tracking-widest px-4 py-2.5 transition shadow-sm hover:scale-103 cursor-pointer"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {filteredServices.length > SERVICES_PER_PAGE && (
                    <div className="mt-8 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        Showing {servicesStartIndex + 1} - {Math.min(servicesStartIndex + SERVICES_PER_PAGE, filteredServices.length)} of {filteredServices.length} Services
                      </span>
                      
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <button
                          disabled={servicesPage === 1}
                          onClick={() => {
                            setServicesPage(p => Math.max(p - 1, 1));
                            document.getElementById("popular-services")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="px-3 py-2 rounded-xl border border-[#E8DCCB] text-[#3E362E] text-[10px] font-black uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer transition"
                        >
                          Prev
                        </button>
                        
                        {getPageNumbers().map((page, idx) => {
                          if (page === "...") {
                            return (
                              <span
                                key={`ellipsis-${idx}`}
                                className="w-8 h-8 flex items-center justify-center text-[#8A7B6A] text-[10px] font-black"
                              >
                                ...
                              </span>
                            );
                          }
                          const isActive = page === servicesPage;
                          return (
                            <button
                              key={page}
                              onClick={() => {
                                setServicesPage(page);
                                document.getElementById("popular-services")?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className={`w-8 h-8 rounded-xl text-[10px] font-black tracking-widest transition flex items-center justify-center cursor-pointer ${
                                isActive
                                  ? "bg-[#3E362E] text-white"
                                  : "border border-[#E8DCCB] text-[#3E362E] hover:bg-stone-50"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        
                        <button
                          disabled={servicesPage === totalServicesPages}
                          onClick={() => {
                            setServicesPage(p => Math.min(p + 1, totalServicesPages));
                            document.getElementById("popular-services")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="px-3 py-2 rounded-xl border border-[#E8DCCB] text-[#3E362E] text-[10px] font-black uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 💈 Stylists Section */}
          <div className="rounded-2xl border border-[#E8DCCB] bg-white p-6 shadow-sm text-left">
            <div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4">
              <h2 className="font-serif text-xl sm:text-2xl tracking-normal text-[#3E362E] flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase text-[17px] sm:text-[19px]">Meet Our</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Stylists Team</span>
              </h2>
              <Users className="text-[#C5A059]" size={18} />
            </div>
            {barbers.length === 0 ? (
              <p className="text-xs font-semibold text-stone-400">Stylists are currently busy or offline. Walk-ins are welcome!</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {barbers.map((barber) => (
                  <div key={barber._id} className="flex items-center gap-3 p-4 rounded-xl border border-[#E8DCCB]/60 bg-[#FAF6F0]/65 hover:border-[#C5A059]/40 hover:shadow-xs transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E8DCCB] flex items-center justify-center text-[#C5A059] flex-shrink-0 shadow-2xs">
                      <Users size={20} className="stroke-[1.5px]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-extrabold text-[#3E362E] text-sm truncate">{barber.name}</h3>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          barber.status === "available"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                            : barber.status === "busy"
                            ? "bg-amber-50 text-amber-700 border-amber-200/50"
                            : barber.status === "break"
                            ? "bg-blue-50 text-blue-700 border-blue-200/50"
                            : "bg-stone-50 text-stone-600 border-stone-200/50"
                        }`}>
                          {barber.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-[#B58B67] uppercase tracking-wide mt-0.5">
                        {barber.specialization || "Hair Specialist"}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-[10px] font-semibold text-stone-505">{barber.experience || 0} yrs exp</span>
                        <div className="flex items-center gap-0.5">
                          <Star size={10} className="fill-[#C5A059] text-[#C5A059]" />
                          <span className="text-[10px] font-black text-stone-800">{barber.rating || 4.5}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 📑 FIXED FLOATING RIGHT SIDEBAR ANCHOR */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Booking Card */}
          <div className="rounded-2xl border border-[#E8DCCB] bg-white text-[#3E362E] p-6 shadow-sm text-left transition-all hover:border-[#C5A059]/40">
            <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-lg tracking-normal text-[#3E362E] flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase text-[15px]">Book Your</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Visit</span>
              </h2>
              <CalendarClock className="text-[#C5A059]" size={18} />
            </div>
            <p className="mb-6 text-xs font-medium leading-relaxed text-stone-500">
              Select a service and barber, then reserve your slot with a small
              token payment.
            </p>
            <button
              type="button"
              onClick={handleBookVisit}
              className="w-full rounded-xl bg-[#3E362E] hover:bg-[#2A241F] text-white px-5 py-4 text-xs font-black uppercase tracking-widest shadow-sm transition-all active:scale-[0.99] hover:scale-[1.02] cursor-pointer"
            >
              Choose Services
            </button>
            <div className="flex items-start gap-3 rounded-xl bg-[#FAF6F0]/70 border border-[#E8DCCB] p-4 text-xs text-[#8A7B6A] mt-4">
              <ShieldCheck size={16} className="shrink-0 text-[#C5A059]" />
              <span className="font-medium leading-normal">Verified salon profile with appointment logs and live smart queue support.</span>
            </div>
          </div>

          {/* Owner & Verification Details */}
          <div className="rounded-2xl border border-[#E8DCCB] bg-white text-[#3E362E] p-6 shadow-sm text-left transition-all hover:border-[#C5A059]/40">
            <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-lg tracking-normal text-[#3E362E] flex items-center justify-start gap-2 whitespace-nowrap">
                <span className="font-bold uppercase text-[15px]">Studio</span>
                <span className="italic text-[#C5A059] normal-case font-medium">Verification Check</span>
              </h2>
              <UserCheck className="text-[#C5A059]" size={18} />
            </div>
            <div className="space-y-4">
              <div className="border-b last:border-0 pb-3 last:pb-0">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block">Studio Owner</label>
                <p className="font-extrabold text-[#3E362E] mt-0.5 text-sm">{salon.owner_name}</p>
              </div>

              <div className="border-b last:border-0 pb-3 last:pb-0">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block">Verification Status</label>
                <p className="font-extrabold text-emerald-700 mt-0.5 text-sm">Approved Profile</p>
                <p className="text-[9px] font-semibold text-stone-400 mt-0.5">Verified: {salon.approved_at ? new Date(salon.approved_at).toLocaleDateString("en-IN", {day: "numeric", month: "short", year: "numeric"}) : "June 2026"}</p>
              </div>

              <div className="border-b last:border-0 pb-3 last:pb-0">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block">Admin Approver Email</label>
                <p className="font-extrabold text-[#3E362E] mt-0.5 text-sm font-mono break-all">{salon.email || "contact@barberpro.com"}</p>
              </div>

              <div className="border-b last:border-0 pb-3 last:pb-0">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] block">Verification Hotline</label>
                <p className="font-extrabold text-[#3E362E] mt-0.5 text-sm font-mono">+91 90000 00000</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
      <Footer />
    </main>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#E8DCCB] bg-white text-[#3E362E] p-5 shadow-sm text-left transition-all hover:border-[#C5A059]/55 hover:shadow-md hover:scale-[1.01] duration-300 font-sans">
      <Icon className="mb-3 text-[#C5A059] stroke-[2.5px]" size={20} />
      <p className="text-[10px] font-black uppercase tracking-widest text-[#B58B67]">
        {label}
      </p>
      <p className="mt-2 font-extrabold text-[#3E362E] text-sm leading-snug">{value}</p>
    </div>
  );
}