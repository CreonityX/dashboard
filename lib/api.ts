// Tiny fetch wrapper for the Creonity API.
//
// Browser: cookies (creonity_auth, creonity_refresh) are sent automatically.
// Server (server actions / route handlers): pass the incoming request's
// `Cookie` header via `forwardCookies` so the API can authenticate.
//
// The API base URL is read from NEXT_PUBLIC_API_BASE for the browser and
// INTERNAL_API_BASE for server-side fetches (Docker service name in dev).

const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000";
const INTERNAL_BASE = process.env.INTERNAL_API_BASE ?? PUBLIC_BASE;
const isServer = typeof window === "undefined";

export type ApiError = {
  status: number;
  code: string;
  message: string;
  issues?: ReadonlyArray<{ path: ReadonlyArray<string>; message: string }>;
};

export class ApiCallError extends Error {
  readonly status: number;
  readonly code: string;
  readonly issues?: ApiError["issues"];

  constructor(err: ApiError) {
    super(err.message);
    this.name = "ApiCallError";
    this.status = err.status;
    this.code = err.code;
    if (err.issues) this.issues = err.issues;
  }
}

type Init = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: Record<string, string>;
  /** Server-side only: forward the incoming request's Cookie header. */
  forwardCookies?: string;
};

export async function apiFetch<T>(path: string, init: Init = {}): Promise<T> {
  const { body, headers, forwardCookies, ...rest } = init;
  const base = isServer ? INTERNAL_BASE : PUBLIC_BASE;

  const finalHeaders: Record<string, string> = { ...headers };
  if (body !== undefined && !(body instanceof FormData) && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (isServer && forwardCookies) finalHeaders["Cookie"] = forwardCookies;

  const res = await fetch(`${base}/api/v1${path}`, {
    ...rest,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
    credentials: isServer ? "omit" : "include",
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const err = data as { error?: { code?: string; message?: string; issues?: ApiError["issues"] } } | null;
    throw new ApiCallError({
      status: res.status,
      code: err?.error?.code ?? "HTTP_ERROR",
      message: err?.error?.message ?? `Request failed with status ${res.status}`,
      ...(err?.error?.issues ? { issues: err.error.issues } : {}),
    });
  }
  return data as T;
}

// ── Typed auth API ────────────────────────────────────────────────────────────

export type TokenPair = {
  access_token: string;
  refresh_token: string;
};

export type MfaRequired = {
  mfa_required: true;
  mfa_token: string;
};

export type Me = {
  id: string;
  email: string;
  is_email_verified: boolean;
  name?: string;
  roles: string[];
  account_type: "brand" | "creator" | "admin";
  account_id: string | null;
  is_onboarding_complete: boolean | null;
  mfa_enabled: boolean;
  created_at: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
  username?: string;
  bio?: string;
  tagline?: string;
  expertiseTags?: string[];
  timezone: string;
  country: string;
  legalName?: string;
  website?: string;
  fullName?: string;
  department?: string;
  accessLevel?: "super_admin" | "support_agent" | "developer" | "auditor";
};

export type RegisterResult = {
  userId: string;
  message: string;
};

export type MfaSetupResult = {
  secret: string;
  qr_uri: string;
};

export type OnboardingStatus = {
  currentStep:
    | "profile_basics"
    | "expertise_tags"
    | "social_connect"
    | "availability"
    | "payout_method"
    | "team_setup"
    | null;
  completedSteps: Array<OnboardingStatus["currentStep"]>;
  percentComplete: number;
  isComplete: boolean;
};

export async function login(email: string, password: string): Promise<TokenPair | MfaRequired> {
  return apiFetch<TokenPair | MfaRequired>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function logout(refreshToken: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/logout", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
}

export async function refresh(refreshToken: string): Promise<TokenPair> {
  return apiFetch<TokenPair>("/auth/refresh", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
}

export async function me(forwardCookies?: string): Promise<Me> {
  return apiFetch<Me>("/auth/me", forwardCookies ? { forwardCookies } : {});
}

export async function registerCreator(payload: RegisterPayload): Promise<RegisterResult> {
  return apiFetch<RegisterResult>("/auth/register/creator", {
    method: "POST",
    body: payload,
  });
}

export async function registerBrand(payload: RegisterPayload): Promise<RegisterResult> {
  return apiFetch<RegisterResult>("/auth/register/brand", {
    method: "POST",
    body: payload,
  });
}

export async function verifyEmail(email: string, token: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/verify-email", {
    method: "POST",
    body: { email, token },
  });
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/resend-verification", {
    method: "POST",
    body: { email },
  });
}

