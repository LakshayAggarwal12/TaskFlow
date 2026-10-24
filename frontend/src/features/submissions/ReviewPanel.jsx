import { useState } from "react";
import { FileText, Image as ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import Skeleton from "../../components/ui/Skeleton";
import { hasRole } from "../../lib/permissions";
import { useToast } from "../../context/ToastContext";
import { useTaskSubmissions, useReviewSubmission } from "./hooks/useSubmissions";

const STATUS_BADGE = {
  pending_review: { tone: "accent", label: "In review" },
  approved: { tone: "success", label: "Approved" },
  changes_requested: { tone: "danger", label: "Changes requested" },
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Shown once a task has at least one submission. Reviewer actions (approve /
// request changes) only render for admin+ — the backend enforces this
// regardless, this is purely so non-reviewers don't see buttons they can't use.
export default function ReviewPanel({ task, myRole }) {
  const toast = useToast();
  const { data: submissions, isLoading } = useTaskSubmissions(task._id);
  const reviewSubmission = useReviewSubmission(task._id);
  const [reviewNote, setReviewNote] = useState("");

  if (task.reviewStatus === "none" && !isLoading && (!submissions || submissions.length === 0)) {
    return null;
  }

  if (isLoading) return <Skeleton className="h-24" />;

  const latest = submissions?.[0];
  if (!latest) return null;

  const canReview = task.reviewStatus === "pending_review" && hasRole(myRole, "admin");

  const handleDecision = (decision) => {
    reviewSubmission.mutate(
      { id: latest._id, decision, reviewNote: reviewNote.trim() },
      {
        onSuccess: () => {
          toast.success(decision === "approved" ? "Submission approved." : "Changes requested.");
          setReviewNote("");
        },
        onError: (err) => toast.error(err.response?.data?.message || "Couldn't record your review."),
      }
    );
  };

  const badge = STATUS_BADGE[task.reviewStatus];

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-surface2/60 border border-hairline">
      <div className="flex items-center justify-between">
        <span className="text-caption font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Submitted for review
        </span>
        {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-body-sm text-secondary">{latest.submittedBy?.name}</span>
        <span className="text-caption text-tertiary">
          {new Date(latest.createdAt).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>

      <p className="text-body-sm text-primary whitespace-pre-wrap">{latest.notes}</p>

      {latest.attachments?.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {latest.attachments.map((a) => (
            <a
              key={a._id}
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-2.5 h-9 rounded-md bg-surface3/70 hover:bg-surface3 transition-colors duration-fast"
            >
              {a.mimeType?.startsWith("image/") ? (
                <ImageIcon size={14} className="text-accent shrink-0" />
              ) : (
                <FileText size={14} className="text-tertiary shrink-0" />
              )}
              <span className="text-body-sm text-primary truncate flex-1">{a.filename}</span>
              <span className="text-caption text-tertiary shrink-0">{formatBytes(a.size)}</span>
            </a>
          ))}
        </div>
      )}

      {task.reviewStatus === "changes_requested" && latest.reviewNote && (
        <div className="px-3 py-2 rounded-lg bg-status-danger/10 border border-status-danger/30">
          <p className="text-caption text-status-danger font-medium mb-0.5">Changes requested:</p>
          <p className="text-body-sm text-primary">{latest.reviewNote}</p>
        </div>
      )}

      {canReview && (
        <div className="flex flex-col gap-2 pt-1 border-t border-hairline mt-1">
          <Textarea
            label="Review note (required if requesting changes)"
            name="review-note"
            placeholder="What needs to change?"
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            rows={2}
          />
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => handleDecision("changes_requested")}
              isLoading={reviewSubmission.isPending}
            >
              <XCircle size={15} /> Request changes
            </Button>
            <Button onClick={() => handleDecision("approved")} isLoading={reviewSubmission.isPending}>
              <CheckCircle2 size={15} /> Approve
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}