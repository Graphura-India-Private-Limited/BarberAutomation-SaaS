# Payment & Revenue Management API

Base URL: `http://localhost:5000/api`

Authentication: send `Authorization: Bearer <jwt>` for all endpoints except `POST /payment/webhook`.

## Payment APIs

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| POST | `/payment/create-order` | customer/owner/admin | Create Razorpay order and pending payment record |
| POST | `/payment/verify` | customer/owner/admin | Verify Razorpay signature and mark payment `SUCCESS` |
| GET | `/payment` | owner/admin | Get all payments with filters and pagination |
| GET | `/payment/token` | owner/admin | Get token payments |
| GET | `/payment/full` | owner/admin | Get full payments |
| GET | `/payment/pending` | owner/admin | Get pending payments |
| GET | `/payment/:id` | owner/admin | Get one payment |
| GET | `/payment/salon/:salonId` | owner/admin | Get payments by salon |
| GET | `/payment/barber/:barberId` | owner/admin | Get payments by barber |
| GET | `/payment/date-range?from=2026-05-01&to=2026-05-14` | owner/admin | Get payments by date range |
| PATCH | `/payment/:id/failed` | customer/owner/admin | Mark a pending payment failed |
| POST | `/payment/:id/retry` | customer/owner/admin | Create a fresh order for a failed payment |
| POST | `/payment/refund` | owner/admin | Refund a captured payment |
| POST | `/payment/webhook` | Razorpay | Secure webhook handler |

### Create Order Body

```json
{
  "bookingId": "664000000000000000000001",
  "amount": 250,
  "paymentType": "TOKEN"
}
```

### Payment Filters

`GET /payment?paymentType=TOKEN&status=SUCCESS&date=2026-05-14&barberId=<id>&q=pay_123&page=1&limit=10`

Supported payment types: `TOKEN`, `FULL`.

Supported statuses: `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`.

## Revenue APIs

Revenue is calculated only from `SUCCESS` payments. Pending, failed and refunded payments are excluded.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/payment/revenue/dashboard` | Summary, service, barber and trend data |
| GET | `/payment/revenue/daily?date=2026-05-14` | Daily revenue |
| GET | `/payment/revenue/total?from=2026-05-01&to=2026-05-14` | Total revenue |
| GET | `/payment/revenue/services` | Service-wise revenue |
| GET | `/payment/revenue/barbers` | Barber-wise revenue |
| GET | `/payment/revenue/monthly?year=2026` | Month-wise revenue |
| GET | `/payment/revenue/trends?days=30` | Daily trend series |

## Frontend Routes

| Route | Page |
| --- | --- |
| `/owner/payments` | Payment Management Dashboard |
| `/owner/revenue` | Revenue Dashboard |

## Razorpay Webhook

Configure Razorpay to call:

`POST http://localhost:5000/api/payment/webhook`

Set the same webhook secret in Razorpay and `RAZORPAY_WEBHOOK_SECRET`.

Supported events: `payment.captured`, `payment.failed`, `order.paid`.
