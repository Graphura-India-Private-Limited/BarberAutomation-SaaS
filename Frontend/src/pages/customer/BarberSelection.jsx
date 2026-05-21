import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchFilterHeader from "../../components/booking/SearchFilterHeader";

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
      img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400",
      aiWaitTime: { queueLength: 0, past7DaysAvg: "15 mins/cut", estimatedWait: "0 mins" }
    },
    {
      id: 2,
      name: "Mike",
      experience: "3 yrs",
      rating: 4.5,
      status: "Busy",
      distance: 5,
      img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400",
      aiWaitTime: { queueLength: 3, past7DaysAvg: "25 mins/cut", estimatedWait: "75 mins" }
    },
    {
      id: 3,
      name: "Alex",
      experience: "6 yrs",
      rating: 4.9,
      status: "Available",
      distance: 1,
      img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400",
      aiWaitTime: { queueLength: 1, past7DaysAvg: "12 mins/cut", estimatedWait: "12 mins" }
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
    <div style={{background:"#F9F7F4",minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#1C1410",padding:"40px 20px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        .hcard { transition: all 0.3s ease; }
        .hcard:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; transform: translateY(-6px); }
        .btn-gold { background: #C9882A; color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(201,136,42,0.2); }
        .btn-gold:hover { background: #b87a22; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,136,42,0.3); }
        .badge-avail { background: #ECFDF5; color: #065F46; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid #A7F3D0; }
        .badge-busy { background: #FFF7ED; color: #92400E; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid #FCD34D; }
      `}</style>

      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <SearchFilterHeader onFiltersChange={setFilters} />
        
        <div style={{marginTop:40,marginBottom:32}}>
          <h1 style={{fontSize:42,fontWeight:900,color:"#1C1410",fontFamily:"'Cormorant Garamond',serif",letterSpacing:-0.5,marginBottom:16}}>
            Select Barber
          </h1>

          {!selectedService && (
            <p style={{ color: "red" }}>
              No service selected. Please go back.
            </p>
          )}

          {selectedService && (
            <div style={{background:"#fff",padding:"20px 24px",borderRadius:12,border:"1px solid #E8E0D6",display:"inline-block",boxShadow:"0 4px 12px rgba(0,0,0,0.03)",marginBottom:24}}>
              <div style={{fontSize:13,color:"#7C6E60",marginBottom:4,fontWeight:600}}>Selected Service</div>
              <div style={{fontSize:18,fontWeight:800,color:"#1C1410"}}>{selectedService.name} <span style={{color:"#C9882A",marginLeft:8}}>₹{selectedService.price}</span></div>
            </div>
          )}
          
          <div style={{display:"block",marginBottom:32}}>
            <button className="btn-gold" style={{background:"#1C1410",boxShadow:"none"}} onClick={handleAutoAssign}>
              AUTO ASSIGN BARBER
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:28}}>
          {filteredBarbers.map((b) => {
            const isSelected = selectedBarber?.id === b.id;
            return (
              <div key={b.id} className="hcard" style={{background:"#fff",borderRadius:16,overflow:"hidden",border: isSelected ? '2px solid #C9882A' : '2px solid #E8E0D6',boxShadow:isSelected?"0 8px 24px rgba(201,136,42,0.15)":"0 4px 16px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",cursor:"pointer"}} onClick={() => b.status === "Available" && setSelectedBarber(b)}>
                <div style={{height:220,overflow:"hidden",position:"relative"}}>
                  <img src={b.img} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s ease",filter:b.status==="Busy"?"grayscale(0.6)":"none"}} 
                       onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                       onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} alt={b.name} loading="lazy" />
                  <div style={{position:"absolute",top:12,right:12}}>
                    <span className={b.status === "Available" ? "badge-avail" : "badge-busy"}>
                      {b.status}
                    </span>
                  </div>
                </div>
                <div style={{padding:"24px",display:"flex",flexDirection:"column",flexGrow:1,justifyContent:"space-between",textAlign:"center"}}>
                  <div style={{marginBottom: 20}}>
                    <h3 style={{fontSize:24,fontWeight:800,color:"#1C1410",fontFamily:"'Cormorant Garamond',serif",marginBottom:8}}>{b.name}</h3>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginBottom:8}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span style={{fontSize:14,fontWeight:700,color:"#1C1410"}}>{b.rating}</span>
                    </div>
                    <div style={{fontSize:13,color:"#7C6E60",marginBottom:4}}>{b.experience} experience</div>
                    <div style={{fontSize:13,color:"#7C6E60",marginBottom:16}}>{b.distance} km away</div>

                    {/* AI WAIT TIME PREDICTION VIEW */}
                    <div className="bg-orange-50" style={{padding:"12px",borderRadius:"8px",border:"1px solid #FED7AA",textAlign:"left"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"8px"}}>
                        <span style={{fontSize:"14px"}}>✨</span>
                        <span style={{fontSize:"11px",fontWeight:800,color:"#9A3412",letterSpacing:"0.5px"}}>AI WAIT TIME PREDICTION</span>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:"4px",fontSize:"12px",color:"#7C2D12"}}>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                          <span>Queue Length:</span>
                          <span style={{fontWeight:600}}>{b.aiWaitTime.queueLength} persons</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                          <span>7-Day Avg Speed:</span>
                          <span style={{fontWeight:600}}>{b.aiWaitTime.past7DaysAvg}</span>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px",paddingTop:"4px",borderTop:"1px solid #FDBA74",fontWeight:700}}>
                          <span>Est. Wait Time:</span>
                          <span>{b.aiWaitTime.estimatedWait}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {b.status === "Available" ? (
                    <button
                      className="btn-gold"
                      style={{width:"100%",background:isSelected?"#C9882A":"transparent",color:isSelected?"#fff":"#C9882A",border:isSelected?"none":"1.5px solid #C9882A",boxShadow:isSelected?"0 4px 14px rgba(201,136,42,0.2)":"none"}}
                      onClick={(e) => { e.stopPropagation(); setSelectedBarber(b); }}
                    >
                      {isSelected ? "SELECTED" : "SELECT"}
                    </button>
                  ) : (
                    <button className="btn-gold" style={{width:"100%",background:"#F3F0EB",color:"#A89F91",cursor:"not-allowed",boxShadow:"none"}}>
                      UNAVAILABLE
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTINUE */}
        {selectedBarber && (
          <div style={{ marginTop: 48, textAlign: "center" }}>
            <button
              className="btn-gold"
              style={{padding:"16px 40px",fontSize:15}}
              onClick={() =>
                navigate("/customer/details", {
                  state: {
                    service: selectedService,
                    barber: selectedBarber
                  }
                })
              }
            >
              CONTINUE TO DETAILS →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}