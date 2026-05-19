import { cn } from "@/lib/utils";

export function Sparkline({
  values,
  className,
  color = "currentColor",
  width = 80,
  height = 24,
}: {
  values: number[];
  className?: string;
  color?: string;
  width?: number;
  height?: number;
}) {
  if (values.length < 2) {
    return null;
  }

  const max = Math.max(...values, 1);
  const stepX = width / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * stepX;
      const y = height - (v / max) * (height - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={cn("h-6", className)}
      style={{ color, width: `${width}px` }}
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
