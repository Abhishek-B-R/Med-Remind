'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calendar,
  Camera,
  Bell,
  CheckCircle,
  Moon,
  Sun,
  Share2,
  Clock,
  Archive,
  Globe,
} from 'lucide-react'

export default function LandingPage() {
  const [dark, setDark] = useState<boolean>(false)
  const [showDemo, setShowDemo] = useState<boolean>(false)
  const [snoozeMenuOpen, setSnoozeMenuOpen] = useState(false)
  const [language, setLanguage] = useState<string>('en')

  useEffect(() => {
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const stored = localStorage.getItem('medremind:dark')
    const isDark = stored ? stored === 'true' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    localStorage.setItem('medremind:dark', dark ? 'true' : 'false')
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggleDark = () => setDark((s) => !s)
  const snoozeOptions = ['30 min', '1 hour', '2 hours', 'Tomorrow', 'Custom']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-slate-900 dark:text-gray-50 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.06) 0%, transparent 25%), radial-gradient(circle at 90% 80%, rgba(139,92,246,0.04) 0%, transparent 20%)',
        }}
      />

      <header className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            M
          </div>
          <span className="font-semibold text-lg">MedRemind</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setLanguage((l) => (l === 'en' ? 'hi' : l === 'hi' ? 'mr' : 'en'))}
              className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-gray-200 shadow-sm"
              aria-label="Toggle language"
              title="Toggle language"
            >
              <Globe className="inline mr-2" />
              {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'मराठी'}
            </button>

            <button
              onClick={toggleDark}
              className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-gray-200 shadow-sm"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <Link href="/auth/signin">
            <Button size="default" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white">
              Sign in with Google
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Never miss a dose again
            </h1>
            <p className="text-lg text-slate-600 dark:text-gray-300 mb-6 max-w-2xl">
              Scan prescriptions, extract medicines with AI, and push smart reminders to your Google
              Calendar. Rich tracking, allergy checks, drug interaction alerts, and multi profile
              support make it great for families.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Link href="/auth/signin">
                <Button size="lg" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white">
                  Get started for free
                </Button>
              </Link>

              <button
                onClick={() => setShowDemo(true)}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 shadow-md"
              >
                Try demo
                <Share2 className="w-4 h-4" />
              </button>

              <a
                href="#features"
                className="self-center ml-2 text-sm text-slate-600 dark:text-gray-300 underline underline-offset-2"
              >
                See features
              </a>
            </div>

            <div className="flex gap-4 flex-wrap text-sm">
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                Demo account available
              </span>
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                No credit card required
              </span>
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                Works offline for scanning
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    AI
                  </div>
                  <div>
                    <div className="text-sm font-medium">Prescription Scan</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">
                      Upload a photo or use your camera
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-500 dark:text-gray-400">Sample demo</div>
              </div>

              <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <Camera className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Upload or drag an image</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">
                      Supports multi-language OCR
                    </div>
                  </div>
                  <Button size="sm" className="px-3 py-1">
                    Upload
                  </Button>
                </div>

                <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                  <div className="text-xs text-slate-500 dark:text-gray-400 mb-2">
                    Detected medicines
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-2">
                      <div>
                        <div className="text-sm font-medium">Paracetamol 500mg</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">
                          1 tablet every 8 hours
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs">Next dose</div>
                        <div className="font-medium">2:30 PM</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded p-2">
                      <div>
                        <div className="text-sm font-medium">Amoxicillin 250mg</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">
                          1 capsule every 12 hours
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs">Next dose</div>
                        <div className="font-medium">6:30 PM</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 items-center">
                    <Button size="sm" className="px-3 py-1">
                      Add to Calendar
                    </Button>
                    <button
                      onClick={() => setSnoozeMenuOpen((s) => !s)}
                      className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm shadow-sm"
                    >
                      Snooze
                    </button>

                    {snoozeMenuOpen && (
                      <div className="absolute mt-40 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-lg right-6 w-48 z-20">
                        {snoozeOptions.map((opt) => (
                          <button
                            key={opt}
                            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Mark taken
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-500 dark:text-gray-400">
                  Pro tip. Add your meal times in settings to have intelligent scheduling around
                  food and sleep times.
                </div>
              </div>
            </div>

            <div className="absolute right-6 top-6 w-36 hidden md:block">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-lg">
                <div className="text-xs text-slate-500 dark:text-gray-300">Weekly summary</div>
                <div className="mt-2 text-2xl font-semibold">18 doses</div>
                <div className="text-xs text-slate-500 dark:text-gray-400">Taken 92 percent</div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Powerful features that people actually use</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <Calendar className="w-8 h-8 text-purple-600" />
                <CardTitle className="mt-2">Smart Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Push automatic reminders to Google Calendar. Auto adjust for meals and sleep using
                  your preferred meal times. Custom snooze options let you choose 30 minutes, 1
                  hour, tomorrow or set a custom time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <Bell className="w-8 h-8 text-green-600" />
                <CardTitle className="mt-2">Allergy and Interaction Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Store allergies and run drug interaction checks using public drug interaction
                  APIs. We show clear warnings with recommended next steps and doctor share options.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <Archive className="w-8 h-8 text-orange-600" />
                <CardTitle className="mt-2">Medicine History</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  A clear timeline of what you took in the last week or month. Exportable PDF to
                  share with your doctor. Add notes for side effects or observations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <CardTitle className="mt-2">Multi Profile Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track medications for family members or pets. Switch profiles quickly and see
                  combined reminders on one calendar if desired.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <Clock className="w-8 h-8 text-indigo-600" />
                <CardTitle className="mt-2">Barcode and QR Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Scan barcode or QR codes on medicine packaging to fetch dosage info instantly.
                  Great for packaged prescriptions and over the counter meds.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <Globe className="w-8 h-8 text-teal-600" />
                <CardTitle className="mt-2">Multi Language OCR</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tesseract based OCR with support for multiple Indian languages and English. UI
                  also supports translations so your elderly parents can use it comfortably.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Trust and privacy</h2>
          <p className="text-slate-600 dark:text-gray-300 mb-4 max-w-3xl">
            We designed MedRemind to keep your medical data private. Minimal data stays on device
            where possible, all exports are user triggered, and we provide clear controls over what
            is shared with Google Calendar or with your doctor.
          </p>

          <div className="flex gap-4 flex-wrap items-center">
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded">MIT License</div>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded">
              Open source components
            </div>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded">
              SOC 2 ready roadmap
            </div>
          </div>
        </section>

        <section className="mt-12 pb-24">
          <h2 className="text-3xl font-bold mb-6">Interview talking points</h2>
          <ul className="list-disc pl-6 text-slate-700 dark:text-gray-300">
            <li>Using RLS in Supabase to protect profile level data even if API keys leak</li>
            <li>
              Designing OCR pipeline with fallback heuristic extraction and human review for low
              confidence text
            </li>
            <li>
              Handling calendar sync failures idempotently so duplicate events are not created
            </li>
            <li>
              Drug interaction checks with cached external API results and alert throttling to avoid
              spamming users
            </li>
            <li>
              How multi profile and family calendar aggregation are modelled in Postgres schema
            </li>
            <li>Accessibility choices for elderly users including large text and voice prompts</li>
          </ul>
        </section>
      </main>

      {/* Demo modal */}
      {showDemo && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowDemo(false)}
          />
          <div className="relative z-50 max-w-3xl w-full bg-white dark:bg-gray-900 rounded-xl p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold">Interactive demo</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  Play with sample scans and see how the calendar events and snooze options behave
                </p>
              </div>
              <button
                onClick={() => setShowDemo(false)}
                className="text-slate-500 dark:text-gray-300"
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm text-slate-500 dark:text-gray-400 mb-2">
                    Detected medicines
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded">
                      <div>
                        <div className="font-medium">Cetirizine 10mg</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">
                          1 tablet every night
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs">Next dose</div>
                        <div className="font-semibold">11:30 PM</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded">
                      <div>
                        <div className="font-medium">Vitamin D 60k</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">Single dose</div>
                      </div>
                      <div>
                        <Button size="sm">Add to calendar</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm text-slate-500 dark:text-gray-400 mb-2">
                    Snooze quick actions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {snoozeOptions.map((opt) => (
                      <button
                        key={opt}
                        className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm text-slate-500 dark:text-gray-400 mb-2">
                    Interaction alerts
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-3 rounded">
                    <div className="text-sm font-medium">No dangerous interactions detected</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                      We check against public APIs and flag known issues
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-500 dark:text-gray-400">
                    Exportable PDF and CSV make it easy to share with your doctor
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-right">
              <Button
                onClick={() => setShowDemo(false)}
                size="sm"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Close demo
              </Button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600 dark:text-gray-400">
            Built with care. Open source components. Privacy first.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-slate-600 dark:text-gray-300">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-slate-600 dark:text-gray-300">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
