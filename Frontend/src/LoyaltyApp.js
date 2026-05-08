
import React, { useState, useRef, useCallback } from 'react';
import { Toast } from './Components/Atoms';
import StatsBar from './Components/StatsBar';
import CustomerList from './Components/CustomerList';
import EarnModal from './Components/EarnModal';
import RedeemModal from './Components/RedeemModal';
import PlansTab from './Components/PlansTab';
import HistoryTab from './Components/HistoryTab';
import { initCustomers, initHistory, nextId, PLANS } from './constants';
import { nowTime } from './utils';

export default function LoyaltyApp() {
  const [customers,  setCustomers]  = useState(initCustomers);
  const [history,    setHistory]    = useState(initHistory);
  const [tab,        setTab]        = useState('customers');
  const [notif,      setNotif]      = useState(null);
  const [earnFor,    setEarnFor]    = useState(null);
  const [redeemFor,  setRedeemFor]  = useState(null);
  const notifRef = useRef();

  const toast = useCallback((msg, type = 'info') => {
    setNotif({ msg, type });
    clearTimeout(notifRef.current);
    notifRef.current = setTimeout(() => setNotif(null), 3500);
  }, []);

  const handleEarn   = (id) => setEarnFor(customers.find((c) => c.id === id));
  const handleRedeem = (id) => setRedeemFor(customers.find((c) => c.id === id));

  const confirmEarn = () => {
    const pts = PLANS[earnFor.plan].ptsPerVisit;
    setCustomers((prev) =>
      prev.map((c) => c.id === earnFor.id ? { ...c, points: c.points + pts, visits: c.visits + 1 } : c)
    );
    setHistory((prev) => [...prev, {
      id: nextId(), custName: earnFor.name,
      type: 'earn', pts,
      desc: `Visit — ${earnFor.plan} plan`,
      time: nowTime(),
    }]);
    toast(`+${pts} points added to ${earnFor.name}! 🎉`, 'success');
    setEarnFor(null);
  };

  const confirmRedeem = () => {
    const plan = PLANS[redeemFor.plan];
    setCustomers((prev) =>
      prev.map((c) => c.id === redeemFor.id ? { ...c, points: c.points - plan.minRedeem } : c)
    );
    setHistory((prev) => [...prev, {
      id: nextId(), custName: redeemFor.name,
      type: 'redeem', pts: -plan.minRedeem,
      desc: `Redeemed — ${plan.discount}% discount applied`,
      time: nowTime(),
    }]);
    toast(`${plan.minRedeem} pts redeemed! ${plan.discount}% discount applied for ${redeemFor.name}`, 'warn');
    setRedeemFor(null);
  };

  const tabs = [
    ['customers', ' Customers'],
    ['plans',     ' Plans'],
    ['history',   'History'],
  ];

  return (
    <div className="min-h-screen bg-[#FDF6F0] font-sans pb-20">
      <Toast notif={notif} />

      <div className="bg-gradient-to-b from-[#F5E6D8] to-[#FDF6F0] border-b border-[#E8C9B0] px-4 pt-5 pb-0 sticky top-0 z-50">
        <div className="max-w-lg mx-auto">
          <div className="mb-4">
            <p className="font-mono text-[#A0785A] text-[17px] tracking-widest uppercase m-0">
              GRAPHURA INDIA PRIVATE LIMITED
            </p>
            <h1 className="font-sans font-extrabold text-[#5C3D2E] text-xl tracking-tight m-0">
              Loyalty & Membership 
            </h1>
          </div>

          <StatsBar customers={customers} />

          <div className="flex gap-0.5">
            {tabs.map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 py-2.5 border-none font-sans font-bold text-sm rounded-t-lg cursor-pointer transition-all duration-200 ${
                  tab === k
                    ? 'bg-[#C8896A] text-white'
                    : 'bg-transparent text-[#A0785A] hover:text-[#5C3D2E]'
                }`}
              >{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-3.5 pt-5">
        {tab === 'customers' && (
          <CustomerList
            customers={customers}
            setCustomers={setCustomers}
            onEarn={handleEarn}
            onRedeem={handleRedeem}
            onSelect={(c) => toast(`${c.name} — ${c.points} pts · ${c.plan} plan`, 'info')}
            onAdd={(msg) => toast(msg, 'success')}
          />
        )}
        {tab === 'plans'   && <PlansTab toast={toast} />}
        {tab === 'history' && <HistoryTab history={history} />}
      </div>

      {earnFor   && <EarnModal   customer={earnFor}   onClose={() => setEarnFor(null)}   onConfirm={confirmEarn}   />}
      {redeemFor && <RedeemModal customer={redeemFor} onClose={() => setRedeemFor(null)} onConfirm={confirmRedeem} />}
    </div>
  );
}