require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const { protect } = require("./middleware/auth");
const User = require("./models/User");
const Puzzle = require("./models/Puzzle");

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

//Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (IsUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hasedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hasedPassword });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.status(201).json({
      message: "registered successfully",
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: "Error Registering User" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password " });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.json({
      token,
      userId: user._id,
      username: user.username,
      solved: user.solved,
    });
  } catch (err) {
    res.status(500).json({ message: "Error Logging In User" });
  }
});

// gameplay routes

app.get("/api/puzzles/random", async (req, res) => {
  try {
    const { difficulty } = req.query;
    let matchStage = { author: null };

    if (difficulty) {
      matchStage.difficulty = new RegExp("^${difficult}$", "i");
    }

    const randomPuzzle = await Puzzle.aggregate([
      { $match: matchStage },
      { $sample: { size: 1 } },
      { $project: { title: 0 } },
    ]);

    if (!randomPuzzle.length) {
      return res.status(404).json({ message: "No puzzles found" });
    }

    res.json(randomPuzzle[0]);
  } catch (err) {
    res.status(500).json({ message: "Error Getting Random Puzzle" });
  }
});

app.post("/api/puzzles/guess", async (req, res) => {
  try {
    const { id, guess, userId } = req.body;
    const puzzle = await Puzzle.findById(id);

    if (!puzzle) return res.status(404).json({ error: "Puzzle not found" });

    const cleanStr = (str) =>
      str
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .trim();

    if (cleanStr(puzzle.title) === cleanStr(guess)) {
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { solved: puzzle._id },
        });
      }
      return res.json({ correct: true, message: "Correct!" });
    }

    res.json({ correct: false });
  } catch (err) {
    res.status(500).json({ error: "Error verifying guess" });
  }
});
