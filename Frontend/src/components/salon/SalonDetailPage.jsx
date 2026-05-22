import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  Clock,
  MapPin,
  Phone,
  Scissors,
  ShieldCheck,
  Star,
} from "lucide-react";

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
      "https://images.unsplash.com/photo-1621605815841-aa33c5447a33?q=80&w=1400",
    hours: "10:30 AM - 9:30 PM",
  },
];

const services = [
  { name: "Classic Haircut", duration: "30 min", price: "Rs. 249" },
  { name: "Beard Trim & Shape", duration: "20 min", price: "Rs. 149" },
  { name: "Hair Spa", duration: "45 min", price: "Rs. 599" },
  { name: "Premium Grooming", duration: "60 min", price: "Rs. 899" },
];

export default function SalonDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const salon = demoSalons.find((item) => item.id === id) || demoSalons[0];

  return (
    <main className="min-h-screen bg-[#F9F7F4] text-[#1A1612]">
      <section className="relative min-h-[72vh] overflow-hidden">
        <img
          src={salon.image}
          alt={salon.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1612] via-[#1A1612]/55 to-[#1A1612]/10" />

        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-between px-5 py-6 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#1A1612] shadow-sm transition hover:bg-white"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="max-w-3xl pb-8 text-white">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-bold">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[#1A1612]">
                <Star size={16} className="fill-[#C5A059] text-[#C5A059]" />
                {salon.rating} ({salon.reviews} reviews)
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                <MapPin size={16} />
                {salon.distance} away
              </span>
            </div>

            <h1 className="font-serif text-5xl font-black leading-tight sm:text-6xl">
              {salon.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium text-white/85 sm:text-lg">
              Premium grooming, reliable queue updates, and quick booking in one
              polished studio experience.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <InfoTile icon={MapPin} label="Address" value={salon.address} />
            <InfoTile icon={Clock} label="Hours" value={salon.hours} />
            <InfoTile icon={Phone} label="Phone" value={salon.phone} />
          </div>

          <div className="rounded-2xl border border-[#E8E0D6] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <Scissors className="text-[#C5A059]" size={22} />
              <h2 className="text-2xl font-black">Popular Services</h2>
            </div>

            <div className="divide-y divide-[#EFE8DD]">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-bold">{service.name}</h3>
                    <p className="text-sm text-[#7C6E60]">{service.duration}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-[#C5A059]">
                      {service.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate("/customer/barber")}
                      className="rounded-lg bg-[#1A1612] px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#C5A059]"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-[#E8E0D6] bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <div className="mb-5 flex items-center gap-3">
            <CalendarClock className="text-[#C5A059]" size={22} />
            <h2 className="text-xl font-black">Book Your Visit</h2>
          </div>
          <p className="mb-6 text-sm leading-6 text-[#7C6E60]">
            Select a service and barber, then reserve your slot with a small
            token payment.
          </p>
          <button
            type="button"
            onClick={() => navigate("/customer/services")}
            className="mb-4 w-full rounded-xl bg-[#C5A059] px-5 py-4 text-sm font-black uppercase tracking-widest text-white shadow-md transition hover:bg-[#b18d49]"
          >
            Choose Services
          </button>
          <div className="flex items-start gap-3 rounded-xl bg-[#F9F7F4] p-4 text-sm text-[#5F5146]">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#C5A059]" />
            <span>Verified salon profile with appointment and queue support.</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#E8E0D6] bg-white p-5 shadow-sm">
      <Icon className="mb-3 text-[#C5A059]" size={22} />
      <p className="text-xs font-black uppercase tracking-widest text-[#8D7B68]">
        {label}
      </p>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}
