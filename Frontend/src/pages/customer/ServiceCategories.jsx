import { useNavigate } from "react-router-dom";

export default function ServiceCategories() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Men Services",
      desc: "Timeless cuts that suit your style and face shape.",
      img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
      path: "/customer/services/men"
    },
    {
      title: "Women Services",
      desc: "Tailored cuts and blowouts for all hair types.",
      img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80",
      path: "/customer/services/women"
    },
    {
      title: "Add-On Services",
      desc: "Extra grooming & treatments.",
      img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80",
      path: "/customer/services/addon"
    }
  ];

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
      <div style={{position:"relative",height:300,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",marginBottom:48}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80)",backgroundSize:"cover",backgroundPosition:"center",filter:"brightness(0.6)"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, #F9F7F4, transparent)"}} />
        <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
          <h2 style={{fontSize:56,fontWeight:900,color:"#1C1410",fontFamily:"'Cormorant Garamond',serif",letterSpacing:-1,marginBottom:12}}>
            Our Services
          </h2>
          <p style={{fontSize:16,color:"#4a3f35",maxWidth:600,margin:"0 auto",lineHeight:1.6}}>
            Experience premium grooming and styling with our curated selection of specialized services.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px 80px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:32}}>
          {categories.map((cat, i) => (
            <div key={i} className="hcard" style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #E8E0D6",boxShadow:"0 4px 16px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column"}}>
              <div style={{height:240,overflow:"hidden",position:"relative"}}>
                <img src={cat.img} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s ease"}} 
                     onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                     onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
              </div>
              <div style={{padding:"24px",display:"flex",flexDirection:"column",flexGrow:1,justifyContent:"space-between"}}>
                <div>
                  <h3 style={{fontSize:24,fontWeight:800,color:"#1C1410",fontFamily:"'Cormorant Garamond',serif",marginBottom:8}}>{cat.title}</h3>
                  <p style={{fontSize:14,color:"#7C6E60",lineHeight:1.6,marginBottom:24}}>{cat.desc}</p>
                </div>
                <button className="btn-gold" onClick={() => navigate(cat.path)} style={{width:"100%"}}>
                  EXPLORE SERVICES
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}