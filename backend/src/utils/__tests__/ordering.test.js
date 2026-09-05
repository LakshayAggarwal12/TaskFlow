const { computeOrder, nextOrder, GAP } = require("../ordering");

describe("computeOrder", () => {
  test("returns the base gap when the list is empty", () => {
    expect(computeOrder(null, null)).toBe(GAP);
  });

  test("returns a value below the first item when dropped at the start", () => {
    const result = computeOrder(null, 2000);
    expect(result).toBe(2000 - GAP / 2);
    expect(result).toBeLessThan(2000);
  });

  test("returns a value above the last item when dropped at the end", () => {
    const result = computeOrder(1000, null);
    expect(result).toBe(1000 + GAP);
    expect(result).toBeGreaterThan(1000);
  });

  test("returns the midpoint when dropped between two items", () => {
    expect(computeOrder(1000, 2000)).toBe(1500);
  });

  test("stays strictly between neighbors even after repeated inserts", () => {
    // Simulates dragging into the same gap several times in a row —
    // this is the scenario that actually breaks a naive implementation.
    let before = 1000;
    let after = 2000;
    for (let i = 0; i < 10; i++) {
      const mid = computeOrder(before, after);
      expect(mid).toBeGreaterThan(before);
      expect(mid).toBeLessThan(after);
      after = mid; // next insert goes into the now-smaller gap
    }
  });
});

describe("nextOrder", () => {
  test("returns the base gap for the first item in an empty list", () => {
    expect(nextOrder(null)).toBe(GAP);
  });

  test("appends one full gap past the current max", () => {
    expect(nextOrder(3000)).toBe(3000 + GAP);
  });
});