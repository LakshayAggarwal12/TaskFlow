import { GitCommitHorizontal } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import { timeAgo } from "../../lib/dateUtils";

export default function ActivityItem({ activity }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Avatar name={activity.actor?.name} size="xs" className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-body-sm text-primary">{activity.message}</p>
        <span className="text-caption text-tertiary font-mono">{timeAgo(activity.createdAt)}</span>
      </div>
    </div>
  );
}
