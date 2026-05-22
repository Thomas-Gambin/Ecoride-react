import { getAccessToken } from "@/shared/auth/auth-storage"
import { refreshAuthSession } from "@/shared/auth/auth-session"

export type ApiErrorShape = {
  message: string
  fields?: Record<string, string>
  code?: string
}

export type ApiFetchOptions = {
  /** Ne pas envoyer le Bearer token (login, refresh, logout). */
  skipAuth?: boolean
  /** Ne pas déclencher le callback global 401. */
  skipUnauthorizedHandler?: boolean
  /** Requête déjà relancée après refresh (évite les boucles). */
  isRetry?: boolean
}

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler
}

function getBaseUrl() {
  const env = import.meta.env.VITE_API_BASE_URL as string | undefined
  return env?.replace(/\/+$/, "") ?? ""
}

async function readJsonSafe(res: Response) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    return null
  }
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  options: ApiFetchOptions = {},
): Promise<Response> {
  const url = `${getBaseUrl()}${path}`
  const headers: Record<string, string> = {
    ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...((init.headers as Record<string, string> | undefined) ?? {}),
  }

  if (!options.skipAuth) {
    const accessToken = getAccessToken()
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }
  }

  const res = await fetch(url, {
    ...init,
    headers,
  })

  const canRefresh =
    res.status === 401 &&
    !options.skipAuth &&
    !options.isRetry &&
    path !== "/api/login" &&
    path !== "/api/token/refresh"

  if (canRefresh) {
    const refreshedUser = await refreshAuthSession()
    if (refreshedUser) {
      return apiFetch(path, init, { ...options, isRetry: true })
    }
  }

  if (
    res.status === 401 &&
    !options.skipUnauthorizedHandler &&
    unauthorizedHandler &&
    path !== "/api/login" &&
    path !== "/api/token/refresh"
  ) {
    unauthorizedHandler()
  }

  return res
}

export async function getJson<TResponse>(path: string, options: ApiFetchOptions = {}): Promise<TResponse> {
  const res = await apiFetch(path, { method: "GET" }, options)

  const data = await readJsonSafe(res)

  if (!res.ok) {
    const apiError = normalizeApiError(data)
    throw new Error(JSON.stringify(apiError))
  }

  return data as TResponse
}

export async function postJson<TResponse, TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const res = await apiFetch(
    path,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    options,
  )

  const data = await readJsonSafe(res)

  if (!res.ok) {
    const apiError = normalizeApiError(data)
    throw new Error(JSON.stringify(apiError))
  }

  return data as TResponse
}

export async function patchJson<TResponse, TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const res = await apiFetch(
    path,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
    options,
  )

  const data = await readJsonSafe(res)

  if (!res.ok) {
    const apiError = normalizeApiError(data)
    throw new Error(JSON.stringify(apiError))
  }

  return data as TResponse
}

export async function putJson<TResponse, TBody extends Record<string, unknown>>(
  path: string,
  body: TBody,
  options: ApiFetchOptions = {},
): Promise<TResponse> {
  const res = await apiFetch(
    path,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
    options,
  )

  const data = await readJsonSafe(res)

  if (!res.ok) {
    const apiError = normalizeApiError(data)
    throw new Error(JSON.stringify(apiError))
  }

  return data as TResponse
}

export async function deleteJson<TResponse>(path: string, options: ApiFetchOptions = {}): Promise<TResponse> {
  const res = await apiFetch(path, { method: "DELETE" }, options)

  const data = await readJsonSafe(res)

  if (!res.ok) {
    const apiError = normalizeApiError(data)
    throw new Error(JSON.stringify(apiError))
  }

  return data as TResponse
}

function normalizeApiError(data: unknown): ApiErrorShape {
  if (typeof data === "object" && data !== null) {
    const d = data as Record<string, unknown>

    if (typeof d.message === "string") {
      const fields = typeof d.fields === "object" && d.fields !== null ? (d.fields as Record<string, string>) : undefined
      const code = typeof d.code === "string" ? d.code : undefined
      return { message: d.message, fields, code }
    }

    const violations = d.violations
    if (Array.isArray(violations)) {
      const fields: Record<string, string> = {}
      for (const v of violations) {
        if (v && typeof v === "object") {
          const vv = v as Record<string, unknown>
          const propertyPath = typeof vv.propertyPath === "string" ? vv.propertyPath : undefined
          const message = typeof vv.message === "string" ? vv.message : undefined
          if (propertyPath && message) fields[propertyPath] = message
        }
      }
      return { message: "Certains champs sont invalides.", fields }
    }
  }

  if (typeof data === "string" && data.includes("Unprocessable Content")) {
    return { message: "Certains champs sont invalides." }
  }

  return { message: "Une erreur est survenue." }
}
