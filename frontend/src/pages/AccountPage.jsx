import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
      >
        <h1 className="text-h1 font-display text-primary mb-6">Account</h1>

        <div className="bg-surface1 border border-hairline rounded-lg p-5 flex items-center gap-4">
          <Avatar name={user?.name} size="lg" />
          <div>
            <h2 className="text-h3 text-primary">{user?.name}</h2>
            <p className="text-body-sm text-secondary">{user?.email}</p>
            <Badge tone="accent" className="mt-1.5">{user?.role}</Badge>
          </div>
        </div>

        <p className="text-body-sm text-tertiary mt-4">
          Profile editing (name/password change) isn't available yet — the backend doesn't
          currently expose an update-profile endpoint. This section will become editable
          once that's added.
        </p>
      </motion.div>
    </div>
  );
}
