import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchFilterHeader from "../../components/booking/SearchFilterHeader";

export default function MenServices() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: "",
    cost: "",
    distance: "",
    rating: ""
  });

  const services = [
    {
      name: "Classic Haircut",
      price: 200,
      img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800"
    },
    {
      name: "Skin Fade",
      price: 250,
      img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800"
    },
    {
      name: "Beard Trim",
      price: 100,
      img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800"
    },
    {
      name: "Hot Towel Shave",
      price: 150,
      img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800"
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
    <div style={{background:"#F9F7F4",minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1C1410"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        .hcard { transition: all 0.3s ease; }
        .hcard:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; transform: translateY(-6px); }
        .btn-gold { background: #C9882A; color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(201,136,42,0.2); }
        .btn-gold:hover { background: #b87a22; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,136,42,0.3); }
      `}</style>

      {/* Hero Section */}
      <div style={{position:"relative",height:340,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",marginBottom:48}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80)",backgroundSize:"cover",backgroundPosition:"center",filter:"brightness(0.7)"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, #F9F7F4, transparent)"}} />
        <div style={{position:"relative",zIndex:1,textAlign:"center",padding:"0 20px"}}>
          <h1 style={{fontSize:56,fontWeight:900,color:"#fff",fontFamily:"'Cormorant Garamond',serif",letterSpacing:-1,marginBottom:12,textShadow:"0 2px 10px rgba(0,0,0,0.5)"}}>
            Men Services
          </h1>
          <p style={{fontSize:16,color:"#fff",textShadow:"0 1px 4px rgba(0,0,0,0.6)",maxWidth:600,margin:"0 auto",lineHeight:1.6}}>
            Sharp cuts, beard care, and signature grooming services created for a polished, confident finish.
          </p>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px 80px"}}>
        <div style={{marginBottom:40}}>
          <SearchFilterHeader onFiltersChange={setFilters} />
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:28}}>
          {filteredServices.map((s, i) => (
            <div key={i} className="hcard" style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #E8E0D6",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column"}}>
              <div style={{height:220,overflow:"hidden",position:"relative"}}>
                <img src={s.img} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s ease"}} 
                     onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                     onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} alt={s.name} loading="lazy" />
              </div>
              <div style={{padding:"24px",display:"flex",flexDirection:"column",flexGrow:1,justifyContent:"space-between"}}>
                <div style={{marginBottom: 20}}>
                  <h3 style={{fontSize:22,fontWeight:800,color:"#1C1410",fontFamily:"'Cormorant Garamond',serif",marginBottom:8}}>{s.name}</h3>
                  <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                    <span style={{fontSize:14,color:"#7C6E60"}}>Starting at</span>
                    <span style={{fontSize:20,fontWeight:800,color:"#1C1410"}}>₹{s.price}</span>
                  </div>
                </div>
                <button
                  className="btn-gold"
                  style={{width:"100%"}}
                  onClick={() =>
                    navigate("/customer/barber", {
                      state: { service: s }
                    })
                  }
                >
                  SELECT SERVICE
                </button>
              </div>
            </div>
          ))}
          {filteredServices.length === 0 && (
            <div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px 0",color:"#7C6E60",fontSize:16}}>
              No services found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}