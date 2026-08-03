// Mirrors src/utils/ordering.js on the backend exactly, so the optimistic
// UI update during a drag computes the SAME order value the server will
// compute — meaning the card never visibly "jumps" once the real PATCH
// response comes back and React Query reconciles.
const GAP = 1000;

export function computeOrder(beforeOrder, afterOrder) {
  if (beforeOrder == null && afterOrder == null) return GAP;
  if (beforeOrder == null) return afterOrder - GAP / 2;
  if (afterOrder == null) return beforeOrder + GAP;
  return (beforeOrder + afterOrder) / 2;
}

export function nextOrder(maxOrder) {
  return maxOrder == null ? GAP : maxOrder + GAP;
}
