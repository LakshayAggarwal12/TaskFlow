import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

/**
 * Presentational drag-and-drop file input. Knows nothing about tasks,
 * attachments, or any API — it just reports a chosen file back via
 * onFileSelected. Reused as-is for task attachments now, and for account
 * avatar upload later (Phase 8), so upload UX only has to be built once.
 */
export default function FileUploader({
  onFileSelected,
  accept,
  isUploading = false,
  progress = 0,
  label = "Drop a file here, or click to browse",
  hint,
  className = "",
}) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = (fileList) => {
    const file = fileList?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !isUploading && inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && !isUploading && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isUploading) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!isUploading) handleFiles(e.dataTransfer.files);
      }}
      className={`relative flex flex-col items-center justify-center gap-1.5 px-4 py-5 rounded-md border border-dashed
        transition-colors duration-fast cursor-pointer
        ${isDragOver ? "border-accent bg-accent-muted" : "border-hairline bg-surface2 hover:border-strong"}
        ${isUploading ? "cursor-wait opacity-80" : ""}
        ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {isUploading ? (
        <>
          <Loader2 size={18} className="text-accent animate-spin" />
          <span className="text-caption text-secondary">Uploading{progress ? ` — ${progress}%` : "..."}</span>
        </>
      ) : (
        <>
          <UploadCloud size={18} className="text-tertiary" />
          <span className="text-caption text-secondary text-center">{label}</span>
          {hint && <span className="text-caption text-tertiary">{hint}</span>}
        </>
      )}
    </div>
  );
}