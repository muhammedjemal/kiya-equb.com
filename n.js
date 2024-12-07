const crypto = require("crypto");

function generate4DigitCode(id1, id2) {
  const combined = `${id1}${id2}`; // Concatenate the IDs
  const hash = crypto.createHash("sha256").update(combined).digest("hex"); // Generate a hash
  const numericCode = parseInt(hash.slice(0, 8), 16) % 10000; // Convert to number and reduce to 4 digits
  return numericCode.toString().padStart(4, "0"); // Ensure 4 digits
}

console.log(
  generate4DigitCode("64c65e7831f1b5367e6df819", "64c65e7831f1b5367e6df850")
);
