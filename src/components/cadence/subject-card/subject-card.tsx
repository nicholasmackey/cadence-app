"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDown, Paperclip, StickyNote, Timer } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type Attachment = {
  id: string
  name: string
  sizeLabel: string
}

type SubjectCardProps = {
  title: string
  durationLabel?: string
  hasNote?: boolean
  noteText?: string
  attachmentCount?: number
  attachments?: Attachment[]
  leadingIcon?: React.ReactNode
  density?: "default" | "compact"
}

const cardVariants = cva(
  "w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-primary)]",
  {
    variants: {
      density: {
        default: "",
        compact: "",
      },
    },
    defaultVariants: {
      density: "default",
    },
  }
)

const headerVariants = cva(
  "flex w-full min-h-[44px] items-center gap-3 px-4 text-left transition-colors",
  {
    variants: {
      density: {
        default: "py-4",
        compact: "py-3",
      },
    },
    defaultVariants: {
      density: "default",
    },
  }
)

const metaVariants = cva(
  "flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]",
  {
    variants: {
      density: {
        default: "",
        compact: "text-xs",
      },
    },
    defaultVariants: {
      density: "default",
    },
  }
)

const contentVariants = cva("px-4 pb-4", {
  variants: {
    density: {
      default: "pt-1",
      compact: "pt-0.5",
    },
  },
  defaultVariants: {
    density: "default",
  },
})

const sectionIconBase =
  "h-4 w-4 text-[var(--text-secondary)] opacity-0 translate-y-1 rotate-[-6deg] [animation-fill-mode:both] motion-reduce:opacity-100 motion-reduce:transform-none motion-reduce:animate-none"

const sectionIconAnimate =
  "group-data-[state=open]:animate-[cadence-swing-in_200ms_ease-in-out]"

export function SubjectCard({
  title,
  durationLabel,
  hasNote,
  noteText,
  attachmentCount,
  attachments,
  leadingIcon,
  density = "default",
}: SubjectCardProps) {
  const hasNoteContent = hasNote || Boolean(noteText)
  const attachmentTotal =
    typeof attachmentCount === "number"
      ? attachmentCount
      : attachments?.length ?? 0

  const showAttachments = attachmentTotal > 0 || (attachments?.length ?? 0) > 0
  const showDuration = Boolean(durationLabel)

  return (
    <Collapsible className="group" defaultOpen={false}>
      <div className={cn(cardVariants({ density }))}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(headerVariants({ density }))}
            aria-label={`${title} details`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-[var(--text-primary)]">
              {leadingIcon}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-base font-semibold text-[var(--text-primary)]">
                {title}
              </span>
              <span className={cn(metaVariants({ density }))}>
                {showDuration ? (
                  <span className="inline-flex items-center gap-1">
                    <Timer className="h-4 w-4" aria-hidden="true" />
                    {durationLabel}
                  </span>
                ) : null}
                {hasNoteContent ? (
                  <span className="inline-flex items-center gap-1">
                    <StickyNote className="h-4 w-4" aria-hidden="true" />
                    Note
                  </span>
                ) : null}
                {showAttachments ? (
                  <span className="inline-flex items-center gap-1">
                    <Paperclip className="h-4 w-4" aria-hidden="true" />
                    {attachmentTotal}
                  </span>
                ) : null}
              </span>
            </span>
            <ChevronDown
              className="h-5 w-5 text-[var(--text-secondary)] transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            "overflow-hidden data-[state=open]:animate-[collapsible-down_200ms_ease-in-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-in-out] motion-reduce:transition-none"
          )}
        >
          <div className={cn(contentVariants({ density }))}>
            <div className="grid gap-4">
              {showDuration ? (
                <div className="grid gap-1">
                  <div className="flex items-start gap-2">
                    <Timer
                      className={cn(
                        sectionIconBase,
                        sectionIconAnimate,
                        "group-data-[state=open]:[animation-delay:0ms]"
                      )}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs font-medium text-[var(--text-secondary)]">Time</p>
                      <p className="text-sm text-[var(--text-primary)]">{durationLabel}</p>
                    </div>
                  </div>
                </div>
              ) : null}
              {hasNoteContent ? (
                <div className="grid gap-1">
                  <div className="flex items-start gap-2">
                    <StickyNote
                      className={cn(
                        sectionIconBase,
                        sectionIconAnimate,
                        "group-data-[state=open]:[animation-delay:70ms]"
                      )}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs font-medium text-[var(--text-secondary)]">Note</p>
                      <p className="text-sm text-[var(--text-primary)]">
                        {noteText ?? ""}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
              {showAttachments ? (
                <div className="grid gap-2">
                  <div className="flex items-start gap-2">
                    <Paperclip
                      className={cn(
                        sectionIconBase,
                        sectionIconAnimate,
                        "group-data-[state=open]:[animation-delay:140ms]"
                      )}
                      aria-hidden="true"
                    />
                    <div className="w-full">
                      <p className="text-xs font-medium text-[var(--text-secondary)]">
                        Attachments
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {(attachments ?? []).map((attachment) => (
                          <div
                            key={attachment.id}
                            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-primary)] p-3"
                          >
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              {attachment.sizeLabel}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}
