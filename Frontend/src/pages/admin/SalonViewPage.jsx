import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SalonDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const salon = location.state;

  if (!salon) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No Salon Data Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 bg-[#D6B36A] text-black px-5 py-2 rounded-xl font-bold"
      >
        ← Back
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Image */}
        <div>
          <img
            src={salon.image}
            alt={salon.name}
            className="w-full h-[500px] object-cover rounded-3xl border border-[#2d2419]"
          />
        </div>

        {/* Details */}
        <div className="bg-[#111111] border border-[#2d2419] rounded-3xl p-8">
          <h1 className="text-5xl font-black text-[#D6B36A] mb-6">
            {salon.name}
          </h1>

          <div className="space-y-5 text-lg">
            <p>
              <span className="text-[#D6B36A] font-bold">
                Owner :
              </span>{" "}
              {salon.owner}
            </p>

            <p>
              <span className="text-[#D6B36A] font-bold">
                City :
              </span>{" "}
              {salon.city}
            </p>

            <p>
              <span className="text-[#D6B36A] font-bold">
                Status :
              </span>{" "}
              {salon.status}
            </p>

            <p>
              <span className="text-[#D6B36A] font-bold">
                Total Bookings :
              </span>{" "}
              {salon.bookings}
            </p>
          </div>

         <div className="mt-10 flex justify-center">
  <button
    onClick={() =>
      window.open(
        `https://wa.me/919881332280?text=Hello%20${salon.name}%20Salon,%20I%20want%20to%20contact%20you.`,
        "_blank"
      )
    }
    className="bg-[#D6B36A] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#c7a458] transition"
  >
    Contact Salon
  </button>
</div>
        </div>
      </div>
    </div>
  );
}