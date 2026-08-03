import Avatar from "../../components/ui/Avatar";

export default function AssigneeAvatarGroup({ assignees = [], size = "xs", max = 3 }) {
  if (!assignees.length) return null;
  const shown = assignees.slice(0, max);
  const extra = assignees.length - shown.length;

  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((user) => (
        <Avatar key={user._id} name={user.name} size={size} className="ring-2 ring-surface1" />
      ))}
      {extra > 0 && (
        <span className="w-6 h-6 rounded-pill bg-surface3 ring-2 ring-surface1 flex items-center justify-center text-[10px] text-secondary">
          +{extra}
        </span>
      )}
    </div>
  );
}
