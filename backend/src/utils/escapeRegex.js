// Escapes regex special characters so user- or AI-derived strings can be
// safely used inside a MongoDB $regex filter without behaving like a pattern.
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = escapeRegex;
