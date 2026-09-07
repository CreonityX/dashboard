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
  action: "publish" | "pause" | "resume" | "close" | "cancel",
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/campaign/${campaignId}/${action}`, {
    method: "POST",
    forwardCookies,
  });
}

export const publishCampaign = (id: string, c: string) => campaignTransition(id, "publish", c);
export const pauseCampaign = (id: string, c: string) => campaignTransition(id, "pause", c);
export const resumeCampaign = (id: string, c: string) => campaignTransition(id, "resume", c);
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

// ── Creator insights ──────────────────────────────────────────────────────────
// Shapes mirror the OpenAPI responses in
// backend/src/modules/creator/routes/insights.route.ts.

export type InsightsOverview = {
  totalFollowers: number;
  followerGrowthPct: number | null;
  avgEngagementRate: number | null;
  estimatedReach: number;
  topPlatform: string | null;
  dealCount: number;
  totalEarnings: number;
  earningsGrowthPct: number | null;
};

export type PlatformBreakdown = {
  platform: string;
  followerCount: number | null;
  followerDelta: number | null;
  engagementRate: number | null;
  avgViews: number | null;
  topPost: { title: string | null; url: string | null; views: number | null } | null;
};

export type ContentMetric = {
  id: string;
  socialAccountId: string;
  platformPostId: string;
  postType: string;
  publishedAt: string | null;
  title: string | null;
  url: string | null;
  views: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  saves: number | null;
  reach: number | null;
  impressions: number | null;
  watchTimeSeconds: number | null;
  engagementRate: number | null;
  campaignId: string | null;
  campaignName: string | null;
};

export type ContentPage = {
  items: ContentMetric[];
  pagination: { nextCursor: string | null };
};

export type AudienceDemographics = {
  platform: string;
  snapshotDate: string;
  ageRange: Record<string, unknown> | null;
  gender: Record<string, unknown> | null;
  topCountries: Record<string, unknown> | null;
  topCities: Record<string, unknown> | null;
} | null;

export type GrowthSeries = {
  platform: string;
  metric: string;
  series: Array<{ date: string; value: number | null }>;
};

export type Benchmarks = {
  niche: string;
  platforms: Array<{ platform: string; creator: unknown; niche: unknown }>;
};

export type DealPerformance = {
  deals: Array<{
    dealId: string;
    campaignId: string;
    campaignTitle: string;
    brandAccountId: string;
    agreedRate: string;
    status: string;
    contentSubmittedAt: string | null;
    approvedAt: string | null;
    contentUrl: string | null;
    views: number | null;
    likes: number | null;
    comments: number | null;
    shares: number | null;
    engagementRate: number | null;
  }>;
};

export type DateRange = { from?: string; to?: string };

function rangeQs(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) qs.set(k, String(v));
  }
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return suffix;
}

export async function getInsightsOverview(
  params: DateRange,
  forwardCookies: string,
): Promise<InsightsOverview> {
  return apiFetch<InsightsOverview>(`/creator/insights/overview${rangeQs(params)}`, {
    forwardCookies,
  });
}

export async function getInsightsPlatforms(
  params: DateRange,
  forwardCookies: string,
): Promise<PlatformBreakdown[]> {
  return apiFetch<PlatformBreakdown[]>(`/creator/insights/platforms${rangeQs(params)}`, {
    forwardCookies,
  });
}

export async function getInsightsContent(
  params: {
    platform?: string;
    from?: string;
    to?: string;
    sort?: "views" | "likes" | "engagement_rate" | "published_at";
    cursor?: string;
    limit?: number;
  },
  forwardCookies: string,
): Promise<ContentPage> {
  return apiFetch<ContentPage>(`/creator/insights/content${rangeQs(params)}`, { forwardCookies });
}

export async function getInsightsAudience(
  platform: string,
  forwardCookies: string,
): Promise<AudienceDemographics> {
  return apiFetch<AudienceDemographics>(
    `/creator/insights/audience${rangeQs({ platform })}`,
    { forwardCookies },
  );
}

export async function getInsightsGrowthChart(
  params: {
    platform: string;
    metric: "followers" | "engagement" | "reach" | "impressions";
    from?: string;
    to?: string;
  },
  forwardCookies: string,
): Promise<GrowthSeries> {
  return apiFetch<GrowthSeries>(`/creator/insights/growth-chart${rangeQs(params)}`, {
    forwardCookies,
  });
}

export async function getInsightsBenchmarks(
  niche: string,
  forwardCookies: string,
): Promise<Benchmarks> {
  return apiFetch<Benchmarks>(`/creator/insights/benchmarks${rangeQs({ niche })}`, {
    forwardCookies,
  });
}

export async function getInsightsDealPerformance(
  forwardCookies: string,
): Promise<DealPerformance> {
  return apiFetch<DealPerformance>("/creator/insights/deal-performance", { forwardCookies });
}

// ── Brand analytics overview ──────────────────────────────────────────────────
// Shape mirrors backend/src/modules/brand/routes/analytics.route.ts.

export type BrandAnalyticsCampaign = {
  id: string;
  title: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  creatorIds: string[];
  deliverables: { completed: number; total: number };
  reach: number;
  impressions: number;
  engagements: number;
  clicks: number;
  conversions: number;
};

export type BrandAnalyticsCreator = {
  id: string;
  displayName: string;
  username: string;
  campaignIds: string[];
  deliverables: { completed: number; total: number };
  reach: number;
  impressions: number;
  engagements: number;
  clicks: number;
  conversions: number;
  attributedValue: number;
};

export type BrandAnalyticsOverview = {
  campaigns: BrandAnalyticsCampaign[];
  creators: BrandAnalyticsCreator[];
  platformShare: Array<{ platform: string; share: number }>;
  weeklyReach: number[];
};

export async function getBrandAnalyticsOverview(
  forwardCookies: string,
): Promise<BrandAnalyticsOverview> {
  return apiFetch<BrandAnalyticsOverview>("/brand/analytics/overview", { forwardCookies });
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

// ── Comms (creator side) ──────────────────────────────────────────────────────
// Shapes mirror the Drizzle rows (camelCase). Lists are newest-first from
// the API; the UI reverses for chronological display.

export type CommChannel = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  isPrivate: boolean;
  isDefault: boolean;
  createdBy: string;
  archivedAt: string | null;
  createdAt: string;
};

export type CommMessage = {
  id: string;
  channelId: string | null;
  dmThreadId: string | null;
  authorId: string;
  body: string;
  parentMessageId: string | null;
  replyCount: number;
  createdAt: string;
  editedAt: string | null;
  deletedAt: string | null;
};

export type DmThread = {
  id: string;
  workspaceId: string;
  createdAt: string;
  participants: Array<{ userId: string; email: string }>;
};



export type MessageReaction = { emoji: string; count: number; userIds: string[] };

export async function listMessageReactions(
  messageId: string,
  forwardCookies: string,
): Promise<MessageReaction[]> {
  return apiFetch<MessageReaction[]>(`/creator/comms/messages/${messageId}/reactions`, { forwardCookies });
}

export async function addMessageReaction(
  messageId: string,
  emoji: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/creator/comms/messages/${messageId}/reactions`, {
    method: "POST",
    body: { emoji },
    forwardCookies,
  });
}

