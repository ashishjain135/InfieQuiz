// backend/src/controllers/auth.Controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.schema.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";

// register
export const register = async (req, res) => {
  try {
    console.log("Register request:", req.body);

    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const userCreated = await User.create({ email, password: hashed, name });

    if (!userCreated) {
      return res.status(500).json({ message: "User creation failed" });
    }

    res.status(201).json({ message: "User registered successfully", user: { id: userCreated._id, email: userCreated.email, name: userCreated.name } });
  } catch (error) {
    console.error("Error in user registration", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (!userExists) return res.status(400).json({ message: "User does not exist" });

    const matched = await bcrypt.compare(password, userExists.password);
    if (!matched) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: userExists._id, email: userExists.email, role: userExists.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ token, message: `${userExists.name} logged in successfully` });
  } catch (error) {
    console.error("Error in user login", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
