import { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";

/* ── ICONS ───────────────────────────────────────── */
const Ic = {
  star:   (f=true,s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill={f?"#F59E0B":"none"} stroke="#F59E0B" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  clock:  (c="#6B7280",s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  pin:    (c="#6B7280",s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  phone:  (c="#6B7280",s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11 19.79 19.79 0 0 1 1.07 3.18 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.97 5.97l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>,
  users:  (c="#6B7280",s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  check:  (c="#fff",s=11)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  plus:   (c="#6B7280",s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x:      (c="#6B7280",s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chevD:  (c="#6B7280",s=13)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  scissors:(c="#6B7280",s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>,
  calendar:(c="#6B7280",s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  crown:  (c="#6B7280",s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><line x1="5" y1="20" x2="19" y2="20"/></svg>,
  user:   (c="#6B7280",s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  thumbup:(c="#6B7280",s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>,
  wifi:   (c="#10B981",s=10)=><svg width={s} height={s} viewBox="0 0 24 24" fill={c}><circle cx="12" cy="12" r="4"/></svg>,
};

/* ── DATA ────────────────────────────────────────── */
const SALON = {
  name:"Elite Cuts & Spa",
  address:"123 Main Street, Shivajinagar, Pune, MH 411005",
  phone:"+91 98765 43210",
  rating:4.9, reviews:1245,
  queue:4, waitMin:18,
  open:true, closeTime:"9:00 PM",
  about:"Elite Cuts & Spa is Pune's premier grooming destination. We combine traditional barbering with modern luxury — delivering precision haircuts, beard artistry, skin treatments and full grooming experiences by a team of certified master stylists.",
  images:[
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=500&fit=crop&auto=format&q=80&sat=-10",
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=500&fit=crop&auto=format&q=80",
  ],
};

const QUEUE_HISTORY = [
  {time:"09:00",count:2},{time:"10:00",count:5},{time:"11:00",count:8},
  {time:"12:00",count:6},{time:"13:00",count:9},{time:"14:00",count:7},
  {time:"15:00",count:4},{time:"16:00",count:6},{time:"Now",count:4},
];

const BARBERS = [
  {id:1,name:"Rahul Sharma",  role:"Senior Stylist",   spec:"Haircut & Fade",   exp:"5 yrs",rating:4.9,served:142,status:"available",freeIn:0,  photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80"},
  {id:2,name:"Amit Patil",    role:"Beard Specialist", spec:"Beard & Shave",    exp:"3 yrs",rating:4.7,served:98, status:"busy",     freeIn:12, photo:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format&q=80"},
  {id:3,name:"Vikram Kadam",  role:"Colour Expert",    spec:"Hair Colour",      exp:"7 yrs",rating:4.8,served:211,status:"break",    freeIn:20, photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format&q=80"},
  {id:4,name:"Sunil More",    role:"Grooming Expert",  spec:"Pedicure & Facial",exp:"4 yrs",rating:4.5,served:76, status:"available",freeIn:0,  photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=80"},
];

const STATUS_CFG = {
  available:{label:"Available", bg:"#ECFDF5",color:"#065F46",border:"#A7F3D0",dot:"#10B981"},
  busy:     {label:"Busy",      bg:"#FFF7ED",color:"#92400E",border:"#FCD34D",dot:"#F59E0B"},
  break:    {label:"On Break",  bg:"#F3F4F6",color:"#4B5563",border:"#D1D5DB",dot:"#9CA3AF"},
};

const SERVICES = {
  HAIR:[
    {id:"h1",name:"Classic Haircut",       price:250,dur:20,desc:"Precision cut with wash & blow-dry",    addons:[{id:"a1",name:"Scalp Massage",price:100},{id:"a2",name:"Hot Towel",price:60}]},
    {id:"h2",name:"Signature Fade",        price:450,dur:45,desc:"Skin fade with scissor finish on top",  addons:[{id:"a3",name:"Beard Line Up",price:80}]},
    {id:"h3",name:"Royal Hair Colour",     price:1800,dur:90,desc:"Premium ammonia-free colour treatment",addons:[]},
    {id:"h4",name:"Deep Conditioning",     price:600,dur:40,desc:"Intensive keratin moisture treatment",  addons:[{id:"a4",name:"Scalp Serum",price:150}]},
  ],
  NAILS:[
    {id:"n1",name:"Classic Manicure",      price:350,dur:35,desc:"Nail shaping, cuticle care & polish",   addons:[{id:"a5",name:"Nail Art",price:150}]},
    {id:"n2",name:"Gel Pedicure",          price:600,dur:50,desc:"Long-lasting gel finish with massage",   addons:[]},
    {id:"n3",name:"Nail Extensions",       price:1200,dur:80,desc:"Premium acrylic nail extensions",      addons:[{id:"a6",name:"3D Art",price:250}]},
  ],
  SKIN:[
    {id:"s1",name:"Hydra Facial",          price:1500,dur:60,desc:"Deep cleansing hydration facial",      addons:[{id:"a7",name:"Eye Mask",price:200}]},
    {id:"s2",name:"Gold Facial",           price:2000,dur:75,desc:"24K gold luxury facial treatment",     addons:[]},
    {id:"s3",name:"Beard Spa",             price:500,dur:30,desc:"Hot oil beard treatment & styling",     addons:[{id:"a8",name:"Face Mask",price:150}]},
  ],
  COMBOS:[
    {id:"c1",name:"Groom Package",         price:1200,dur:90,desc:"Haircut + beard trim + facial",        addons:[]},
    {id:"c2",name:"Weekend Special",       price:1800,dur:120,desc:"Hair + skin + relaxation combo",      addons:[{id:"a9",name:"Head Massage",price:200}]},
    {id:"c3",name:"Signature Full Day",    price:4500,dur:240,desc:"Complete top-to-bottom grooming day", addons:[]},
  ],
};

const REVIEWS = [
  {id:1,name:"Rahul Mehta",   avatar:"RM",rating:5,date:"2 days ago",  text:"Absolutely the best grooming experience in Pune. Rahul bhai's fade is flawless — clean, sharp and exactly what I wanted. The ambiance is top-notch too.",     helpful:24},
  {id:2,name:"Priya Singh",   avatar:"PS",rating:4,date:"1 week ago",  text:"Beautiful salon with very professional staff. Had the hydra facial and it left my skin glowing. Tiny wait time but absolutely worth every minute.",              helpful:18},
  {id:3,name:"Amit Kulkarni", avatar:"AK",rating:5,date:"2 weeks ago", text:"Been a loyal customer for 2 years now. Never once disappointed. The combo package is incredible value — haircut, beard and facial all in one go!",               helpful:31},
  {id:4,name:"Sneha Joshi",   avatar:"SJ",rating:5,date:"3 weeks ago", text:"The gel pedicure is divine. Priya is so skilled and the hot stone massage they include is pure bliss. Already booked my next appointment.",                       helpful:15},
  {id:5,name:"Vikram Desai",  avatar:"VD",rating:4,date:"1 month ago", text:"Great service, great staff. The queue system is very smooth — I knew exactly how long to wait. Minor suggestion: extend the weekend hours.",                       helpful:9},
];

/* ── COLORS ──────────────────────────────────────── */
const W   = "#FFFFFF";
const BG  = "#F9F7F4";
const BG2 = "#F3F0EB";
const INK = "#1C1410";
const MUT = "#7C6E60";
const BOR = "#E8E0D6";
const BOR2= "#F0EAE2";
const GLD = "#C9882A";
const GLD2= "#E8A840";
const TEL = "#0D7377";

/* ════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════ */
export default function SalonDetailPage() {
  const [svcTab,    setSvcTab]    = useState("HAIR");
  const [selection, setSelection] = useState({});
  const [selBarber, setSelBarber] = useState(null);
  const [queue,     setQueue]     = useState(SALON.queue);
  const [wait,      setWait]      = useState(SALON.waitMin);
  const [addonOpen, setAddonOpen] = useState({});
  const [booked,    setBooked]    = useState(false);
  const [modal,     setModal]     = useState(false);
  const [bookType,  setBookType]  = useState("queue");
  const [pageTab,   setPageTab]   = useState("overview");
  const [reviewFilter,setReviewFilter] = useState(0);
  const [helpful,   setHelpful]   = useState({});
  const [mounted,   setMounted]   = useState(false);
  const { addNotification } = useNotification();

  useEffect(()=>{setTimeout(()=>setMounted(true),80);},[]);
  useEffect(()=>{
    const t = setInterval(()=>{
      setQueue(q=>Math.max(1,q+(Math.random()>.6?1:-1)));
      setWait(w=>Math.max(5,Math.round(w+(Math.random()>.6?2:-1))));
    },7000);
    return ()=>clearInterval(t);
  },[]);

  const toggleSvc = svc => setSelection(p=>{
    const n={...p};
    n[svc.id]?delete n[svc.id]:n[svc.id]={service:svc,addons:[]};
    return n;
  });
  const toggleAddon = (svcId,addon) => setSelection(p=>{
    if(!p[svcId])return p;
    const has=p[svcId].addons.find(a=>a.id===addon.id);
    return{...p,[svcId]:{...p[svcId],addons:has?p[svcId].addons.filter(a=>a.id!==addon.id):[...p[svcId].addons,addon]}};
  });

  const totalPrice = Object.values(selection).reduce((s,{service,addons})=>s+service.price+addons.reduce((a,x)=>a+x.price,0),0);
  const totalDur   = Object.values(selection).reduce((s,{service})=>s+service.dur,0);
  const cnt        = Object.keys(selection).length;
  const canBook    = cnt>0;

  const confirm = ()=>{
    setBooked(true);
    addNotification({
      type: "booking",
      title: "Booking Confirmed successfully",
      message: `Your appointment at ${SALON.name} is confirmed. You are at position #${queue+1}.`
    });
    setTimeout(()=>{setBooked(false);setSelection({});setModal(false);},3000);
  };

  const rv = (d=0)=>({
    opacity:mounted?1:0,
    transform:mounted?"none":"translateY(14px)",
    transition:`opacity .5s ease ${d*.06}s,transform .5s ease ${d*.06}s`,
  });

  const Stars = ({n,s=12})=><span style={{display:"inline-flex",gap:2}}>{[1,2,3,4,5].map(i=><span key={i}>{Ic.star(i<=Math.round(n),s)}</span>)}</span>;

  const filteredReviews = reviewFilter===0 ? REVIEWS : REVIEWS.filter(r=>r.rating===reviewFilter);
  const ratingDist = [5,4,3,2,1].map(r=>({r,count:REVIEWS.filter(v=>v.rating===r).length,pct:Math.round(REVIEWS.filter(v=>v.rating===r).length/REVIEWS.length*100)}));

  return (
    <div style={{background:BG,minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:INK}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes tick{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.6)}}
        .nb{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif}
        .hbtn:hover{filter:brightness(1.06);transform:translateY(-1px)}
        .hrow:hover{background:#F5F0E8!important}
        .hcard:hover{box-shadow:0 8px 28px rgba(0,0,0,.1)!important;transform:translateY(-2px)}
        .hsvc:hover{border-color:${GLD}!important;background:#FFFBF5!important}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#DDD5C8;border-radius:3px}
      `}</style>

      {/* ══════ NAVBAR ══════ */}
      <nav style={{background:W,borderBottom:`1px solid ${BOR}`,height:60,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 40px",position:"sticky",top:0,zIndex:300,boxShadow:"0 1px 12px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",gap:32}}>
          {["Explore","Bookings","My Profile"].map(n=>(
            <button key={n} className="nb" style={{fontSize:13,fontWeight:600,color:MUT,transition:"color .15s"}}
              onMouseEnter={e=>e.target.style.color=INK} onMouseLeave={e=>e.target.style.color=MUT}>{n}</button>
          ))}
        </div>
        <span style={{fontSize:19,fontWeight:800,color:INK,letterSpacing:3,fontFamily:"'Cormorant Garamond',serif"}}>ELITE CUTS</span>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:34,height:34,borderRadius:"50%",border:`1.5px solid ${BOR}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:BG}}>
            {Ic.user(MUT,16)}
          </div>
          <button className="nb hbtn" style={{background:INK,color:W,padding:"7px 18px",borderRadius:8,fontWeight:700,fontSize:12,letterSpacing:.5,transition:"all .2s"}}>LOGOUT</button>
        </div>
      </nav>

      {/* ══════ HERO PHOTO GRID ══════ */}
      <div style={{...rv(0),display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",height:440,gap:3,background:BOR}}>
        {SALON.images.map((src,i)=>(
          <div key={i} style={{overflow:"hidden",position:"relative",background:"#e8e0d8"}}>
            <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",transition:"transform .6s ease",filter:"brightness(1.02) saturate(.95)"}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              onError={e=>{e.target.style.background="#E5DDD4";e.target.style.display="none";}}/>
            {/* First image overlay */}
            {i===0&&<div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(20,16,12,.45) 0%,transparent 55%)"}}/>}
          </div>
        ))}
      </div>

      {/* ══════ SALON IDENTITY BAR ══════ */}
      <div style={{...rv(1),background:W,borderBottom:`1px solid ${BOR}`,padding:"20px 40px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:20}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <h1 style={{fontSize:28,fontWeight:900,color:INK,fontFamily:"'Cormorant Garamond',serif",letterSpacing:-.5}}>{SALON.name}</h1>
              <span style={{display:"flex",alignItems:"center",gap:5,background:SALON.open?"#ECFDF5":"#FEF2F2",color:SALON.open?"#065F46":"#991B1B",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,border:`1px solid ${SALON.open?"#A7F3D0":"#FECACA"}`}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:SALON.open?"#10B981":"#EF4444",display:"inline-block",animation:"blink 2s infinite"}}/>
                {SALON.open?`Open · Closes ${SALON.closeTime}`:"Closed"}
              </span>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:16,marginBottom:10}}>
              <span style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:MUT}}>{Ic.pin(MUT,13)}{SALON.address}</span>
              <span style={{display:"flex",alignItems:"center",gap:5,fontSize:13,color:MUT}}>{Ic.phone(MUT,13)}{SALON.phone}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Stars n={SALON.rating} s={15}/>
              <span style={{fontSize:16,fontWeight:800,color:INK}}>{SALON.rating}</span>
              <button className="nb" onClick={()=>setPageTab("reviews")} style={{fontSize:13,color:GLD,fontWeight:600,textDecoration:"underline",textUnderlineOffset:3}}>({SALON.reviews.toLocaleString()} reviews)</button>
              <span style={{color:BOR}}>·</span>
              <span style={{fontSize:13,color:MUT}}>Starting from <b style={{color:INK}}>₹250</b></span>
            </div>
          </div>
          <button className="nb hbtn" onClick={()=>setModal(true)}
            style={{background:TEL,color:W,padding:"14px 28px",borderRadius:12,fontWeight:800,fontSize:14,letterSpacing:.5,transition:"all .2s",boxShadow:`0 6px 20px rgba(13,115,119,.3)`,whiteSpace:"nowrap",flexShrink:0}}>
            JOIN LIVE QUEUE / BOOK
          </button>
        </div>
      </div>

      {/* ══════ LIVE QUEUE STATUS BAND ══════ */}
      <div style={{...rv(2),background:"linear-gradient(135deg,#F0FDF4,#ECFDF5)",borderBottom:`1px solid #A7F3D0`,padding:"0 40px"}}>
        <div style={{display:"flex",alignItems:"stretch",height:78,gap:0}}>

          {/* Live indicator */}
          <div style={{display:"flex",alignItems:"center",gap:12,paddingRight:32,marginRight:32,borderRight:`1px solid #A7F3D0`}}>
            <div style={{width:36,height:36,borderRadius:10,background:"#D1FAE5",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {Ic.wifi("#10B981",10)}
            </div>
            <div>
              <div style={{fontSize:9,color:"#065F46",fontWeight:700,letterSpacing:1.5}}>LIVE QUEUE STATUS</div>
              <div style={{fontSize:11,color:"#047857",fontWeight:600,marginTop:1}}>Updates every 7 sec</div>
            </div>
          </div>

          {/* Current Queue */}
          <div style={{display:"flex",alignItems:"center",gap:12,paddingRight:32,marginRight:32,borderRight:`1px solid #A7F3D0`}}>
            <div>
              <div style={{fontSize:9,color:MUT,fontWeight:700,letterSpacing:1.5,marginBottom:2}}>CURRENT QUEUE</div>
              <div style={{display:"flex",alignItems:"baseline",gap:5}}>
                <span style={{fontSize:28,fontWeight:900,color:INK,lineHeight:1}}>{queue}</span>
                <span style={{fontSize:13,color:MUT,fontWeight:500}}>people</span>
              </div>
            </div>
            {/* Mini bar chart */}
            <div style={{display:"flex",alignItems:"flex-end",gap:3,height:32}}>
              {QUEUE_HISTORY.map((q,i)=>(
                <div key={i} style={{width:6,background:i===QUEUE_HISTORY.length-1?"#10B981":"#A7F3D0",borderRadius:"2px 2px 0 0",height:`${(q.count/10)*100}%`,transition:"height .3s"}}/>
              ))}
            </div>
          </div>

          {/* Estimated Wait */}
          <div style={{display:"flex",alignItems:"center",gap:12,paddingRight:32,marginRight:32,borderRight:`1px solid #A7F3D0`}}>
            <div>
              <div style={{fontSize:9,color:MUT,fontWeight:700,letterSpacing:1.5,marginBottom:2}}>ESTIMATED WAIT</div>
              <div style={{display:"flex",alignItems:"baseline",gap:5}}>
                <span style={{fontSize:28,fontWeight:900,color:INK,lineHeight:1}}>~{wait}</span>
                <span style={{fontSize:13,color:MUT,fontWeight:500}}>minutes</span>
              </div>
            </div>
          </div>

          {/* Active barbers */}
          <div style={{display:"flex",alignItems:"center",gap:12,paddingRight:32,marginRight:32,borderRight:`1px solid #A7F3D0`}}>
            <div>
              <div style={{fontSize:9,color:MUT,fontWeight:700,letterSpacing:1.5,marginBottom:2}}>ACTIVE BARBERS</div>
              <div style={{display:"flex",alignItems:"baseline",gap:5}}>
                <span style={{fontSize:28,fontWeight:900,color:INK,lineHeight:1}}>{BARBERS.filter(b=>b.status!=="break").length}</span>
                <span style={{fontSize:13,color:MUT}}>of {BARBERS.length}</span>
              </div>
            </div>
          </div>

          {/* Queue position viz */}
          <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:MUT,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>QUEUE POSITION PREVIEW</div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {Array.from({length:Math.min(queue+1,8)}).map((_,i)=>(
                  <div key={i} style={{width:28,height:28,borderRadius:"50%",background:i<queue?"#A7F3D0":"#10B981",border:`2px solid ${i<queue?"#6EE7B7":"#059669"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:i<queue?"#065F46":"#fff",flexShrink:0}}>
                    {i===queue?"YOU":i+1}
                  </div>
                ))}
                {queue>7&&<span style={{fontSize:11,color:MUT,fontWeight:600}}>+{queue-7} more</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ PAGE TABS ══════ */}
      <div style={{...rv(3),background:W,borderBottom:`1px solid ${BOR}`,padding:"0 40px",display:"flex",gap:0,position:"sticky",top:60,zIndex:200}}>
        {[
          {key:"overview",  label:"Overview"},
          {key:"barbers",   label:"Barbers"},
          {key:"services",  label:"Services & Pricing"},
          {key:"reviews",   label:`Reviews (${SALON.reviews.toLocaleString()})`},
        ].map(t=>(
          <button key={t.key} className="nb" onClick={()=>setPageTab(t.key)}
            style={{padding:"14px 22px",fontSize:13,fontWeight:700,color:pageTab===t.key?INK:MUT,borderBottom:pageTab===t.key?`2.5px solid ${INK}`:"2.5px solid transparent",letterSpacing:.3,transition:"all .18s",marginBottom:-1}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════ CONTENT + BOOKING TRAY ══════ */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",maxWidth:1400,margin:"0 auto"}}>

        {/* ── MAIN CONTENT ── */}
        <div style={{padding:"28px 32px 120px"}}>

          {/* ─── OVERVIEW TAB ─── */}
          {pageTab==="overview"&&(
            <div style={{animation:"fadeUp .35s ease"}}>
              {/* About */}
              <section style={{marginBottom:32}}>
                <h2 style={{fontSize:18,fontWeight:800,color:INK,marginBottom:12}}>About the Salon</h2>
                <p style={{fontSize:14,color:MUT,lineHeight:1.85}}>{SALON.about}</p>
              </section>

              {/* Stats row */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:32}}>
                {[
                  {val:"2,400+",label:"Happy Clients",bg:"#FFF7ED",color:"#92400E"},
                  {val:"6 yrs",  label:"In Business",  bg:"#EFF6FF",color:"#1D4ED8"},
                  {val:"4",      label:"Expert Barbers",bg:"#F0FDF4",color:"#065F46"},
                  {val:"28 min", label:"Avg. Service",  bg:"#FDF4FF",color:"#6B21A8"},
                ].map(({val,label,bg,color},i)=>(
                  <div key={i} style={{background:bg,borderRadius:14,padding:"18px 20px",border:`1px solid ${BOR2}`}}>
                    <div style={{fontSize:26,fontWeight:800,color,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{val}</div>
                    <div style={{fontSize:11,color:MUT,fontWeight:600,letterSpacing:.5}}>{label.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              {/* Top rated barbers preview */}
              <h2 style={{fontSize:18,fontWeight:800,color:INK,marginBottom:14}}>Our Team</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:28}}>
                {BARBERS.slice(0,2).map(b=>{
                  const st=STATUS_CFG[b.status];
                  return (
                    <div key={b.id} className="hcard" style={{background:W,borderRadius:14,padding:"16px",border:`1px solid ${BOR}`,display:"flex",gap:14,transition:"all .2s",boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
                      <div style={{width:60,height:60,borderRadius:14,overflow:"hidden",flexShrink:0,border:`1.5px solid ${BOR}`}}>
                        <img src={b.photo} alt={b.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>e.target.style.display="none"}/>
                      </div>
                      <div>
                        <div style={{fontSize:15,fontWeight:700,color:INK,marginBottom:2}}>{b.name}</div>
                        <div style={{fontSize:11,color:MUT,marginBottom:6}}>{b.role} · {b.exp}</div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <Stars n={b.rating} s={11}/>
                          <span style={{fontSize:12,fontWeight:700,color:INK}}>{b.rating}</span>
                          <span style={{display:"inline-flex",alignItems:"center",gap:3,background:st.bg,color:st.color,padding:"1px 7px",borderRadius:10,fontSize:9,fontWeight:700,border:`1px solid ${st.border}`}}>
                            <span style={{width:4,height:4,borderRadius:"50%",background:st.dot,display:"inline-block"}}/>
                            {st.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="nb hbtn" onClick={()=>setPageTab("barbers")} style={{color:GLD,fontWeight:700,fontSize:13,textDecoration:"underline",textUnderlineOffset:3,transition:"all .2s"}}>View all barbers →</button>

              {/* Quick services preview */}
              <h2 style={{fontSize:18,fontWeight:800,color:INK,margin:"28px 0 14px"}}>Popular Services</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {SERVICES.HAIR.slice(0,3).map(s=>(
                  <div key={s.id} className="hcard" style={{background:W,borderRadius:12,padding:"14px 16px",border:`1px solid ${BOR}`,transition:"all .2s",boxShadow:"0 1px 6px rgba(0,0,0,.04)"}}>
                    <div style={{fontSize:13,fontWeight:700,color:INK,marginBottom:4}}>{s.name}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:15,fontWeight:800,color:INK}}>₹{s.price}</span>
                      <span style={{fontSize:11,color:MUT,display:"flex",alignItems:"center",gap:3}}>{Ic.clock(MUT,11)}{s.dur}m</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="nb hbtn" onClick={()=>setPageTab("services")} style={{color:GLD,fontWeight:700,fontSize:13,textDecoration:"underline",textUnderlineOffset:3,marginTop:12,display:"block",transition:"all .2s"}}>View full services menu →</button>
            </div>
          )}

          {/* ─── BARBERS TAB ─── */}
          {pageTab==="barbers"&&(
            <div style={{animation:"fadeUp .35s ease"}}>
              <h2 style={{fontSize:18,fontWeight:800,color:INK,marginBottom:18}}>Our Expert Team</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
                {BARBERS.map(b=>{
                  const st=STATUS_CFG[b.status];
                  const sel=selBarber===b.id;
                  const dim=b.status==="break";
                  return (
                    <div key={b.id} className="hcard"
                      onClick={()=>!dim&&setSelBarber(b.id===selBarber?null:b.id)}
                      style={{background:W,borderRadius:16,overflow:"hidden",border:`1.5px solid ${sel?GLD:BOR}`,cursor:dim?"default":"pointer",opacity:dim?.58:1,transition:"all .22s",boxShadow:sel?`0 0 0 2px ${GLD}44,0 8px 24px rgba(201,136,42,.12)`:"0 2px 10px rgba(0,0,0,.05)"}}>
                      {/* Photo strip */}
                      <div style={{height:160,overflow:"hidden",position:"relative",background:"#E8E0D8"}}>
                        <img src={b.photo} alt={b.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",filter:dim?"grayscale(.5)":"none",transition:"transform .4s ease"}}
                          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
                          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                          onError={e=>e.target.style.display="none"}/>
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(255,255,255,.9) 0%,transparent 50%)"}}/>
                        <span style={{position:"absolute",top:12,right:12,display:"inline-flex",alignItems:"center",gap:4,background:st.bg,color:st.color,padding:"4px 10px",borderRadius:20,fontSize:10,fontWeight:800,border:`1px solid ${st.border}`,boxShadow:"0 2px 8px rgba(0,0,0,.1)"}}>
                          <span style={{width:5,height:5,borderRadius:"50%",background:st.dot,display:"inline-block",animation:b.status==="available"?"blink 2s infinite":"none"}}/>
                          {st.label}{b.status==="busy"&&` · ${b.freeIn}m`}
                        </span>
                      </div>
                      {/* Info */}
                      <div style={{padding:"14px 16px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                          <div>
                            <div style={{fontSize:16,fontWeight:800,color:INK,marginBottom:1}}>{b.name}</div>
                            <div style={{fontSize:11,color:MUT}}>{b.role}</div>
                          </div>
                          {sel&&<span style={{background:GLD,color:W,padding:"3px 9px",borderRadius:8,fontSize:10,fontWeight:800}}>Selected</span>}
                        </div>
                        <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                          <span style={{background:BG2,color:MUT,padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600}}>{b.spec}</span>
                          <span style={{background:BG2,color:MUT,padding:"2px 8px",borderRadius:5,fontSize:10,fontWeight:600}}>{b.exp} exp</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <Stars n={b.rating} s={12}/>
                            <span style={{fontSize:12,fontWeight:700,color:INK}}>{b.rating}</span>
                            <span style={{fontSize:11,color:MUT}}>({b.served} served)</span>
                          </div>
                          <div style={{fontSize:11,color:MUT,display:"flex",alignItems:"center",gap:4}}>
                            {Ic.clock(MUT,11)}
                            {b.status==="available"?"Free now":b.status==="busy"?`Free in ${b.freeIn}m`:`Back in ${b.freeIn}m`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── SERVICES TAB ─── */}
          {pageTab==="services"&&(
            <div style={{animation:"fadeUp .35s ease"}}>
              <h2 style={{fontSize:18,fontWeight:800,color:INK,marginBottom:18}}>Services & Pricing</h2>
              {/* Tabs */}
              <div style={{display:"flex",borderBottom:`2px solid ${BOR}`,marginBottom:22,gap:0}}>
                {Object.keys(SERVICES).map(t=>(
                  <button key={t} className="nb" onClick={()=>setSvcTab(t)}
                    style={{padding:"10px 22px",fontSize:12,fontWeight:700,color:svcTab===t?INK:MUT,borderBottom:svcTab===t?`2.5px solid ${INK}`:"2.5px solid transparent",letterSpacing:.8,marginBottom:-2,transition:"all .18s"}}>
                    {t}
                  </button>
                ))}
              </div>
              {/* Cards */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {SERVICES[svcTab].map(svc=>{
                  const sel=!!selection[svc.id];
                  const open=addonOpen[svc.id];
                  const selA=selection[svc.id]?.addons||[];
                  return (
                    <div key={svc.id} className="hsvc"
                      style={{background:sel?"#FFFBF0":W,border:`1.5px solid ${sel?GLD:BOR}`,borderRadius:14,overflow:"hidden",transition:"all .18s",boxShadow:sel?`0 4px 16px rgba(201,136,42,.1)`:"0 1px 6px rgba(0,0,0,.04)"}}>
                      <div style={{padding:"16px 20px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:16}} onClick={()=>toggleSvc(svc)}>
                        {/* Checkbox */}
                        <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${sel?GLD:BOR}`,background:sel?GLD:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .15s"}}>
                          {sel&&Ic.check("#fff",11)}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                            <div>
                              <div style={{fontSize:14,fontWeight:700,color:sel?GLD:INK,marginBottom:3}}>{svc.name}</div>
                              <div style={{fontSize:12,color:MUT,lineHeight:1.5}}>{svc.desc}</div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0,paddingLeft:12}}>
                              <div style={{fontSize:17,fontWeight:900,color:INK}}>₹{svc.price.toLocaleString()}</div>
                              <div style={{fontSize:11,color:MUT,display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end",marginTop:2}}>
                                {Ic.clock(MUT,11)}{svc.dur} min
                              </div>
                            </div>
                          </div>
                          {svc.addons.length>0&&(
                            <button className="nb" onClick={e=>{e.stopPropagation();setAddonOpen(p=>({...p,[svc.id]:!p[svc.id]}));}}
                              style={{fontSize:11,color:GLD,fontWeight:700,display:"flex",alignItems:"center",gap:3,marginTop:6}}>
                              {Ic.plus(GLD,11)} Add-ons available {Ic.chevD(GLD,12)}
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Addons */}
                      {open&&svc.addons.length>0&&(
                        <div style={{borderTop:`1px solid ${BOR2}`,background:"#FAF7F1",padding:"12px 20px 12px 58px",display:"flex",flexDirection:"column",gap:10,animation:"fadeUp .2s ease"}}>
                          {svc.addons.map(addon=>{
                            const has=selA.find(a=>a.id===addon.id);
                            return (
                              <div key={addon.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:sel?"pointer":"default",opacity:sel?1:.5}}
                                onClick={()=>sel&&toggleAddon(svc.id,addon)}>
                                <span style={{fontSize:13,color:INK}}>{addon.name}</span>
                                <div style={{display:"flex",alignItems:"center",gap:8}}>
                                  <span style={{fontSize:12,color:MUT,fontWeight:600}}>+ ₹{addon.price}</span>
                                  <div style={{width:22,height:22,borderRadius:6,border:`1.5px solid ${has?GLD:BOR}`,background:has?GLD:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
                                    {has&&Ic.check("#fff",10)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {!sel&&<p style={{fontSize:11,color:MUT,fontStyle:"italic"}}>Select service first to add extras</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── REVIEWS TAB ─── */}
          {pageTab==="reviews"&&(
            <div style={{animation:"fadeUp .35s ease"}}>
              <h2 style={{fontSize:18,fontWeight:800,color:INK,marginBottom:20}}>Customer Reviews</h2>

              {/* Rating summary */}
              <div style={{background:W,borderRadius:18,padding:"24px 28px",border:`1px solid ${BOR}`,marginBottom:24,display:"flex",gap:32,alignItems:"flex-start",boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
                <div style={{textAlign:"center",minWidth:100}}>
                  <div style={{fontSize:56,fontWeight:900,color:INK,fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>{SALON.rating}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:3,margin:"8px 0 4px"}}><Stars n={SALON.rating} s={18}/></div>
                  <div style={{fontSize:12,color:MUT}}>{SALON.reviews.toLocaleString()} reviews</div>
                </div>
                <div style={{flex:1}}>
                  {ratingDist.map(({r,count,pct})=>(
                    <div key={r} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,cursor:"pointer"}} onClick={()=>setReviewFilter(reviewFilter===r?0:r)}>
                      <span style={{fontSize:12,color:MUT,width:40,flexShrink:0}}>{r} star</span>
                      <div style={{flex:1,height:8,background:BG2,borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:reviewFilter===r?GLD:"#F59E0B",borderRadius:4,transition:"width .5s ease"}}/>
                      </div>
                      <span style={{fontSize:11,color:MUT,width:28,textAlign:"right"}}>{count}</span>
                    </div>
                  ))}
                </div>
                {/* Summary chips */}
                <div style={{display:"flex",flexDirection:"column",gap:8,minWidth:130}}>
                  {[{label:"Clean & Hygienic",pct:96},{label:"Friendly Staff",pct:98},{label:"Value for Money",pct:91},{label:"On Time",pct:88}].map(({label,pct})=>(
                    <div key={label} style={{background:BG2,borderRadius:8,padding:"6px 10px"}}>
                      <div style={{fontSize:10,color:MUT,fontWeight:600,marginBottom:3}}>{label}</div>
                      <div style={{height:4,background:BOR,borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:"#10B981",borderRadius:2}}/>
                      </div>
                      <div style={{fontSize:10,color:"#065F46",fontWeight:700,marginTop:2}}>{pct}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter buttons */}
              <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
                <button className="nb" onClick={()=>setReviewFilter(0)}
                  style={{padding:"6px 14px",borderRadius:20,background:reviewFilter===0?INK:W,color:reviewFilter===0?W:MUT,border:`1px solid ${reviewFilter===0?INK:BOR}`,fontSize:12,fontWeight:600,transition:"all .15s"}}>All</button>
                {[5,4,3,2,1].map(r=>(
                  <button key={r} className="nb" onClick={()=>setReviewFilter(reviewFilter===r?0:r)}
                    style={{padding:"6px 14px",borderRadius:20,background:reviewFilter===r?GLD:W,color:reviewFilter===r?W:MUT,border:`1px solid ${reviewFilter===r?GLD:BOR}`,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4,transition:"all .15s"}}>
                    {Ic.star(true,11)} {r}
                  </button>
                ))}
              </div>

              {/* Review cards */}
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {filteredReviews.map(rv=>(
                  <div key={rv.id} style={{background:W,borderRadius:16,padding:"20px 22px",border:`1px solid ${BOR}`,boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <div style={{display:"flex",gap:12,alignItems:"center"}}>
                        <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${GLD}33,${GLD}11)`,border:`1.5px solid ${GLD}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:GLD,flexShrink:0}}>{rv.avatar}</div>
                        <div>
                          <div style={{fontSize:14,fontWeight:700,color:INK,marginBottom:2}}>{rv.name}</div>
                          <div style={{fontSize:11,color:MUT}}>{rv.date}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:2}}><Stars n={rv.rating} s={13}/></div>
                    </div>
                    <p style={{fontSize:13,color:MUT,lineHeight:1.7,marginBottom:12}}>{rv.text}</p>
                    <button className="nb" onClick={()=>setHelpful(p=>({...p,[rv.id]:!p[rv.id]}))}
                      style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:helpful[rv.id]?GLD:MUT,fontWeight:600,transition:"color .15s"}}>
                      {Ic.thumbup(helpful[rv.id]?GLD:MUT,13)}
                      Helpful ({rv.helpful+(helpful[rv.id]?1:0)})
                    </button>
                  </div>
                ))}
                {filteredReviews.length===0&&<div style={{textAlign:"center",padding:"32px 0",color:MUT,fontSize:14}}>No reviews for this rating.</div>}
              </div>
            </div>
          )}
        </div>

        {/* ── BOOKING TRAY ── */}
        <div style={{background:W,borderLeft:`1px solid ${BOR}`,position:"sticky",top:108,height:"calc(100vh - 108px)",display:"flex",flexDirection:"column",overflowY:"auto"}}>
          <div style={{padding:"20px 22px 14px",borderBottom:`1px solid ${BOR}`}}>
            <div style={{fontSize:12,fontWeight:800,color:INK,letterSpacing:2,marginBottom:2}}>CURRENT SELECTION</div>
            <div style={{fontSize:11,color:MUT}}>Updates in real-time</div>
          </div>

          {/* Selected barber */}
          {selBarber&&(
            <div style={{padding:"12px 22px",borderBottom:`1px solid ${BOR2}`,background:"#FFFBF0"}}>
              <div style={{fontSize:10,color:MUT,fontWeight:700,letterSpacing:1,marginBottom:8}}>SELECTED BARBER</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:10,overflow:"hidden",flexShrink:0,border:`2px solid ${GLD}55`}}>
                  <img src={BARBERS.find(b=>b.id===selBarber)?.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:INK}}>{BARBERS.find(b=>b.id===selBarber)?.name}</div>
                  <div style={{fontSize:11,color:MUT}}>{BARBERS.find(b=>b.id===selBarber)?.spec}</div>
                </div>
                <button className="nb" onClick={()=>setSelBarber(null)} style={{color:MUT,padding:2}}>{Ic.x(MUT,13)}</button>
              </div>
            </div>
          )}

          {/* Selected services list */}
          <div style={{flex:1,padding:"16px 22px",overflowY:"auto"}}>
            {cnt===0?(
              <div style={{textAlign:"center",padding:"32px 0",color:MUT}}>
                <div style={{marginBottom:12,opacity:.35}}>{Ic.scissors("#9CA3AF",26)}</div>
                <div style={{fontSize:13,fontWeight:600,color:MUT}}>No services selected</div>
                <div style={{fontSize:11,color:MUT,marginTop:4}}>Go to Services tab to add</div>
                <button className="nb hbtn" onClick={()=>setPageTab("services")}
                  style={{marginTop:14,color:GLD,fontWeight:700,fontSize:12,textDecoration:"underline",textUnderlineOffset:3,transition:"all .2s"}}>
                  Browse Services →
                </button>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {Object.values(selection).map(({service,addons})=>(
                  <div key={service.id} style={{padding:"12px 14px",background:BG,borderRadius:10,border:`1px solid ${BOR2}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:addons.length?8:0}}>
                      <div style={{flex:1,paddingRight:8}}>
                        <div style={{fontSize:13,fontWeight:700,color:INK,marginBottom:2}}>{service.name}</div>
                        <div style={{fontSize:11,color:MUT,display:"flex",alignItems:"center",gap:4}}>{Ic.clock(MUT,10)}{service.dur} min</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontSize:14,fontWeight:800,color:INK}}>₹{service.price.toLocaleString()}</span>
                        <button className="nb" onClick={()=>toggleSvc(service)} style={{color:MUT,transition:"color .15s"}}
                          onMouseEnter={e=>e.target.style.color="#EF4444"} onMouseLeave={e=>e.target.style.color=MUT}>
                          {Ic.x(MUT,13)}
                        </button>
                      </div>
                    </div>
                    {addons.map(a=>(
                      <div key={a.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:MUT,paddingTop:5,borderTop:`1px solid ${BOR2}`,marginTop:5}}>
                        <span>+ {a.name}</span>
                        <span style={{fontWeight:600}}>₹{a.price}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals + Book button */}
          <div style={{padding:"16px 22px",borderTop:`1px solid ${BOR}`,background:W}}>
            {cnt>0&&(
              <>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:MUT,marginBottom:5}}>
                  <span>{cnt} service{cnt>1?"s":""} selected</span>
                  <span style={{fontWeight:600,color:INK}}>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:MUT,marginBottom:12}}>
                  <span>Total time</span>
                  <span style={{fontWeight:600,color:INK}}>{totalDur} min</span>
                </div>
                <div style={{background:INK,borderRadius:10,padding:"11px 16px",display:"flex",justifyContent:"space-between",marginBottom:14}}>
                  <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.6)"}}>TOTAL PRICE</span>
                  <span style={{fontSize:17,fontWeight:900,color:W}}>₹{totalPrice.toLocaleString()}</span>
                </div>
              </>
            )}
            <button className="nb hbtn" disabled={!canBook} onClick={confirm}
              style={{width:"100%",padding:"14px",borderRadius:11,background:canBook?TEL:BG2,color:canBook?W:MUT,fontWeight:800,fontSize:13,letterSpacing:.8,transition:"all .2s",boxShadow:canBook?`0 6px 18px rgba(13,115,119,.28)`:"none",cursor:canBook?"pointer":"not-allowed",marginBottom:8}}>
              {booked?"✓ BOOKING CONFIRMED!":"CONFIRM BOOKING"}
            </button>
            {!canBook&&<p style={{textAlign:"center",fontSize:11,color:MUT}}>Select a service to continue</p>}
          </div>
        </div>
      </div>

      {/* ══════ BOOKING MODAL ══════ */}
      {modal&&(
        <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setModal(false)}>
          <div style={{position:"absolute",inset:0,background:"rgba(28,20,16,.5)",backdropFilter:"blur(4px)"}}/>
          <div style={{position:"relative",background:W,borderRadius:24,padding:"36px 38px",maxWidth:460,width:"90%",boxShadow:"0 24px 80px rgba(0,0,0,.2)",animation:"fadeUp .3s ease"}} onClick={e=>e.stopPropagation()}>
            <button className="nb" onClick={()=>setModal(false)} style={{position:"absolute",top:18,right:18,color:MUT}}>{Ic.x(MUT,16)}</button>

            <div style={{fontSize:10,fontWeight:700,color:GLD,letterSpacing:2,marginBottom:6}}>QUICK BOOK</div>
            <h3 style={{fontSize:24,fontWeight:800,color:INK,fontFamily:"'Cormorant Garamond',serif",marginBottom:18}}>Book Your Session</h3>

            {/* Live queue info */}
            <div style={{background:BG,borderRadius:14,padding:"16px 18px",marginBottom:18,border:`1px solid ${BOR}`}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:8}}>
                <span style={{color:MUT}}>Current Queue</span><b style={{color:INK}}>{queue} people waiting</b>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                <span style={{color:MUT}}>Estimated Wait</span><b style={{color:INK}}>~{wait} minutes</b>
              </div>
            </div>

            {/* Book type toggle */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
              {[
                {key:"queue",   icon:Ic.users(W,15),   label:"Instant Queue"},
                {key:"slot",    icon:Ic.calendar(W,15), label:"Schedule Slot"},
                {key:"priority",icon:Ic.crown(W,15),    label:"Priority"},
              ].map(t=>(
                <button key={t.key} className="nb" onClick={()=>setBookType(t.key)}
                  style={{padding:"10px 8px",borderRadius:10,background:bookType===t.key?INK:BG,border:`1px solid ${bookType===t.key?INK:BOR}`,color:bookType===t.key?W:MUT,fontSize:11,fontWeight:700,display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .18s"}}>
                  {t.icon}<span>{t.label}</span>
                </button>
              ))}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button className="nb hbtn" onClick={confirm}
                style={{padding:"14px",borderRadius:12,background:TEL,color:W,fontWeight:800,fontSize:14,letterSpacing:.5,boxShadow:`0 6px 20px rgba(13,115,119,.28)`,transition:"all .2s"}}>
                {booked?"✓ Confirmed!":"JOIN NOW"}
              </button>
              <button className="nb hbtn" onClick={()=>setModal(false)}
                style={{padding:"14px",borderRadius:12,background:"transparent",color:INK,fontWeight:700,fontSize:13,border:`1.5px solid ${BOR}`,transition:"all .2s"}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ SUCCESS TOAST ══════ */}
      {booked&&(
        <div style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",background:INK,color:W,padding:"14px 26px",borderRadius:14,fontWeight:700,fontSize:13,letterSpacing:.5,boxShadow:"0 8px 28px rgba(0,0,0,.25)",zIndex:400,animation:"fadeUp .3s ease",display:"flex",alignItems:"center",gap:10,whiteSpace:"nowrap"}}>
          <span style={{width:22,height:22,borderRadius:"50%",background:"#10B981",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{Ic.check("#fff",11)}</span>
          Booking Confirmed! Queue position #{queue+1}
        </div>
      )}
    </div>
  );
}