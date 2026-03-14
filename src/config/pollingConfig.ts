/**
 * Centralized polling configuration for all data fetching endpoints.
 * Adjust intervals here to tune polling frequency across the application.
 */
export const POLLING_CONFIG = {
  /** Task fetching interval (ms) */
  tasks: {
    interval: 5000,
    enabled: true,
  },
  /** Game status fetching interval (ms) */
  gameStatus: {
    interval: 5000,
    enabled: true,
  },
  /** Game logs fetching interval (ms) - faster for real-time updates */
  logs: {
    interval: 3000,
    enabled: true,
  },
  /** Project members fetching interval (ms) */
  members: {
    interval: 5000,
    enabled: true,
  },
  /** Player items fetching interval (ms) */
  items: {
    interval: 5000,
    enabled: true,
  },
  /** Status effects fetching interval (ms) */
  effects: {
    interval: 5000,
    enabled: true,
  },
} as const

export type PollingConfigKey = keyof typeof POLLING_CONFIG

