import { motion } from "framer-motion"
import { staggerSections, fadeUp } from "@/features/profile/lib/motion"

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-2xl bg-stone-200/80 dark:bg-zinc-800/80 ${className ?? ""}`}
      animate={{ opacity: [0.45, 0.85, 0.45] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export function ProfileLoadingSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <motion.div variants={staggerSections} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={fadeUp} className="space-y-3">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-9 w-48" />
          <SkeletonBlock className="h-4 w-full max-w-xl" />
        </motion.div>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={fadeUp}
            className="overflow-hidden rounded-[28px] border border-stone-200/70 bg-white/70 p-6 dark:border-zinc-800/70 dark:bg-zinc-900/40"
          >
            <SkeletonBlock className="mb-4 h-4 w-28" />
            <SkeletonBlock className="h-6 w-56" />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-24" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  )
}
