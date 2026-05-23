import { useLocation } from "react-router-dom";
import ServiceSummary from "../../components/booking/ServiceSummary";

export default function Booking() {
  const location = useLocation();

  const service = location.state?.service;
  const barber = location.state?.barber;

  if (!service) return <div>No service selected</div>;

  const tokenAmount = Math.round(service.price * 0.2);

  const handlePayment = () => {
    const options = {
      key: "rzp_test_1234567890",
      amount: tokenAmount * 100,
      currency: "INR",
      name: "Barber Booking",
      description: `${service.name} (Token Payment)`,
      handler: function () {
        alert("Token Payment Successful ✅");
      },
      theme: { color: "#c89b5e" }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{position:"relative",minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1C1410",padding:"80px 40px",display:"flex",alignItems:"flex-start",justifyContent:"center"}}>
      {/* Background Image with soft overlay */}
      <div style={{position:"fixed",inset:0,zIndex:-1,backgroundImage:"url(https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1600&q=80)",backgroundSize:"cover",backgroundPosition:"center"}} />
      <div style={{position:"fixed",inset:0,zIndex:-1,background:"rgba(249,247,244,0.85)",backdropFilter:"blur(8px)"}} />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        .btn-gold { background: #C9882A; color: #fff; padding: 16px 24px; border-radius: 12px; font-weight: 800; font-size: 14px; letter-spacing: 0.8px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 6px 18px rgba(201,136,42,0.25); }
        .btn-gold:hover { background: #b87a22; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,136,42,0.3); }
      `}</style>

      <div style={{width:"100%",maxWidth:1000,margin:"0 auto"}}>
        <h1 style={{fontSize:48,fontWeight:900,color:"#1C1410",fontFamily:"'Cormorant Garamond',serif",letterSpacing:-0.5,marginBottom:40,textAlign:"center",textShadow:"0 2px 10px rgba(255,255,255,0.5)"}}>
          Confirm Booking
        </h1>
        
        <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:40,alignItems:"flex-start"}}>
          {/* Left Column: Payment Details */}
          <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(12px)",borderRadius:24,padding:"40px",border:"1px solid rgba(232,224,214,0.6)",boxShadow:"0 16px 48px rgba(0,0,0,0.06)"}}>
            <h2 style={{fontSize:24,fontWeight:800,color:"#1C1410",fontFamily:"'Cormorant Garamond',serif",marginBottom:24,borderBottom:"1px solid #E8E0D6",paddingBottom:16}}>
              Payment Details
            </h2>
            
            <div style={{background:"#FFFBF0",borderRadius:16,padding:"24px",border:"1px solid #F0EAE2",marginBottom:32}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontSize:16,color:"#7C6E60",fontWeight:600}}>Token Amount</span>
                <span style={{fontSize:28,fontWeight:900,color:"#1C1410"}}>₹{tokenAmount}</span>
              </div>
              <p style={{fontSize:13,color:"#C9882A",fontWeight:600}}>
                * Secure your slot by paying a small token now. Pay the rest at the salon.
              </p>
            </div>

            <button className="btn-gold" style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",gap:8}} onClick={handlePayment}>
              PAY ₹{tokenAmount} SECURELY
            </button>
          </div>

          {/* Right Column: Service Summary */}
          <div style={{position:"sticky",top:40}}>
            <ServiceSummary service={service} barber={barber} />
          </div>
        </div>
      </div>
    </div>
  );
}