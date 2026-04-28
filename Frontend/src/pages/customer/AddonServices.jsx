import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchFilterHeader from "../../Components/SearchFilterHeader";

export default function AddonServices() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: "",
    cost: "",
    distance: "",
    rating: ""
  });

  const services = [
    {
      name: "Head Massage",
      price: 150,
      img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400"
    },
    {
      name: "Hair Treatment",
      price: 600,
      img: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400"
    },
    {
      name: "Hair Coloring Add-on",
      price: 500,
      img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400"
    }
  ];

  const getPriceRange = (cost) => {
    switch (cost) {
      case "under200": return [0, 200];
      case "200-500": return [200, 500];
      case "500-1000": return [500, 1000];
      case "above1000": return [1000, Infinity];
      default: return [0, Infinity];
    }
  };

  const filteredServices = services.filter((s) => {
    const [minPrice, maxPrice] = getPriceRange(filters.cost);
    return (
      s.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      s.price >= minPrice && s.price <= maxPrice
    );
  });

  return (
    <div className="container">
      <SearchFilterHeader onFiltersChange={setFilters} />
      <h2>Add-On Services</h2>

      <div className="grid">
        {filteredServices.map((s, i) => (
          <div key={i} className="service-card">
            <img src={s.img} className="service-img" alt={s.name} />
            <h3>{s.name}</h3>
            <p>₹{s.price}</p>

            <button
              className="btn"
              onClick={() =>
                navigate("/customer/barber", {
                  state: { service: s }
                })
              }
            >
              Select
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}