import axios from "axios"

export interface Item {
  id: number
  name: string
}

// Empty string = same-origin (for Vite dev proxy); undefined = local backend fallback
const BASE_URL =
  import.meta.env.VITE_API_URL === ""
    ? ""
    : import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const TIMEOUT_MS = 10000

/** Stored JWTs when HTTP-only cookies are not sent (e.g. Safari cross-site). */
export const AUTH_ACCESS_TOKEN_KEY = "access_token"
export const AUTH_REFRESH_TOKEN_KEY = "refresh_token"

export function persistAuthTokens(access: string, refresh: string): void {
  localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, access)
  localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refresh)
}

export function clearAuthTokens(): void {
  localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY)
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY)
}

// Global Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  withCredentials: true, // SEND COOKIES
  headers: {
    "Content-Type": "application/json",
  },
})

// Track active non-silent requests to properly manage loading bar
let activeNonSilentRequests = 0

function startLoading() {
  const ref = (window as any).loadingBarRef
  if (ref?.current) {
    ref.current.continuousStart()
  }
}

function stopLoading() {
  const ref = (window as any).loadingBarRef
  if (ref?.current) {
    ref.current.complete()
  }
}

// AXIOS INTERCEPTORS (AUTO LOADING BAR)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY)
    if (token) {
      config.headers = config.headers ?? {}
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    // Only show loading bar if request is not marked as silent
    const isSilent = (config as any).silent === true
    if (!isSilent) {
      activeNonSilentRequests++
      if (activeNonSilentRequests === 1) {
        // Only start if this is the first non-silent request
        startLoading()
      }
    }
    return config
  },
  (error) => {
    const isSilent = (error.config as any)?.silent === true
    if (!isSilent) {
      activeNonSilentRequests = Math.max(0, activeNonSilentRequests - 1)
      if (activeNonSilentRequests === 0) {
        stopLoading()
      }
    }
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    // Only stop loading bar if request was not silent
    const isSilent = (response.config as any).silent === true
    if (!isSilent) {
      activeNonSilentRequests = Math.max(0, activeNonSilentRequests - 1)
      if (activeNonSilentRequests === 0) {
        stopLoading()
      }
    }
    return response
  },
  (error) => {
    const isSilent = (error.config as any)?.silent === true
    if (!isSilent) {
      activeNonSilentRequests = Math.max(0, activeNonSilentRequests - 1)
      if (activeNonSilentRequests === 0) {
        stopLoading()
      }
    }
    return Promise.reject(error)
  },
)

// FETCH ITEMS (GET)
export async function get<T>(url: string, silent?: boolean): Promise<T> {
  try {
    const config: any = {}
    if (silent) {
      config.silent = true
    }
    const res = await api.get<T>(`${url}`, config)
    if (!res.status.toString().startsWith("2")) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.data
  } catch (error) {
    console.error("Fetch failed:", error)
    throw error
  }
}

// POST DATA (GENERIC)
export async function post<T, U>(url: string, data: T): Promise<U> {
  try {
    const res = await api.post<U>(`${url}`, data)
    if (!res.status.toString().startsWith("2")) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.data
  } catch (error) {
    console.error("Post request failed:", error)
    throw error
  }
}

// PUT DATA (GENERIC)
export async function put<T, U>(url: string, data: T): Promise<U> {
  try {
    const res = await api.put<U>(`${url}`, data)
    if (!res.status.toString().startsWith("2")) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.data
  } catch (error) {
    console.error("Put request failed:", error)
    throw error
  }
}

// PATCH DATA (GENERIC)
export async function patch<T, U>(url: string, data: T): Promise<U> {
  try {
    const res = await api.patch<U>(`${url}`, data)
    if (!res.status.toString().startsWith("2")) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.data
  } catch (error) {
    console.error("Patch request failed:", error)
    throw error
  }
}

// DELETE DATA (GENERIC)
export async function del(url: string): Promise<void> {
  try {
    await api.delete(`${url}`)
  } catch (error) {
    console.error("Delete request failed:", error)
    throw error
  }
}

export default api
