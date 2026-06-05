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
        className
      )}
    >
      <div className="relative">{children}</div>
    </div>
  )
}

