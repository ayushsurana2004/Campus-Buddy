const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    console.log("Register function called");

    try {
        const { email, password } = req.body;
        console.log("Received data:", req.body);

        // Check if user already exists
        let user = await User.findOne({ email });
        console.log("Existing user check result:", user);

        if (user) {
            console.log("User already exists");
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed");

        // Create new User
        user = new User({ email, password: hashedPassword });
        await user.save();
        console.log("User saved:", user);

        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.login = async (req, res) => {
    console.log("Login function called");

    try {
        const { email, password } = req.body;
        console.log("Parsed body:", req.body);

        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            console.log("No user found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            console.log("Incorrect password");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Token created:", token);

        res.json({ token });
    } catch (err) {
        console.error("Full login error:", err); // Log everything!
        res.status(500).json({ message: "Server Error" });
    }
};
