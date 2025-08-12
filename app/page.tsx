'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calendar,
  Camera,
  Bell,
  CheckCircle,
  Share2,
  Clock,
  Archive,
  Globe,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-slate-900 dark:text-gray-50 relative overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            'radial-gradient(circle at 12% 18%, rgba(59,130,246,0.04) 0%, transparent 20%), radial-gradient(circle at 92% 82%, rgba(139,92,246,0.03) 0%, transparent 18%)',
        }}
      />

      <main className="relative z-10 container mx-auto px-6 py-14 max-w-[1200px]">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">Never miss a dose again</h1>
            <p className="text-lg text-slate-600 dark:text-gray-300 mb-6 max-w-2xl">
              Scan prescriptions, extract medicines with AI, and push smart reminders to your Google
              Calendar. Rich tracking, allergy checks, drug interaction alerts, and multi profile
              support make it great for families.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Link href="/auth/signin" passHref>
                <Button size="lg" className="px-6 py-3 bg-gradient-to-br from-blue-600 to-[#090979] hover:from-blue-700 hover:to-[#3030d0] text-white">
                  Get started for free
                </Button>
              </Link>

              <Link href="/demo.mp4" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 shadow-md border border-gray-100 dark:border-gray-800">
                Try demo
                <Share2 className="w-4 h-4" />
              </Link>

              <a href="#features" className="self-center ml-2 text-sm text-slate-600 dark:text-gray-300 underline underline-offset-2">
                See features
              </a>
            </div>

            <div className="flex gap-4 flex-wrap text-sm">
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">Demo account available</span>
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">No credit card required</span>
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">Works offline for scanning</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-[#090979] flex items-center justify-center text-white font-bold">AI</div>
                  <div>
                    <div className="text-sm font-medium">Prescription Scan</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">Upload a photo or use your camera</div>
                  </div>
                </div>
                <div className="text-sm text-slate-500 dark:text-gray-400">Live demo</div>
              </div>

              <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <Camera className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Upload or drag an image</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">Supports multi-language OCR</div>
                  </div>
                  <Button size="sm" className="px-3 py-1">Upload</Button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-md overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded">
                        <div className="text-sm font-medium">Paracetamol 500mg</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">1 tablet every 8 hours</div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-gray-400">Next dose <span className="font-semibold ml-1">2:30 PM</span></div>
                      </div>

                      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded">
                        <div className="text-sm font-medium">Amoxicillin 250mg</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">1 capsule every 12 hours</div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-gray-400">Next dose <span className="font-semibold ml-1">6:30 PM</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Button size="sm" className="px-3 py-1">Add to Calendar</Button>
                    <Button size="sm" variant="outline" className="px-3 py-1">Snooze</Button>
                    <Button size="sm" className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white">Mark taken</Button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-500 dark:text-gray-400">Pro tip: add meal times in Settings to adjust reminders around food & sleep.</div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -right-6 top-6 hidden md:block w-44"
            >
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-lg border border-gray-100 dark:border-gray-800">
                <div className="text-xs text-slate-500 dark:text-gray-300">Weekly summary</div>
                <div className="mt-2 text-2xl font-semibold">18 doses</div>
                <div className="text-xs text-slate-500 dark:text-gray-400">Taken 92%</div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Powerful features that people actually use</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Calendar className="w-7 h-7 text-[#090979]" />, title: 'Smart Reminders', desc: 'Automatic Google Calendar reminders with meal & sleep aware scheduling, custom snooze options.' },
              { icon: <Bell className="w-7 h-7 text-green-600" />, title: 'Allergy & Interaction Alerts', desc: 'Store allergies and get clear warnings powered by public drug APIs with doctor share.' },
              { icon: <Archive className="w-7 h-7 text-orange-600" />, title: 'Medicine History', desc: 'Timeline of doses, side-effect notes and exportable PDF/CSV for appointments.' },
              { icon: <CheckCircle className="w-7 h-7 text-blue-600" />, title: 'Multi Profile', desc: 'Manage meds for family or pets with quick switching and combined calendar view.' },
              { icon: <Clock className="w-7 h-7 text-indigo-600" />, title: 'Barcode & QR Scan', desc: 'Scan packaging codes to fetch dosage info and instructions instantly.' },
              { icon: <Globe className="w-7 h-7 text-teal-600" />, title: 'Multi-language OCR', desc: 'Tesseract-based OCR supporting Indian and international scripts.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Card className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <CardHeader>
                    <div className="flex items-center gap-3">{f.icon}<CardTitle className="mt-1 text-lg">{f.title}</CardTitle></div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{f.desc}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Trust and privacy</h2>
          <p className="text-slate-600 dark:text-gray-300 mb-4 max-w-3xl">We designed MedRemind to keep your medical data private. Minimal data stays on device where possible, exports are user-triggered, and you control what is shared with Google Calendar or your doctor.</p>

          <div className="flex gap-4 flex-wrap items-center">
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded">MIT License</div>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded">Open source components</div>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded">SOC 2 ready roadmap</div>
          </div>
        </section>

        <section className="mt-12 pb-24">
          <h2 className="text-3xl font-bold mb-6">Interview talking points</h2>
          <ul className="list-disc pl-6 text-slate-700 dark:text-gray-300 space-y-2 max-w-3xl">
            <li>RLS & row-level security for profile isolation and safe share models</li>
            <li>OCR pipeline with confidence thresholds, heuristics and manual review flow</li>
            <li>Idempotent calendar sync — dedupe & retry strategies for event creation</li>
            <li>Drug interaction caching + throttled alerts to avoid spamming users</li>
            <li>Multi-profile data modelling in Postgres and efficient calendar aggregation</li>
            <li>Accessibility improvements for elderly users (larger tap targets and spoken prompts)</li>
          </ul>
        </section>
      </main>

      <footer className="relative z-10 container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600 dark:text-gray-400">Built with care. Open source components. Privacy first.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-slate-600 dark:text-gray-300">Privacy</Link>
            <Link href="/terms" className="text-sm text-slate-600 dark:text-gray-300">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
