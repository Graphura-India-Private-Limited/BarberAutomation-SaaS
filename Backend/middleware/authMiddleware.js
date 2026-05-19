const jwt      = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Barber   = require("../models/Barber");
const Admin    = require("../models/Admin");
const Salon    = require("../models/Salon");

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ success:false, message:"No token" });
    const token   = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === "barber")      req.user = await Barber.findById(decoded.id).select("-password_hash");
    else if (decoded.role === "admin")  req.user = await Admin.findById(decoded.id).select("-password_hash -mpin_hash");
    else if (decoded.role === "owner")  req.user = await Salon.findById(decoded.id).select("-password_hash");
    else                                req.user = await Customer.findById(decoded.id);
    if (!req.user) return res.status(401).json({ success:false, message:"User not found" });
    req.user.role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ success:false, message:"Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ success:false, message:"Admin access only" });
  next();
};

module.exports = { protect, adminOnly };
