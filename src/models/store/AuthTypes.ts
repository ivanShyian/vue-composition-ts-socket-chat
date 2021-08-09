interface StatusInterface {
  error: boolean,
  success: boolean
}

export type StatusType = StatusInterface | Record<string, unknown>
