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