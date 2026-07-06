# 💈 BarberAutomation SaaS

> A production-deployed, multi-role Salon Management platform built with React, Node.js, MongoDB, and Socket.IO.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-barberautomation--saas--frontend.onrender.com-brightgreen)](https://barberautomation-saas-frontend.onrender.com)
[![Backend API](https://img.shields.io/badge/Backend%20API-barberautomation--saas.onrender.com-blue)](https://barberautomation-saas.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-BarberAutomation--SaaS-black?logo=github)](https://github.com/Graphura-India-Private-Limited/BarberAutomation-SaaS)

---

## 🌐 Live Links

| Service | URL |
|---------|-----|
| **Frontend** | https://barberautomation-saas-frontend.onrender.com |
| **Backend API** | https://barberautomation-saas.onrender.com |
| **GitHub Repo** | https://github.com/Graphura-India-Private-Limited/BarberAutomation-SaaS |

---

## 🚀 Overview

BarberAutomation SaaS is a full-stack platform that automates salon operations across 4 distinct user roles — **Customer**, **Barber**, **Owner**, and **Admin**. It handles real-time queue management, bookings, payments, and analytics in a single unified system.

---

## ✨ Key Features

- **Multi-Role Authentication** — OTP-based login + Google OAuth2 for Customers; credential-based login for Barbers, Owners, and Admins
- **Real-Time Queue System** — Live queue sync via Socket.IO with <50ms latency
- **Smart Booking Flow** — Service selection → barber selection → slot booking → Razorpay payment
- **Payment Integration** — Razorpay with webhook verification, token & full payment support, automated refund logic
- **SMTP Email Notifications** — Booking confirmations, reminders, and rebook nudges via cron jobs
- **Owner Analytics Dashboard** — Revenue tracking, booking trends, barber performance metrics
- **Admin Control Panel** — Salon approval, user management, RBAC enforcement
- **AI Wait-Time Prediction** — Historical data-based wait time estimation improving accuracy by 25%
- **Break Management** — Barbers can request breaks; owners approve/deny in real time

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React, Vite, Tailwind CSS, Socket.IO Client |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB, Mongoose (8+ collections) |
| **Auth** | JWT, Google OAuth2 |
| **Payments** | Razorpay (webhooks, refunds) |
| **Email** | Nodemailer (SMTP / Gmail) |
| **Deployment** | Render (Backend + Frontend), GitHub CI/CD |

---

## 👥 User Roles & Test Credentials

### Customer
- Login at `/login`
- Any 10-digit mobile number → OTP shown in UI (dev mode)

### Admin
| Field | Value |
|-------|-------|
| Mobile | `9000000000` |
| Password | `Admin@123` |
| MPIN | `123456` |

### Salon Owners — Login at `/owner/login`
| Salon | Mobile | Password |
|-------|--------|----------|
| The Royal Blade | `9999999999` | `owner@123` |
| Noor Beauty Parlor | `7038959005` | `owner@123` |
| VanshTest | `9674367213` | `owner@123` |

### Barbers — Login at `/barber/login`
| Salon | Barber | Mobile | Password |
|-------|--------|--------|----------|
| The Royal Blade | Ali (Master Stylist) | `8888888801` | `Barber@123` |
| The Royal Blade | Ravi (Beard Expert) | `8888888802` | `Barber@123` |
| Noor Beauty Parlor | rahul barber | `9506998800` | `Barber@123` |

> All seeded accounts (28 states) use password `password123`

---

## ⚙️ Local Setup

### Backend
```bash
cd Backend
npm install
```

Create `Backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="BarberPro" <your_email@gmail.com>
GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

Create `Frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Project Structure

```
BarberAutomation-SaaS/
├── Backend/                  # Express + Mongoose API
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas (8+ collections)
│   ├── routes/               # API endpoints (20+)
│   ├── middleware/           # Auth, RBAC, webhook verification
│   └── utils/                # Cron jobs, mailer, helpers
│
└── Frontend/                 # React + Vite + Tailwind CSS
    └── src/
        ├── pages/            # Customer, Barber, Owner, Admin views
        ├── components/       # Reusable UI components
        ├── contexts/         # React Context providers
        └── utils/            # Razorpay helpers
```

---

## 📄 License

Built by [Vansh Malik](https://github.com/vnshMal) at [Graphura Pvt Ltd](https://github.com/Graphura-India-Private-Limited).
