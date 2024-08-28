const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3001;

app.use(express.json());

const parseTextToMap = (text) => {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const extractedData = [];
  let currentEntry = null;
  let currentSubEntry = null;
  let currentSubSubEntry = null;

  const addEntry = (key, value) => {
    extractedData.push({ key, value });
    return extractedData.length - 1;
  };

  const updateEntry = (index, value) => {
    extractedData[index].value += " " + value;
  };

  lines.forEach((line) => {
    const paragraphText = line.trim();
    const level1Match = paragraphText.match(/^(\d+)\.?\s(.*)$/);
    const level2Match = paragraphText.match(/^([a-z])\)(.*)$/);
    const level3Match = paragraphText.match(/^\(([ivx]+)\)\s(.*)$/);

    if (level1Match) {
      currentEntry = addEntry(level1Match[1], level1Match[2]);
      currentSubEntry = null;
      currentSubSubEntry = null;
    } else if (level2Match && currentEntry !== null) {
      const key = `${extractedData[currentEntry].key}.${level2Match[1]}`;
      currentSubEntry = addEntry(key, level2Match[2].trim());
      currentSubSubEntry = null;
    } else if (level3Match && currentSubEntry !== null) {
      const key = `${extractedData[currentSubEntry].key}.${level3Match[1]}`;
      currentSubSubEntry = addEntry(key, level3Match[2]);
    } else if (currentSubSubEntry !== null) {
      updateEntry(currentSubSubEntry, paragraphText);
    } else if (currentSubEntry !== null) {
      updateEntry(currentSubEntry, paragraphText);
    } else if (currentEntry !== null) {
      updateEntry(currentEntry, paragraphText);
    }
  });

  return Object.fromEntries(
    extractedData.map(({ key, value }) => [key, value])
  );
};

app.post("/parse", (req, res) => {
  const { inputText } = req.body;
  if (!inputText) {
    return res.status(400).json({ error: "No text provided" });
  }

  const result = parseTextToMap(inputText);
  res.json(result);
});

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "text.txt");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(400).json({ error: "Failed to read file" });
    }

    const result = parseTextToMap(data);
    res.json(result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
