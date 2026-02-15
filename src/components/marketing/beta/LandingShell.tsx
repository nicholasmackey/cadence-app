import * as React from 'react'
import { cn } from '@/lib/utils'

type LandingShellProps = {
  left: React.ReactNode
  right: React.ReactNode
  className?: string
}

export function LandingShell({ left, right, className }: LandingShellProps) {
  return (
    <main className={cn('bg-[var(--surface-primary)] text-[var(--text-primary)]', className)}>
      <div className="mx-auto w-full max-w-[1140px] px-4">
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,700px)_minmax(0,420px)] lg:gap-12">
            <section className="min-w-0 self-start" aria-label="Cadence beta hero">
              {left}
            </section>

            {/* Align this block with the image start (desktop) */}
            <aside className="min-w-0 self-start lg:pt-28" aria-label="Join the waitlist">
              <div className="[&>*:first-child]:mt-0">{right}</div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
