"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  PiggyBank,
  TrendingUp,
  Clock,
  CheckCircle2,
  Info,
  Zap,
  Target,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import ScoreRing from "@/components/assessment/ScoreRing";
import BreakdownCard from "@/components/assessment/BreakdownCard";
import { Button } from "@/components/ui/button";
import { assessmentApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import type { Assessment, BlockerKey } from "@/types";

// ─── Breakdown metadata ───────────────────────────────────────────────────────

const BREAKDOWN_META: {
  key: BlockerKey;
  title: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "deposit",
    title: "Deposit strength",
    desc: "Your savings as % of target price",
    icon: <PiggyBank className="w-4 h-4" />,
  },
  {
    key: "income",
    title: "Income vs price",
    desc: "Target price relative to your income",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    key: "commitments",
    title: "Monthly commitments",
    desc: "Debt payments as % of monthly income",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    key: "credit",
    title: "Credit profile",
    desc: "Self-reported credit history indicators",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
];

// ─── Blocker summary line ─────────────────────────────────────────────────────

const BLOCKER_SUMMARY: Record<BlockerKey, string> = {
  deposit:     "Improving your deposit will have the biggest impact on your readiness.",
  income:      "Reviewing your target price relative to income will have the biggest impact.",
  commitments: "Reducing your monthly commitments will have the biggest impact on affordability.",
  credit:      "Improving your credit profile will have the biggest impact on your application.",
};

// ─── Simulation card colours ──────────────────────────────────────────────────

const SIM_STYLES = [
  { border: "border-border",       bg: "bg-white",        label: "bg-muted text-muted-foreground" },
  { border: "border-rendi-200",    bg: "bg-rendi-50/60",  label: "bg-rendi-100 text-rendi-700" },
  { border: "border-rendi-300",    bg: "bg-rendi-50",     label: "bg-rendi-200 text-rendi-800" },
];

// ─── Result content ───────────────────────────────────────────────────────────

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [disclaimer, setDisclaimer] = useState("");
  const [loading, setLoading] = useState(true);

  const storeResult = useAssessmentStore((state) => state.result);

  useEffect(() => {
    const idParam = searchParams.get("id");

    if (idParam) {
      assessmentApi
        .getDetail(Number(idParam))
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
      assessmentApi
        .getLatest()
        .then((res) => {
          setAssessment(res.data.assessment);
          setDisclaimer(res.data.disclaimer);
        })
        .catch(() => router.push("/dashboard"))
        .finally(() => setLoading(false));
    }
  }, [router, searchParams, storeResult]);

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

  // Build a lookup from blocker key → priority rank (0 = worst)
  const blockerRankMap: Record<string, number> = {};
  (assessment.blocker_priority ?? []).forEach((key, idx) => {
    blockerRankMap[key] = idx;
  });

  const hasSimulations = assessment.simulations && assessment.simulations.length > 0;
  const hasRecommendations = assessment.recommendations && assessment.recommendations.length > 0;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

          {/* ── Back ──────────────────────────────────────────────── */}
          <div className="opacity-0 animate-fade-up">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 -ml-2 text-muted-foreground"
              >
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
                  {/* Phase 2: motivational sub-line */}
                  <p className="text-rendi-100 text-sm">
                    You're in the {assessment.status.toLowerCase()} — but you can improve this faster.
                  </p>
                </div>
              </div>

              {/* Phase 2: biggest opportunity callout inside hero */}
              {assessment.biggest_blocker && (
                <div className="mt-6 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 flex items-start gap-3">
                  <Target className="w-4 h-4 text-rendi-200 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/90 leading-relaxed">
                    <span className="font-semibold text-white">Biggest opportunity: </span>
                    {BLOCKER_SUMMARY[assessment.biggest_blocker]}
                  </p>
                </div>
              )}
            </div>

            {/* Stats strip */}
            <div className="bg-white grid grid-cols-3 divide-x divide-border">
              {[
                {
                  icon: PiggyBank,
                  label: "Deposit needed",
                  value: formatCurrency(assessment.deposit_needed),
                },
                {
                  icon: TrendingUp,
                  label: "Deposit gap",
                  value: formatCurrency(assessment.deposit_gap),
                },
                {
                  icon: Clock,
                  label: "Est. months",
                  value:
                    assessment.estimated_months === 0
                      ? "Ready now"
                      : `${assessment.estimated_months} mo`,
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
            <div className="flex items-start justify-between mb-1 opacity-0 animate-fade-up delay-200">
              <h2 className="font-display text-xl font-medium">Score breakdown</h2>
            </div>
            {/* Phase 2: summary line below heading */}
            {assessment.biggest_blocker && (
              <p className="text-sm text-muted-foreground mb-4 opacity-0 animate-fade-up delay-200">
                {BLOCKER_SUMMARY[assessment.biggest_blocker]}
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
                  priorityRank={blockerRankMap[meta.key]}
                />
              ))}
            </div>
          </div>

          {/* ── Phase 2: Your plan to improve ─────────────────────── */}
          {hasRecommendations && (
            <div
              className="bg-rendi-50 rounded-2xl border border-rendi-200 p-6 space-y-4 opacity-0 animate-fade-up"
              style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
            >
              <h2 className="font-semibold text-rendi-800">
                Your plan to improve your readiness
              </h2>
              <ul className="space-y-3">
                {assessment.recommendations.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-rendi-800"
                  >
                    <span className="w-5 h-5 rounded-full bg-rendi-200 text-rendi-700 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Phase 2: Fastest improvement simulations ───────────── */}
          {hasSimulations && (
            <div
              className="space-y-4 opacity-0 animate-fade-up"
              style={{ animationDelay: "580ms", animationFillMode: "forwards" }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-rendi-600" />
                <h2 className="font-display text-xl font-medium">
                  Fastest way to improve your score
                </h2>
              </div>
              <p className="text-sm text-muted-foreground -mt-2">
                See how different saving rates could change your timeline.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {assessment.simulations.map((sim, i) => {
                  const style = SIM_STYLES[i] ?? SIM_STYLES[0];
                  return (
                    <div
                      key={sim.monthly_saving}
                      className={`rounded-2xl border ${style.border} ${style.bg} p-4 space-y-3`}
                    >
                      {/* Saving rate label */}
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${style.label}`}
                      >
                        {sim.label}
                      </span>

                      {/* Months to goal — big number */}
                      <div>
                        <p className="font-display text-3xl font-medium text-foreground leading-none">
                          {sim.months_to_goal}
                          <span className="text-base font-sans font-normal text-muted-foreground ml-1">
                            months
                          </span>
                        </p>
                        {sim.months_saved > 0 && (
                          <p className="text-xs text-rendi-600 font-medium mt-1">
                            {sim.months_saved} months faster
                          </p>
                        )}
                      </div>

                      {/* Summary sentence */}
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {sim.summary}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Disclaimer ─────────────────────────────────────────── */}
          <div
            className="flex items-start gap-3 rounded-xl bg-muted/50 border border-border p-4 opacity-0 animate-fade-up"
            style={{ animationDelay: "640ms", animationFillMode: "forwards" }}
          >
            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {disclaimer}
            </p>
          </div>

          {/* ── CTAs ───────────────────────────────────────────────── */}
          <div
            className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-up"
            style={{ animationDelay: "680ms", animationFillMode: "forwards" }}
          >
            {/* Phase 2: renamed from "Reassess" */}
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

          {/* Phase 2: helper text beneath CTAs */}
          <p className="text-xs text-center text-muted-foreground -mt-2">
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