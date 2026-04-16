import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SECTIONS = [
  {
    num: "1",
    title: "Introduction",
    content: `Welcome to Rendi ("we", "our", "us"). These Terms & Conditions govern your use of our platform and services. By using Rendi, you agree to these terms. If you do not agree, you must not use the platform.`,
  },
  {
    num: "2",
    title: "About Rendi",
    content: `Rendi is a platform designed to help users understand their readiness to purchase a home. We provide estimates, insights, and planning tools. Rendi does not provide financial, legal, or mortgage advice.`,
  },
  {
    num: "3",
    title: "Eligibility",
    content: `To use Rendi, you must be at least 18 years old and provide accurate and truthful information.`,
  },
  {
    num: "4",
    title: "No Financial Advice",
    content: `All information provided on Rendi is for informational purposes only. We do not provide financial advice, recommend specific financial products, or guarantee outcomes. You should seek professional advice before making financial decisions.`,
  },
  {
    num: "5",
    title: "Estimates and Accuracy",
    content: `Rendi provides estimates based on user-provided information and general market assumptions. We do not guarantee accuracy, completeness, or suitability. You use these insights at your own risk.`,
  },
  {
    num: "6",
    title: "No Custody of Funds",
    content: `Rendi does not hold money, manage funds, or process payments. Any financial contributions between users and third parties occur outside of Rendi.`,
  },
  {
    num: "7",
    title: "Deposit Circle & Gift Features",
    content: `Rendi may allow users to share goals, track contributions, and invite others to support their journey. However, Rendi is not a financial intermediary, we do not verify contributions, and we are not responsible for any agreements between users. Users are solely responsible for their interactions and financial arrangements.`,
  },
  {
    num: "8",
    title: "User Responsibilities",
    content: `You agree not to misuse the platform, not to provide false information, and not to use Rendi for fraudulent or unlawful purposes.`,
  },
  {
    num: "9",
    title: "Third-Party Links and Services",
    content: `Rendi may include links to third-party services (e.g., mortgage advisors). We are not responsible for their services, content, or outcomes.`,
  },
  {
    num: "10",
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law, Rendi shall not be liable for financial loss, incorrect decisions based on our insights, or interactions between users.`,
  },
  {
    num: "11",
    title: "Intellectual Property",
    content: `All content, branding, and materials on Rendi are owned by us. You may not copy, reproduce, or distribute without permission.`,
  },
  {
    num: "12",
    title: "Data Protection",
    content: `Your use of Rendi is also governed by our Privacy Policy.`,
  },
  {
    num: "13",
    title: "Changes to Terms",
    content: `We may update these Terms at any time. Continued use of Rendi means you accept the updated terms.`,
  },
  {
    num: "14",
    title: "Termination",
    content: `We may suspend or terminate access if terms are breached or misuse is detected.`,
  },
  {
    num: "15",
    title: "Governing Law",
    content: `These Terms are governed by the laws of England and Wales.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ──────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mesh-bg px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-medium text-rendi-600 uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: April 2026
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Intro callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
            <p className="text-sm text-amber-800 leading-relaxed">
              <span className="font-semibold">Please read carefully.</span>{" "}
              By using Rendi, you agree to these Terms & Conditions. Rendi does not provide
              financial advice — all outputs are informational estimates only.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.num} className="flex gap-6">
                <div className="w-8 h-8 rounded-xl bg-rendi-50 border border-rendi-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-rendi-700">{s.num}</span>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground mb-2">{s.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Questions about these terms?{" "}
              <a href="mailto:contact@rendi.co.uk" className="text-rendi-600 font-medium hover:underline">
                contact@rendi.co.uk
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}