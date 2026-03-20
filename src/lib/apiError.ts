import axios from 'axios'

export function getAxiosStatus(err: unknown): number | undefined {
  return axios.isAxiosError(err) ? err.response?.status : undefined
}

export function getAxiosApiMessage(err: unknown): string | undefined {
  if (!axios.isAxiosError(err)) return undefined
  const data = err.response?.data
  if (!data || typeof data !== 'object') return undefined
  const rec = data as Record<string, unknown>
  const errMsg = rec.error
  const msg = rec.message
  if (typeof errMsg === 'string') return errMsg
  if (typeof msg === 'string') return msg
  return undefined
}
