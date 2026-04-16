import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, TrendingUp, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: TrendingUp,
    title: "Know your number",
    desc: "Get a clear 0–100 readiness score based on your deposit, income, and commitments.",
  },
  {
    icon: Clock,
    title: "See your timeline",
    desc: "Find out how many months away you are from being ready — and what to do next.",
  },
  {
    icon: Shield,
    title: "No credit checks",
    desc: "All estimates use only what you tell us. No hard searches. No data shared.",
  },
];

const steps = [
  { num: "01", title: "Create your free account", desc: "Takes 30 seconds." },
  { num: "02", title: "Enter your details", desc: "Income, savings, and target property price." },
  { num: "03", title: "Get your readiness score", desc: "Instant estimate with a clear breakdown." },
];

// Subset of FAQs shown on the landing page — links to /faq for the rest
const LANDING_FAQS = [
  {
    q: "Is this financial advice?",
    a: "No. Rendi provides guidance and estimates, not regulated financial advice. You should seek professional advice before making financial decisions.",
  },
  {
    q: "Does Rendi cost anything?",
    a: "Rendi is currently free to use.",
  },
  {
    q: "Does Rendi hold or manage my money?",
    a: "No. Rendi does not hold, store, or transfer any money. We are a planning and tracking tool only.",
  },
  {
    q: "How accurate are the estimates?",
    a: "Rendi provides estimates based on the information you provide and general market assumptions. These are not financial advice or guaranteed figures, but a guide to help you understand your position.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ──────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mesh-bg">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-rendi-200 rounded-full px-4 py-1.5 text-sm text-rendi-700 font-medium mb-8 shadow-sm opacity-0 animate-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-rendi-500 animate-pulse" />
            Free to use — no credit check required
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-foreground leading-[1.1] mb-6 opacity-0 animate-fade-up delay-100">
            Know when you&apos;re{" "}
            <span className="gradient-text italic">ready to buy</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up delay-200">
            Get a personalised home-buying readiness estimate in minutes.
            No jargon, no judgment — just clarity on where you stand and what to do next.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 opacity-0 animate-fade-up delay-300">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 shadow-lg shadow-rendi-500/20 w-full sm:w-auto">
                Check my readiness
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                I already have an account
              </Button>
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-12 opacity-0 animate-fade-up delay-400">
            {["No credit check", "100% free", "Takes 2 minutes", "Information only"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-rendi-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Score preview card ───────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-border overflow-hidden shadow-xl shadow-black/5">
            <div className="bg-gradient-to-r from-rendi-600 to-rendi-700 px-8 py-6 flex items-center justify-between">
              <div>
                <p className="text-rendi-100 text-sm font-medium">Your readiness score</p>
                <p className="text-white font-display text-3xl font-medium mt-1">Nearly ready</p>
              </div>
              <div className="text-right">
                <span className="font-display text-6xl font-medium text-white">74</span>
                <span className="text-rendi-200 text-lg">/100</span>
              </div>
            </div>
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white">
              {[
                { label: "Deposit", pts: "25/40", color: "text-amber-600" },
                { label: "Income", pts: "30/30", color: "text-rendi-600" },
                { label: "Commitments", pts: "9/20", color: "text-amber-600" },
                { label: "Credit", pts: "10/10", color: "text-rendi-600" },
              ].map((c) => (
                <div key={c.label} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                  <p className={`font-semibold text-sm ${c.color}`}>{c.pts}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Example output — for illustration only.
          </p>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-center mb-3">
            Built for first-time buyers
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            We cut through the complexity so you can focus on making progress.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-border p-6 space-y-3">
                <div className="w-10 h-10 bg-rendi-50 rounded-xl flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-rendi-600" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-center mb-12">
            How it works
          </h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.num} className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-rendi-600 text-white flex items-center justify-center font-display font-medium text-sm flex-shrink-0">
                  {s.num}
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ section ──────────────────────────────────────── */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-3">
              Common questions
            </h2>
            <p className="text-muted-foreground text-sm">
              Quick answers to what people ask most.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden mb-6">
            <div className="px-8 divide-y divide-border">
              {LANDING_FAQS.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                    <span className="text-sm font-medium text-foreground group-hover:text-rendi-700 transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3 pr-8">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-rendi-600 hover:underline"
            >
              See all questions
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 mesh-bg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
            Ready to find out where you stand?
          </h2>
          <p className="text-muted-foreground mb-8">
            It&apos;s free, takes under 2 minutes, and requires no personal financial data beyond what you choose to share.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="gap-2 shadow-lg shadow-rendi-500/20">
              Get my readiness score
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}