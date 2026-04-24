import { useNavigate } from "react-router-dom";

export default function MenServices() {
  const navigate = useNavigate();

  const services = [
    {
      name: "Classic Haircut",
      price: 200,
      img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400"
    },
    {
      name: "Skin Fade",
      price: 250,
      img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400"
    },
    {
      name: "Beard Trim",
      price: 100,
      img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400"
    },
    {
      name: "Hot Towel Shave",
      price: 150,
      img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400"
    }
  ];

  return (
    <div className="container">
      <h2>Men Services</h2>

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