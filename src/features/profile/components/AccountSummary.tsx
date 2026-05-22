import type { AuthUser } from "@/features/auth/types/user"
import SoftCard from "@/features/homePage/components/SoftCard"

export function AccountSummary({ user }: { user: AuthUser }) {
  return (
    <SoftCard>
      <section id="credits" className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
          Compte
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Pseudo</p>
            <p className="mt-1 text-base font-semibold text-zinc-950 dark:text-zinc-50">{user.username}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email</p>
            <p className="mt-1 break-all text-base font-semibold text-zinc-950 dark:text-zinc-50">{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Crédits</p>
            <p className="mt-1 text-base font-semibold text-zinc-950 dark:text-zinc-50">{user.credits} crédits</p>
          </div>
        </div>
      </section>
    </SoftCard>
  )
}
