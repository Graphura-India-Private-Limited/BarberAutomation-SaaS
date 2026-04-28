import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchFilterHeader from "../../Components/SearchFilterHeader";

export default function BarberSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedService = location.state?.service;

  const [selectedBarber, setSelectedBarber] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    cost: "",
    distance: "",
    rating: ""
  });

  const barbers = [
    {
      id: 1,
      name: "John",
      experience: "5 yrs",
      rating: 4.8,
      status: "Available",
      distance: 2,
      img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400"
    },
    {
      id: 2,
      name: "Mike",
      experience: "3 yrs",
      rating: 4.5,
      status: "Busy",
      distance: 5,
      img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400"
    },
    {
      id: 3,
      name: "Alex",
      experience: "6 yrs",
      rating: 4.9,
      status: "Available",
      distance: 1,
      img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400"
    }
  ];

  // 🔥 FILTER LOGIC
  const filteredBarbers = barbers.filter((b) => {
    return (
      b.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.rating === "" || b.rating >= Number(filters.rating)) &&
      (filters.distance === "" || b.distance <= Number(filters.distance))
    );
  });

  // 🔥 AUTO ASSIGN
  const handleAutoAssign = () => {
    const availableBarber = filteredBarbers.find(
      (b) => b.status === "Available"
    );

    if (availableBarber) {
      setSelectedBarber(availableBarber);
    } else {
      alert("No barbers available with current filters");
    }
  };

  return (
    <div className="container">
      <SearchFilterHeader onFiltersChange={setFilters} />
      <h2>Select Barber</h2>

      {!selectedService && (
        <p style={{ color: "red" }}>
          No service selected. Please go back.
        </p>
      )}

      <p>
        Service: <strong>{selectedService?.name}</strong>
      </p>

      <p>
        Price: <strong>₹{selectedService?.price}</strong>
      </p>

      {/* Auto Assign */}
      <button
        className="btn"
        style={{ marginBottom: "20px" }}
        onClick={handleAutoAssign}
      >
        Auto Assign Barber
      </button>

      <div className="grid">
        {filteredBarbers.map((b) => (
          <div
            key={b.id}
            className={`barber-card ${
              selectedBarber?.id === b.id ? "selected" : ""
            }`}
          >
            <img src={b.img} className="service-img" alt={b.name} />

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

            <h3>{b.name}</h3>
            <p>⭐ {b.rating}</p>
            <p>{b.experience} experience</p>
            <p>{b.distance} km away</p>

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

      {/* CONTINUE */}
      {selectedBarber && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            className="btn"
            onClick={() =>
              navigate("/customer/details", {
                state: {
                  service: selectedService,
                  barber: selectedBarber
                }
              })
            }
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}