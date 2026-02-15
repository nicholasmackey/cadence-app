import Image from "next/image"

import { BRAND } from "@/lib/brand"
import { cn } from "@/lib/utils"

type BrandVariant = keyof typeof BRAND

type BrandProps = {
  variant: BrandVariant
  alt?: string
  className?: string
  priority?: boolean
}

const BRAND_DIMENSIONS: Record<BrandVariant, { width: number; height: number }> = {
  wordmark: { width: 160, height: 32 },
  mark: { width: 48, height: 48 },
  lockup: { width: 200, height: 48 },
}

export default function Brand({
  variant,
  alt = "Cadence",
  className,
  priority = false,
}: BrandProps) {
  const { width, height } = BRAND_DIMENSIONS[variant]

  return (
    <Image
      src={BRAND[variant]}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  )
}
