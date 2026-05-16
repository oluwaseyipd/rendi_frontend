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
  // Phase 4: optional referral code passed from URL ?ref=
  referral_code?: string;
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

// ─── Assessment ───────────────────────────────────────────────────────────────

export interface AssessmentInputs {
  annual_income: number;
  savings: number;
  target_property_price: number;
  monthly_commitments?: number | null;
  has_ccj?: boolean | null;
  has_missed_payments?: boolean | null;
  monthly_saving_ability?: number | null;
}

export type AssessmentStatus =
  | "Early stages"
  | "Building momentum"
  | "Getting close"
  | "Strong position";

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

export interface SavingScenario {
  monthly_amount: number;
  months_to_close: number;
  months_faster_than_baseline: number;
  message: string;
  is_meaningful: boolean;
}

export type BlockerKey = "deposit" | "income" | "commitments" | "credit";

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
  biggest_blocker: BlockerKey;
  blocker_priority: BlockerKey[];
  recommendations: string[];
  simulations: SavingScenario[];
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
  biggest_blocker: BlockerKey;
  created_at: string;
}

export interface AssessmentResponse {
  disclaimer: string;
  assessment: Assessment;
}

// ─── Phase 3: "How you compare" ───────────────────────────────────────────────

export interface ComparisonResult {
  has_data: boolean;
  fallback_message: string;
  headline: string;
  headline_pct: number;
  subtitle: string;
  savings_line: string;
  deposit_gap_line: string;
  segment_label: string;
  total_users: number;
  share_text: string;
}

// ─── Phase 4: Referrals ───────────────────────────────────────────────────────

export interface ReferralStats {
  code: string;
  referral_url: string;
  invite_count: number;
  conversion_count: number;
  conversion_rate: number;
  share_text: string;
  created_at: string;
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
