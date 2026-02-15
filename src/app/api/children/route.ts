import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createChild, setActiveChildCookie } from '@/lib/data/children'

const createChildSchema = z.object({
  name: z.string().trim().min(1).max(120),
  birthYear: z.number().int().min(1900).max(2100).nullable().optional(),
})

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = createChildSchema.parse({
      name: payload?.name,
      birthYear:
        payload?.birthYear === undefined || payload?.birthYear === ''
          ? null
          : Number(payload?.birthYear),
    })

    const child = await createChild({
      name: parsed.name,
      birthYear: parsed.birthYear,
    })

    await setActiveChildCookie(child.id)

    return NextResponse.json({ child })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create child profile.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
