import { motion } from "framer-motion";
import { UserPlus, MessageSquare, Clock, AlertTriangle, FlagOff } from "lucide-react";
import SignalDot from "../../components/ui/SignalDot";

const ICONS = {
  task_assigned: UserPlus,
  comment_added: MessageSquare,
  due_soon: Clock,
  overdue: AlertTriangle,
  sprint_closed: FlagOff,
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationItem({ notification, onMarkRead }) {
  const Icon = ICONS[notification.type] || MessageSquare;

  return (
    <motion.button
      onClick={() => !notification.read && onMarkRead(notification._id)}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
      className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-fast"
    >
      <div className="w-8 h-8 rounded-md bg-surface3 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-body-sm leading-snug ${notification.read ? "text-secondary" : "text-primary"}`}>
          {notification.message}
        </p>
        <span className="text-caption text-tertiary font-mono mt-0.5 block">
          {timeAgo(notification.createdAt)}
        </span>
      </div>
      {!notification.read && <SignalDot size={7} className="mt-1.5 shrink-0" />}
    </motion.button>
  );
}
