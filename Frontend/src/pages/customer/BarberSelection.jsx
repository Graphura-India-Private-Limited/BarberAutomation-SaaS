import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BarberSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedService = location.state?.service;

  const [selectedBarber, setSelectedBarber] = useState(null);

  const barbers = [
    {
      id: 1,
      name: "John",
      experience: "5 yrs",
      rating: 4.8,
      status: "Available",
      img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400"
    },
    {
      id: 2,
      name: "Mike",
      experience: "3 yrs",
      rating: 4.5,
      status: "Busy",
      img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400"
    },
    {
      id: 3,
      name: "Alex",
      experience: "6 yrs",
      rating: 4.9,
      status: "Available",
      img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400"
    }
  ];

  return (
    <div className="container">
      <h2>Select Barber</h2>

      {/* SAFETY CHECK */}
      {!selectedService && (
        <p style={{ color: "red" }}>
          No service selected. Please go back.
        </p>
      )}

      <p>
        Service: <strong>{selectedService?.name}</strong>
      </p>

      {/* Auto Assign */}
      <button
        className="btn"
        style={{ marginBottom: "20px" }}
        onClick={() => alert("Best available barber assigned")}
      >
        Auto Assign Barber
      </button>

      <div className="grid">
        {barbers.map((b) => (
          <div
            key={b.id}
            className={`barber-card ${
              selectedBarber?.id === b.id ? "selected" : ""
            }`}
          >
            {/* IMAGE */}
            <img src={b.img} className="service-img" alt={b.name} />

            {/* STATUS */}
            <div className="status-row">
              <span
                className={
                  b.status === "Available"
                    ? "badge available"
                    : "badge busy"
                }
              >
                {b.status}
              </span>
            </div>

            {/* DETAILS */}
            <h3>{b.name}</h3>
            <p>⭐ {b.rating}</p>
            <p>{b.experience} experience</p>

            {/* BUTTON */}
            {b.status === "Available" && (
              <button
                className="btn"
                onClick={() => setSelectedBarber(b)}
              >
                {selectedBarber?.id === b.id ? "Selected" : "Select"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 🔥 NEXT BUTTON */}
      {selectedBarber && (
        <div style={{ marginTop: "30px" }}>
          <button
            className="btn"
            onClick={() =>
              navigate("/customer/booking", {
                state: {
                  service: selectedService,
                  barber: selectedBarber
                }
              })
            }
          >
            Continue Booking →
          </button>
        </div>
      )}
    </div>
  );
}