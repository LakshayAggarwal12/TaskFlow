import { Users } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";

const ROLE_TONE = { owner: "accent", admin: "success", member: "neutral", viewer: "neutral" };

export default function TeamWidget({ workspace }) {
  const members = workspace?.members ?? [];

  return (
    <div className="bg-surface1 border border-hairline rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users size={15} className="text-secondary" />
        <h2 className="text-h2 font-display text-primary">Team</h2>
      </div>
      <div className="flex flex-col gap-3">
        {members.map((m) => (
          <div key={m.user._id} className="flex items-center gap-3">
            <Avatar name={m.user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-body-sm text-primary truncate">{m.user.name}</p>
            </div>
            <Badge tone={ROLE_TONE[m.role] || "neutral"}>{m.role}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