export async function removeMessageReaction(
  messageId: string,
  emoji: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/creator/comms/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`, {
    method: "DELETE",
    forwardCookies,
  });
}

export type UnreadCounts = {
  channels: Array<{ id: string; name: string; unreadCount: number }>;
  dms: Array<{ id: string; unreadCount: number }>;
};

export async function listCommChannels(forwardCookies: string): Promise<CommChannel[]> {
  return apiFetch<CommChannel[]>("/creator/comms/channels", { forwardCookies });
}

export async function createCommChannel(
  payload: { name: string; description?: string; isPrivate?: boolean },
  forwardCookies: string,
): Promise<CommChannel> {
  return apiFetch<CommChannel>("/creator/comms/channels", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function listChannelMessages(
  channelId: string,
  params: { before?: string; limit?: number },
  forwardCookies: string,
): Promise<CommMessage[]> {
  const qs = new URLSearchParams();
  if (params.before) qs.set("before", params.before);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<CommMessage[]>(`/creator/comms/channels/${channelId}/messages${suffix}`, {
    forwardCookies,
  });
}

export async function sendChannelMessage(
  channelId: string,
  payload: { body: string; parentMessageId?: string },
  forwardCookies: string,
): Promise<CommMessage> {
  return apiFetch<CommMessage>(`/creator/comms/channels/${channelId}/messages`, {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function listDmThreads(forwardCookies: string): Promise<DmThread[]> {
  return apiFetch<DmThread[]>("/creator/comms/dms", { forwardCookies });
}

export async function startDmThread(
  userId: string,
  forwardCookies: string,
): Promise<DmThread> {
  return apiFetch<DmThread>("/creator/comms/dms", {
    method: "POST",
    body: { userId },
    forwardCookies,
  });
}

export async function listDmMessages(
  threadId: string,
  params: { before?: string; limit?: number },
  forwardCookies: string,
): Promise<CommMessage[]> {
  const qs = new URLSearchParams();
  if (params.before) qs.set("before", params.before);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<CommMessage[]>(`/creator/comms/dms/${threadId}/messages${suffix}`, {
    forwardCookies,
  });
}

export async function sendDmMessage(
  threadId: string,
  payload: { body: string },
  forwardCookies: string,
): Promise<CommMessage> {
  return apiFetch<CommMessage>(`/creator/comms/dms/${threadId}/messages`, {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function getUnreadCounts(forwardCookies: string): Promise<UnreadCounts> {
  return apiFetch<UnreadCounts>("/creator/comms/unread", { forwardCookies });
}

export async function markChannelRead(
  channelId: string,
  messageId: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/creator/comms/channels/${channelId}/mark-read`, {
    method: "POST",
    body: { messageId },
    forwardCookies,
  });
}

