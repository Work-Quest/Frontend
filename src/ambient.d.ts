import type { RefObject } from 'react'
import type { LoadingBarRef } from 'react-top-loading-bar'
import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** When true, Api interceptors skip the global loading bar for this request. */
    silent?: boolean
  }
}

declare global {
  interface Window {
    loadingBarRef?: RefObject<LoadingBarRef | null>
  }
}

export {}
