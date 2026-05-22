import type { ReactNode } from "react"
import { cn } from "@/shared/lib/utils"

export default function SoftCard({
  className,
  children,
  interactive = true,
}: {
  className?: string
  children: ReactNode
  interactive?: boolean
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border",
        interactive
          ? "border-stone-200/70 bg-white/70 shadow-[0_14px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:shadow-[0_18px_55px_rgba(0,0,0,0.38)]"
          : "border-stone-200/70 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.08)] dark:border-zinc-800/70 dark:bg-zinc-900 dark:shadow-[0_18px_55px_rgba(0,0,0,0.38)]",
        interactive && [
          "group transition-[transform,box-shadow,border-color,background-color] duration-300",
          "hover:-translate-y-0.5 hover:border-stone-300 hover:bg-white",
          "dark:hover:border-zinc-700/80 dark:hover:bg-zinc-900/55",
        ],
        className
      )}
    >
      {interactive ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        >
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-600/10 blur-2xl dark:bg-emerald-400/10" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-lime-500/10 blur-2xl dark:bg-lime-400/8" />
        </div>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  )
}

