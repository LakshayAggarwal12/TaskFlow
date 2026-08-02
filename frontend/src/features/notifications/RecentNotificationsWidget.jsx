import { BellOff } from "lucide-react";
import { useNotifications, useMarkNotificationRead } from "../notifications/hooks/useNotifications";
import NotificationItem from "../notifications/NotificationItem";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

export default function RecentNotificationsWidget() {
  const { data, isLoading } = useNotifications({ limit: 5 });
  const markRead = useMarkNotificationRead();
  const notifications = data?.notifications ?? [];

  return (
    <div className="bg-surface1 border border-hairline rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-hairline">
        <h2 className="text-h2 font-display text-primary">Recent activity for you</h2>
      </div>

      {isLoading && (
        <div className="p-4 flex flex-col gap-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <EmptyState icon={BellOff} title="All caught up" description="Nothing new right now." className="py-10" />
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="divide-y divide-hairline">
          {notifications.map((n) => (
            <NotificationItem key={n._id} notification={n} onMarkRead={markRead.mutate} />
          ))}
        </div>
      )}
    </div>
  );
}
