export const AVG_CUT = 18;

export const SERVICES = [
  { id: "haircut", label: "Haircut",     mins: 20, price: 25 },
  { id: "beard",   label: "Beard Trim",  mins: 15, price: 15 },
  { id: "both",    label: "Cut + Beard", mins: 35, price: 35 },
  { id: "kids",    label: "Kids Cut",    mins: 15, price: 18 },
  { id: "fade",    label: "Fade",        mins: 25, price: 30 },
];

export const BARBERS = [
  { id: 1, name: "Raj", color: "#f59e0b"},
  { id: 2, name: "Kamlesh",  color: "#ec4899"},
  { id: 3, name: "Rakesh", color: "#22c55e"},
];


export const TIME_SLOTS = [
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM",
];



let uid = 100;
export const nextId = () => `c${++uid}`;

export const initQueue = () => [
  { id: nextId(), name: "Mayur K.",  phone: "955-010-5897", service: "haircut", barber: 1, position: 1, joinedAt: Date.now() - 240000, source: "walk-in", status: "waiting" },
  { id: nextId(), name: "Sam K.",   phone: "973-589-7907", service: "fade",    barber: 2, position: 2, joinedAt: Date.now() - 120000, source: "walk-in", status: "waiting" },
  { id: nextId(), name: "Pratik D.", phone: "952-637-7432", service: "both",    barber: 3, position: 3, joinedAt: Date.now() - 60000,  source: "booked",  status: "waiting" },
];

export const initBookings = () => [
  { id: nextId(), name: "Tanish S.",  phone: "989-452-7898", service: "haircut", barber: 1, slot: "2:00 PM", date: "Today", status: "confirmed" },
  { id: nextId(), name: "Vaibhav K.", phone: "947-274-7845", service: "beard",   barber: 2, slot: "3:30 PM", date: "Today", status: "confirmed" },
];