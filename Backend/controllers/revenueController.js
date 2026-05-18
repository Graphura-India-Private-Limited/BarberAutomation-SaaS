const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const asyncHandler = require("../utils/asyncHandler");

const toDateRange = query => {
  const match = {};
  if (query.from || query.to || query.date) {
    match.created_at = {};
    const from = query.date || query.from;
    const to = query.date || query.to;
    if (from) match.created_at.$gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      match.created_at.$lte = end;
    }
  }
  return match;
};

const baseMatch = req => {
  const match = { status: "SUCCESS", ...toDateRange(req.query) };
  if (req.user?.role === "owner") match.salon_id = req.user._id;
  else if (req.query.salonId && mongoose.isValidObjectId(req.query.salonId)) {
    match.salon_id = new mongoose.Types.ObjectId(req.query.salonId);
  }
  return match;
};

const totalRevenuePipeline = match => [
  { $match: match },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$amount" },
      tokenRevenue: { $sum: { $cond: [{ $eq: ["$payment_type", "TOKEN"] }, "$amount", 0] } },
      fullRevenue: { $sum: { $cond: [{ $eq: ["$payment_type", "FULL"] }, "$amount", 0] } },
      transactionCount: { $sum: 1 },
    },
  },
];

const getTotalRevenue = asyncHandler(async (req, res) => {
  const [summary] = await Payment.aggregate(totalRevenuePipeline(baseMatch(req)));
  res.json({
    success: true,
    revenue: summary || { totalRevenue: 0, tokenRevenue: 0, fullRevenue: 0, transactionCount: 0 },
  });
});

const getDailyRevenue = asyncHandler(async (req, res) => {
  const today = req.query.date ? new Date(req.query.date) : new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);
  const match = { ...baseMatch(req), created_at: { $gte: today, $lte: end } };
  const [summary] = await Payment.aggregate(totalRevenuePipeline(match));
  res.json({
    success: true,
    date: today,
    revenue: summary || { totalRevenue: 0, tokenRevenue: 0, fullRevenue: 0, transactionCount: 0 },
  });
});

const getServiceWiseRevenue = asyncHandler(async (req, res) => {
  const rows = await Payment.aggregate([
    { $match: baseMatch(req) },
    { $unwind: "$service_ids" },
    {
      $lookup: {
        from: "services",
        localField: "service_ids",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$service_ids",
        serviceName: { $first: { $ifNull: ["$service.name", "Service"] } },
        revenue: { $sum: "$amount" },
        transactions: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
  ]);
  res.json({ success: true, services: rows });
});

const getBarberWiseRevenue = asyncHandler(async (req, res) => {
  const rows = await Payment.aggregate([
    { $match: { ...baseMatch(req), barber_id: { $ne: null } } },
    {
      $lookup: {
        from: "barbers",
        localField: "barber_id",
        foreignField: "_id",
        as: "barber",
      },
    },
    { $unwind: { path: "$barber", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$barber_id",
        barberName: { $first: { $ifNull: ["$barber.name", "Unassigned"] } },
        revenue: { $sum: "$amount" },
        transactions: { $sum: 1 },
        tokenRevenue: { $sum: { $cond: [{ $eq: ["$payment_type", "TOKEN"] }, "$amount", 0] } },
        fullRevenue: { $sum: { $cond: [{ $eq: ["$payment_type", "FULL"] }, "$amount", 0] } },
      },
    },
    { $sort: { revenue: -1 } },
  ]);
  res.json({ success: true, barbers: rows });
});

const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();
  const match = {
    ...baseMatch(req),
    created_at: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) },
  };
  const rows = await Payment.aggregate([
    { $match: match },
    {
      $group: {
        _id: { month: { $month: "$created_at" } },
        revenue: { $sum: "$amount" },
        tokenRevenue: { $sum: { $cond: [{ $eq: ["$payment_type", "TOKEN"] }, "$amount", 0] } },
        fullRevenue: { $sum: { $cond: [{ $eq: ["$payment_type", "FULL"] }, "$amount", 0] } },
        transactions: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);
  res.json({ success: true, year, monthly: rows.map(row => ({ month: row._id.month, ...row })) });
});

const getRevenueTrends = asyncHandler(async (req, res) => {
  const days = Math.min(Math.max(Number(req.query.days) || 14, 1), 90);
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  const match = { ...baseMatch(req), created_at: { $gte: start } };

  const rows = await Payment.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
        revenue: { $sum: "$amount" },
        tokenRevenue: { $sum: { $cond: [{ $eq: ["$payment_type", "TOKEN"] }, "$amount", 0] } },
        fullRevenue: { $sum: { $cond: [{ $eq: ["$payment_type", "FULL"] }, "$amount", 0] } },
        transactions: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json({ success: true, trends: rows.map(row => ({ date: row._id, ...row })) });
});

const getRevenueDashboard = asyncHandler(async (req, res) => {
  const match = baseMatch(req);
  const [total, services, barbers, trends] = await Promise.all([
    Payment.aggregate(totalRevenuePipeline(match)),
    Payment.aggregate([
      { $match: match },
      { $unwind: "$service_ids" },
      { $lookup: { from: "services", localField: "service_ids", foreignField: "_id", as: "service" } },
      { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$service_ids", serviceName: { $first: { $ifNull: ["$service.name", "Service"] } }, revenue: { $sum: "$amount" }, transactions: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
    ]),
    Payment.aggregate([
      { $match: { ...match, barber_id: { $ne: null } } },
      { $lookup: { from: "barbers", localField: "barber_id", foreignField: "_id", as: "barber" } },
      { $unwind: { path: "$barber", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$barber_id", barberName: { $first: { $ifNull: ["$barber.name", "Unassigned"] } }, revenue: { $sum: "$amount" }, transactions: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
    ]),
    Payment.aggregate([
      { $match: match },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } }, revenue: { $sum: "$amount" }, transactions: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 31 },
    ]),
  ]);

  res.json({
    success: true,
    summary: total[0] || { totalRevenue: 0, tokenRevenue: 0, fullRevenue: 0, transactionCount: 0 },
    services,
    barbers,
    trends: trends.map(row => ({ date: row._id, ...row })),
  });
});

module.exports = {
  getDailyRevenue,
  getTotalRevenue,
  getServiceWiseRevenue,
  getBarberWiseRevenue,
  getMonthlyRevenue,
  getRevenueTrends,
  getRevenueDashboard,
};
