import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Image as ImageIcon, Download, Trash2 } from "lucide-react";
import FileUploader from "../../components/ui/FileUploader";
import Skeleton from "../../components/ui/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useAttachments, useUploadAttachment, useDeleteAttachment } from "./hooks/useAttachments";

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function AttachmentIcon({ mimeType }) {
  if (mimeType?.startsWith("image/")) return <ImageIcon size={16} className="text-flow shrink-0" />;
  return <FileText size={16} className="text-tertiary shrink-0" />;
}

export default function AttachmentSection({ taskId }) {
  const { user } = useAuth();
  const toast = useToast();
  const { data: attachments, isLoading } = useAttachments(taskId);
  const uploadAttachment = useUploadAttachment(taskId);
  const deleteAttachment = useDeleteAttachment(taskId);
  const [progress, setProgress] = useState(0);

  const handleFileSelected = (file) => {
    setProgress(0);
    uploadAttachment.mutate(
      {
        file,
        onUploadProgress: (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      },
      {
        onError: (err) => toast.error(err.response?.data?.message || "Upload failed."),
      }
    );
  };

  const handleDelete = (id) => {
    deleteAttachment.mutate(id, {
      onError: (err) => toast.error(err.response?.data?.message || "Couldn't delete this file."),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-h3 text-primary">
        Attachments {attachments?.length > 0 && <span className="text-tertiary font-mono">({attachments.length})</span>}
      </h3>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-11" />
        </div>
      )}

      <AnimatePresence initial={false}>
        {attachments?.map((a) => (
          <motion.div
            key={a._id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="flex items-center gap-2.5 px-3 h-11 rounded-md bg-surface2 border border-hairline"
          >
            <AttachmentIcon mimeType={a.mimeType} />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm text-primary truncate">{a.filename}</p>
              <p className="text-caption text-tertiary">
                {formatBytes(a.size)} · {a.uploadedBy?.name}
              </p>
            </div>
            <a
              href={a.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Download ${a.filename}`}
              className="text-tertiary hover:text-primary transition-colors duration-fast"
            >
              <Download size={15} />
            </a>
            {(a.uploadedBy?._id === user?._id || a.uploadedBy === user?._id) && (
              <button
                onClick={() => handleDelete(a._id)}
                aria-label={`Delete ${a.filename}`}
                className="text-tertiary hover:text-status-danger transition-colors duration-fast"
              >
                <Trash2 size={15} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <FileUploader
        onFileSelected={handleFileSelected}
        isUploading={uploadAttachment.isPending}
        progress={progress}
        label="Drop a file here, or click to browse"
        hint="Up to 10MB"
      />
    </div>
  );
}