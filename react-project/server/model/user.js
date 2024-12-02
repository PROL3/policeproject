const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    email:{type:String,require:true,unique:true},
    password:{type:String,require:true},
    role:{type:String,require:true}
})

const UserModel=mongoose.model("users",UserSchema);
module.exports=UserModel;