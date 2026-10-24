import { useState } from "react";
import { FileText, Image as ImageIcon, X } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import FileUploader from "../../components/ui/FileUploader";
import { useToast } from "../../context/ToastContext";
import { useCreateSubmission } from "./hooks/useSubmissions";

const MAX_FILES = 5;

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// The short form behind the "Submit for Review" action: a note plus up to
// 5 files, sent as one request. This is what actually gates a task from
// entering a Done list — see backend's submissionGate.js.
export default function SubmissionModal({ taskId, isOpen, onClose }) {
  const toast = useToast();
  const createSubmission = useCreateSubmission(taskId);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);

  const reset = () => {
    setNotes("");
    setFiles([]);
  };

  const handleClose = () => {
    if (createSubmission.isPending) return;
    reset();
    onClose();
  };

  const addFile = (file) => {
    if (files.length >= MAX_FILES) {
      toast.error(`You can attach up to ${MAX_FILES} files.`);
      return;
    }
    setFiles((prev) => [...prev, file]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!notes.trim()) {
      toast.error("Add a short note describing what was done.");
      return;
    }
    createSubmission.mutate(
      { notes: notes.trim(), files },
      {
        onSuccess: () => {
          toast.success("Submitted for review.");
          reset();
          onClose();
        },
        onError: (err) => toast.error(err.response?.data?.message || "Couldn't submit this task."),
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Submit for review">
      <div className="flex flex-col gap-4">
        <Textarea
          label="What did you do?"
          name="submission-notes"
          placeholder="Briefly describe what was completed..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          autoFocus
        />

        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-secondary font-medium">
            Attachments <span className="text-tertiary font-normal">(optional, up to {MAX_FILES})</span>
          </span>

          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-2.5 px-3 h-10 rounded-md bg-surface2 border border-hairline"
            >
              {file.type.startsWith("image/") ? (
                <ImageIcon size={15} className="text-accent shrink-0" />
              ) : (
                <FileText size={15} className="text-tertiary shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-primary truncate">{file.name}</p>
              </div>
              <span className="text-caption text-tertiary shrink-0">{formatBytes(file.size)}</span>
              <button
                onClick={() => removeFile(i)}
                aria-label={`Remove ${file.name}`}
                className="text-tertiary hover:text-status-danger transition-colors duration-fast shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {files.length < MAX_FILES && (
            <FileUploader onFileSelected={addFile} label="Add a file" hint="Up to 10MB each" />
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={handleClose} disabled={createSubmission.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={createSubmission.isPending}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}