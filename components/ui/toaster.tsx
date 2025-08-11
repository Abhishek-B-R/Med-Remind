"use client"

import * as React from "react"
import { useToast as useCustomToast } from "@/hooks/use-toast"

export function AppToaster() {
  const { toasts, dismiss, remove } = useCustomToast()

  // Manage timers for auto-dismiss and removal
  React.useEffect(() => {
    const timers: number[] = []

    toasts.forEach((t) => {
      // If toast is open, schedule auto-dismiss after its duration
      if (t.open) {
        const duration = t.duration ?? 3000
        const timeoutId = window.setTimeout(() => {
          // set open = false first (so UI can animate)
          dismiss(t.id)
          // schedule removal slightly after dismiss (for animation), 300ms
          const removeId = window.setTimeout(() => remove(t.id), 300)
          timers.push(removeId)
        }, duration)
        timers.push(timeoutId)
      } else {
        // If toast was closed programmatically (open=false), ensure it gets removed after a short delay
        const removeId = window.setTimeout(() => remove(t.id), 300)
        timers.push(removeId)
      }
    })

    return () => timers.forEach((id) => clearTimeout(id))
  }, [toasts, dismiss, remove])

  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed right-6 bottom-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto max-w-sm w-full rounded-lg shadow-lg p-4 flex items-start justify-between transition-all transform
            ${t.variant === "destructive" ? "bg-red-600 text-white" : "bg-white text-black"}
          `}
        >
          <div className="flex-1">
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm mt-1">{t.description}</div>}
          </div>

          <div className="ml-3 flex items-start">
            <button
              onClick={() => {
                // first dismiss (for animation), then remove quickly
                dismiss(t.id)
                window.setTimeout(() => remove(t.id), 200)
              }}
              aria-label="close toast"
              className="text-sm opacity-80 hover:opacity-100 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
