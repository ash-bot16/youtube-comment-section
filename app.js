/**
 * Inclusive Commenting System – Executable Demo
 * Tech Stack: Node.js + Express
 * Run: node app.js
 */

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let comments = [];
let commentId = 1;

// Utility: block special characters
function hasSpecialCharacters(text) {
  return /[^a-zA-Z0-9\s.,!?]/.test(text);
}

// Utility: fake translator (demo)
function translate(text, targetLang) {
  return `[Translated to ${targetLang}]: ${text}`;
}

// POST a comment
app.post("/comment", (req, res) => {
  const { username, city, language, text } = req.body;

  if (!username || !city || !language || !text) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (hasSpecialCharacters(text)) {
    return res
      .status(403)
      .json({ error: "Comments with special characters are blocked" });
  }

  const comment = {
    id: commentId++,
    username,
    city,
    language,
    text,
    likes: 0,
    dislikes: 0,
  };

  comments.push(comment);
  res.json({ message: "Comment posted", comment });
});

// GET all comments
app.get("/comments", (req, res) => {
  res.json(comments);
});

// TRANSLATE comment
app.get("/translate/:id/:lang", (req, res) => {
  const { id, lang } = req.params;
  const comment = comments.find(c => c.id == id);

  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  res.json({
    original: comment.text,
    translated: translate(comment.text, lang),
  });
});

// LIKE comment
app.post("/like/:id", (req, res) => {
  const comment = comments.find(c => c.id == req.params.id);
  if (!comment) return res.status(404).json({ error: "Comment not found" });

  comment.likes++;
  res.json({ message: "Liked", likes: comment.likes });
});

// DISLIKE comment
app.post("/dislike/:id", (req, res) => {
  const index = comments.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: "Comment not found" });

  comments[index].dislikes++;

  // Auto-remove if 2 dislikes
  if (comments[index].dislikes >= 2) {
    comments.splice(index, 1);
    return res.json({ message: "Comment removed due to dislikes" });
  }

  res.json({ message: "Disliked", dislikes: comments[index].dislikes });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
