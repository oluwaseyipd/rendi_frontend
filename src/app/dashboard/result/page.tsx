"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RefreshCw, PiggyBank, TrendingUp, Clock, CheckCircle2, Info } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import ScoreRing from "@/components/assessment/ScoreRing";
import BreakdownCard from "@/components/assessment/BreakdownCard";
import { Button } from "@/components/ui/button";
import { assessmentApi } from "@/lib/api";
import { formatCurrency, getStatusBadgeClass } from "@/lib/utils";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import type { Assessment } from "@/types";


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
      // Loading a historical assessment by ID
      assessmentApi.getDetail(Number(idParam))
        .then((res) => {
          setAssessment(res.data);
          setDisclaimer("This is an estimate for information only. It is not financial advice, a mortgage offer, or an eligibility decision.");
        })
        .catch(() => router.push("/dashboard"))
        .finally(() => setLoading(false));
    } else if (storeResult) {
      // Fresh submit result
      setAssessment(storeResult.assessment);
      setDisclaimer(storeResult.disclaimer);
      setLoading(false);
    } else {
      // Fallback: load latest
      assessmentApi.getLatest()
        .then((res) => {
          setAssessment(res.data.assessment);
          setDisclaimer(res.data.disclaimer);
        })
        .catch(() => router.push("/dashboard"))
        .finally(() => setLoading(false));
    }
  }, [router, searchParams]);

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

          {/* Score hero */}
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
                  <p className="text-rendi-100 text-sm">
                    Based on the details you provided
                  </p>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="bg-white grid grid-cols-3 divide-x divide-border">
              {[
                { icon: PiggyBank, label: "Deposit needed", value: formatCurrency(assessment.deposit_needed) },
                { icon: TrendingUp, label: "Deposit gap", value: formatCurrency(assessment.deposit_gap) },
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

          {/* Breakdown */}
          <div>
            <h2 className="font-display text-xl font-medium mb-4 opacity-0 animate-fade-up delay-200">
              Score breakdown
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {BREAKDOWN_META.map((meta, i) => (
                <BreakdownCard
                  key={meta.key}
                  title={meta.title}
                  description={meta.desc}
                  data={assessment.breakdown[meta.key]}
                  icon={meta.icon}
                  delay={250 + i * 80}
                />
              ))}
            </div>
          </div>

          {/* Action plan */}
          {assessment.action_plan.length > 0 && (
            <div className="bg-rendi-50 rounded-2xl border border-rendi-200 p-6 opacity-0 animate-fade-up delay-500">
              <h2 className="font-semibold text-rendi-800 mb-4">Things to consider</h2>
              <ul className="space-y-3">
                {assessment.action_plan.map((item, i) => (
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

          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-xl bg-muted/50 border border-border p-4 opacity-0 animate-fade-up delay-500">
            <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{disclaimer}</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-up delay-500">
            <Link href="/dashboard/assessment" className="flex-1">
              <Button className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Reassess
              </Button>
            </Link>
            <Link href="/dashboard/history" className="flex-1">
              <Button variant="outline" className="w-full">
                View all assessments
              </Button>
            </Link>
          </div>
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