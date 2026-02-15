import Brand from "@/components/brand/Brand"
import { ExampleLogCard } from "@/components/marketing/beta/ExampleLogCard"
import { HeroImage } from "@/components/marketing/beta/HeroImage"
import { LandingShell } from "@/components/marketing/beta/LandingShell"
import { TagChips } from "@/components/marketing/beta/TagChips"
import { WaitlistForm } from "@/components/marketing/beta/WaitlistForm"

const TAGS = [
  { label: "Outing", variant: "gray" },
  { label: "Museum", variant: "green" },
  { label: "Skatepark", variant: "gray" },
  { label: "Projects", variant: "mauve" },
  { label: "Audiobooks", variant: "blue" },
]

export default function BetaLandingPage() {
  return (
    <LandingShell
      left={
        <>
          <div className="flex items-center gap-3">
            <Brand
              variant="lockup"
              className="h-6 w-auto"
              priority
            />
          </div>
          <div className="space-y-3">
            <h1 className="mk-hero text-[32px] font-semibold leading-[40px] text-[var(--text-heading)] sm:text-[44px] sm:leading-[52px] lg:font-bold">
              Does this count?
            </h1>
            <p className="mk-subhead text-[16px] leading-[24px] text-[var(--text-primary)]">
              It all counts. Let us help you track it.
            </p>
          </div>
          <TagChips chips={TAGS} defaultActive="Audiobooks" className="lg:flex-nowrap" />
          <HeroImage src="/marketing/beta-hero.png" alt="Family learning time">
            <div className="absolute bottom-6 left-6 hidden sm:block">
              <ExampleLogCard
                title="Physical Education"
                durationLabel="45 min"
                attachmentCount={2}
              />
            </div>
          </HeroImage>
          <div className="sm:hidden">
            <ExampleLogCard
              title="Physical Education"
              durationLabel="45 min"
              attachmentCount={2}
            />
          </div>
        </>
      }
      right={<WaitlistForm />}
    />
  )
}
