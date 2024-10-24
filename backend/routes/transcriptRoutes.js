const express = require("express");
const Transcript = require("../models/Transcript");
const router = express.Router();

// POST route to save transcription
router.post("/save", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }
  try {
    const transcript = new Transcript({ text });
    await transcript.save();
    res.status(201).json({ message: "Transcript saved", transcript });
  } catch (error) {
    res.status(500).json({ message: "Error saving transcript", error });
  }
});

module.exports = router;
