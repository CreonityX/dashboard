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
  accessToken: string;
  refreshToken: string;
};

export type MfaRequired = {
  mfa_required: true;
  mfa_token: string;
};

export type Me = {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  account_type: "brand" | "creator" | "admin";
  mfa_enabled: boolean;
  created_at: string;
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
