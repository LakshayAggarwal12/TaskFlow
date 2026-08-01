const GAP = 1000;

// Computes an order value for an item inserted between two neighbors.
// beforeOrder/afterOrder are the order values of the items on either side
// of the drop position (null if dropping at the very start/end).
const computeOrder = (beforeOrder, afterOrder) => {
  if (beforeOrder == null && afterOrder == null) return GAP; // first item in an empty list
  if (beforeOrder == null) return afterOrder - GAP / 2; // dropped at the very start
  if (afterOrder == null) return beforeOrder + GAP; // dropped at the very end
  return (beforeOrder + afterOrder) / 2; // dropped between two items
};

// Order value for a brand-new item appended to the end, given the current max order (or null if empty)
const nextOrder = (maxOrder) => (maxOrder == null ? GAP : maxOrder + GAP);

module.exports = { computeOrder, nextOrder, GAP };
