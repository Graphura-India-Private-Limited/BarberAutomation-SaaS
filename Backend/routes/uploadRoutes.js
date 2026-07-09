const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { file } = req.body;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file content provided" });
    }

    // Upload base64 string directly to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(file, {
      folder: "barber_saas",
      resource_type: "auto"
    });

    res.json({
      success: true,
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
