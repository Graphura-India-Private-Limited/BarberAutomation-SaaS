export const PLANS = {
  Basic:  { price: 0,   ptsPerVisit: 10, minRedeem: 500, discount: 5,  priority: false },
  Silver: { price: 299, ptsPerVisit: 20, minRedeem: 300, discount: 10, priority: true  },
  Gold:   { price: 599, ptsPerVisit: 30, minRedeem: 200, discount: 20, priority: true  },
};

let uid = 200;
export const nextId = () => `m${++uid}`;

export const initCustomers = () => [
  { id: nextId(), name: 'Mayur K.',    initials: 'MK', phone: '955-010-5897', plan: 'Gold',   points: 840, visits: 28, joinedAt: '2024-01-15' },
  { id: nextId(), name: 'Sam K.',      initials: 'SK', phone: '973-589-7907', plan: 'Silver', points: 420, visits: 14, joinedAt: '2024-02-10' },
  { id: nextId(), name: 'Pratik D.',   initials: 'PD', phone: '952-637-7432', plan: 'Basic',  points: 130, visits: 6,  joinedAt: '2024-03-01' },
  { id: nextId(), name: 'Tanish S.',   initials: 'TS', phone: '989-452-7898', plan: 'Silver', points: 310, visits: 11, joinedAt: '2024-03-20' },
  { id: nextId(), name: 'Vaibhav K.',  initials: 'VK', phone: '947-274-7845', plan: 'Basic',  points: 90,  visits: 4,  joinedAt: '2024-04-01' },
];

export const initHistory = () => [
  { id: nextId(), custName: 'Mayur K.',   type: 'earn',   pts: 30,   desc: 'Visit — Gold plan',            time: 'Today 10:30 AM' },
  { id: nextId(), custName: 'Sam K.',     type: 'earn',   pts: 20,   desc: 'Visit — Silver plan',          time: 'Today 11:00 AM' },
  { id: nextId(), custName: 'Mayur K.',   type: 'redeem', pts: -200, desc: 'Redeemed — 20% discount',      time: 'Today 11:45 AM' },
  { id: nextId(), custName: 'Pratik D.',  type: 'earn',   pts: 10,   desc: 'Visit — Basic plan',           time: 'Today 12:15 PM' },
  { id: nextId(), custName: 'Tanish S.',  type: 'earn',   pts: 20,   desc: 'Visit — Silver plan',          time: 'Today 1:00 PM'  },
  { id: nextId(), custName: 'Vaibhav K.', type: 'earn',  pts: 10,   desc: 'Visit — Basic plan',           time: 'Today 2:00 PM'  },
];