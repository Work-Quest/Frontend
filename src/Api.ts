import axios from "axios"

export interface Item {
  id: number
  name: string
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined in your .env file")
}

const TIMEOUT_MS = 10000

// Global Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  withCredentials: true, // SEND COOKIES
  headers: {
    "Content-Type": "application/json",
  },
})

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
    startLoading()
    return config
  },
  (error) => {
    stopLoading()
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    stopLoading()
    return response
  },
  (error) => {
    stopLoading()
    return Promise.reject(error)
  }
)


// FETCH ITEMS (GET)
export async function get<T>(url: string): Promise<T> {
  try {
    const res = await api.get<T>(`${url}`)
     if (!res.status.toString().startsWith("2")) {
      throw new Error(`HTTP error! status: ${res.status}`);
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
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.data
  } catch (error) {
    console.error("Post request failed:", error)
    throw error
  }
}

export default api
