import { useLocation } from "react-router-dom";
import ServiceSummary from "../../Components/ServiceSummary";

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
    <div className="page-container">
      <div className="booking-card">
        <h2>Payment Details</h2>
        <div className="booking-details">
          <p className="token">
            Token Amount: ₹{tokenAmount}
          </p>
          <p className="note">
            *Pay small token now, rest at salon
          </p>
        </div>
        <button className="btn booking-btn" onClick={handlePayment}>
          Pay ₹{tokenAmount}
        </button>
      </div>

      <ServiceSummary service={service} barber={barber} />
    </div>
  );
}