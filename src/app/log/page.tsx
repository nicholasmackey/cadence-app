import { LogOutButton } from './_components/LogOutButton'

export default function LogPage() {
  return (
    <main className="min-h-screen bg-[var(--surface-primary)] px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-[var(--surface-secondary)] p-6">
        <header className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-[var(--text-heading)]">Log</h1>
          <LogOutButton />
        </header>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Logging will live here.</p>
      </div>
    </main>
  )
}
