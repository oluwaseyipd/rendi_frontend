// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

// ─── Assessment ──────────────────────────────────────────────────────────────

export interface AssessmentInputs {
  annual_income: number;
  savings: number;
  target_property_price: number;
  monthly_commitments?: number | null;
  has_ccj?: boolean | null;
  has_missed_payments?: boolean | null;
}

export type AssessmentStatus = "Early stages" | "Getting closer" | "Nearly ready";

export interface BreakdownComponent {
  points: number;
  max_points: number;
  label: string;
  value: number;
}

export interface AssessmentBreakdown {
  deposit: BreakdownComponent;
  income: BreakdownComponent;
  commitments: BreakdownComponent;
  credit: BreakdownComponent;
}

export interface Assessment {
  id: number;
  annual_income: string;
  savings: string;
  target_property_price: string;
  monthly_commitments: string | null;
  has_ccj: boolean | null;
  has_missed_payments: boolean | null;
  score: number;
  status: AssessmentStatus;
  time_estimate: string;
  deposit_needed: string;
  deposit_gap: string;
  estimated_months: number;
  breakdown: AssessmentBreakdown;
  action_plan: string[];
  created_at: string;
}

export interface AssessmentListItem {
  id: number;
  score: number;
  status: AssessmentStatus;
  time_estimate: string;
  target_property_price: string;
  deposit_gap: string;
  estimated_months: number;
  created_at: string;
}

export interface AssessmentResponse {
  disclaimer: string;
  assessment: Assessment;
}

// ─── API Errors ───────────────────────────────────────────────────────────────

export interface ApiFieldErrors {
  [field: string]: string[];
}

export interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}
