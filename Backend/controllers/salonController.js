const Salon = require("../models/Salon");

// @desc    Register a new salon
// @route   POST /api/salon/register
// @access  Public
exports.registerSalon = async (req, res) => {
  try {
    const salon = await Salon.create({
      ...req.body,
      status: "pending",
      rejection_reason: "",
      submitted_at: new Date()
    });

    res.status(201).json({
      success: true,
      salon,
      message: "Salon submitted for approval"
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all approved salons
// @route   GET /api/salon
// @access  Public
exports.getApprovedSalons = async (req, res) => {
  try {
    const salons = await Salon.find({ status: "approved" });
    res.json({ success: true, salons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get nearby approved salons
// @route   GET /api/salon/nearby
// @access  Public
exports.getNearbySalons = async (req, res) => {
  try {
    const salons = await Salon.find({ status: "approved" });
    res.json({ success: true, salons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get a single approved salon by ID
// @route   GET /api/salon/:id
// @access  Public
exports.getSalonById = async (req, res) => {
  try {
    const salon = await Salon.findOne({
      _id: req.params.id,
      status: "approved"
    });

    if (!salon) {
      return res.status(404).json({ success: false, message: "Salon is not live" });
    }

    res.json({ success: true, salon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
