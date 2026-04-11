"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft, Home, PoundSterling, CreditCard, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/index";
import { assessmentApi } from "@/lib/api";
import { extractApiError } from "@/lib/utils";
import { useAssessmentStore } from "@/store/useAssessmentStore";


const schema = z.object({
  annual_income: z.coerce.number().min(1, "Please enter your annual income"),
  savings: z.coerce.number().min(0, "Please enter your savings amount"),
  target_property_price: z.coerce.number().min(1, "Please enter a target property price"),
  monthly_commitments: z.coerce.number().min(0).optional().nullable(),
  has_ccj: z.boolean().optional().nullable(),
  has_missed_payments: z.boolean().optional().nullable(),
});
type FormData = z.infer<typeof schema>;

const STEPS = [
  { id: 1, label: "Income & savings", icon: PoundSterling },
  { id: 2, label: "Target property", icon: Home },
  { id: 3, label: "Commitments", icon: CreditCard },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      has_ccj: null,
      has_missed_payments: null,
      monthly_commitments: null,
    },
  });

  const setResult = useAssessmentStore((state) => state.setResult);

  const hasCcj = watch("has_ccj");
  const hasMissed = watch("has_missed_payments");

  const nextStep = async () => {

    // Prevent moving forward if already at the last step
    if (step >= 3) return;

    const fields: (keyof FormData)[] =
      step === 1
        ? ["annual_income", "savings"]
        : step === 2
        ? ["target_property_price"]
        : [];
    const valid = fields.length === 0 || (await trigger(fields));
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: FormData) => {

    // FIX: Only allow submission if we are actually on the final step
    if (step !== 3) return;

    setApiError("");
    try {
      const res = await assessmentApi.submit({
        annual_income: data.annual_income,
        savings: data.savings,
        target_property_price: data.target_property_price,
        monthly_commitments: data.monthly_commitments ?? null,
        has_ccj: data.has_ccj ?? null,
        has_missed_payments: data.has_missed_payments ?? null,
      });
      setResult(res.data);
      router.push("/dashboard/result");
    } catch (err) {
      setApiError(extractApiError(err));
    }
  };

  // Prevent default "Enter" key submission behavior for multi-step flow
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step < 3) {
      e.preventDefault();
      nextStep();
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-8 opacity-0 animate-fade-up">
            <h1 className="font-display text-3xl font-medium mb-1">Readiness assessment</h1>
            <p className="text-muted-foreground text-sm">
              Takes about 2 minutes. All fields are informational estimates only.
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8 opacity-0 animate-fade-up delay-100">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${step >= s.id ? "text-rendi-600" : "text-muted-foreground"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors ${
                    step > s.id
                      ? "bg-rendi-600 text-white"
                      : step === s.id
                      ? "bg-rendi-100 text-rendi-700 border-2 border-rendi-500"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${step > s.id ? "bg-rendi-400" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Form card */}
          <div className="bg-white rounded-3xl border border-border shadow-sm p-8 opacity-0 animate-fade-up delay-200">
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>

              {/* ── Step 1: Income & savings ── */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-medium mb-1">Income & savings</h2>
                    <p className="text-sm text-muted-foreground">We use these to calculate how much you could borrow and your deposit strength.</p>
                  </div>
                  <FormField
                    label="Annual gross income"
                    error={errors.annual_income?.message}
                    hint="Your total salary before tax"
                  >
                    <Input
                      {...register("annual_income")}
                      type="number"
                      prefix="£"
                      placeholder="45,000"
                      error={!!errors.annual_income}
                    />
                  </FormField>
                  <FormField
                    label="Current savings / deposit pot"
                    error={errors.savings?.message}
                    hint="Total you currently have saved toward a deposit"
                  >
                    <Input
                      {...register("savings")}
                      type="number"
                      prefix="£"
                      placeholder="15,000"
                      error={!!errors.savings}
                    />
                  </FormField>
                </div>
              )}

              {/* ── Step 2: Target property ── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-medium mb-1">Target property</h2>
                    <p className="text-sm text-muted-foreground">What kind of property are you hoping to buy? This is just an estimate — you can always reassess.</p>
                  </div>
                  <FormField
                    label="Target property price"
                    error={errors.target_property_price?.message}
                    hint="The approximate value of the home you'd like to buy"
                  >
                    <Input
                      {...register("target_property_price")}
                      type="number"
                      prefix="£"
                      placeholder="250,000"
                      error={!!errors.target_property_price}
                    />
                  </FormField>
                  <div className="rounded-xl bg-muted/50 border border-border p-4 text-sm text-muted-foreground">
                    💡 Not sure? Use the average for your area as a starting point. You can always update this later.
                  </div>
                </div>
              )}

              {/* ── Step 3: Commitments & credit ── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl font-medium mb-1">Commitments & credit</h2>
                    <p className="text-sm text-muted-foreground">These are optional. If you skip them, we'll apply a neutral score.</p>
                  </div>

                  <FormField
                    label="Monthly debt commitments (optional)"
                    error={errors.monthly_commitments?.message}
                    hint="Loans, credit cards, car finance — total monthly payment"
                  >
                    <Input
                      {...register("monthly_commitments")}
                      type="number"
                      prefix="£"
                      placeholder="Leave blank to skip"
                      error={!!errors.monthly_commitments}
                    />
                  </FormField>

                  {/* CCJ question */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Any County Court Judgements (CCJ) in the last 6 years? <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <div className="flex gap-3">
                      {[
                        { value: false, label: "No" },
                        { value: true, label: "Yes" },
                      ].map((opt) => (
                        <button
                          key={String(opt.value)}
                          type="button"
                          onClick={() => setValue("has_ccj", opt.value)}
                          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            hasCcj === opt.value
                              ? "bg-rendi-50 border-rendi-400 text-rendi-700"
                              : "border-border text-muted-foreground hover:border-rendi-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setValue("has_ccj", null)}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          hasCcj === null
                            ? "bg-muted border-foreground/20 text-foreground"
                            : "border-border text-muted-foreground hover:border-gray-300"
                        }`}
                      >
                        Skip
                      </button>
                    </div>
                  </div>

                  {/* Missed payments question */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Any missed payments in the last 12 months? <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <div className="flex gap-3">
                      {[
                        { value: false, label: "No" },
                        { value: true, label: "Yes" },
                      ].map((opt) => (
                        <button
                          key={String(opt.value)}
                          type="button"
                          onClick={() => setValue("has_missed_payments", opt.value)}
                          className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            hasMissed === opt.value
                              ? "bg-rendi-50 border-rendi-400 text-rendi-700"
                              : "border-border text-muted-foreground hover:border-rendi-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setValue("has_missed_payments", null)}
                        className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          hasMissed === null
                            ? "bg-muted border-foreground/20 text-foreground"
                            : "border-border text-muted-foreground hover:border-gray-300"
                        }`}
                      >
                        Skip
                      </button>
                    </div>
                  </div>

                  {apiError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {apiError}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button type="button" onClick={nextStep} className="flex-1 gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1 gap-2" loading={isSubmitting}>
                    Get my score <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted-foreground mt-6 max-w-md mx-auto">
            All results are informational estimates only — not financial advice, a mortgage offer, or an eligibility decision.
          </p>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
