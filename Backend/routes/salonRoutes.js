const express=require("express");const router=express.Router();const Salon=require("../models/Salon");const{protect}=require("../middleware/authMiddleware");
router.post("/register",async(req,res)=>{try{const salon=await Salon.create({...req.body,status:"pending",rejection_reason:"",submitted_at:new Date()});res.status(201).json({success:true,salon,message:"Salon submitted for approval"});}catch(err){res.status(500).json({success:false,message:err.message});}});
router.get("/",async(req,res)=>{try{const salons=await Salon.find({status:"approved"});res.json({success:true,salons});}catch(err){res.status(500).json({success:false,message:err.message});}});
router.get("/nearby",async(req,res)=>{try{const salons=await Salon.find({status:"approved"});res.json({success:true,salons});}catch(err){res.status(500).json({success:false,message:err.message});}});
router.get("/:id",async(req,res)=>{try{const salon=await Salon.findOne({_id:req.params.id,status:"approved"});if(!salon)return res.status(404).json({success:false,message:"Salon is not live"});res.json({success:true,salon});}catch(err){res.status(500).json({success:false,message:err.message});}});
module.exports=router;
