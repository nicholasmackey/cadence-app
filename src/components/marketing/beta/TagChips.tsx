"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type TagChip = {
  label: string
  variant?: VariantProps<typeof chipVariants>["variant"]
}

type TagChipsProps = {
  chips: TagChip[]
  defaultActive?: string
  className?: string
}

const chipVariants = cva(
  "relative inline-flex min-h-[44px] items-center rounded-full border px-4 py-1 text-xs font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)]",
  {
    variants: {
      variant: {
        gray:
          "border-[var(--chip-gray-border)] bg-[var(--chip-gray-bg)] text-[var(--chip-gray-text)]",
        green:
          "border-[var(--chip-green-border)] bg-[var(--chip-green-bg)] text-[var(--chip-green-text)]",
        mauve:
          "border-[var(--chip-mauve-border)] bg-[var(--chip-mauve-bg)] text-[var(--chip-mauve-text)]",
        blue:
          "border-[var(--chip-blue-border)] bg-[var(--chip-blue-bg)] text-[var(--chip-blue-text)]",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  }
)

export function TagChips({ chips, defaultActive, className }: TagChipsProps) {
  const [active, setActive] = React.useState(
    defaultActive ?? chips[0]?.label ?? ""
  )

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => {
        const isActive = chip.label === active
        const variant = chip.variant ?? "gray"

        return (
          <button
            key={chip.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => setActive(chip.label)}
            data-active={isActive}
            className={cn(
              "mk-chip",
              chipVariants({ variant }),
              isActive && "scale-[1.02] shadow-[var(--shadow-subtle)]",
              "active:scale-[0.98]"
            )}
          >
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
