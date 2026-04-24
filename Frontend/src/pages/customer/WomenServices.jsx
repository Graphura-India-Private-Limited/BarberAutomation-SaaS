import { useNavigate } from "react-router-dom";

export default function WomenServices() {
  const navigate = useNavigate();

  const services = [
    {
      name: "Haircut & Styling",
      price: 500,
      img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400"
    },
    {
      name: "Hair Coloring",
      price: 800,
      img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400"
    },
    {
      name: "Highlights & Balayage",
      price: 1000,
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400"
    },
    {
      name: "Hair Spa Treatment",
      price: 700,
      img: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=400"
    }
  ];

  return (
    <div className="container">
      <h2>Women Services</h2>

      <div className="grid">
        {services.map((s, i) => (
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