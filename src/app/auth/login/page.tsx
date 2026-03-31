"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/index";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { extractApiError } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setApiError("");
    try {
      const res = await authApi.login(data);
      setAuth(res.data.user, res.data.access, res.data.refresh);
      // Sync to cookie for middleware
      document.cookie = `rendi_access=${res.data.access}; path=/; max-age=3600; SameSite=Lax`;
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      router.push(redirect);
    } catch (err) {
      setApiError(extractApiError(err));
    }
  };

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
          <h1 className="font-display text-3xl font-medium text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to see your readiness score</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-border shadow-sm shadow-black/5 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Email address" error={errors.email?.message}>
              <Input
                {...register("email")}
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                error={!!errors.email}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  autoComplete="current-password"
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

            {apiError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {apiError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              loading={isSubmitting}
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-rendi-600 font-medium hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}