const mongoose =require("mongoose")
const connectDB=async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/liav")
        console.log("mongoose connected")
        
    } catch (error) {
        
    }
}
module.exports=connectDB;