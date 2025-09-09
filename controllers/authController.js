import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../model/authModel.js"; 


// ================== SIGNUP ==================
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Check confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Exclude password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== LOGIN ==================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Exclude password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== LOGOUT ==================
export const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
