import { Source_Sans_3 } from "next/font/google"

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans",
})

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      data-cadence-surface="marketing"
      data-marketing="true"
      className={`${sourceSans.variable} font-sans`}
    >
      {children}
    </div>
  )
}
