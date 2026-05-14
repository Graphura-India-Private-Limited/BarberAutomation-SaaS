import React, { useState } from "react";
import { Send, Clock, AlertCircle } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

export default function AnnouncementComposer() {
  const { addAnnouncement, addToast } = useNotification();
  
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "Offers",
    audience: "All Customers",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      addToast("Validation Error", "Title and message are required.", "queue");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      addAnnouncement(formData);
      addToast("Success", "Announcement sent successfully!", "success");
      setFormData({ title: "", message: "", type: "Offers", audience: "All Customers" });
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#EADDCA]">
      <div className="mb-6">
        <h2 className="text-xl font-black text-[#3E362E] uppercase tracking-widest">New Announcement</h2>
        <p className="text-sm text-stone-500 mt-1">Send manual updates and promotional offers.</p>
      </div>

      <form onSubmit={handleSend} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-stone-600">Announcement Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-[#EADDCA] bg-[#FDFBF7] focus:outline-none focus:border-[#C5A059] text-sm"
            >
              <option value="Offers">Offers</option>
              <option value="Discounts">Discounts</option>
              <option value="Important Updates">Important Updates</option>
              <option value="Holiday Notices">Holiday Notices</option>
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-stone-600">Target Audience</label>
            <select 
              name="audience" 
              value={formData.audience} 
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-[#EADDCA] bg-[#FDFBF7] focus:outline-none focus:border-[#C5A059] text-sm"
            >
              <option value="All Customers">All Customers</option>
              <option value="Selected Customers">Selected Customers</option>
              <option value="Specific Barber Customers">Specific Barber Customers</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-stone-600">Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange}
            placeholder="e.g. 🔥 Weekend Offer – 20% OFF" 
            className="w-full p-3 rounded-xl border border-[#EADDCA] bg-[#FDFBF7] focus:outline-none focus:border-[#C5A059] text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-stone-600">Message</label>
          <textarea 
            name="message" 
            value={formData.message} 
            onChange={handleChange}
            placeholder="Write your announcement here..." 
            rows="4"
            className="w-full p-3 rounded-xl border border-[#EADDCA] bg-[#FDFBF7] focus:outline-none focus:border-[#C5A059] text-sm resize-none"
          ></textarea>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            This will be sent as a real-time notification to the selected audience. They will receive it immediately in their Notification Center.
          </p>
        </div>

        <div className="flex gap-4 pt-2">
          <button 
            type="button"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-[#EADDCA] text-[#3E362E] px-6 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition"
          >
            <Clock className="w-4 h-4" /> Schedule
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex items-center justify-center gap-2 bg-[#3E362E] text-white px-6 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-[#C5A059] transition ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Sending..." : <><Send className="w-4 h-4" /> Send Now</>}
          </button>
        </div>
      </form>
    </div>
  );
}
