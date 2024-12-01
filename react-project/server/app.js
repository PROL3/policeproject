const express = require("express");
const connectDB=require("./db/connectDB")
const cors=require("cors")
const app=express();
const authRoutes=require("./routes/auth")
const adsRoutes=require("./routes/ads")

app.use(express.json())
connectDB()
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
  }));

app.use("/api/auth", authRoutes);  // Routes for authentication
app.use("/api/ads", adsRoutes);    // Routes for ads
const port=3000;
app.listen(port,()=>{
    console.log("server is running on port "+"http://localhost:"+port)
})
