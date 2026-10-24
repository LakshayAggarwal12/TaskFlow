const { getResourceType, buildPublicId } = require("../cloudinaryUpload");

describe("getResourceType", () => {
  test.each([
    ["image/png", "image"],
    ["application/pdf", "image"],
    ["video/mp4", "video"],
    ["audio/mpeg", "video"],
    ["application/zip", "raw"],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "raw"],
    ["application/octet-stream", "raw"],
  ])("%s -> %s", (mimetype, expected) => {
    expect(getResourceType(mimetype)).toBe(expected);
  });

  test("tolerates a missing mimetype", () => {
    expect(getResourceType(undefined)).toBe("raw");
  });
});

describe("buildPublicId", () => {
  test("non-raw types get no custom id (Cloudinary generates one)", () => {
    expect(buildPublicId("photo.png", "image")).toBeUndefined();
  });

  test("raw ids keep the extension and are sanitized", () => {
    const id = buildPublicId("My Report (final).docx", "raw");
    expect(id).toMatch(/^My_Report_final_-[0-9a-f-]{36}\.docx$/);
  });

  test("two uploads of the same filename never collide", () => {
    expect(buildPublicId("a.zip", "raw")).not.toBe(buildPublicId("a.zip", "raw"));
  });

  test("very long names are truncated", () => {
    const id = buildPublicId(`${"x".repeat(300)}.zip`, "raw");
    expect(id.length).toBeLessThan(150);
    expect(id.endsWith(".zip")).toBe(true);
  });
});