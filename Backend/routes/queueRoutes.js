const express=require("express");const router=express.Router();const Queue=require("../models/Queue");const{protect}=require("../middleware/authMiddleware");
router.get("/:salon_id", protect, async (req, res, next) => {
  try {
    const mongoose = require("mongoose");
    const { salon_id } = req.params;

    // ✅ Defensive check: If the passed ID isn't a valid ObjectId format, safely exit instead of crashing
    if (!mongoose.Types.ObjectId.isValid(salon_id)) {
      return res.status(200).json({ success: true, queue: [] });
    }

    const queue = await Queue.find({ 
      salon_id: salon_id, 
      status: { $in: ["waiting", "in-progress", "paused"] } 
    }).populate("customer_id");

    res.status(200).json({ success: true, queue });
  } catch (error) {
    next(error); // Passes execution down safely to server error boundary middleware
  }
});
router.put("/:queue_id/status",protect,async(req,res)=>{try{const entry=await Queue.findByIdAndUpdate(req.params.queue_id,{status:req.body.status},{new:true});res.json({success:true,entry});}catch(err){res.status(500).json({success:false,message:err.message});}});
module.exports=router;
