const mongoose=require("mongoose");

const adSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Store image file name (or path) here
  });

const Ads = mongoose.model("Ads", adSchema);
module.exports=Ads;