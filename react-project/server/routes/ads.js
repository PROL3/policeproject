const router = require("express").Router();
const Ads = require("../model/ads");

router.get("/getads",async(req,res)=>{
    try {
        const ads=await Ads.find();
        console.log(ads);
        res.status(200).json({ads});
    }catch(err){
        res.status(500).json({message:'server error'});
    }
})

router.post("/newads", async (req, res) => {
    const { id, title, description, image } = req.body; // Destructure required fields
    
    if (!id || !title || !description || !image) {
      return res.status(400).json({ message: "All fields are required." }); // Validate input
    }  
    try {
      const newAds = new Ads({ id, title, description, image }); // Create new ad
      await newAds.save(); // Save to the database
  
      res.status(201).json({ ads: newAds }); // Return the created ad
    } catch (err) {
      console.error("Error creating new ad:", err);
      res.status(500).json({ message: "Error creating new ad." }); // Handle errors
    }
  });
  


router.delete('/:ids', async (req, res) => {
    try {
      const ids = req.params.ids.split(',').map(id => Number(id)); // Convert IDs to numbers
      await Ads.deleteMany({ id: { $in: ids } });
      res.status(200).json({ message: 'Ads deleted successfully' });
    } catch (error) {
      console.error('Error deleting ads:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports=router;