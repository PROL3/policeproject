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
  const { title, description, image } = req.body; // Destructure required fields
  
  if (!title || !description || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newAd = new Ads({ title, description, image }); // Create new ad without `id`
    await newAd.save(); // Save to the database

    res.status(201).json({ ad: newAd }); // Return the created ad
  } catch (err) {
    console.error("Error creating new ad:", err);
    res.status(500).json({ message: "Error creating new ad." });
  }
});
  
router.put("/update/:_ids", async (req, res) => {
  const { _ids } = req.params;  // Extract the IDs from the URL
  const adIds = _ids.split(",");  // Split comma-separated IDs

  const { title, description, image } = req.body;  // Extract data from the request body

  // Validation: Check if required fields are provided
  if (!title || !description || !image) {
    return res.status(400).json({ error: "All fields (title, description, image) are required" });
  }

  try {
    // Update the ads based on the given IDs
    const updatedAds = await Ads.updateOne(
      { _id: { $in: adIds } },  // Find ads with matching IDs
      { $set: { title, description, image } }  // Set the updated values
    );

    // If no ads were updated, send an error
    if (updatedAds.nModified === 0) {
      return res.status(404).json({ error: "No ads found with the provided IDs" });
    }

    // Send a success response
    res.status(200).json({ message: "Ads updated successfully", updatedAds });
  } catch (error) {
    console.error("Error updating ads:", error);
    res.status(500).json({ error: "There was an error updating the ads" });
  }
});

// Delete ads by their MongoDB _id
router.delete('/:ids', async (req, res) => {
  try {
    const ids = req.params.ids.split(',').map(id => id.trim()); // MongoDB _id are strings
    await Ads.deleteMany({ _id: { $in: ids } }); // Delete ads by _id
    res.status(200).json({ message: 'Ads deleted successfully' });
  } catch (error) {
    console.error('Error deleting ads:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports=router;