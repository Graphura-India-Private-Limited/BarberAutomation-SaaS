const express   = require("express");
const cors      = require("cors");
const morgan    = require("morgan");
const connectDB = require("./config/db");
const breakRoutes = require("./routes/breakRoutes");
const adminRoutes = require("./routes/adminRoutes");

require("dotenv").config();

const app = express();
connectDB();

app.use(cors({ origin: (origin, cb) => cb(null, true), credentials: true }));
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/salon",    require("./routes/salonRoutes"));
app.use("/api/barber",   require("./routes/barberRoutes"));
app.use("/api/owner",    require("./routes/ownerRoutes"));
app.use("/api/booking",  require("./routes/bookingRoutes"));
app.use("/api/queue",    require("./routes/queueRoutes"));
app.use("/api/payment",  require("./routes/razorpayRoutes"));
app.use("/api/admin",    require("./routes/adminRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/reminder", require("./routes/reminderRoutes"));
app.use("/api/noshow",   require("./routes/noshowRoutes"));
app.use("/api/breaks", breakRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => res.json({ message:"Graphura Barber SaaS API v2.0", database:"MongoDB", status:"running" }));
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success:false, message:err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
