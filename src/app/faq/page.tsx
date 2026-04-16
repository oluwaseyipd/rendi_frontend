"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm font-medium text-foreground group-hover:text-rendi-700 transition-colors">
          {q}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="pb-5 pr-8">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
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

      {/* ── FAQ list ─────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="px-8">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>

          {/* Still have questions */}
          <div className="mt-10 text-center">
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