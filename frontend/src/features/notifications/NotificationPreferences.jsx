import { Mail, AlertCircle } from "lucide-react";
import Switch from "../../components/ui/Switch";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { useToast } from "../../context/ToastContext";
import { NOTIFICATION_TYPES, NOTIFICATION_TYPE_LABELS } from "../../lib/constants";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useSendTestEmail,
} from "./hooks/useNotificationPreferences";

// Controls which events also arrive by email. In-app and live notifications
// always stay on — these toggles only affect email.
export default function NotificationPreferences() {
  const toast = useToast();
  const { data, isLoading, isError } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();
  const testEmail = useSendTestEmail();

  const save = (body) =>
    update.mutate(body, {
      onError: (err) => toast.error(err.response?.data?.message || "Couldn't save that change."),
    });

  const handleTest = () =>
    testEmail.mutate(undefined, {
      onSuccess: (res) => toast.success(res.message || "Test email sent."),
      onError: (err) => toast.error(err.response?.data?.message || "Couldn't send the test email."),
    });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-14" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-body-sm text-status-danger">Couldn't load your notification preferences.</p>;
  }

  const { preferences, emailConfigured } = data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-caption font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Notification preferences
        </span>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleTest}
          isLoading={testEmail.isPending}
          disabled={!emailConfigured || !preferences.emailEnabled}
        >
          <Mail size={14} /> Send test email
        </Button>
      </div>

      {!emailConfigured && (
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-status-danger/10 border border-status-danger/30">
          <AlertCircle size={16} className="text-status-danger shrink-0 mt-0.5" />
          <p className="text-body-sm text-primary">
            Email isn't set up on this server yet, so these settings won't send anything. Add the
            <code className="font-mono text-caption mx-1">SMTP_*</code>and
            <code className="font-mono text-caption mx-1">EMAIL_FROM</code>
            variables to the backend <code className="font-mono text-caption">.env</code>.
          </p>
        </div>
      )}

      <div className="rounded-xl bg-surface1 border border-hairline divide-y divide-hairline">
        <div className="flex items-center justify-between gap-4 px-4 py-3.5">
          <div>
            <p className="text-body-sm text-primary font-medium">Email notifications</p>
            <p className="text-caption text-tertiary">Master switch — turn off to stop all email. In-app alerts are unaffected.</p>
          </div>
          <Switch
            checked={preferences.emailEnabled}
            onChange={(value) => save({ emailEnabled: value })}
            label="Email notifications"
          />
        </div>

        {NOTIFICATION_TYPES.map((type) => {
          const meta = NOTIFICATION_TYPE_LABELS[type];
          return (
            <div key={type} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className={preferences.emailEnabled ? "" : "opacity-50"}>
                <p className="text-body-sm text-primary">{meta.label}</p>
                <p className="text-caption text-tertiary">{meta.description}</p>
              </div>
              <Switch
                checked={preferences.email[type]}
                disabled={!preferences.emailEnabled}
                onChange={(value) => save({ email: { [type]: value } })}
                label={`Email me: ${meta.label}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}