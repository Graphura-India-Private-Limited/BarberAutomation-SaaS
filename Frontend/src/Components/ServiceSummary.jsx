import React from "react";

export default function ServiceSummary({ service, barber }) {
  if (!service) return null;

  return (
    <div className="summary-card">
      <h3>Service Summary</h3>
      <div className="summary-details">
        <div className="summary-item">
          <span>Service</span>
          <strong>{service.name}</strong>
        </div>
        <div className="summary-item">
          <span>Price</span>
          <strong>₹{service.price}</strong>
        </div>
        {barber && (
          <div className="summary-item">
            <span>Barber</span>
            <strong>{barber.name}</strong>
          </div>
        )}
      </div>
      <div className="summary-total">
        <span>Total Payable</span>
        <strong>₹{service.price}</strong>
      </div>
    </div>
  );
}
