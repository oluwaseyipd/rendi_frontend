"use client";
import { useEffect, useState } from "react";
import { cn, getScoreRingColor, getScoreColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function ScoreRing({
  score,
  size = 160,
  className,
  animated = true,
}: ScoreRingProps) {
  const [displayed, setDisplayed] = useState(animated ? 0 : score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339
  const strokeDashoffset = circumference - (displayed / 100) * circumference;

  // Animate score counter
  useEffect(() => {
    if (!animated) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = score / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayed(score);
        clearInterval(timer);
      } else {
        setDisplayed(Math.round(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [score, animated]);

  const ringColor = getScoreRingColor(score);
  const textColor = getScoreColor(score);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/60"
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          strokeDasharray={circumference}
          strokeDashoffset={0}
        />
        {/* Progress */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="8"
          strokeLinecap="round"
          className={cn("transition-all duration-[1200ms] ease-out", ringColor)}
          stroke="currentColor"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          strokeDasharray={circumference}
          strokeDashoffset={animated ? strokeDashoffset : circumference - (score / 100) * circumference}
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-display font-medium leading-none", textColor, size >= 160 ? "text-4xl" : "text-2xl")}>
          {displayed}
        </span>
        <span className="text-xs text-muted-foreground mt-1 font-medium">/ 100</span>
      </div>
    </div>
  );
}
