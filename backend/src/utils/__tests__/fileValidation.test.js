const { validateFile, isTypeAllowed, MAX_FILE_SIZE_BYTES } = require("../fileValidation");

describe("isTypeAllowed", () => {
  test("accepts a recognized mimetype directly", () => {
    expect(isTypeAllowed({ mimetype: "application/pdf", filename: "doc.pdf" })).toEqual({ ok: true });
  });

  test("rejects a disallowed, specific mimetype", () => {
    const result = isTypeAllowed({ mimetype: "application/x-msdownload", filename: "virus.exe" });
    expect(result.ok).toBe(false);
  });

  test("falls back to extension when the browser reports generic octet-stream", () => {
    // The real bug this covers: Windows/browser combos often report .docx,
    // .zip, .xlsx as application/octet-stream instead of their real type.
    expect(isTypeAllowed({ mimetype: "application/octet-stream", filename: "report.docx" })).toEqual({ ok: true });
    expect(isTypeAllowed({ mimetype: "application/octet-stream", filename: "archive.zip" })).toEqual({ ok: true });
    expect(isTypeAllowed({ mimetype: "application/octet-stream", filename: "sheet.xlsx" })).toEqual({ ok: true });
  });

  test("still rejects a disallowed extension even under octet-stream", () => {
    const result = isTypeAllowed({ mimetype: "application/octet-stream", filename: "virus.exe" });
    expect(result.ok).toBe(false);
  });

  test("rejects a file with no extension at all under octet-stream", () => {
    const result = isTypeAllowed({ mimetype: "application/octet-stream", filename: "noextension" });
    expect(result.ok).toBe(false);
  });
});

describe("validateFile", () => {
  test("accepts an allowed type under the size limit", () => {
    expect(validateFile({ mimetype: "application/pdf", filename: "doc.pdf", size: 1024 })).toEqual({ ok: true });
  });

  test("accepts an octet-stream file with a good extension, under the size limit", () => {
    expect(validateFile({ mimetype: "application/octet-stream", filename: "report.docx", size: 1024 })).toEqual({
      ok: true,
    });
  });

  test("rejects a file over the size limit even if the type is fine", () => {
    const result = validateFile({ mimetype: "image/png", filename: "big.png", size: MAX_FILE_SIZE_BYTES + 1 });
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/exceeds/);
  });

  test("accepts a file exactly at the size limit", () => {
    expect(validateFile({ mimetype: "image/png", filename: "at-limit.png", size: MAX_FILE_SIZE_BYTES })).toEqual({
      ok: true,
    });
  });
});