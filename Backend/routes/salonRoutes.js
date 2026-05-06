const express=require("express");const router=express.Router();const Salon=require("../models/Salon");const{protect}=require("../middleware/authMiddleware");
router.post("/register",async(req,res)=>{try{const salon=await Salon.create(req.body);res.status(201).json({success:true,salon});}catch(err){res.status(500).json({success:false,message:err.message});}});
router.get("/",async(req,res)=>{try{const salons=await Salon.find({status:"approved"});res.json({success:true,salons});}catch(err){res.status(500).json({success:false,message:err.message});}});
router.get("/nearby",async(req,res)=>{try{const salons=await Salon.find({status:"approved"});res.json({success:true,salons});}catch(err){res.status(500).json({success:false,message:err.message});}});
router.get("/:id",async(req,res)=>{try{const salon=await Salon.findById(req.params.id);if(!salon)return res.status(404).json({success:false,message:"Not found"});res.json({success:true,salon});}catch(err){res.status(500).json({success:false,message:err.message});}});
module.exports=router;
