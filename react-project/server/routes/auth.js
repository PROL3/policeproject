// loginRoute.js
const router = require("express").Router();
const UserModel = require("../model/user"); // Import your UserModel

// Login route
router.post("/login", async (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
    // If user not found
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const isMatch= password==user.password ;
    // If passwords don't match
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    res.status(200).json({ message: "Login successful" /*, token: token */ });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
