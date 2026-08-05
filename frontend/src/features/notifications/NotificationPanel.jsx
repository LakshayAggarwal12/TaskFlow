import { AnimatePresence, motion } from "framer-motion";
import { X, BellOff } from "lucide-react";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "./hooks/useNotifications";
import NotificationItem from "./NotificationItem";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

export default function NotificationPanel({ isOpen, onClose }) {
  const { data, isLoading } = useNotifications({ limit: 30 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.notifications ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 24, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 24, y: -8 }}
            transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
            className="fixed top-16 right-3 left-3 sm:left-auto sm:right-6 z-50 w-auto sm:w-96 max-h-[70vh] bg-surface2 border border-hairline rounded-lg shadow-modal flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
              <h2 className="text-h3 text-primary">Notifications</h2>
              <div className="flex items-center gap-3">
                {notifications.some((n) => !n.read) && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="text-caption text-accent hover:text-accent-hover transition-colors duration-fast"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close notifications"
                  className="text-tertiary hover:text-primary transition-colors duration-fast"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto scrollbar-thin divide-y divide-hairline">
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-4 py-3 flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-md" />
                    <div className="flex-1 flex flex-col gap-2">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}

              {!isLoading && notifications.length === 0 && (
                <EmptyState
                  icon={BellOff}
                  title="No notifications yet"
                  description="Assignments, comments, and reminders will show up here."
                />
              )}

              {!isLoading &&
                notifications.map((n) => (
                  <NotificationItem key={n._id} notification={n} onMarkRead={markRead.mutate} />
                ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
