import Link from 'next/link'

import { AddChildForm } from '@/components/app/add-child-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { listChildren } from '@/lib/data/children'

export default async function ChildrenPage() {
  const children = await listChildren()

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg text-[var(--text-heading)]">Children</CardTitle>
          <p className="text-sm text-[var(--text-secondary)]">
            Add your child profile first so quick logs have a clear destination.
          </p>
        </CardHeader>
        <CardContent>
          <AddChildForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-[var(--text-heading)]">Existing profiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {children.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">No child profiles yet.</p>
          ) : (
            <ul className="space-y-2">
              {children.map((child) => (
                <li key={child.id} className="rounded-md border border-border p-3">
                  <p className="text-sm font-semibold text-[var(--text-heading)]">{child.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {child.birth_year ? `Birth year: ${child.birth_year}` : 'Birth year not set'}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Button asChild variant="outline" className="h-11 w-full">
            <Link href="/app">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
