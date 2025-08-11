import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'
import { Providers } from '@/components/providers'
import { AppToaster } from '@/components/ui/toaster' // Import Toaster

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'MedReminder - Smart Prescription Management',
    description:
        'Scan prescriptions, get AI-powered parsing, and automatic Google Calendar reminders for your medications.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    <Navigation />
                    {children}
                    <AppToaster />
                </Providers>
            </body>
        </html>
    )
}
