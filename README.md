# 💈 BarberAutomation SaaS

## ⚙️ Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file inside `Backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://graphuratestingDB:FChgN9ZIZBi5ItdK@graphuratestingdb.v2gcmi8.mongodb.net/BarberAutomation?retryWrites=true&w=majority
JWT_SECRET=graphura_barber_secret_2026
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

---

## 🎨 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔐 Test Credentials

| Role | Mobile | Password |
|------|--------|----------|
| Customer | Any mobile | OTP shown in blue box |
| Owner | 9999999999 | Owner@123 |
| Barber | 9876543210 | Barber@123 |
| Admin | 9000000000 | Admin@123 |
| Admin MPIN | — | 123456 |

---
## Staff Login Credentials

| Role   | Email                                     | Password  |
| ------ | ----------------------------------------- | --------- |
| Owner  | [ravi@salon.com](mailto:ravi@salon.com)   | owner123  |
| Barber | [ajay@salon.com](mailto:ajay@salon.com)   | barber123 |
| Barber | [kiran@salon.com](mailto:kiran@salon.com) | kiran123  |

```bash
http://localhost:5173/staff-login
```


---

## ⚠️ Notes

- `.env` file is NOT in repo — create it manually
- `node_modules` is NOT in repo — run `npm install`
- Need **VPN**  for MongoDB connection
- First time only — run `node createTestData.js` in Backend folder

## 📁 Folder Structure

```
BarberAutomation-SaaS/
│
├── Backend/                          # Express + Mongoose API
│   ├── models/                       # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── Barber.js
│   │   ├── Booking.js
│   │   ├── BreakRequest.js
│   │   ├── Customer.js
│   │   ├── OtpStore.js
│   │   ├── Payment.js
│   │   ├── Queue.js
│   │   ├── Reminder.js
│   │   ├── Review.js
│   │   ├── Salon.js
│   │   └── Service.js
│   ├── routes/                       # API endpoints
│   │   ├── authRoutes.js
│   │   ├── salonRoutes.js
│   │   ├── barberRoutes.js
│   │   ├── ownerRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── queueRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── noshowRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── breakRoutes.js
│   ├── middleware/                   # Auth & validation
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── paymentVerificationMiddleware.js
│   │   └── razorpayWebhookMiddleware.js
│   ├── controllers/                  # Business logic
│   │   ├── paymentController.js
│   │   └── revenueController.js
│   ├── services/                     # External integrations
│   │   └── razorpayService.js
│   ├── utils/
│   │   ├── apiError.js
│   │   └── asyncHandler.js
│   └── server.js                     # Entry point
│
└── Frontend/                         # React + Vite + Tailwind
    ├── public/                       # Static assets
    │   ├── favicon.svg
    │   └── icons.svg
    │
    └── src/
        ├── App.jsx                   # Root component & routes
        ├── App.css
        ├── main.jsx                  # Entry point
        ├── index.css
        │
        ├── assets/                   # Images & static media
        │
        ├── components/               # Reusable UI components
        │   ├── admin/                # Admin-specific widgets
        │   │   └── Sidebar.jsx
        │   ├── booking/              # Booking flow components
        │   │   ├── BookingForm.jsx
        │   │   ├── ConfirmationPage.jsx
        │   │   ├── SearchFilterHeader.jsx
        │   │   ├── ServiceSummary.jsx
        │   │   └── SlotSelection.jsx
        │   ├── common/               # Atomic building blocks
        │   │   ├── Atoms.jsx
        │   │   ├── FormAtoms.jsx
        │   │   ├── Modals.jsx
        │   │   └── StatusBadge.jsx
        │   ├── customer/             # Customer-shared components
        │   │   ├── CustomerCard.jsx
        │   │   └── DetailPanel.jsx
        │   ├── layout/               # Page chrome
        │   │   ├── Footer.jsx
        │   │   └── Navbar.jsx
        │   ├── membership/
        │   │   └── MembershipSection.jsx
        │   ├── queue/
        │   │   ├── NearbyBarbers.jsx
        │   │   └── NoShowDelayPage.jsx
        │   ├── reviews/
        │   │   └── ReviewSystem.jsx
        │   └── salon/
        │       └── SalonDetailPage.jsx
        │
        ├── pages/                    # Route-level pages
        │   ├── HomePage.jsx
        │   ├── admin/
        │   │   ├── AdminLogin.jsx
        │   │   ├── AdminOnboarding.jsx
        │   │   ├── SalonManagement.jsx
        │   │   └── SalonViewPage.jsx
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   ├── Signup.jsx
        │   │   ├── Register.jsx
        │   │   ├── OTPLogin.jsx
        │   │   ├── OTPVerify.jsx
        │   │   ├── StaffLogin.jsx
        │   │   ├── Payment.jsx
        │   │   ├── CustomerProfile.jsx
        │   │   ├── DuplicateAccount.jsx
        │   │   └── RateLimit.jsx
        │   ├── barber/
        │   │   ├── BarberDashboard.jsx
        │   │   ├── BarberLogin.jsx
        │   │   ├── BarberProfile.jsx
        │   │   ├── BreakManagement.jsx
        │   │   ├── NoShowHandle.jsx
        │   │   ├── QueuePage.jsx
        │   │   ├── ServiceConsole.jsx
        │   │   └── ServiceHandler.jsx
        │   ├── customer/
        │   │   ├── AddonServices.jsx
        │   │   ├── AllReviews.jsx
        │   │   ├── BarberSelection.jsx
        │   │   ├── Booking.jsx
        │   │   ├── BookingHistory.jsx
        │   │   ├── CustomerBookingFlow.jsx
        │   │   ├── CustomerDetails.jsx
        │   │   ├── CustomerInteractionView.jsx
        │   │   ├── CustomerManagement.jsx
        │   │   ├── MenServices.jsx
        │   │   ├── ReminderSystem.jsx
        │   │   ├── ServiceCategories.jsx
        │   │   ├── SmartQueue.jsx
        │   │   ├── UserNotification.jsx
        │   │   └── WomenServices.jsx
        │   └── owner/
        │       ├── AnalyticsDashboard.jsx
        │       ├── BookingManagement.jsx
        │       ├── BreakApprovalDashboard.jsx
        │       ├── FinancePage.jsx
        │       ├── HomeOverview.jsx
        │       ├── LiveQueue.jsx
        │       ├── ManageServices.jsx
        │       ├── OwnerDashboard.jsx
        │       ├── OwnerLogin.jsx
        │       ├── PaymentDashboard.jsx
        │       ├── RevenueDashboard.jsx
        │       ├── SalonRegistration.jsx
        │       └── SettingsPage.jsx
        │
        ├── contexts/                 # React Context providers
        │   └── AppContext.jsx
        │
        ├── config/                   # Constants & static data
        │   └── data.js
        │
        ├── utils/                    # Helper functions
        │   └── razorpay.js
        │
        └── styles/                   # Global CSS
            ├── smart-queue.css
            └── theme.css
```
