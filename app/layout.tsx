import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { Providers } from '@/components/providers'
import { AppToaster } from '@/components/ui/toaster' // Import Toaster
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MedRemind - Smart Prescription Management',
  description:
    'Scan prescriptions, get AI-powered parsing, and automatic Google Calendar reminders for your medications.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="https://i.imghippo.com/files/sql9599OoU.jpeg"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
          <AppToaster />
          <Footer/>
        </Providers>
      </body>
    </html>
  )
}
