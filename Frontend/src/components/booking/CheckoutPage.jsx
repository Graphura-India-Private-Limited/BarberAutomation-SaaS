import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, Phone, ArrowLeft, ShieldCheck, Sparkles, Building, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GOLD = "#C5A059";

export default function CheckoutPage({ bookingData, onBack, onComplete }) {
  const [paymentType, setPaymentType] = useState("TOKEN"); // "TOKEN" or "FULL"
  const [payMethod, setPayMethod] = useState("upi"); // "upi", "card", "netbanking"
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "", name: "" });

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // { code: '...', type: '...', value: 100 }
  const [promoError, setPromoError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [unusedRewards, setUnusedRewards] = useState(0);
  const [hasPreviousBookings, setHasPreviousBookings] = useState(false);

  useEffect(() => {
    const fetchUserRewards = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const bookingsRes = await fetch(`${API_URL}/booking/my`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success && bookingsData.bookings) {
          const activeBookings = bookingsData.bookings.filter(a => 
            a.status === "completed" || a.status === "confirmed" || a.status === "pending" || a.status === "in-progress" ||
            a.status === "Completed" || a.status === "Confirmed" || a.status === "Pending" || a.status === "In-progress"
          );
          setHasPreviousBookings(activeBookings.length > 0);
          const usedRewardsCount = activeBookings.filter(a => a.promo_code === "LOYAL10" || a.promoCode === "LOYAL10").length;
          const paidVisitsCount = activeBookings.filter(a => a.promo_code !== "LOYAL10" && a.promoCode !== "LOYAL10").length;
          const calculatedUnused = Math.max(0, Math.floor(paidVisitsCount / 10) - usedRewardsCount);
          setUnusedRewards(calculatedUnused);
        }
      } catch (err) {
        console.error("Error fetching user rewards at checkout:", err);
      }
    };
    fetchUserRewards();
  }, []);

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "FIRSTCUT20") {
      if (hasPreviousBookings) {
        setPromoError("FIRSTCUT20 is only valid for your first appointment.");
        setAppliedPromo(null);
      } else {
        setAppliedPromo({ code, type: "PERCENT", value: 20 });
      }
    } else if (code === "LOYAL10") {
      if (unusedRewards <= 0) {
        setPromoError("You do not have any loyalty rewards available.");
        setAppliedPromo(null);
      } else {
        setAppliedPromo({ code, type: "PERCENT", value: 10 });
      }
    } else {
      setPromoError("Invalid promo code.");
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const attendeesCount = bookingData.attendees ? bookingData.attendees.length : 1;
  const servicePrice = bookingData.price || 500;
  const baseFullAmount = servicePrice * attendeesCount;

  // Apply discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "PERCENT") {
      discountAmount = Math.round(baseFullAmount * (appliedPromo.value / 100));
    } else if (appliedPromo.type === "FREE") {
      discountAmount = baseFullAmount;
    }
  }

  const fullAmount = Math.max(0, baseFullAmount - discountAmount);
  const tokenAmount = appliedPromo?.type === "FREE" ? 0 : (attendeesCount * 50);

  const amountToPayNow = paymentType === "FULL" ? fullAmount : tokenAmount;
  const remainingAtSalon = paymentType === "FULL" ? 0 : Math.max(0, fullAmount - tokenAmount);

  // Billing calculation details
  const platformFee = 15;
  const taxRate = 0.18; // 18% GST (already included or added?) Let's show as included to keep total clean
  const taxesIncluded = Math.round(amountToPayNow * taxRate);

  const handlePay = async () => {
    setPaymentError("");

    if (payMethod === "upi") {
      const upi = upiId.trim();
      if (!upi) {
        setPaymentError("Please enter your UPI ID.");
        return;
      }
      
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(upi)) {
        setPaymentError("Invalid UPI ID format. Example: username@okhdfcbank");
        return;
      }

      // Check for email domains (indicated by a dot in the handle or common domains) to prevent entering email
      const commonEmailDomains = ["@gmail.com", "@yahoo.com", "@outlook.com", "@hotmail.com", "@icloud.com", "@mail.com", "@protonmail.com", "@zoho.com"];
      const handlePart = upi.split("@")[1] || "";
      if (handlePart.includes(".") || commonEmailDomains.some(domain => upi.toLowerCase().endsWith(domain))) {
        setPaymentError("You entered an email address. Please enter a valid UPI ID (e.g., name@okaxis) instead.");
        return;
      }
    } else if (payMethod === "card") {
      if (!cardDetails.name.trim()) {
        setPaymentError("Please enter the cardholder's name.");
        return;
      }

      const num = cardDetails.number.replace(/\s+/g, "");
      if (!num || !/^\d+$/.test(num)) {
        setPaymentError("Please enter a valid card number (digits only).");
        return;
      }

      if (num.length < 12 || num.length > 19) {
        setPaymentError("Card number must be between 12 and 19 digits.");
        return;
      }

      const expiryClean = cardDetails.expiry.replace(/\s+/g, "");
      if (!expiryClean || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryClean)) {
        setPaymentError("Please enter expiry date in MM/YY format (e.g., 12/28).");
        return;
      }

      const cvcClean = cardDetails.cvc.replace(/\s+/g, "");
      if (!cvcClean || !/^\d{3,4}$/.test(cvcClean)) {
        setPaymentError("Please enter a valid 3 or 4-digit CVC code.");
        return;
      }
    }

    setProcessing(true);
    // Simulate Razorpay handshake / payment gateway loader (reduced from 2000ms to 500ms for responsiveness)
    setTimeout(async () => {
      try {
        await onComplete(paymentType, amountToPayNow, appliedPromo?.code || "");
      } catch (err) {
        console.error(err);
      } finally {
        setProcessing(false);
      }
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto text-left font-sans">
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#3E362E]/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center text-white"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-6 animate-pulse">
              <Sparkles className="w-8 h-8 text-[#C5A059]" />
            </div>
            <h3 className="font-serif text-2xl font-bold tracking-wide animate-bounce text-center">
              Processing Secure Payment
            </h3>
            <p className="text-stone-400 text-xs mt-2 tracking-widest uppercase">
              Simulating Razorpay Handshake...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center mb-6 pb-4 border-b">
        <button type="button" onClick={onBack} className="text-gray-400 hover:text-stone-700 transition-colors mr-4 cursor-pointer">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Payment Checkout</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Token Payment Option */}
        <div 
          onClick={() => setPaymentType("TOKEN")}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all select-none relative overflow-hidden ${
            paymentType === "TOKEN" 
              ? "border-[#C5A059] bg-[#FEF9EE]" 
              : "border-stone-200 hover:border-[#C5A059]/40 bg-white"
          }`}
        >
          {paymentType === "TOKEN" && (
            <div className="absolute top-0 right-0 w-8 h-8 bg-[#C5A059] flex items-center justify-center rounded-bl-xl">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          )}
          <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]">Option A</span>
          <h4 className="font-serif text-lg font-bold text-[#3E362E] mt-1">Partial Payment</h4>
          <p className="text-stone-500 text-xs mt-1 leading-relaxed">
            Pay ₹50 per person now to confirm your reservation. Balance due at salon. <span className="text-red-600 font-semibold">(Non-refundable)</span>
          </p>
          <div className="mt-4 text-2xl font-black font-mono text-[#3E362E]">₹{tokenAmount}</div>
        </div>

        {/* Full Payment Option */}
        <div 
          onClick={() => setPaymentType("FULL")}
          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all select-none relative overflow-hidden ${
            paymentType === "FULL" 
              ? "border-[#C5A059] bg-[#FEF9EE]" 
              : "border-stone-200 hover:border-[#C5A059]/40 bg-white"
          }`}
        >
          {paymentType === "FULL" && (
            <div className="absolute top-0 right-0 w-8 h-8 bg-[#C5A059] flex items-center justify-center rounded-bl-xl">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          )}
          <span className="text-[9px] font-black uppercase tracking-widest text-[#C5A059]">Option B</span>
          <h4 className="font-serif text-lg font-bold text-[#3E362E] mt-1">Pay Full Amount</h4>
          <p className="text-stone-500 text-xs mt-1 leading-relaxed">
            Prepay the entire amount now for a completely contactless, premium check-out.
          </p>
          <div className="mt-4 text-2xl font-black font-mono text-[#3E362E]">₹{fullAmount}</div>
        </div>
      </div>

      {/* Invoice Breakdown */}
      <div className="bg-[#FAF6F0] rounded-2xl p-5 border border-[#EADBCE] mb-6">
        <h3 className="text-xs font-black uppercase tracking-wider text-stone-500 mb-3">Invoice Details</h3>
        <div className="space-y-2.5 text-xs text-stone-600 font-semibold">
          <div className="flex justify-between">
            <span>Service Total ({attendeesCount} person)</span>
            <span className="font-mono text-stone-800">₹{baseFullAmount}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Promo Discount ({appliedPromo?.code})</span>
              <span className="font-mono font-bold">-₹{discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between items-center gap-4 py-1.5 border-t border-b border-dashed border-[#EADBCE]/60 my-1">
            <span className="text-stone-500 font-bold">Coupon Code</span>
            {appliedPromo ? (
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                  {appliedPromo.code} Applied
                </span>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-stone-400 hover:text-red-500 text-[10px] font-black cursor-pointer border-none bg-transparent"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2 shrink-0">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter Code"
                  className="bg-white border border-[#EADBCE] rounded-lg px-2 py-1 text-[10px] font-mono font-bold outline-none text-[#3E362E] focus:border-[#C5A059] w-28 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-[#3E362E] hover:bg-[#2A241F] text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg border-none cursor-pointer transition-all"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
          {unusedRewards > 0 && !appliedPromo && (
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={() => {
                  setAppliedPromo({ code: "LOYAL10", type: "PERCENT", value: 10 });
                  setPromoCode("LOYAL10");
                  setPromoError("");
                }}
                className="text-[10px] text-[#C5A059] font-black uppercase hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent"
              >
                <Sparkles className="w-3 h-3 text-[#C5A059] fill-[#C5A059]" /> Apply Unused Loyalty Reward (10% Off)
              </button>
            </div>
          )}
          {promoError && (
            <p className="text-[10px] text-red-500 font-semibold text-right mt-0.5">{promoError}</p>
          )}
          <div className="flex justify-between">
            <span>Platform Service Fee</span>
            <span className="flex items-center gap-1.5">
              <span className="line-through text-stone-400 font-mono">₹{platformFee}</span>
              <span className="bg-[#C5A059]/20 text-[#B06000] px-1.5 py-0.5 rounded text-[8px] font-black">PROMO FREE</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span>GST & Service Taxes (18% Included)</span>
            <span className="font-mono text-stone-400">₹{taxesIncluded}</span>
          </div>
          <div className="border-t border-[#EADBCE] pt-2.5 mt-2.5 flex justify-between text-sm">
            <span className="text-stone-800 font-black">Amount to Pay Now</span>
            <span className="font-black text-[#C5A059] font-mono text-base">₹{amountToPayNow}</span>
          </div>
          {remainingAtSalon > 0 && (
            <div className="flex justify-between text-[11px] text-amber-700 bg-amber-50/50 p-2 rounded-lg border border-amber-100/60 mt-2.5">
              <span>Remaining Balance (Pay at Salon)</span>
              <span className="font-black font-mono">₹{remainingAtSalon}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Gateway Panel */}
      <div className="border border-stone-200 rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-serif font-bold text-stone-800 mb-4">Select Payment Mode</h3>
        <div className="flex gap-2 mb-4 border-b border-stone-100 pb-3">
          <button 
            type="button" 
            onClick={() => { setPayMethod("upi"); setPaymentError(""); }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              payMethod === "upi" ? "bg-[#3E362E] text-white border-transparent" : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
            }`}
          >
            UPI / GPay
          </button>
          <button 
            type="button" 
            onClick={() => { setPayMethod("card"); setPaymentError(""); }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              payMethod === "card" ? "bg-[#3E362E] text-white border-transparent" : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50"
            }`}
          >
            Credit / Debit Card
          </button>
        </div>

        {payMethod === "upi" ? (
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Enter UPI ID</label>
            <input 
              type="text"
              name="upiId"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="username@okhdfcbank"
              autoComplete="on"
              className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#C5A059] transition-all font-semibold"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Card Holder Name</label>
              <input 
                type="text"
                placeholder="Rahul Kumar"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#C5A059] transition-all font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Card Number</label>
              <input 
                type="text"
                placeholder="4321 8765 9000 1234"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#C5A059] transition-all font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">Expiry Date</label>
                <input 
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#C5A059] transition-all font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">CVC Code</label>
                <input 
                  type="password"
                  placeholder="•••"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#C5A059] transition-all font-semibold"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 text-stone-500 text-[10px] leading-relaxed mb-6">
        <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
        <p>
          Payments are secure and processed via <strong>Razorpay Payment Gateway</strong>. Once booked, bookings are non-refundable as per our Cancellation and Refund Policy.
        </p>
      </div>

      {paymentError && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-red-600">
          <AlertCircle size={15} className="shrink-0 text-red-500" />
          <span>{paymentError}</span>
        </div>
      )}

      <button
        onClick={handlePay}
        className="w-full bg-[#3E362E] hover:bg-[#2A241F] text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-200 cursor-pointer text-center block border-none outline-none"
      >
        {amountToPayNow === 0 ? "Confirm Booking (Free Reward)" : `Proceed to Pay ₹${amountToPayNow}`}
      </button>
    </div>
  );
}
