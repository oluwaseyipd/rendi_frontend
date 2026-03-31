"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/index";
import { authApi } from "@/lib/api";
import { extractApiError } from "@/lib/utils";

const schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    password_confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setApiError("");
    try {
      await authApi.register(data);
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err) {
      setApiError(extractApiError(err));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-rendi-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-rendi-600" />
          </div>
          <h2 className="font-display text-2xl font-medium">Account created!</h2>
          <p className="text-muted-foreground text-sm">Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-rendi-600 flex items-center justify-center">
              <span className="text-white font-display font-medium">R</span>
            </div>
            <span className="font-display text-2xl font-medium">Rendi</span>
          </Link>
          <h1 className="font-display text-3xl font-medium">Create your account</h1>
          <p className="text-muted-foreground mt-2 text-sm">Free forever — no credit check required</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-border shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First name" error={errors.first_name?.message}>
                <Input
                  {...register("first_name")}
                  placeholder="Jane"
                  autoComplete="given-name"
                  error={!!errors.first_name}
                />
              </FormField>
              <FormField label="Last name" error={errors.last_name?.message}>
                <Input
                  {...register("last_name")}
                  placeholder="Doe"
                  autoComplete="family-name"
                  error={!!errors.last_name}
                />
              </FormField>
            </div>

            <FormField label="Email address" error={errors.email?.message}>
              <Input
                {...register("email")}
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                error={!!errors.email}
              />
            </FormField>

            <FormField
              label="Password"
              error={errors.password?.message}
              hint="At least 8 characters, one uppercase, one number"
            >
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  error={!!errors.password}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <FormField label="Confirm password" error={errors.password_confirm?.message}>
              <div className="relative">
                <Input
                  {...register("password_confirm")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  error={!!errors.password_confirm}
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            {apiError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            )}

            <Button type="submit" className="w-full gap-2" size="lg" loading={isSubmitting}>
              Create account
              <ArrowRight className="w-4 h-4" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By creating an account you agree that all outputs are estimates for information only and not financial advice.
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-rendi-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
