import { redirect } from 'next/navigation'

import { QuickLogForm } from '@/components/app/quick-log-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getActiveChildIdFromCookie, listChildren } from '@/lib/data/children'

export default async function QuickLogPage() {
  const children = await listChildren()

  if (children.length === 0) {
    redirect('/app/children')
  }

  const activeIdFromCookie = await getActiveChildIdFromCookie()
  const activeChild =
    children.find((child) => child.id === activeIdFromCookie) ??
    children[0]

  return (
    <section>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg text-[var(--text-heading)]">Quick log</CardTitle>
          <p className="text-sm text-[var(--text-secondary)]">
            Capture one learning activity for {activeChild.name}.
          </p>
        </CardHeader>
        <CardContent>
          <QuickLogForm
            children={children.map((child) => ({ id: child.id, name: child.name }))}
            defaultChildId={activeChild.id}
          />
        </CardContent>
      </Card>
    </section>
  )
}
