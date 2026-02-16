import { Suspense } from 'react'

import LoginClient from './LoginClient'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[var(--surface-primary)] px-4 py-6 sm:py-8">
          <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center">
            <section className="rounded-3xl bg-[var(--surface-secondary)] px-5 py-8 sm:px-6" />
          </div>
        </main>
      }>
      <LoginClient />
    </Suspense>
  )
}
