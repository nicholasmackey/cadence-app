import type { Metadata } from 'next'
import { Inter, Fira_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-fira',
})

export const metadata: Metadata = {
  title: 'Cadence beta',
  description: 'Join the waiting list for early access.',
  icons: {
    icon: '/brand/cadence-mark.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
