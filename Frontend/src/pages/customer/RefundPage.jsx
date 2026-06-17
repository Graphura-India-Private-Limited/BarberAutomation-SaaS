import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calendar, Clock, CreditCard, AlertCircle, CheckCircle, 
  HelpCircle, ShieldCheck, Sparkles, Building, Landmark, User, DollarSign,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const GOLD = "#C5A059";
const GOLD_LIGHT = "#FEF9EE";
const GOLD_BORDER = "#EADBCE";
const BG_WARM = "#FAF6F0";
const CHARCOAL = "#3E362E";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

export default function RefundPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [refundRules, setRefundRules] = useState(null);

  const [refundMethod, setRefundMethod] = useState("original"); // "original" or "bank"
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRefundDetails();
  }, [bookingId]);

  const fetchRefundDetails = async () => {
    setLoading(true);
    setError("");
    const token = getToken();
    try {
      const res = await fetch(`${API}/booking/${bookingId}/refund-estimation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBooking(data.booking);
        setPayment(data.payment);
        setRefundRules(data.refundRules);
      } else {
        setError(data.message || "Failed to load refund details.");
      }
    } catch (err) {
      setError("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmCancelAndRefund = async () => {
    if (refundMethod === "bank") {
      if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName) {
        setError("Please fill in all bank details to continue.");
        return;
      }
    }

    setSubmitting(true);
    setError("");
    const token = getToken();
    try {
      const res = await fetch(`${API}/booking/${bookingId}/cancel-with-refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          refundMethod,
          bankDetails: refundMethod === "bank" ? bankDetails : null
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to cancel booking.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#FAF6F0] min-h-screen flex items-center justify-center font-sans text-stone-600">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-[#C5A059]" />
            </div>
            <p className="text-sm font-medium tracking-wide">Calculating Refund Estimates...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#FAF6F0] min-h-screen font-sans text-[#3E362E] selection:bg-[#C5A059] selection:text-white relative overflow-hidden flex flex-col pt-24 pb-20">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#C5A059]/5 via-[#EADDCA]/10 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/3 right-10 w-[700px] h-[500px] bg-[#EADDCA]/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <div className="mb-6 flex justify-start">
            <button 
              onClick={() => navigate("/customerprofile")}
              className="flex items-center gap-2 text-xs font-black tracking-widest uppercase transition-all duration-300 hover:opacity-80 group text-[#3E362E] bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#EADBCE] shadow-sm hover:bg-white"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" style={{ color: GOLD }} />
              <span>Back to Registry</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                
                {/* Left Panel: Booking Details and Payments */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Title & Header */}
                  <div className="text-left">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-white border border-[#EADBCE] px-3.5 py-1.5 rounded-full text-[#C5A059] shadow-2xs inline-block mb-3">
                      Secure Refund System
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-serif text-[#3E362E] leading-none mb-2">
                      Cancel & <span className="text-[#C5A059] italic font-medium">Refund</span>
                    </h1>
                    <p className="text-stone-500 text-xs font-light tracking-wide max-w-md">
                      Confirm cancellation details, review refund breakdown, and submit bank transfer parameters if required.
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs font-medium text-left">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Booking Details Card */}
                  <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-2xs text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FAF6F0] rounded-bl-full flex items-center justify-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-[#C5A059]/30" />
                    </div>

                    <h3 className="font-serif text-lg font-bold mb-4">Appointment Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-xs">
                        <span className="text-stone-400 font-medium">Salon Hub</span>
                        <span className="font-bold text-[#3E362E]">{booking?.salon_id?.salon_name || "Style Studio"}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-xs">
                        <span className="text-stone-400 font-medium">Services</span>
                        <span className="font-bold text-[#3E362E]">{booking?.services?.map(s => s.service_name).join(", ") || "Grooming Session"}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-xs">
                        <span className="text-stone-400 font-medium">Date & Slot</span>
                        <span className="font-bold text-[#3E362E]">
                          {booking?.slot_time ? new Date(booking.slot_time).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "Queue booking"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#FAF6F0] pb-2 text-xs">
                        <span className="text-stone-400 font-medium">Amount Paid</span>
                        <span className="font-black text-[#C5A059] font-mono">₹{payment?.amount || booking?.total_amount || 0}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-1">
                        <span className="text-stone-400 font-medium">Payment Type</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          payment?.payment_type === "FULL" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {payment?.payment_type === "FULL" ? "Full Paid" : "Token Paid"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Refund Policy Summary Info */}
                  <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-2xs text-left relative overflow-hidden">
                    <h3 className="font-serif text-lg font-bold mb-3">Refund Policy Guidelines</h3>
                    <ul className="text-xs text-stone-500 space-y-2.5 list-disc pl-4">
                      <li><strong>Token Booking</strong>: If only a booking token is processed, it will not be refunded. This token covers the upfront salon reservation logistics.</li>
                      <li><strong>Full Paid Booking</strong>: Fully refundable minus a standard platform cancellation booking charge of ₹{refundRules?.bookingCharges || 50}.</li>
                      <li>Refund requests are processed immediately and are usually credited back to your account within 3-5 business days.</li>
                    </ul>
                  </div>

                </div>

                {/* Right Panel: Refund Estimation & Confirm */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Refund Calculation Card */}
                  <div className="bg-[#3D3126] text-white rounded-[2.2rem] p-8 shadow-md border border-[#C5A059]/20 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-full blur-2xl" />
                    
                    <span className="text-[8px] font-black uppercase tracking-[0.25em] bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 px-3 py-1 rounded-full mb-5 inline-block">
                      Calculation Parameters
                    </span>

                    <h3 className="font-serif text-2xl font-bold tracking-tight text-white mb-6">Refund Estimation</h3>

                    <div className="space-y-4 font-sans text-xs border-b border-white/10 pb-6">
                      <div className="flex justify-between items-center text-stone-300">
                        <span>Paid Transaction Amount</span>
                        <span className="font-mono text-sm font-bold text-white">₹{payment?.amount || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#E57373]">
                        <span>Cancellation Booking Charge</span>
                        <span className="font-mono text-sm font-bold">
                          - ₹{refundRules?.bookingCharges || 0}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 pb-2 text-left">
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-black">Total Refundable Value</p>
                      <h2 className="text-4xl font-serif font-black tracking-tight text-[#C5A059] mt-2 font-mono">
                        ₹{refundRules?.refundAmount || 0}
                      </h2>
                      <p className="text-[11px] font-normal leading-relaxed text-stone-400 mt-3.5">
                        {refundRules?.policyNote} {refundRules?.refundAmount > 0 && "Once confirmed, the refund will be processed and credited to your account within 1 to 2 hours."}
                      </p>
                    </div>
                  </div>

                  {/* Refund Destination Selection */}
                  {refundRules?.refundAmount > 0 && (
                    <div className="bg-white rounded-3xl border border-[#EADBCE] p-6 shadow-2xs text-left">
                      <h3 className="font-serif text-lg font-bold mb-4">Refund Destination</h3>
                      
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                          type="button"
                          onClick={() => setRefundMethod("original")}
                          className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition cursor-pointer select-none ${
                            refundMethod === "original" 
                              ? "bg-[#FEF9EE] border-[#C5A059] text-[#3E362E]" 
                              : "bg-white border-stone-200 text-stone-400 hover:border-[#C5A059]/40"
                          }`}
                        >
                          <CreditCard className={`w-5 h-5 ${refundMethod === "original" ? "text-[#C5A059]" : ""}`} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Original Source</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRefundMethod("bank")}
                          className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition cursor-pointer select-none ${
                            refundMethod === "bank" 
                              ? "bg-[#FEF9EE] border-[#C5A059] text-[#3E362E]" 
                              : "bg-white border-stone-200 text-stone-400 hover:border-[#C5A059]/40"
                          }`}
                        >
                          <Landmark className={`w-5 h-5 ${refundMethod === "bank" ? "text-[#C5A059]" : ""}`} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Bank Transfer</span>
                        </button>
                      </div>

                      {/* Bank Details Input fields */}
                      <AnimatePresence>
                        {refundMethod === "bank" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3 overflow-hidden"
                          >
                            <div>
                              <label className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block mb-1">Account Holder Name</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                  <User size={13} />
                                </span>
                                <input
                                  type="text"
                                  name="accountName"
                                  value={bankDetails.accountName}
                                  onChange={handleBankChange}
                                  placeholder="Rahul Kumar"
                                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-[#C5A059] transition-all font-semibold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block mb-1">Account Number</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                  <Landmark size={13} />
                                </span>
                                <input
                                  type="text"
                                  name="accountNumber"
                                  value={bankDetails.accountNumber}
                                  onChange={handleBankChange}
                                  placeholder="50200012345678"
                                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-[#C5A059] transition-all font-semibold"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block mb-1">IFSC Code</label>
                                <input
                                  type="text"
                                  name="ifscCode"
                                  value={bankDetails.ifscCode}
                                  onChange={handleBankChange}
                                  placeholder="HDFC0001234"
                                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#C5A059] transition-all font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-black uppercase tracking-widest text-[#C5A059] block mb-1">Bank Name</label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                                    <Building size={12} />
                                  </span>
                                  <input
                                    type="text"
                                    name="bankName"
                                    value={bankDetails.bankName}
                                    onChange={handleBankChange}
                                    placeholder="HDFC Bank"
                                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl pl-8 pr-4 py-2.5 text-xs outline-none focus:border-[#C5A059] transition-all font-semibold"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleConfirmCancelAndRefund}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-500 text-white text-xs font-black uppercase tracking-wider hover:bg-rose-600 transition active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(239,68,68,0.2)]"
                    >
                      <XCircle size={14} />
                      {submitting ? "Processing Request..." : "Confirm Cancellation"}
                    </button>
                    
                    <button
                      onClick={() => navigate("/customerprofile")}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white border border-[#EADBCE] text-stone-600 text-xs font-black uppercase tracking-wider hover:bg-stone-50 transition"
                    >
                      Keep Appointment
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-stone-400">
                    <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Secured 256-Bit SSL Transfer</span>
                  </div>

                </div>

              </motion.div>
            ) : (
              /* Success / Confirmed State Page Card */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white border border-[#EADBCE] rounded-[2.5rem] p-8 mx-auto text-center shadow-lg relative overflow-hidden"
              >
                {/* Subtle top ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-emerald-500/10 rounded-full blur-xl" />

                {/* Checked Circle Icon */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-emerald-600 animate-bounce" />
                </div>

                <h2 className="font-serif text-3xl font-black text-[#3E362E] tracking-tight mb-3">
                  Booking <span className="italic text-[#C5A059] font-medium">Cancelled</span>
                </h2>

                <p className="text-stone-500 text-xs leading-relaxed mb-6 font-sans">
                  The appointment at <strong>{booking?.salon_id?.salon_name || "Style Studio"}</strong> has been successfully cancelled. The slots have been freed up.
                </p>

                {/* Refund summary in case refundAmount > 0 */}
                {refundRules?.refundAmount > 0 ? (
                  <div className="bg-[#FEF9EE] border border-[#EADBCE] rounded-2xl p-4 text-left space-y-2 mb-8 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-stone-400 uppercase tracking-widest text-[9px]">Refund Amount</span>
                      <span className="text-emerald-700 font-mono font-bold">₹{refundRules?.refundAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400 uppercase tracking-widest text-[9px]">Refund Route</span>
                      <span className="text-stone-700 uppercase tracking-wider text-[9px]">
                        {refundMethod === "original" ? "Original Payment Source" : `Bank Transfer (${bankDetails.bankName})`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400 uppercase tracking-widest text-[9px]">Processing Code</span>
                      <span className="text-stone-700 font-mono text-[10px]">REF-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-normal leading-normal pt-1.5 border-t border-[#EADBCE]/50">
                      * Refund request successfully processed. The transaction will reflect in your account within 1 to 2 hours.
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FAF6F0] border border-[#EADBCE] rounded-2xl p-4 text-left mb-8 text-xs font-medium">
                    <p className="text-stone-500 text-center leading-normal text-[11px]">
                      No refund was applicable for this cancellation as per the Salon Token Policy rules.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => navigate("/customerprofile")}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#E8C878] to-[#C5A059] text-[#1E1A17] text-xs font-black uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition cursor-pointer border-none shadow-[0_0_20px_rgba(197,160,89,0.25)]"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      <Footer />
    </>
  );
}
