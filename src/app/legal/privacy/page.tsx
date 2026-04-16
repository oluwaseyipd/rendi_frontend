import { Shield } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const SECTIONS = [
  {
    num: "1",
    title: "Introduction",
    content: `Rendi ("we", "our", "us") is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.`,
  },
  {
    num: "2",
    title: "Information We Collect",
    content: `We may collect personal information such as your name and email address. We may also collect financial profile data such as income range, savings, deposit amount, and goals. Technical data such as IP address, device type, and usage behaviour may also be collected.`,
  },
  {
    num: "3",
    title: "How We Use Your Information",
    content: `We use your data to provide personalised insights, calculate your deposit gap, improve our services, and communicate with you.`,
  },
  {
    num: "4",
    title: "Legal Basis for Processing",
    content: `We process your data based on your consent, legitimate interests, and contractual necessity.`,
  },
  {
    num: "5",
    title: "Data Sharing",
    content: `We do not sell your data. We may share data with service providers or partners only when necessary and with your consent.`,
  },
  {
    num: "6",
    title: "No Financial Data Handling",
    content: `Rendi does not store bank details, process payments, or hold funds. All financial contributions happen outside of Rendi.`,
  },
  {
    num: "7",
    title: "Data Retention",
    content: `We retain your data only as long as necessary to provide our services and comply with legal obligations.`,
  },
  {
    num: "8",
    title: "Your Rights",
    content: `You have the right to access, correct, delete, or restrict your data. You can contact us at contact@rendi.co.uk to exercise your rights.`,
  },
  {
    num: "9",
    title: "Data Security",
    content: `We take appropriate measures such as encryption and secure servers to protect your data.`,
  },
  {
    num: "10",
    title: "Cookies",
    content: `We may use cookies to improve user experience and analyse usage. You can control cookies through your browser settings.`,
  },
  {
    num: "11",
    title: "Third-Party Links",
    content: `We are not responsible for the privacy practices of third-party services linked on our platform.`,
  },
  {
    num: "12",
    title: "Changes to Policy",
    content: `We may update this Privacy Policy from time to time. Continued use of the platform means you accept the updated policy.`,
  },
  {
    num: "13",
    title: "Contact Us",
    content: `For any questions about this Privacy Policy, contact us at contact@rendi.co.uk`,
  },
];

const HIGHLIGHTS = [
  "We never sell your data",
  "We never store bank details",
  "We never hold or process funds",
  "You can delete your data at any time",
];

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">
            Last updated: April 2026
          </p>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Key commitments callout */}
          <div className="bg-rendi-50 border border-rendi-200 rounded-2xl p-6 mb-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-rendi-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-rendi-600" />
              </div>
              <p className="text-sm font-semibold text-rendi-800">
                Our privacy commitments
              </p>
            </div>
            <ul className="space-y-2">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm text-rendi-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-rendi-500 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
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
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.title === "Contact Us" ? (
                      <>
                        For any questions about this Privacy Policy, contact us at{" "}
                        <a href="mailto:contact@rendi.co.uk" className="text-rendi-600 hover:underline">
                          contact@rendi.co.uk
                        </a>
                      </>
                    ) : (
                      s.content
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Questions about your privacy?{" "}
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