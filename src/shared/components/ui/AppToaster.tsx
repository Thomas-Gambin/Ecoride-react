import { Toaster } from "sonner"
import { useTheme } from "@/shared/hooks/useTheme"

export function AppToaster() {
  const { theme } = useTheme()

  return (
    <Toaster
      theme={theme}
      position="top-right"
      offset={20}
      gap={10}
      duration={4000}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border !px-4 !py-3 !shadow-[0_12px_40px_rgba(15,23,42,0.12)] dark:!shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
          title: "!text-sm !font-semibold",
          description: "!text-sm !opacity-90",
          success:
            "!border-emerald-200/90 !bg-emerald-50 !text-emerald-900 dark:!border-emerald-700/60 dark:!bg-emerald-950/95 dark:!text-emerald-100",
          error:
            "!border-rose-200/90 !bg-rose-50 !text-rose-800 dark:!border-rose-700/60 dark:!bg-rose-950/95 dark:!text-rose-100",
          closeButton:
            "!border-stone-200 !bg-white/80 dark:!border-zinc-700 dark:!bg-zinc-900",
        },
      }}
    />
  )
}
