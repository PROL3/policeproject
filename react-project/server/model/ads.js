const mongoose=require("mongoose");

const adSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Store image file name (or path) here
  });

const Ads = mongoose.model("ads", adSchema);
module.exports=Ads;