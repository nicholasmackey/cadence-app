import Image from "next/image"

import { cn } from "@/lib/utils"

type HeroImageProps = {
  src: string
  alt: string
  className?: string
  children?: React.ReactNode
}

export function HeroImage({ src, alt, className, children }: HeroImageProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-secondary)] shadow-[var(--shadow-subtle)]",
        className
      )}
    >
      <div className="relative aspect-[4/3] sm:aspect-[16/10]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 760px"
          className="object-cover"
        />
        {children}
      </div>
    </div>
  )
}
