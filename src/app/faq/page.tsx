"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const FAQS = [
  {
    q: "What is Rendi?",
    a: "Rendi is a platform that helps you understand how close you are to buying your first home. Instead of guessing, Rendi gives you clarity on your deposit gap, your readiness level, and what steps you need to take next.",
  },
  {
    q: "How does Rendi work?",
    a: "You answer a few simple questions about your finances and goals. Rendi then estimates how much you need for a deposit, shows how far you are from your goal, and provides a personalised path to get there.",
  },
  {
    q: "Is Rendi a mortgage provider?",
    a: "No. Rendi does not provide mortgages or financial products. We help you understand your position and prepare for the home-buying process.",
  },
  {
    q: "Does Rendi hold or manage my money?",
    a: "No. Rendi does not hold, store, or transfer any money. We are a planning and tracking tool only.",
  },
  {
    q: "What is a Deposit Circle?",
    a: "A Deposit Circle allows you to involve friends or family in your home-buying journey. You can share your goal, track contributions, and stay accountable. All contributions happen outside of Rendi.",
  },
  {
    q: "How does the Gift feature work?",
    a: "You can create a page to receive support from friends and family for your deposit — for example on birthdays or celebrations. People can contribute externally, and you track your progress in Rendi.",
  },
  {
    q: "How accurate are the estimates?",
    a: "Rendi provides estimates based on the information you provide and general market assumptions. These are not financial advice or guaranteed figures, but a guide to help you understand your position.",
  },
  {
    q: "Why does Rendi focus on the deposit?",
    a: "For most first-time buyers, the deposit is the biggest barrier. Many people can afford monthly mortgage payments but struggle with saving enough upfront and knowing how much they need.",
  },
  {
    q: "Can I update my information later?",
    a: "Yes. You can update your details at any time to see how your position changes.",
  },
  {
    q: "Does Rendi tell me when I'm ready to buy?",
    a: "Rendi gives you an indication of your readiness based on your financial situation. When you're closer, we may guide you toward speaking with a mortgage advisor.",
  },
  {
    q: "Will Rendi connect me to mortgage advisors?",
    a: "Yes — in the future, Rendi may connect users who are ready to mortgage advisors and relevant partners.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. We take data privacy seriously and only use your information to provide insights and improve your experience. See our Privacy Policy for full details.",
  },
  {
    q: "Does Rendi cost anything?",
    a: "Rendi is currently free to use.",
  },
  {
    q: "Who is Rendi for?",
    a: "Rendi is for renters, first-time buyers, and anyone unsure if they can buy a home.",
  },
  {
    q: "Is this financial advice?",
    a: "No. Rendi provides guidance and estimates, not regulated financial advice. You should seek professional advice before making financial decisions.",
  },
];

function FAQCard({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        "group w-full text-left rounded-2xl border p-6 transition-all duration-200",
        "bg-white hover:border-rendi-300 hover:shadow-md hover:shadow-rendi-500/5",
        open
          ? "border-rendi-300 shadow-md shadow-rendi-500/5"
          : "border-border shadow-sm"
      )}
    >
      {/* Question row */}
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "text-sm font-semibold leading-snug transition-colors duration-200",
            open ? "text-rendi-700" : "text-foreground group-hover:text-rendi-700"
          )}
        >
          {q}
        </span>
        {/* Animated +/× indicator */}
        <span
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 mt-0.5",
            open
              ? "border-rendi-400 bg-rendi-50 text-rendi-600 rotate-45"
              : "border-border text-muted-foreground group-hover:border-rendi-300"
          )}
          aria-hidden
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M5 1v8M1 5h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>

      {/* Answer — always rendered, height animated via max-height */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-64 mt-3" : "max-h-0"
        )}
      >
        <p className="text-sm text-muted-foreground leading-relaxed text-left">
          {a}
        </p>
      </div>
    </button>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ──────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mesh-bg px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-white/80 border border-rendi-200 rounded-full px-4 py-1.5 text-xs text-rendi-700 font-medium mb-6 shadow-sm">
            Got questions?
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4">
            Frequently asked{" "}
            <span className="gradient-text italic">questions</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Everything you need to know about Rendi and how it works.
          </p>
        </div>
      </section>

      {/* ── FAQ grid ─────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FAQS.map((faq) => (
              <FAQCard key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-14 text-center">
            <p className="text-sm text-muted-foreground mb-2">Still have questions?</p>
            <a
              href="mailto:contact@rendi.co.uk"
              className="text-sm font-medium text-rendi-600 hover:underline"
            >
              contact@rendi.co.uk
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}