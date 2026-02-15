export type ActivityCreatePayload = {
  childId: string
  subject: string
  occurredAt: string
  durationMinutes?: number | null
  notes?: string | null
}

export type OfflineQueue = {
  enqueueActivityCreate(payload: ActivityCreatePayload): Promise<void>
  flushQueue(): Promise<void>
}

const memoryQueue: ActivityCreatePayload[] = []

// Stub queue: this intentionally keeps in-memory state only.
// Replace with IndexedDB-backed storage in a future iteration.
export const offlineQueue: OfflineQueue = {
  async enqueueActivityCreate(payload) {
    memoryQueue.push(payload)
  },
  async flushQueue() {
    memoryQueue.length = 0
  },
}

export async function enqueueActivityCreate(payload: ActivityCreatePayload) {
  await offlineQueue.enqueueActivityCreate(payload)
}

export async function flushQueue() {
  await offlineQueue.flushQueue()
}
