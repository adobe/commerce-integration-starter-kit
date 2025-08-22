const util = require("node:util");

const LAST_RETURN_CHAR = "└── ";
const RETURN_CHAR = "├── ";

/**
 * Format an array of items to report an error message for each item.
 *
 * @param {Array} items - The array of items to format.
 * @param {Function} applyMessage - A function that takes the current item and returns the error for that item.
 */
function arrayItemsErrorFormat(items, applyMessage) {
  return items
    .map((item, index) => {
      const isLast = index === items.length - 1;
      const returnChar = isLast ? LAST_RETURN_CHAR : RETURN_CHAR;

      const message = applyMessage(item);
      return `${returnChar}${message}`;
    })
    .join("\n");
}

/**
 * Make an error object with a code, label, and payload.
 *
 * @param {string} label - The error label.
 * @param {string} reason - The error reason.
 * @param {object} payload - The error payload.
 */
function makeError(label, reason, payload = {}) {
  return {
    success: false,
    error: {
      label,
      reason,
      payload,
    },
  };
}

/**
 * Format an error object to be logged to the console.
 * It uses util.inspect to format the error object and log at maximum depth.
 *
 * @param {object} error - The error object to format.
 */
function formatError(error) {
  return util.inspect(error, {
    sorted: true,
    depth: null,
    colors: true,
    maxStringLength: Number.POSITIVE_INFINITY,
  });
}

module.exports = {
  makeError,
  arrayItemsErrorFormat,
  formatError,
};
