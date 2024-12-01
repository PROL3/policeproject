const router = require("express").Router();
const Ads = require("../model/ads");

router.get("/ads",async(req,res)=>{
    try {
        const ads=await Ads.find();
        res.status(200).json({ads});
    }catch(err){
        res.status(500).json({message:'server error'});
    }
})

router.post("/ads",async(req,res)=>{
    const {}=req.body
    try {
        const newAds=new Ads({});
        await newAds.save();
        res.status(201).json({ads: newAds});
    }catch(err){
        res.status(500).json({message:'error creating new ads'});
    }
})

module.exports=router;