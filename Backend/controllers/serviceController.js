const Service = require("../models/Service");
const Salon = require("../models/Salon");

// @desc    Get all active services of a specific salon
// @route   GET /api/services/:salon_id
// @access  Public
exports.getSalonServices = async (req, res) => {
  try {
    const services = await Service.find({
      salon_id: req.params.salon_id,
      is_active: true
    });

    res.json({ success: true, services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Owner/Admin)
exports.createService = async (req, res) => {
  try {
    const salon = await Salon.findById(req.body.salon_id);
    if (!salon || salon.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Salon approval required before managing services"
      });
    }

    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Soft delete a service
// @route   DELETE /api/services/:id
// @access  Private (Owner/Admin)
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndUpdate(req.params.id, { is_active: false });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a service (including toggle is_active)
// @route   PUT /api/services/:id
// @access  Private (Owner/Admin/Barber)
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
