const SIZES = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-body-sm",
  md: "w-10 h-10 text-body",
  lg: "w-14 h-14 text-h3",
};

// Deterministic color pick from a small, muted palette so the same person
// always gets the same color, without needing an actual avatar image
// (the backend has no avatar upload endpoint yet — see planning doc Section 7).
const PALETTE = ["#6E9BD1", "#D9A441", "#5FB88A", "#E2604A", "#8B7FD1", "#4CA6A8"];

function colorForName(name = "") {
  const hash = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
}

function initials(name = "") {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name = "?", size = "md", className = "" }) {
  return (
    <div
      title={name}
      className={`inline-flex items-center justify-center rounded-pill font-medium text-canvas shrink-0 ${SIZES[size]} ${className}`}
      style={{ backgroundColor: colorForName(name) }}
    >
      {initials(name)}
    </div>
  );
}
