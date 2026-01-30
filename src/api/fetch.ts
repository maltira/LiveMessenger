
const baseURL = import.meta.env.VITE_API_URL
async function refreshToken(): Promise<boolean> {
  const res = await fetch(`${baseURL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })

  return res.ok
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const res = await fetch(`${baseURL}${path}`, {
    ...options,
    credentials: 'include',
  })

  if (res.status !== 401) return res

  const refreshed = await refreshToken()

  if (!refreshed) return res

  // повторяем запрос
  return fetch(`${baseURL}${path}`, {
    ...options,
    credentials: 'include',
  })
}