export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow: string
  title: string
  subtitle?: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-900/70 dark:text-emerald-400/80">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}

