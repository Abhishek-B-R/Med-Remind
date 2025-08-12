"use client"

import { signIn, getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push("/dashboard")
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      })
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center relative overflow-x-hidden">
      <div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, rgba(59,130,246,0.05) 0%, transparent 25%), radial-gradient(circle at 90% 80%, rgba(139,92,246,0.03) 0%, transparent 20%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <CardHeader className="text-center pt-8">
            <div className="mx-auto w-20 h-20 rounded-lg bg-gradient-to-br from-blue-600 to-[#090979] flex items-center justify-center text-white shadow-md mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl">Connect Your Calendar</CardTitle>
            <CardDescription className="max-w-xs mx-auto">
              Sign in with Google to access your calendar and set up medication reminders. We need calendar access to create and manage reminders on your behalf.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 pb-8">
            <Button onClick={handleGoogleSignIn} className="w-full bg-gradient-to-br from-blue-600 to-[#090979] hover:from-blue-700 hover:to-purple-700 text-white" size="lg">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              We only access your calendar to create and manage medication reminders. You can revoke access anytime from your Google account.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <a href="/privacy" className="text-xs text-slate-600 dark:text-gray-300 underline">Privacy</a>
              <span className="text-xs text-slate-400">•</span>
              <a href="/terms" className="text-xs text-slate-600 dark:text-gray-300 underline">Terms</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