export async function mfaChallenge(mfaToken: string, totpCode: string): Promise<TokenPair> {
  return apiFetch<TokenPair>("/auth/mfa/challenge", {
    method: "POST",
    body: { mfa_token: mfaToken, totp_code: totpCode },
  });
}

export async function mfaSetup(forwardCookies: string): Promise<MfaSetupResult> {
  return apiFetch<MfaSetupResult>("/auth/mfa/setup", { forwardCookies });
}

export async function mfaVerify(totpCode: string, forwardCookies: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/mfa/verify", {
    method: "POST",
    body: { totp_code: totpCode },
    forwardCookies,
  });
}

export async function mfaDisable(
  password: string,
  totpCode: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/mfa/disable", {
    method: "POST",
    body: { password, totp_code: totpCode },
    forwardCookies,
  });
}

// ── Onboarding API (creator account) ─────────────────────────────────────────

export async function onboardingStatus(forwardCookies: string): Promise<OnboardingStatus> {
  return apiFetch<OnboardingStatus>("/creator/onboarding/status", { forwardCookies });
}

export async function onboardingProfileBasics(
  payload: { displayName: string; username: string; bio?: string; tagline?: string },
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/creator/onboarding/profile-basics", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function onboardingAvatar(
  file: File,
  forwardCookies: string,
): Promise<{ avatarUrl: string; avatarThumbUrl: string }> {
  const fd = new FormData();
  fd.append("file", file);
  return apiFetch<{ avatarUrl: string; avatarThumbUrl: string }>("/creator/onboarding/avatar", {
    method: "POST",
    body: fd,
    forwardCookies,
  });
}

export async function onboardingExpertiseTags(
  tags: string[],
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/creator/onboarding/expertise-tags", {
    method: "POST",
    body: { tags },
    forwardCookies,
  });
}

export async function onboardingAvailability(
  payload: { acceptingGigs: boolean; responseSla?: string },
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/creator/onboarding/availability", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function onboardingPayoutMethod(
  payload: { type: "bank_account" | "upi"; details?: Record<string, unknown> },
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/creator/onboarding/payout-method", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function onboardingComplete(forwardCookies: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/creator/onboarding/complete", {
    method: "POST",
    forwardCookies,
  });
}

export async function acceptTeamInvite(
  memberId: string,
  token: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/brand/team-members/${memberId}/accept`, {
    method: "POST",
    body: { token },
    forwardCookies,
  });
}

// ── Brand profile ─────────────────────────────────────────────────────────────

export type BrandProfile = {
  id: string;
  legalName: string;
  displayName: string;
  website: string | null;
  logoUrl: string | null;
  verificationStatus: string;
  subscriptionTier: string;
  timezone: string;
  country: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicBrandProfile = {
  id: string;
  displayName: string;
  website: string | null;
  logoUrl: string | null;
  verificationStatus: string;
  subscriptionTier: string;
  country: string;
  createdAt: string;
};

export type UpdateBrandProfilePayload = {
  displayName?: string;
  website?: string | null;
  logoUrl?: string | null;
  timezone?: string;
  country?: string;
};

export async function getMyBrand(forwardCookies: string): Promise<BrandProfile> {
  return apiFetch<BrandProfile>("/brand/me", { forwardCookies });
}

export async function updateMyBrand(
  payload: UpdateBrandProfilePayload,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/brand/me", {
    method: "PATCH",
    body: payload,
    forwardCookies,
  });
}

export async function getPublicBrandProfile(
  brandId: string,
  forwardCookies: string,
): Promise<PublicBrandProfile> {
  return apiFetch<PublicBrandProfile>(`/brand/${brandId}/public`, { forwardCookies });
}

// ── Team (brand + creator share the shape; only the prefix differs) ──────────

export type TeamMember = {
  id: string;
  userId: string;
  email: string;
  role: string;
  status: string;
  invitedAt: string;
  activatedAt: string | null;
};

export async function listBrandTeam(forwardCookies: string): Promise<{ members: TeamMember[] }> {
  return apiFetch<{ members: TeamMember[] }>("/brand/team-members", { forwardCookies });
}

export async function inviteBrandMember(
  payload: { email: string; role: string },
  forwardCookies: string,
): Promise<{ message: string; teamMemberId: string }> {
  return apiFetch<{ message: string; teamMemberId: string }>("/brand/team-members", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function updateBrandMemberRole(
  memberId: string,
  role: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/brand/team-members/${memberId}`, {
    method: "PATCH",
    body: { role },
    forwardCookies,
  });
}

