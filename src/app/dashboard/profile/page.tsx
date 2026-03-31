"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, User, Lock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, Card, CardHeader, CardTitle, CardContent, Separator } from "@/components/ui/index";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { extractApiError } from "@/lib/utils";

// ── Profile form schema ───────────────────────────────────────────
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});
type ProfileData = z.infer<typeof profileSchema>;

// ── Password form schema ──────────────────────────────────────────
const passwordSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    new_password_confirm: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.new_password === d.new_password_confirm, {
    message: "Passwords do not match",
    path: ["new_password_confirm"],
  });
type PasswordData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // ── Profile form ─────────────────────────────────────────────────
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { first_name: user?.first_name ?? "", last_name: user?.last_name ?? "" },
  });

  const onProfileSubmit = async (data: ProfileData) => {
    setProfileError("");
    setProfileSuccess(false);
    try {
      const res = await authApi.updateProfile(data);
      updateUser(res.data);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(extractApiError(err));
    }
  };

  // ── Password form ─────────────────────────────────────────────────
  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const onPasswordSubmit = async (data: PasswordData) => {
    setPasswordError("");
    setPasswordSuccess(false);
    try {
      await authApi.changePassword(data);
      setPasswordSuccess(true);
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(extractApiError(err));
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

          {/* Header */}
          <div className="opacity-0 animate-fade-up">
            <h1 className="font-display text-3xl font-medium">Profile & settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your account details</p>
          </div>

          {/* Avatar strip */}
          <div className="flex items-center gap-4 bg-white rounded-2xl border border-border p-5 opacity-0 animate-fade-up delay-100">
            <div className="w-14 h-14 rounded-2xl bg-rendi-100 flex items-center justify-center flex-shrink-0">
              <span className="text-rendi-700 font-display font-medium text-xl">
                {user?.first_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.full_name || "—"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* ── Personal info card ──────────────────────────────── */}
          <Card className="opacity-0 animate-fade-up delay-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-rendi-50 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-rendi-600" />
                </div>
                <CardTitle className="text-lg">Personal information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First name" error={profileErrors.first_name?.message}>
                    <Input
                      {...regProfile("first_name")}
                      error={!!profileErrors.first_name}
                    />
                  </FormField>
                  <FormField label="Last name" error={profileErrors.last_name?.message}>
                    <Input
                      {...regProfile("last_name")}
                      error={!!profileErrors.last_name}
                    />
                  </FormField>
                </div>

                <FormField label="Email address" hint="Email cannot be changed">
                  <Input value={user?.email ?? ""} disabled className="bg-muted/50" readOnly />
                </FormField>

                {profileError && (
                  <p className="text-sm text-destructive">{profileError}</p>
                )}

                <div className="flex items-center gap-3">
                  <Button type="submit" loading={profileSubmitting} size="sm">
                    Save changes
                  </Button>
                  {profileSuccess && (
                    <span className="flex items-center gap-1.5 text-sm text-rendi-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Saved!
                    </span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* ── Change password card ────────────────────────────── */}
          <Card className="opacity-0 animate-fade-up delay-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-rendi-50 rounded-xl flex items-center justify-center">
                  <Lock className="w-4 h-4 text-rendi-600" />
                </div>
                <CardTitle className="text-lg">Change password</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-5">
                <FormField label="Current password" error={passwordErrors.old_password?.message}>
                  <Input
                    {...regPassword("old_password")}
                    type="password"
                    placeholder="Enter current password"
                    error={!!passwordErrors.old_password}
                  />
                </FormField>

                <Separator />

                <FormField
                  label="New password"
                  error={passwordErrors.new_password?.message}
                  hint="At least 8 characters, one uppercase, one number"
                >
                  <Input
                    {...regPassword("new_password")}
                    type="password"
                    placeholder="Create new password"
                    error={!!passwordErrors.new_password}
                  />
                </FormField>

                <FormField label="Confirm new password" error={passwordErrors.new_password_confirm?.message}>
                  <Input
                    {...regPassword("new_password_confirm")}
                    type="password"
                    placeholder="Repeat new password"
                    error={!!passwordErrors.new_password_confirm}
                  />
                </FormField>

                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}

                <div className="flex items-center gap-3">
                  <Button type="submit" loading={passwordSubmitting} size="sm">
                    Update password
                  </Button>
                  {passwordSuccess && (
                    <span className="flex items-center gap-1.5 text-sm text-rendi-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Password updated!
                    </span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* ── Sign out ────────────────────────────────────────── */}
          <div className="opacity-0 animate-fade-up delay-400">
            <Separator className="mb-6" />
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground border-border hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
