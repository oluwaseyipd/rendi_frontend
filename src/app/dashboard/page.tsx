"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, TrendingUp, Clock, PiggyBank } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import ScoreRing from "@/components/assessment/ScoreRing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/index";
import { assessmentApi } from "@/lib/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { formatCurrency, getStatusBadgeClass } from "@/lib/utils";
import type { Assessment } from "@/types";

export default function DashboardHome() {
  const { user } = useAuthStore();
  const [latest, setLatest] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentApi.getLatest()
      .then((res) => setLatest(res.data.assessment))
      .catch(() => setLatest(null))
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

          {/* Header */}
          <div className="opacity-0 animate-fade-up">
            <h1 className="font-display text-3xl font-medium text-foreground">
              {greeting()}, {user?.first_name || "there"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {latest ? "Here's your latest readiness snapshot." : "Let's find out how ready you are to buy."}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : latest ? (
            <>
              {/* Score hero card */}
              <div
                className="rounded-3xl overflow-hidden border border-border shadow-sm opacity-0 animate-fade-up delay-100"
              >
                <div className="bg-gradient-to-br from-rendi-600 to-rendi-700 p-8 flex flex-col md:flex-row items-center gap-8">
                  <ScoreRing score={latest.score} size={140} />
                  <div className="text-center md:text-left">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium mb-3 ${getStatusBadgeClass(latest.status)} bg-white/20 text-white border-white/30`}>
                      {latest.status}
                    </span>
                    <h2 className="font-display text-2xl font-medium text-white mb-1">
                      {latest.time_estimate}
                    </h2>
                    <p className="text-rendi-100 text-sm">
                      Based on your most recent assessment
                    </p>
                  </div>
                  <div className="md:ml-auto">
                    <Link href="/dashboard/result">
                      <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                        View full results
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Stats strip */}
                <div className="bg-white grid grid-cols-3 divide-x divide-border">
                  {[
                    { icon: PiggyBank, label: "Deposit needed", value: formatCurrency(latest.deposit_needed) },
                    { icon: TrendingUp, label: "Deposit gap", value: formatCurrency(latest.deposit_gap) },
                    { icon: Clock, label: "Est. months", value: latest.estimated_months === 0 ? "Ready now" : `${latest.estimated_months} months` },
                  ].map((stat) => (
                    <div key={stat.label} className="p-5 text-center">
                      <stat.icon className="w-4 h-4 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
                      <p className="font-semibold text-foreground text-sm">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action plan preview */}
              {latest.action_plan.length > 0 && (
                <div className="bg-rendi-50 rounded-2xl border border-rendi-200 p-6 opacity-0 animate-fade-up delay-200">
                  <h3 className="font-semibold text-rendi-800 mb-3 text-sm">Your next steps</h3>
                  <ul className="space-y-2">
                    {latest.action_plan.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-rendi-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-rendi-500 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 opacity-0 animate-fade-up delay-300">
                <Link href="/dashboard/assessment" className="flex-1">
                  <Button className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    New assessment
                  </Button>
                </Link>
                <Link href="/dashboard/history" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    View history
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            /* No assessments yet */
            <div className="opacity-0 animate-fade-up delay-100">
              <div className="rounded-3xl border-2 border-dashed border-rendi-200 bg-rendi-50/50 p-12 text-center">
                <div className="w-16 h-16 bg-rendi-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <TrendingUp className="w-8 h-8 text-rendi-600" />
                </div>
                <h2 className="font-display text-2xl font-medium mb-2">
                  No assessments yet
                </h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  Take your first assessment to get a personalised home-buying readiness score.
                </p>
                <Link href="/dashboard/assessment">
                  <Button size="lg" className="gap-2">
                    Start my assessment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
