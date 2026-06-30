import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { RequestOptions } from '../interfaces/api'

const API_BASE = '/api/v1'

let accessToken: string | null = null
let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string | null) => void; reject: (err: unknown) => void }> = []

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken(): string | null {
  return accessToken
}

let _onUnauthorized: (() => void) | null = null

export function setOnUnauthorized(cb: (() => void) | null) {
  _onUnauthorized = cb
}

export async function refreshToken(): Promise<string> {
  const response = await axios.post<{ accessToken: string }>(
    `${API_BASE}/auth/refresh`,
    {},
    { withCredentials: true },
  )
  const newToken = response.data.accessToken
  accessToken = newToken
  return newToken
}

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (
      !originalRequest
      || error.response?.status !== 401
      || originalRequest._retry
      || originalRequest.url?.includes('/auth/login')
      || originalRequest.url?.includes('/auth/register')
      || originalRequest.url?.includes('/auth/refresh')
      || originalRequest.url?.includes('/auth/logout')
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        return apiClient(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const newToken = await refreshToken()
      processQueue(null, newToken)
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
      }
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      accessToken = null
      if (_onUnauthorized) {
        _onUnauthorized()
      } else {
        window.location.href = '/login'
      }
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

function toApiError(error: unknown): unknown {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data as Record<string, unknown> | undefined
    return new ApiError(
      error.response.status,
      (data?.error as string) || 'Error del servidor',
    )
  }
  return error
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  try {
    const response = await apiClient({
      url: endpoint,
      method: options.method ?? 'GET',
      data: options.body,
      ...(options.headers ? { headers: options.headers } : {}),
    })
    return response.data as T
  } catch (error) {
    throw toApiError(error)
  }
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) => apiRequest<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body: unknown) => apiRequest<T>(endpoint, { method: 'PUT', body }),
  patch: <T>(endpoint: string, body: unknown) => apiRequest<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
}
