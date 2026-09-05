// Pure validation logic, extracted from the multer middleware so it can be
// unit tested without mocking multer/Cloudinary at all.
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

// Mimetype -> allowed. Kept as the primary check since it's the most
// reliable signal when the browser/OS reports it correctly.
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/json",
]);

// Extension fallback for the "application/octet-stream" case: many OS/browser
// combinations (Windows especially) report this generic type for perfectly
// normal files — .docx, .zip, .xlsx, etc. — when the OS's own file-type
// registry doesn't have an entry for them. Rejecting on mimetype alone in
// that case blocks legitimate uploads, so we fall back to the extension.
const ALLOWED_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "webp",
  "pdf", "txt", "csv", "json",
  "doc", "docx", "xls", "xlsx", "zip",
]);

const GENERIC_MIME_TYPES = new Set(["application/octet-stream", "", undefined, null]);

const getExtension = (filename = "") => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : null;
};

// Type check only — used by multer's fileFilter, which runs before the
// file's size is known.
const isTypeAllowed = ({ mimetype, filename }) => {
  if (ALLOWED_MIME_TYPES.has(mimetype)) return { ok: true };

  if (GENERIC_MIME_TYPES.has(mimetype)) {
    const ext = getExtension(filename);
    if (ext && ALLOWED_EXTENSIONS.has(ext)) return { ok: true };
    return { ok: false, reason: `File type '.${ext || "unknown"}' is not allowed` };
  }

  return { ok: false, reason: `File type '${mimetype}' is not allowed` };
};

// Full check (type + size) — used as the final safety-net check in the
// controller, once the whole file is buffered and its real size is known.
const validateFile = ({ mimetype, size, filename }) => {
  const typeResult = isTypeAllowed({ mimetype, filename });
  if (!typeResult.ok) return typeResult;

  if (size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, reason: `File exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit` };
  }
  return { ok: true };
};

module.exports = { validateFile, isTypeAllowed, MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS };