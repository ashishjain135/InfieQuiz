// backend/src/models/user.schema.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    number: { type: Number },
    role: { type: String, enum: ["student", "teacher", "admin"], default: "student" }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
