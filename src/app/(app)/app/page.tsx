import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ActiveChildSelector } from '@/components/app/active-child-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { listRecentActivities } from '@/lib/data/activities'
import { getActiveChildIdFromCookie, listChildren } from '@/lib/data/children'

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export default async function AppDashboardPage() {
  const children = await listChildren()

  if (children.length === 0) {
    redirect('/app/children')
  }

  const activeIdFromCookie = await getActiveChildIdFromCookie()
  const activeChild =
    children.find((child) => child.id === activeIdFromCookie) ??
    children[0]

  const activities = await listRecentActivities(activeChild.id, 10)

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg text-[var(--text-heading)]">Dashboard</CardTitle>
          <p className="text-sm text-[var(--text-secondary)]">
            Track one child at a time and keep your daily log simple.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ActiveChildSelector
            children={children.map((child) => ({ id: child.id, name: child.name }))}
            activeChildId={activeChild.id}
          />
          <Button asChild className="h-11 w-full">
            <Link href="/app/log">Log activity for {activeChild.name}</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-[var(--text-heading)]">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No entries yet. Add your first quick log.</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <li key={activity.id} className="rounded-md border border-border p-3">
                  <p className="text-sm font-semibold text-[var(--text-heading)]">{activity.subject}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{formatDateTime(activity.occurred_at)}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {activity.duration_minutes ? `${activity.duration_minutes} min` : 'Duration not set'}
                  </p>
                  {activity.notes ? (
                    <p className="pt-1 text-sm text-[var(--text-primary)]">{activity.notes}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
