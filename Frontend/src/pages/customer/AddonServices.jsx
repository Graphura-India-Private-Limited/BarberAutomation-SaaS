import { useNavigate } from "react-router-dom";

export default function AddonServices() {
  const navigate = useNavigate();

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

  return (
    <div className="container">
      <h2>Add-On Services</h2>

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