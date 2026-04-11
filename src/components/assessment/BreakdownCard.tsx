"use client";
import { cn, getLabelColor } from "@/lib/utils";
import type { BreakdownComponent } from "@/types";

interface BreakdownCardProps {
  title: string;
  description: string;
  data: BreakdownComponent;
  icon: React.ReactNode;
  delay?: number;
  // Phase 2: priority position (0 = biggest blocker, 1 = important, 2+ = good)
  priorityRank?: number;
}

// Maps a priority rank to a human-readable label and style
function getPriorityBadge(rank: number): { label: string; className: string } | null {
  if (rank === 0)
    return {
      label: "Biggest blocker",
      className: "bg-red-50 text-red-700 border-red-200",
    };
  if (rank === 1)
    return {
      label: "Important",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  if (rank >= 2)
    return {
      label: "Good",
      className: "bg-rendi-50 text-rendi-700 border-rendi-200",
    };
  return null;
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

export default function BreakdownCard({
  title,
  description,
  data,
  icon,
  delay = 0,
  priorityRank,
}: BreakdownCardProps) {
  const pct = Math.round((data.points / data.max_points) * 100);

  const barColor =
    data.label === "Strong" || data.label === "Low impact"
      ? "bg-rendi-500"
      : data.label === "Okay" || data.label === "Getting there"
      ? "bg-amber-400"
      : data.label === "Not provided"
      ? "bg-gray-200"
      : "bg-coral-400";

  // Highlight the biggest blocker card with a subtle red ring
  const cardBorder =
    priorityRank === 0
      ? "border-red-200 ring-1 ring-red-100"
      : "border-border";

  const priorityBadge =
    priorityRank !== undefined ? getPriorityBadge(priorityRank) : null;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border p-5 space-y-4 opacity-0 animate-fade-up",
        cardBorder
      )}
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
        {/* Show priority badge if rank is provided, otherwise show label badge */}
        {priorityBadge ? (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap",
              priorityBadge.className
            )}
          >
            {priorityBadge.label}
          </span>
        ) : (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full border",
              getLabelBadge(data.label)
            )}
          >
            {data.label}
          </span>
        )}
      </div>

      {/* Score label pill (shown below header when priority badge is active) */}
      {priorityBadge && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full border",
              getLabelBadge(data.label)
            )}
          >
            {data.label}
          </span>
        </div>
      )}

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
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              barColor
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}