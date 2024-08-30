function parseTextToMap(text) {
  if (typeof text !== "string") {
    throw new TypeError("Input must be a string");
  }

  if (!text.trim()) {
    return "No text provided";
  }

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const result = {};
  let currentMainKey = "";
  let currentSubKey = "";
  let currentDefinition = "";
  let inDefinition = false;

  for (const line of lines) {
    const mainSectionMatch = line.match(/^(\d+(\.\d+)*)\s*\.?\s*(.*)/);
    const subpointMatch = line.match(/^\(([a-z])\)\s*(.*)/i);
    const definitionMatch = line.match(/^"([^"]+)"\s+means\s+(.*)/);

    if (mainSectionMatch) {
      currentMainKey = mainSectionMatch[1];
      currentSubKey = "";
      inDefinition = false;
      result[currentMainKey] = mainSectionMatch[3].trim();
    } else if (subpointMatch && currentMainKey) {
      currentSubKey = `${currentMainKey}.${subpointMatch[1]}`;
      result[currentSubKey] = subpointMatch[2];
    } else if (definitionMatch) {
      currentDefinition = definitionMatch[1];
      inDefinition = true;
      if (currentMainKey) {
        if (!result[currentMainKey]) result[currentMainKey] = {};
        result[currentMainKey][currentDefinition] = definitionMatch[2];
      }
    } else if (inDefinition && currentMainKey) {
      result[currentMainKey][currentDefinition] += " " + line;
    } else if (currentSubKey) {
      result[currentSubKey] += " " + line;
    } else if (currentMainKey) {
      result[currentMainKey] += " " + line;
    }
  }

  return result;
}

module.exports = { parseTextToMap };
