const fs = require("fs");
const path = require("path");
const textParser = require("../models/textParser");

exports.parseText = (req, res) => {
  const { inputText } = req.body;
  if (!inputText) {
    return res.status(400).json({ error: "No text provided" });
  }

  const result = textParser.parseTextToMap(inputText);
  res.json(result);
};

exports.parseFromFile = (req, res) => {
  const filePath = path.join(__dirname, "../public", "text.txt");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read file" });
    }

    const result = textParser.parseTextToMap(data);
    res.json(result);
  });
};
