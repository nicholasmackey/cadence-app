import { NextResponse } from 'next/server'
import { z } from 'zod'

import { assertChildInCurrentFamily, setActiveChildCookie } from '@/lib/data/children'

const activeChildSchema = z.object({
  childId: z.string().uuid(),
})

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = activeChildSchema.parse({ childId: payload?.childId })

    await assertChildInCurrentFamily(parsed.childId)
    await setActiveChildCookie(parsed.childId)

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to set active child.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
