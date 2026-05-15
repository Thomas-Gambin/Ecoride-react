export type ApiErrorShape = {
  message: string
  fields?: Record<string, string>
  code?: string
}

export type ApiFetchOptions = {
  credentials?: RequestCredentials
  /** Ne pas déclencher le callback global 401 (ex. bootstrap /api/me). */
  skipUnauthorizedHandler?: boolean
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
  const credentials = options.credentials ?? "include"

  const res = await fetch(url, {
    ...init,
    credentials,
    headers: {
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  })

  if (
    res.status === 401 &&
    !options.skipUnauthorizedHandler &&
    unauthorizedHandler &&
    path !== "/api/login"
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
