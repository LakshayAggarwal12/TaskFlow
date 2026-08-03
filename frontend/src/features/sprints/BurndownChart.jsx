export default function BurndownChart({ snapshot }) {
  const { totalEstimatedHours, remainingEstimatedHours, idealRemainingHours, totalDays, daysElapsed } = snapshot;

  const width = 480;
  const height = 180;
  const padding = 24;
  const maxHours = Math.max(totalEstimatedHours, 1);

  const xForDay = (day) => padding + (day / totalDays) * (width - padding * 2);
  const yForHours = (hours) => height - padding - (hours / maxHours) * (height - padding * 2);

  // Ideal line: straight from totalEstimatedHours at day 0 to 0 at totalDays
  const idealPath = `M ${xForDay(0)} ${yForHours(totalEstimatedHours)} L ${xForDay(totalDays)} ${yForHours(0)}`;

  // Actual line: only drawn up to daysElapsed, from totalEstimatedHours down to remainingEstimatedHours
  const actualPath = `M ${xForDay(0)} ${yForHours(totalEstimatedHours)} L ${xForDay(daysElapsed)} ${yForHours(remainingEstimatedHours)}`;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {/* Axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-hairline" strokeWidth="1" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" className="text-hairline" strokeWidth="1" />

      {/* Ideal line — dashed */}
      <path d={idealPath} fill="none" stroke="currentColor" className="text-tertiary" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Actual line — solid accent */}
      <path d={actualPath} fill="none" stroke="currentColor" className="text-accent" strokeWidth="2" strokeLinecap="round" />
      <circle cx={xForDay(daysElapsed)} cy={yForHours(remainingEstimatedHours)} r="3.5" fill="currentColor" className="text-accent" />

      {/* Labels */}
      <text x={padding} y={padding - 8} className="fill-tertiary" style={{ fontSize: 10, fontFamily: "JetBrains Mono" }}>
        {Math.round(totalEstimatedHours)}h
      </text>
      <text x={width - padding} y={height - padding + 16} textAnchor="end" className="fill-tertiary" style={{ fontSize: 10, fontFamily: "JetBrains Mono" }}>
        Day {totalDays}
      </text>
    </svg>
  );
}
