const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token") || localStorage.getItem("ownerToken");

const loadRazorpay = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export async function openRazorpayCheckout({ bookingId, amount, paymentType = "TOKEN", customer = {}, onSuccess }) {
  const loaded = await loadRazorpay();
  if (!loaded) throw new Error("Razorpay checkout could not be loaded");

  const orderRes = await fetch(`${API}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ bookingId, amount, paymentType }),
  });
  const orderData = await orderRes.json();
  if (!orderData.success) throw new Error(orderData.message || "Could not create payment order");

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: orderData.key,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "Salon Booking",
      description: `${paymentType} payment`,
      order_id: orderData.order.id,
      prefill: {
        name: customer.name || "",
        email: customer.email || "",
        contact: customer.mobile || "",
      },
      handler: async response => {
        try {
          const verifyRes = await fetch(`${API}/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyData.success) throw new Error(verifyData.message || "Payment verification failed");
          onSuccess?.(verifyData);
          resolve(verifyData);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });
    checkout.open();
  });
}
