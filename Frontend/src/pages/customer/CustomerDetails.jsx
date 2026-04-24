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
    <div className="page-container">
      <div className="booking-card">
        <h2>Enter Details</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="input"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
          className="input"
        />
        <button className="btn booking-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>

      <ServiceSummary service={service} barber={barber} />
    </div>
  );
}