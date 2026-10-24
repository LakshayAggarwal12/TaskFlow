const fs = require("fs");
const path = require("path");
const Activity = require("../Activity");

// logActivity is fire-and-forget and swallows errors by design, so an
// invalid targetType doesn't crash anything — the activity entry just
// silently never gets written. This test makes that failure loud: every
// targetType any controller passes to logActivity must be a valid enum value.
describe("Activity.targetType", () => {
  test("accepts every targetType used by the controllers", () => {
    const controllersDir = path.join(__dirname, "../../controllers");
    const used = new Set();
    for (const file of fs.readdirSync(controllersDir).filter((f) => f.endsWith(".js"))) {
      const source = fs.readFileSync(path.join(controllersDir, file), "utf8");
      for (const match of source.matchAll(/targetType:\s*"([A-Za-z]+)"/g)) used.add(match[1]);
    }

    expect(used.size).toBeGreaterThan(0);
    const allowed = Activity.schema.path("targetType").enumValues;
    const missing = [...used].filter((t) => !allowed.includes(t));
    expect(missing).toEqual([]);
  });
});