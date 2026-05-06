import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ServiceSummary from "../../Components/ServiceSummary";

export default function CustomerDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const { service, barber } = location.state || {};

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (!form.name || !form.phone) {
      alert("Please fill required fields");
      return;
    }

    navigate("/customer/booking", {
      state: { service, barber, customer: form }
    });
  };

  return (
    <div style={{position:"relative",minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1C1410",padding:"60px 40px",display:"flex",alignItems:"flex-start",justifyContent:"center"}}>
      {/* Background Image with soft overlay */}
      <div style={{position:"fixed",inset:0,zIndex:-1,backgroundImage:"url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&q=80)",backgroundSize:"cover",backgroundPosition:"center"}} />
      <div style={{position:"fixed",inset:0,zIndex:-1,background:"rgba(249,247,244,0.85)",backdropFilter:"blur(8px)"}} />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        .btn-gold { background: #C9882A; color: #fff; padding: 16px 24px; border-radius: 12px; font-weight: 800; font-size: 14px; letter-spacing: 0.8px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 18px rgba(201,136,42,0.25); }
        .btn-gold:hover { background: #b87a22; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,136,42,0.3); }
        .input-premium { width: 100%; padding: 14px 18px; border-radius: 10px; border: 1.5px solid #E8E0D6; background: #FAF9F7; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1C1410; transition: all 0.2s; outline: none; margin-bottom: 20px; }
        .input-premium:focus { border-color: #C9882A; background: #fff; box-shadow: 0 0 0 4px rgba(201,136,42,0.1); }
        .input-premium::placeholder { color: #A89F91; }
      `}</style>

      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <h1 style={{fontSize:42,fontWeight:900,color:"#1C1410",fontFamily:"'Cormorant Garamond',serif",letterSpacing:-0.5,marginBottom:48,textAlign:"center"}}>
          Enter Details
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: service ? "1fr 380px" : "1fr",
          gap: 40,
          alignItems: "flex-start",
          maxWidth: service ? "100%" : 500,
          margin: "0 auto"
        }}>
          {/* Left Column: Form Details */}
          <div style={{background:"#fff",borderRadius:24,padding:"40px",border:"1px solid #E8E0D6",boxShadow:"0 12px 40px rgba(0,0,0,0.04)"}}>
            
            <label style={{display:"block",fontSize:13,fontWeight:700,color:"#7C6E60",marginBottom:8,letterSpacing:0.5,textTransform:"uppercase"}}>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={handleChange}
              className="input-premium"
            />
            
            <label style={{display:"block",fontSize:13,fontWeight:700,color:"#7C6E60",marginBottom:8,letterSpacing:0.5,textTransform:"uppercase"}}>Phone Number *</label>
            <input
              type="text"
              name="phone"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
              className="input-premium"
            />
            
            <label style={{display:"block",fontSize:13,fontWeight:700,color:"#7C6E60",marginBottom:8,letterSpacing:0.5,textTransform:"uppercase"}}>Email Address (Optional)</label>
            <input
              type="email"
              name="email"
              placeholder="rahul@example.com"
              value={form.email}
              onChange={handleChange}
              className="input-premium"
            />
            
            <button className="btn-gold" style={{width:"100%",marginTop:16}} onClick={handleContinue}>
              CONTINUE TO PAYMENT →
            </button>
          </div>

          {/* Right Column: Service Summary */}
          {service && (
            <div style={{position:"sticky",top:40}}>
              <ServiceSummary service={service} barber={barber} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}