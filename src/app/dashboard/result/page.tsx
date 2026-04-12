"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, RefreshCw, PiggyBank, TrendingUp, Clock,
  CheckCircle2, Info, Zap, Users, Share2, Copy, Check,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import ScoreRing from "@/components/assessment/ScoreRing";
import BreakdownCard from "@/components/assessment/BreakdownCard";
import { Button } from "@/components/ui/button";
import { assessmentApi } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import type { Assessment, BlockerKey, Simulation, ComparisonResult } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const BREAKDOWN_META = [
  {
    key: "deposit" as const,
    title: "Deposit strength",
    desc: "Your savings as % of target price",
    icon: <PiggyBank className="w-4 h-4" />,
  },
  {
    key: "income" as const,
    title: "Income vs price",
    desc: "Target price relative to your income",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    key: "commitments" as const,
    title: "Monthly commitments",
    desc: "Debt payments as % of monthly income",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    key: "credit" as const,
    title: "Credit profile",
    desc: "Self-reported credit history indicators",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
];

const BLOCKER_LABELS: Record<BlockerKey, string> = {
  deposit:     "your deposit",
  income:      "your income-to-price ratio",
  commitments: "your monthly commitments",
  credit:      "your credit profile",
};

// ─── Simulation card ──────────────────────────────────────────────────────────

function SimulationCard({
  sim,
  isHighlighted,
}: {
  sim: Simulation;
  isHighlighted: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 space-y-1 transition-all",
        isHighlighted
          ? "bg-rendi-50 border-rendi-300 ring-1 ring-rendi-200"
          : "bg-white border-border"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{sim.label}</p>
        {isHighlighted && (
          <span className="text-[10px] font-semibold bg-rendi-600 text-white px-2 py-0.5 rounded-full flex-shrink-0">
            Best option
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{sim.summary}</p>
      {sim.months_saved > 0 && (
        <p className="text-xs font-semibold text-rendi-600">
          {sim.months_saved} months faster than your current pace
        </p>
      )}
    </div>
  );
}

// ─── Phase 3: How you compare card ───────────────────────────────────────────

function ComparisonCard({
  comparison,
  loading,
}: {
  comparison: ComparisonResult | null;
  loading: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyShare = async () => {
    if (!comparison?.share_text) return;
    try {
      await navigator.clipboard.writeText(comparison.share_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: do nothing silently
    }
  };

  if (loading) {
    return (
      <div className="h-32 rounded-2xl bg-muted animate-pulse" />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 space-y-4 opacity-0 animate-fade-up delay-500">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-rendi-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-rendi-600" />
        </div>
        <h2 className="font-display text-lg font-medium">How you compare</h2>
      </div>

      {!comparison || !comparison.has_data ? (
        /* ── Fallback state — not enough data yet ── */
        <p className="text-sm text-muted-foreground leading-relaxed">
          {comparison?.fallback_message ||
            "We'll show comparison insights once more users complete their assessment."}
        </p>
      ) : (
        /* ── Comparison data ── */
        <div className="space-y-3">
          {/* Headline */}
          <p className="text-base font-semibold text-foreground">
            {comparison.headline}
          </p>

          {/* Supporting lines */}
          <div className="space-y-1.5">
            {comparison.subtitle && (
              <p className="text-sm text-muted-foreground">
                {comparison.subtitle}
              </p>
            )}
            {comparison.savings_line && (
              <p className="text-sm text-muted-foreground">
                {comparison.savings_line}
              </p>
            )}
            {comparison.deposit_gap_line && (
              <p className="text-sm text-muted-foreground">
                {comparison.deposit_gap_line}
              </p>
            )}
          </div>

          {/* Segment context */}
          {comparison.segment_label && (
            <p className="text-xs text-muted-foreground/70">
              Compared to {comparison.segment_label} — {comparison.total_users.toLocaleString()} users total
            </p>
          )}

          {/* Share CTA */}
          {comparison.share_text && (
            <div className="pt-2 border-t border-border">
              <button
                onClick={handleCopyShare}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all",
                  copied
                    ? "bg-rendi-50 border-rendi-300 text-rendi-700"
                    : "bg-white border-border text-muted-foreground hover:border-rendi-300 hover:text-rendi-700"
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied to clipboard
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Invite a friend to compare
                  </>
                )}
              </button>
              {!copied && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Copies a shareable message to your clipboard
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main result content ──────────────────────────────────────────────────────

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [disclaimer, setDisclaimer] = useState("");
  const [loading, setLoading] = useState(true);

  // Phase 3: comparison state
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(true);

  const storeResult = useAssessmentStore((state) => state.result);

  useEffect(() => {
    const idParam = searchParams.get("id");

    if (idParam) {
      assessmentApi.getDetail(Number(idParam))
        .then((res) => {
          setAssessment(res.data);
          setDisclaimer(
            "This is an estimate for information only. It is not financial advice, a mortgage offer, or an eligibility decision."
          );
        })
        .catch(() => router.push("/dashboard"))
        .finally(() => setLoading(false));
    } else if (storeResult) {
      setAssessment(storeResult.assessment);
      setDisclaimer(storeResult.disclaimer);
      setLoading(false);
    } else {
      assessmentApi.getLatest()
        .then((res) => {
          setAssessment(res.data.assessment);
          setDisclaimer(res.data.disclaimer);
        })
        .catch(() => router.push("/dashboard"))
        .finally(() => setLoading(false));
    }
  }, [router, searchParams]);

  // Phase 3: fetch comparison data independently so it doesn't block the page
  useEffect(() => {
    assessmentApi.getComparison()
      .then((res) => setComparison(res.data))
      .catch(() => setComparison(null))
      .finally(() => setComparisonLoading(false));
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  if (!assessment) return null;

  // Build priority rank map for breakdown cards
  const priorityRankMap: Record<string, number> = {};
  if (assessment.blocker_priority?.length) {
    assessment.blocker_priority.forEach((key, idx) => {
      priorityRankMap[key] = idx;
    });
  }

  const biggestBlockerLabel =
    assessment.biggest_blocker ? BLOCKER_LABELS[assessment.biggest_blocker] : null;

  const primaryRecommendation =
    assessment.recommendations?.find(
      (r) => !r.toLowerCase().startsWith("you can revisit")
    ) ?? null;

  const bestSimIndex =
    assessment.simulations?.length
      ? assessment.simulations.reduce(
          (bestIdx, sim, idx, arr) =>
            sim.months_saved > arr[bestIdx].months_saved ? idx : bestIdx,
          0
        )
      : -1;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

          {/* Back */}
          <div className="opacity-0 animate-fade-up">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to dashboard
              </Button>
            </Link>
          </div>

          {/* ── Score hero ─────────────────────────────────────────── */}
          <div className="rounded-3xl overflow-hidden border border-border shadow-sm opacity-0 animate-fade-up delay-100">
            <div className="bg-gradient-to-br from-rendi-600 to-rendi-700 p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ScoreRing score={assessment.score} size={160} />
                <div className="text-center md:text-left flex-1">
                  <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30 mb-3">
                    {assessment.status}
                  </span>
                  <h1 className="font-display text-3xl font-medium text-white mb-2">
                    {assessment.time_estimate}
                  </h1>
                  <p className="text-rendi-100 text-sm mb-3">
                    Based on the details you provided — but you can improve this faster.
                  </p>
                  {biggestBlockerLabel && (
                    <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-xl px-3 py-2 text-left">
                      <Zap className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                      <p className="text-xs text-white/90 leading-snug">
                        <span className="font-semibold text-white">Biggest opportunity:</span>{" "}
                        Improving {biggestBlockerLabel} will have the most impact on your score.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="bg-white grid grid-cols-3 divide-x divide-border">
              {[
                { icon: PiggyBank, label: "Deposit needed", value: formatCurrency(assessment.deposit_needed) },
                { icon: TrendingUp, label: "Deposit gap",   value: formatCurrency(assessment.deposit_gap) },
                {
                  icon: Clock,
                  label: "Est. months",
                  value: assessment.estimated_months === 0 ? "Ready now" : `${assessment.estimated_months} mo`,
                },
              ].map((stat) => (
                <div key={stat.label} className="p-5 text-center">
                  <stat.icon className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
                  <p className="font-semibold text-foreground text-sm">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Score breakdown ────────────────────────────────────── */}
          <div>
            <div className="mb-1 opacity-0 animate-fade-up delay-200">
              <h2 className="font-display text-xl font-medium">Score breakdown</h2>
            </div>
            {biggestBlockerLabel && (
              <p className="text-sm text-muted-foreground mb-4 opacity-0 animate-fade-up delay-200">
                Improving {biggestBlockerLabel} will have the biggest impact on your readiness.
              </p>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              {BREAKDOWN_META.map((meta, i) => (
                <BreakdownCard
                  key={meta.key}
                  title={meta.title}
                  description={meta.desc}
                  data={assessment.breakdown[meta.key]}
                  icon={meta.icon}
                  delay={250 + i * 80}
                  priorityRank={priorityRankMap[meta.key]}
                />
              ))}
            </div>
          </div>

          {/* ── Your plan ─────────────────────────────────────────── */}
          {assessment.recommendations?.length > 0 && (
            <div className="bg-rendi-50 rounded-2xl border border-rendi-200 p-6 opacity-0 animate-fade-up delay-400">
              <h2 className="font-semibold text-rendi-800 mb-1">
                Your plan to improve your readiness
              </h2>
              <p className="text-xs text-rendi-600 mb-4">
                Based on what you entered — not financial advice.
              </p>
              <ul className="space-y-3">
                {assessment.recommendations.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-rendi-800">
                    <span className="w-5 h-5 rounded-full bg-rendi-200 text-rendi-700 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Fastest improvement simulations ───────────────────── */}
          {assessment.simulations?.length > 0 && (
            <div className="opacity-0 animate-fade-up delay-500">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-500" />
                <h2 className="font-display text-xl font-medium">
                  Fastest way to improve your score
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                See how different saving rates could get you to your deposit goal sooner.
              </p>
              <div className="space-y-3">
                {assessment.simulations.map((sim, i) => (
                  <SimulationCard
                    key={sim.monthly_saving}
                    sim={sim}
                    isHighlighted={i === bestSimIndex && sim.months_saved > 0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Phase 3: How you compare ───────────────────────────── */}
          <ComparisonCard
            comparison={comparison}
            loading={comparisonLoading}
          />

          {/* ── Disclaimer ─────────────────────────────────────────── */}
          <div className="flex items-start gap-3 rounded-xl bg-muted/50 border border-border p-4 opacity-0 animate-fade-up delay-500">
            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{disclaimer}</p>
          </div>

          {/* ── CTAs ───────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-up delay-500">
            <Link href="/dashboard/assessment" className="flex-1">
              <Button className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Update my progress
              </Button>
            </Link>
            <Link href="/dashboard/history" className="flex-1">
              <Button variant="outline" className="w-full">
                View all assessments
              </Button>
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground -mt-3">
            Check again after financial changes to track your improvement.
          </p>

        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading result...</div>}>
      <ResultContent />
    </Suspense>
  );
}