export async function removeBrandMember(
  memberId: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/brand/team-members/${memberId}`, {
    method: "DELETE",
    forwardCookies,
  });
}

export async function listCreatorTeam(forwardCookies: string): Promise<{ members: TeamMember[] }> {
  return apiFetch<{ members: TeamMember[] }>("/creator/team-members", { forwardCookies });
}

export async function inviteCreatorMember(
  payload: { email: string; role: string },
  forwardCookies: string,
): Promise<{ message: string; teamMemberId: string }> {
  return apiFetch<{ message: string; teamMemberId: string }>("/creator/team-members", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

// ── Campaigns (brand side) ────────────────────────────────────────────────────

export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "closed"
  | "completed"
  | "cancelled";

export type Campaign = {
  id: string;
  brandAccountId: string;
  createdBy: string;
  title: string;
  description: string;
  nicheTags: string[];
  platforms: string[];
  contentTypes: string[];
  budgetTotal: string;
  budgetPerCreator: string;
  maxCreators: number;
  requirements: string | null;
  deliverables: Array<{ type: string; quantity: number; description: string }>;
  applicationDeadline: string | null;
  campaignStartDate: string | null;
  campaignEndDate: string | null;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateCampaignPayload = {
  title: string;
  description: string;
  nicheTags: string[];
  platforms: string[];
  contentTypes: string[];
  budgetTotal: string;
  budgetPerCreator: string;
  maxCreators?: number;
  requirements?: string;
  deliverables: Array<{ type: string; quantity: number; description: string }>;
  applicationDeadline?: string;
  campaignStartDate?: string;
  campaignEndDate?: string;
};

export type CampaignPage = { items: Campaign[]; nextCursor: string | null };

export async function listBrandCampaigns(
  params: { status?: CampaignStatus; limit?: number; cursor?: string },
  forwardCookies: string,
): Promise<CampaignPage> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<CampaignPage>(`/campaign${suffix}`, { forwardCookies });
}

export async function getBrandCampaign(
  campaignId: string,
  forwardCookies: string,
): Promise<Campaign> {
  return apiFetch<Campaign>(`/campaign/${campaignId}`, { forwardCookies });
}

export async function createCampaign(
  payload: CreateCampaignPayload,
  forwardCookies: string,
): Promise<{ message: string; campaignId: string }> {
  return apiFetch<{ message: string; campaignId: string }>("/campaign", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function updateCampaign(
  campaignId: string,
  payload: Partial<CreateCampaignPayload>,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/campaign/${campaignId}`, {
    method: "PATCH",
    body: payload,
    forwardCookies,
  });
}

