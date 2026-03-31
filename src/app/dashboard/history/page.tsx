"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Plus, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import ScoreRing from "@/components/assessment/ScoreRing";
import { Button } from "@/components/ui/button";
import { assessmentApi } from "@/lib/api";
import { formatCurrency, getStatusBadgeClass } from "@/lib/utils";
import type { AssessmentListItem } from "@/types";

export default function HistoryPage() {
  const [items, setItems] = useState<AssessmentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assessmentApi.getHistory()
      .then((res) => {
        const data = res.data;
        setItems(Array.isArray(data) ? data : (data as { results: AssessmentListItem[] }).results ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between opacity-0 animate-fade-up">
            <div>
              <h1 className="font-display text-3xl font-medium">Assessment history</h1>
              <p className="text-muted-foreground text-sm mt-1">Track how your readiness has changed over time</p>
            </div>
            <Link href="/dashboard/assessment">
              <Button size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                New
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="opacity-0 animate-fade-up delay-100 rounded-3xl border-2 border-dashed border-rendi-200 bg-rendi-50/50 p-12 text-center">
              <div className="w-12 h-12 bg-rendi-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-rendi-600" />
              </div>
              <h2 className="font-display text-xl font-medium mb-2">No history yet</h2>
              <p className="text-muted-foreground text-sm mb-5">Take your first assessment to start tracking your progress.</p>
              <Link href="/dashboard/assessment">
                <Button className="gap-2">
                  Start assessment
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/dashboard/result?id=${item.id}`}
                  className="block opacity-0 animate-fade-up"
                  style={{ animationDelay: `${100 + i * 60}ms`, animationFillMode: "forwards" }}
                >
                  <div className="bg-white rounded-2xl border border-border p-5 flex items-center gap-5 hover:border-rendi-300 hover:shadow-sm transition-all group">
                    {/* Mini score ring */}
                    <ScoreRing score={item.score} size={64} animated={false} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(item.created_at), "d MMM yyyy")}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.time_estimate}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Target: {formatCurrency(item.target_property_price)} · Gap: {formatCurrency(item.deposit_gap)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-rendi-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
