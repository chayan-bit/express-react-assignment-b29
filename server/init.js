require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Puzzle = require("./models/Puzzle");

const cynicalPuzzles = [
  {
    description:
      "A billionaire beats up the mentally ill while wearing a rubber suit.",
    title: "The Dark Knight",
    difficulty: "Easy",
    hint: "Directed by Christopher Nolan. Why so serious?",
    author: null,
  },
  {
    description:
      "An orphaned farm boy joins a religious insurgency to blow up his father's workplace.",
    title: "Star Wars",
    difficulty: "Easy",
    hint: "May the force be with you.",
    author: null,
  },
  {
    description:
      "A group of math nerds get incredibly rich by betting that millions of people will lose their homes and ruin the economy.",
    title: "The Big Short",
    difficulty: "Medium",
    hint: "Based on the 2008 financial housing crash.",
    author: null,
  },
  {
    description:
      "Two grown men scream at a traumatized outcast in the snow for an hour and a half until their hair changes color.",
    title: "Dragon Ball Super Broly",
    difficulty: "Medium",
    hint: "His power level is maximum.",
    author: null,
  },
  {
    description:
      "A socially awkward college student gets dumped and decides to invent a website that permanently ruins global politics and privacy.",
    title: "The Social Network",
    difficulty: "Medium",
    hint: "You don't get to 500 million friends without making a few enemies.",
    author: null,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    await Puzzle.deleteMany();
    await Puzzle.insertMany(cynicalPuzzles);

    console.log("Database Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDB();
