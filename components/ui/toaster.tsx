"use client"

import { Toaster } from "sonner"

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        duration: 3000,
      }}
    />
  )
}