export async function markDmRead(
  threadId: string,
  messageId: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/creator/comms/dms/${threadId}/mark-read`, {
    method: "POST",
    body: { messageId },
    forwardCookies,
  });
}


// ── Workflows ────────────────────────────────────────────────────────────────

export type WorkflowStepType =
  | "notify"
  | "assign"
  | "approval"
  | "condition"
  | "webhook"
  | "wait"
  | "create_task"
  | "send_message";

export type WorkflowStepDefinition = {
  type: WorkflowStepType;
  label?: string;
  config: Record<string, unknown>;
};

export type WorkflowTriggerType =
  | "manual"
  | "campaign_created"
  | "content_submitted"
  | "deal_closed"
  | "custom";

export type WorkflowTemplate = {
  id: string;
  creatorAccountId: string | null;
  name: string;
  description: string | null;
  triggerType: WorkflowTriggerType;
  steps: WorkflowStepDefinition[];
  isActive: boolean;
  version: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowInstanceStatus =
  | "pending"
  | "in_progress"
  | "waiting_approval"
  | "completed"
  | "cancelled"
  | "failed";

export type WorkflowStepStatus =
  | "pending"
  | "in_progress"
  | "approved"
  | "rejected"
  | "skipped"
  | "failed";

export type WorkflowReferenceType =
  | "campaign"
  | "content"
  | "deal"
  | "task"
  | "custom";

export type WorkflowStepExecution = {
  id: string;
  instanceId: string;
  stepIndex: number;
  stepType: WorkflowStepType;
  stepConfig: Record<string, unknown>;
  assignedTo: string | null;
  status: WorkflowStepStatus;
  startedAt: string | null;
  completedAt: string | null;
  approvedBy: string | null;
  rejectionReason: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type WorkflowInstance = {
  id: string;
  templateId: string;
  creatorAccountId: string;
  referenceType: WorkflowReferenceType;
  referenceId: string;
  status: WorkflowInstanceStatus;
  currentStepIndex: number;
  startedAt: string | null;
  completedAt: string | null;
  cancelledBy: string | null;
  triggeredBy: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowInstanceWithSteps = WorkflowInstance & {
  steps: WorkflowStepExecution[];
};

export async function listWorkflowTemplates(forwardCookies?: string): Promise<WorkflowTemplate[]> {
  return apiFetch<WorkflowTemplate[]>("/creator/workflows/templates", forwardCookies ? { forwardCookies } : {});
}

export async function getWorkflowTemplate(id: string, forwardCookies?: string): Promise<WorkflowTemplate> {
  return apiFetch<WorkflowTemplate>(`/creator/workflows/templates/${id}`, forwardCookies ? { forwardCookies } : {});
}

export async function createWorkflowTemplate(
  payload: {
    name: string;
    description?: string;
    triggerType?: WorkflowTriggerType;
    steps: WorkflowStepDefinition[];
  },
  forwardCookies: string,
): Promise<WorkflowTemplate> {
  return apiFetch<WorkflowTemplate>("/creator/workflows/templates", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function startWorkflow(
  payload: {
    templateId: string;
    referenceType: WorkflowReferenceType;
    referenceId: string;
  },
  forwardCookies: string,
): Promise<WorkflowInstance> {
  return apiFetch<WorkflowInstance>("/creator/workflows/start", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function listWorkflowInstances(
  params: { status?: WorkflowInstanceStatus; referenceType?: WorkflowReferenceType; limit?: number } = {},
  forwardCookies?: string,
): Promise<WorkflowInstance[]> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.referenceType) qs.set("referenceType", params.referenceType);
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<WorkflowInstance[]>(`/creator/workflows/instances${suffix}`, forwardCookies ? { forwardCookies } : {});
}

export async function getWorkflowInstance(
  id: string,
  forwardCookies?: string,
): Promise<WorkflowInstanceWithSteps> {
  return apiFetch<WorkflowInstanceWithSteps>(`/creator/workflows/instances/${id}`, forwardCookies ? { forwardCookies } : {});
}

export async function approveWorkflowStep(
  id: string,
  payload: { stepIndex: number; approved: boolean; rejectionReason?: string },
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/creator/workflows/instances/${id}/approve-step`, {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function cancelWorkflowInstance(
  id: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/creator/workflows/instances/${id}/cancel`, {
    method: "POST",
    forwardCookies,
  });
}

// ── Notifications ────────────────────────────────────────────────────────────

export type NotificationKind =
  | "application_received"
  | "application_accepted"
  | "application_rejected"
  | "deal_content_submitted"
  | "deal_approved"
  | "deal_cancelled"
  | "message_received"
  | "channel_invite"
  | "workflow_step"
  | "payment_released"
  | "social_sync_completed"
  | "social_sync_failed"
  | "system";

export type Notification = {
  id: string;
  accountType: "brand" | "creator";
  accountId: string;
  actorUserId: string | null;
  kind: NotificationKind;
  title: string;
  body: string;
  referenceType: string | null;
  referenceId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export async function listNotifications(
  params: { unreadOnly?: boolean; limit?: number; cursor?: string } = {},
  forwardCookies?: string,
): Promise<Notification[]> {
  const qs = new URLSearchParams();
  if (params.unreadOnly) qs.set("unreadOnly", "true");
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  const suffix = qs.size > 0 ? `?${qs}` : "";
  // The /me endpoint is the same prefix for both account types;
  // the route decides creator vs brand from the bearer token's
  // accountType claim. We hit /creator/notifications as a default
  // when the server-rendered page knows the account type, and the
  // page will pass the right base. For now, callers pick the path.
  return apiFetch<Notification[]>(
    `/creator/notifications${suffix}`,
    forwardCookies ? { forwardCookies } : {},
  );
}

export async function listBrandNotifications(
  params: { unreadOnly?: boolean; limit?: number; cursor?: string } = {},
  forwardCookies?: string,
): Promise<Notification[]> {
  const qs = new URLSearchParams();
  if (params.unreadOnly) qs.set("unreadOnly", "true");
  if (params.limit !== undefined) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<Notification[]>(
    `/brand/notifications${suffix}`,
    forwardCookies ? { forwardCookies } : {},
  );
}

export async function getUnreadCount(
  forwardCookies?: string,
): Promise<{ count: number }> {
  return apiFetch<{ count: number }>(
    "/creator/notifications/unread-count",
    forwardCookies ? { forwardCookies } : {},
  );
}

export async function getBrandUnreadCount(
  forwardCookies?: string,
): Promise<{ count: number }> {
  return apiFetch<{ count: number }>(
    "/brand/notifications/unread-count",
    forwardCookies ? { forwardCookies } : {},
  );
}

export async function markNotificationRead(
  id: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/creator/notifications/${id}/read`, {
    method: "PATCH",
    forwardCookies,
  });
}

export async function markBrandNotificationRead(
  id: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/brand/notifications/${id}/read`, {
    method: "PATCH",
    forwardCookies,
  });
}

export async function markAllNotificationsRead(
  forwardCookies: string,
): Promise<{ updated: number }> {
  return apiFetch<{ updated: number }>("/creator/notifications/mark-all-read", {
    method: "POST",
    forwardCookies,
  });
}

export async function markAllBrandNotificationsRead(
  forwardCookies: string,
): Promise<{ updated: number }> {
  return apiFetch<{ updated: number }>("/brand/notifications/mark-all-read", {
    method: "POST",
    forwardCookies,
  });
}

export async function deleteNotification(
  id: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/creator/notifications/${id}`, {
    method: "DELETE",
    forwardCookies,
  });
}

