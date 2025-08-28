const fs = require("node:fs");

/**
 * Upserts values into an environment file (.env format)
 * Handles both commented and uncommented entries
 *
 * @param {string} filePath - Path to the env file
 * @param {Object} updates - Key-value pairs to upsert
 * @param {Object} options - Optional configuration
 * @param {boolean} options.uncomment - Whether to uncomment existing commented entries (default: true)
 * @param {boolean} options.createIfMissing - Create file if it doesn't exist (default: true)
 * @returns {void}
 */

const COMMENTED_MATCH = /^#\s*([^=]+)=(.*)$/;
const UNCOMMENTED_MATCH = /^([^#][^=]*)=(.*)$/;

/**
 * Processes a single line of the env file
 * @param {string} line - The line to process
 * @param {Object} updates - Updates to apply
 * @param {boolean} uncomment - Whether to uncomment
 * @param {Set} updatedKeys - Set of already updated keys
 * @returns {string} The processed line
 */
function processLine(line, updates, uncomment, updatedKeys) {
  if (!line.trim() || (line.trim().startsWith("#") && !line.includes("="))) {
    return line;
  }

  const commentedMatch = line.match(COMMENTED_MATCH);
  const uncommentedMatch = line.match(UNCOMMENTED_MATCH);

  if (!(commentedMatch || uncommentedMatch)) {
    return line;
  }

  const key = (commentedMatch ? commentedMatch[1] : uncommentedMatch[1]).trim();

  if (!Object.hasOwn(updates, key)) {
    return line;
  }

  updatedKeys.add(key);
  const newValue = updates[key];

  if ((commentedMatch && uncomment) || uncommentedMatch) {
    return `${key}=${newValue}`;
  }
  return `# ${key}=${newValue}`;
}

function upsertEnvFile(filePath, updates, options = {}) {
  const { uncomment = true, createIfMissing = false } = options;

  let content = "";
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, "utf8");
  } else if (!createIfMissing) {
    throw new Error(`File does not exist: ${filePath}`);
  }

  const lines = content.split("\n");
  const updatedKeys = new Set();

  const processedLines = lines.map((line) =>
    processLine(line, updates, uncomment, updatedKeys),
  );

  for (const [key, value] of Object.entries(updates)) {
    if (!updatedKeys.has(key)) {
      if (processedLines.length > 0 && processedLines.at(-1).trim() !== "") {
        // processedLines.push("");
      }
      processedLines.push(`${key}=${value}`);
    }
  }

  const finalContent = processedLines.join("\n");
  fs.writeFileSync(filePath, finalContent, "utf8");
}

module.exports = {
  upsertEnvFile,
};
