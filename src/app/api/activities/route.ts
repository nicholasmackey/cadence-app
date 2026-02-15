import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createActivity } from '@/lib/data/activities'

const createActivitySchema = z.object({
  childId: z.string().uuid(),
  subject: z.string().trim().min(1).max(120),
  occurredAt: z.string().trim().min(1),
  durationMinutes: z.number().int().positive().max(1440).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
})

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = createActivitySchema.parse({
      childId: payload?.childId,
      subject: payload?.subject,
      occurredAt: payload?.occurredAt,
      durationMinutes:
        payload?.durationMinutes === undefined || payload?.durationMinutes === ''
          ? null
          : Number(payload?.durationMinutes),
      notes: payload?.notes ?? null,
    })

    const occurredAtIso = new Date(parsed.occurredAt).toISOString()

    const activity = await createActivity({
      childId: parsed.childId,
      subject: parsed.subject,
      occurredAt: occurredAtIso,
      durationMinutes: parsed.durationMinutes,
      notes: parsed.notes,
    })

    return NextResponse.json({ activity })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save activity log.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
