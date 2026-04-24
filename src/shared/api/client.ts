export type ApiErrorShape = {
  message: string
  fields?: Record<string, string>
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

export async function postJson<TResponse, TBody extends Record<string, unknown>>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const url = `${getBaseUrl()}${path}`

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

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

    // Notre format back (doublons)
    if (typeof d.message === "string") {
      const fields = typeof d.fields === "object" && d.fields !== null ? (d.fields as Record<string, string>) : undefined
      return { message: d.message, fields }
    }

    // Format API Platform / Symfony validator (violations)
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

  return { message: "Une erreur est survenue." }
}

