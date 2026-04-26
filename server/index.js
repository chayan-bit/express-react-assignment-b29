require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const { protect } = require("./middleware/auth");
const User = require("./models/User");
const Puzzle = require("./models/Puzzle");

const app = express();
connectDB();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

//Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

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
    console.error("Register Error:", err);
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
    console.error("Login Error:", err);
    res.status(500).json({ message: "Error Logging In User" });
  }
});

// gameplay routes

//fetch logic
app.get("/api/puzzles/random", async (req, res) => {
  try {
    const { difficulty } = req.query;
    let matchStage = { author: null };

    if (difficulty) {
      matchStage.difficulty = new RegExp(`^${difficulty}$`, "i");
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
    console.error("Fetch Random Puzzle Error:", err);
    res.status(500).json({ message: "Error Getting Random Puzzle" });
  }
});

//verify logic
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
    console.error("Verify Guess Error:", err);
    res.status(500).json({ error: "Error verifying guess" });
  }
});

//create puzzle route

app.post("/api/puzzles", protect, async (req, res) => {
  try {
    const { description, title, difficulty, hint } = req.body;
    const newPuzzle = await Puzzle.create({
      description,
      title,
      difficulty,
      hint,
      author: req.user._id,
    });

    res.status(201).json(newPuzzle);
  } catch (err) {
    console.error("Create Puzzle Error:", err);
    res.status(500).json({ message: "Error creating puzzle" });
  }
});

//puzzle rating logic
app.post("/api/puzzles/:id/rate", protect, async (req, res) => {
  try {
    const { score } = req.body;
    const puzzleId = req.params.id;
    const userId = req.user._id;

    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) return res.status(404).json({ message: "Puzzle not found" });

    const existingRatingIndex = puzzle.ratings.findIndex(
      (rating) => rating.userId === userId,
    );

    if (existingRatingIndex >= 0) {
      puzzle.ratings[existingRatingIndex].score = score;
    } else {
      puzzle.ratings.push({ userId, score });
      puzzle.ratingCount += 1;
    }

    const totalScore = puzzle.ratings.reduce(
      (acc, curr) => acc + curr.score,
      0,
    );
    puzzle.avgRating = (totalScore / puzzle.ratings.length).toFixed(1);

    await puzzle.save();
    res.json({ message: "Rating saved!", avgRating: puzzle.avgRating });
  } catch (err) {
    console.error("Rate Puzzle Error:", err);
    res.status(500).json({ message: "Error saving rating" });
  }
});

app.get("/api/puzzles/community", async (req, res) => {
  try {
    const { sort = "top" } = req.query;

    let sortConfig = {};
    if (sort === "top") sortConfig = { avgRating: -1 };
    if (sort === "popular") sortConfig = { ratingCount: -1 };

    const puzzles = await Puzzle.find({ author: { $ne: null } })
      .sort(sortConfig)
      .limit(20)
      .populate("author", "username");

    const safePuzzles = puzzles.map((p) => {
      const doc = p.toObject();
      delete doc.title;
      return doc;
    });

    res.json(safePuzzles);
  } catch (err) {
    console.error("Fetch Community Puzzles Error:", err);
    res.status(500).json({ error: "Failed to fetch community puzzles" });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaders = await User.aggregate([
      { $project: { username: 1, score: { $size: "$solved" } } },
      { $sort: { score: -1 } },
      { $limit: 10 },
    ]);
    res.json(leaders);
  } catch (err) {
    console.error("Fetch Leaderboard Error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