async function campaignTransition(
  campaignId: string,
  action: "publish" | "pause" | "close" | "cancel",
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/campaign/${campaignId}/${action}`, {
    method: "POST",
    forwardCookies,
  });
}

export const publishCampaign = (id: string, c: string) => campaignTransition(id, "publish", c);
export const pauseCampaign = (id: string, c: string) => campaignTransition(id, "pause", c);
export const closeCampaign = (id: string, c: string) => campaignTransition(id, "close", c);
export const cancelCampaign = (id: string, c: string) => campaignTransition(id, "cancel", c);

// ── Applications (brand reviews what creators submitted) ──────────────────────

export type ApplicationStatus = "pending" | "shortlisted" | "accepted" | "rejected" | "withdrawn";

export type CampaignApplication = {
  id: string;
  campaignId: string;
  creatorAccountId: string;
  proposedRate: string;
  pitch: string | null;
  status: ApplicationStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationPage = { items: CampaignApplication[]; nextCursor: string | null };

export async function listCampaignApplications(
  campaignId: string,
  params: { status?: ApplicationStatus; limit?: number; cursor?: string },
  forwardCookies: string,
): Promise<ApplicationPage> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<ApplicationPage>(`/campaign/${campaignId}/applications${suffix}`, {
    forwardCookies,
  });
}

export async function reviewApplication(
  campaignId: string,
  applicationId: string,
  payload: { action: "shortlist" | "accept" | "reject"; rejectionReason?: string },
  forwardCookies: string,
): Promise<{ message: string; dealId?: string }> {
  return apiFetch<{ message: string; dealId?: string }>(
    `/campaign/${campaignId}/applications/${applicationId}`,
    { method: "PATCH", body: payload, forwardCookies },
  );
}

// ── Discovery + applications (creator side) ───────────────────────────────────

export type DiscoverFilters = {
  niche?: string;
  platform?: string;
  budgetMin?: string;
  budgetMax?: string;
  limit?: number;
  cursor?: string;
};

export async function discoverCampaigns(
  params: DiscoverFilters,
  forwardCookies: string,
): Promise<CampaignPage> {
  const qs = new URLSearchParams();
  if (params.niche) qs.set("niche", params.niche);
  if (params.platform) qs.set("platform", params.platform);
  if (params.budgetMin) qs.set("budgetMin", params.budgetMin);
  if (params.budgetMax) qs.set("budgetMax", params.budgetMax);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<CampaignPage>(`/campaign/discover${suffix}`, { forwardCookies });
}

export async function getDiscoverCampaign(
  campaignId: string,
  forwardCookies: string,
): Promise<Campaign> {
  return apiFetch<Campaign>(`/campaign/discover/${campaignId}`, { forwardCookies });
}

export async function applyToCampaign(
  campaignId: string,
  payload: { proposedRate: string; pitch?: string },
  forwardCookies: string,
): Promise<{ message: string; applicationId: string }> {
  return apiFetch<{ message: string; applicationId: string }>(
    `/campaign/discover/${campaignId}/apply`,
    { method: "POST", body: payload, forwardCookies },
  );
}

export async function listMyApplications(
  params: { status?: ApplicationStatus; limit?: number; cursor?: string },
  forwardCookies: string,
): Promise<ApplicationPage> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<ApplicationPage>(`/campaign/my-applications${suffix}`, { forwardCookies });
}

export async function withdrawApplication(
  applicationId: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/campaign/my-applications/${applicationId}`, {
    method: "DELETE",
    forwardCookies,
  });
}

// ── Deals (both sides) ────────────────────────────────────────────────────────

export type DealStatus =
  | "active"
  | "content_submitted"
  | "approved"
  | "payment_pending"
  | "completed"
  | "cancelled";

export type Deal = {
  id: string;
  campaignId: string;
  applicationId: string;
  brandAccountId: string;
  creatorAccountId: string;
  agreedRate: string;
  status: DealStatus;
  contentSubmissionUrl: string | null;
  contentSubmittedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DealPage = { items: Deal[]; nextCursor: string | null };

export async function listDeals(
  params: { status?: DealStatus; limit?: number; cursor?: string },
  forwardCookies: string,
): Promise<DealPage> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<DealPage>(`/campaign/deals${suffix}`, { forwardCookies });
}

export async function getDeal(dealId: string, forwardCookies: string): Promise<Deal> {
  return apiFetch<Deal>(`/campaign/deals/${dealId}`, { forwardCookies });
}

export async function submitDealContent(
  dealId: string,
  contentSubmissionUrl: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/campaign/deals/${dealId}/submit-content`, {
    method: "POST",
    body: { contentSubmissionUrl },
    forwardCookies,
  });
}

export async function approveDeal(
  dealId: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/campaign/deals/${dealId}/approve`, {
    method: "POST",
    forwardCookies,
  });
}

export async function cancelDeal(
  dealId: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/campaign/deals/${dealId}/cancel`, {
    method: "POST",
    forwardCookies,
  });
}

// ── UI status mapping ─────────────────────────────────────────────────────────
// The frontend's BrandCampaign type uses live|planning|completed|archived|
// paused; the backend uses draft|active|paused|closed|completed|cancelled.
// Map at the boundary (in UI code) so both sides keep their own vocabulary.

export type UiCampaignStatus = "live" | "planning" | "completed" | "archived" | "paused";

export function toUiCampaignStatus(s: CampaignStatus): UiCampaignStatus {
  switch (s) {
    case "active":
      return "live";
    case "draft":
      return "planning";
    case "paused":
      return "paused";
    case "completed":
      return "completed";
    case "closed":
    case "cancelled":
      return "archived";
  }
}
