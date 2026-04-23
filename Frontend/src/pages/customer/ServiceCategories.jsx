import { useNavigate } from "react-router-dom";

export default function ServiceCategories() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Men Services",
      desc: "Timeless cuts that suit your style and face shape.",
      img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600",
      path: "/customer/services/men"
    },
    {
      title: "Women Services",
      desc: "Tailored cuts and blowouts for all hair types.",
      img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600",
      path: "/customer/services/women"
    },
    {
      title: "Add-On Services",
      desc: "Extra grooming & treatments.",
      img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600",
      path: "/customer/services/addon"
    }
  ];

  return (
    <div className="container">
      <h2 style={{ marginBottom: "30px", fontSize: "26px" }}>
        Our Services
      </h2>

      <div className="grid">
        {categories.map((cat, i) => (
          <div key={i} className="category-card">

            <img src={cat.img} className="category-img" />

            <div className="category-content">
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>

              <button className="btn" onClick={() => navigate(cat.path)}>
                View Services
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}