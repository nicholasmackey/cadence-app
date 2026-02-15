import * as React from "react"
import { Paperclip, StickyNote, Timer } from "lucide-react"

import { cn } from "@/lib/utils"
import { HeartPulseFilled } from "@/components/icons/HeartPulseFilled"

type ExampleLogCardProps = {
  title: string
  durationLabel: string
  attachmentCount: number
  className?: string
}

export function ExampleLogCard({
  title,
  durationLabel,
  attachmentCount,
  className,
}: ExampleLogCardProps) {
  return (
    <div
      className={cn(
        "flex h-[72px] w-full max-w-[359px] items-center gap-3 rounded-[10px] border border-[var(--marketing-card-border)] bg-[var(--marketing-card-bg)] px-4 shadow-[var(--shadow-subtle)]",
        className
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--marketing-card-icon-bg)]">
        <HeartPulseFilled
          className="h-5 w-5 text-[var(--marketing-card-icon-color)]"
          aria-hidden="true"
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm font-semibold text-[var(--text-heading)]">
          {title}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1">
            <Timer className="h-3.5 w-3.5" aria-hidden="true" />
            {durationLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
            Note
          </span>
          <span className="inline-flex items-center gap-1">
            <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
            {attachmentCount}
          </span>
        </div>
      </div>
    </div>
  )
}
