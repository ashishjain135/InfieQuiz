// backend/server.js
import express from "express";
import connectToDatabase from "./src/utility/dbConnect.js";
import userRouter from "./src/routes/user.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// mount routes
app.use("/api/users", userRouter);

// health
app.get("/", (req, res) => res.json({ ok: true, msg: "infieQuiz backend running" }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/infiequiz";

connectToDatabase(MONGO_URI)
  .then(() => {
    console.log("Connected to DataBase");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
