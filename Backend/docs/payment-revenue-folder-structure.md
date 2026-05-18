# Payment & Revenue Module Folder Structure

```text
Backend/
  controllers/
    paymentController.js
    revenueController.js
  docs/
    payment-revenue-api.md
    payment-revenue-folder-structure.md
  middleware/
    paymentVerificationMiddleware.js
    razorpayWebhookMiddleware.js
    roleMiddleware.js
  models/
    Payment.js
  postman/
    payment-revenue.postman_collection.json
  routes/
    razorpayRoutes.js
  seeds/
    paymentSeedData.json
  services/
    razorpayService.js
  utils/
    apiError.js
    asyncHandler.js
  .env.example

Frontend/src/
  pages/owner/
    PaymentDashboard.jsx
    RevenueDashboard.jsx
  utils/
    razorpay.js
```

Owner routes:

```text
/owner/payments
/owner/revenue
```
