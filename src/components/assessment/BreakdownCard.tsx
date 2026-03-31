"use client";
import { cn, getLabelColor } from "@/lib/utils";
import type { BreakdownComponent } from "@/types";

interface BreakdownCardProps {
  title: string;
  description: string;
  data: BreakdownComponent;
  icon: React.ReactNode;
  delay?: number;
}

export default function BreakdownCard({
  title,
  description,
  data,
  icon,
  delay = 0,
}: BreakdownCardProps) {
  const pct = Math.round((data.points / data.max_points) * 100);
  const labelColor = getLabelColor(data.label);

  const barColor =
    data.label === "Strong" || data.label === "Low impact"
      ? "bg-rendi-500"
      : data.label === "Okay" || data.label === "Getting there"
      ? "bg-amber-400"
      : data.label === "Not provided"
      ? "bg-gray-200"
      : "bg-coral-400";

  return (
    <div
      className="bg-white rounded-2xl border border-border p-5 space-y-4 opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", getLabelBadge(data.label))}>
          {data.label}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">Score</span>
          <span className="text-xs font-semibold text-foreground">
            {data.points} / {data.max_points} pts
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700 ease-out", barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function getLabelBadge(label: string): string {
  if (label === "Strong" || label === "Low impact")
    return "bg-rendi-50 text-rendi-700 border-rendi-200";
  if (label === "Okay" || label === "Getting there")
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (label === "Not provided")
    return "bg-gray-50 text-gray-500 border-gray-200";
  return "bg-red-50 text-red-600 border-red-200";
}