export async function deleteBrandNotification(
  id: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/brand/notifications/${id}`, {
    method: "DELETE",
    forwardCookies,
  });
}

// ── Calendar ────────────────────────────────────────────────────────────────

export type CalendarEventType =
  | "post"
  | "campaign"
  | "deadline"
  | "meeting"
  | "shoot"
  | "review"
  | "approval"
  | "payment"
  | "personal";

export type CalendarPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "linkedin";

export type CalendarPriority = "low" | "medium" | "high";

export type CalendarEvent = {
  id: string;
  accountType: "brand" | "creator";
  accountId: string;
  title: string;
  type: CalendarEventType;
  startDate: string;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  allDay: boolean;
  description: string | null;
  platform: CalendarPlatform | null;
  brand: string | null;
  campaign: string | null;
  creator: string | null;
  assignee: string | null;
  priority: CalendarPriority | null;
  completed: boolean;
  reminder: string | null;
  tags: string[];
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listCreatorCalendar(
  params: { from?: string; to?: string; type?: CalendarEventType } = {},
  forwardCookies?: string,
): Promise<CalendarEvent[]> {
  const qs = new URLSearchParams();
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.type) qs.set("type", params.type);
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<CalendarEvent[]>(
    `/creator/calendar${suffix}`,
    forwardCookies ? { forwardCookies } : {},
  );
}

export async function listBrandCalendar(
  params: { from?: string; to?: string; type?: CalendarEventType } = {},
  forwardCookies?: string,
): Promise<CalendarEvent[]> {
  const qs = new URLSearchParams();
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.type) qs.set("type", params.type);
  const suffix = qs.size > 0 ? `?${qs}` : "";
  return apiFetch<CalendarEvent[]>(
    `/brand/calendar${suffix}`,
    forwardCookies ? { forwardCookies } : {},
  );
}

export async function createCalendarEvent(
  payload: {
    title: string;
    type: CalendarEventType;
    startDate: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    allDay?: boolean;
    description?: string;
    platform?: CalendarPlatform;
    brand?: string;
    campaign?: string;
    creator?: string;
    assignee?: string;
    priority?: CalendarPriority;
    completed?: boolean;
    reminder?: string;
    tags?: string[];
  },
  forwardCookies: string,
): Promise<CalendarEvent> {
  return apiFetch<CalendarEvent>("/creator/calendar", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function createBrandCalendarEvent(
  payload: Parameters<typeof createCalendarEvent>[0],
  forwardCookies: string,
): Promise<CalendarEvent> {
  return apiFetch<CalendarEvent>("/brand/calendar", {
    method: "POST",
    body: payload,
    forwardCookies,
  });
}

export async function updateCalendarEvent(
  id: string,
  payload: Partial<Parameters<typeof createCalendarEvent>[0]>,
  forwardCookies: string,
): Promise<CalendarEvent> {
  return apiFetch<CalendarEvent>(`/creator/calendar/${id}`, {
    method: "PATCH",
    body: payload,
    forwardCookies,
  });
}

export async function updateBrandCalendarEvent(
  id: string,
  payload: Partial<Parameters<typeof createCalendarEvent>[0]>,
  forwardCookies: string,
): Promise<CalendarEvent> {
  return apiFetch<CalendarEvent>(`/brand/calendar/${id}`, {
    method: "PATCH",
    body: payload,
    forwardCookies,
  });
}

export async function deleteCalendarEvent(
  id: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/creator/calendar/${id}`, {
    method: "DELETE",
    forwardCookies,
  });
}

export async function deleteBrandCalendarEvent(
  id: string,
  forwardCookies: string,
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/brand/calendar/${id}`, {
    method: "DELETE",
    forwardCookies,
  });
}
