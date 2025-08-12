import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'
import GoogleCalendarEvent from '@/interfaces/GoogleCalenderEvent'
import DbReminder from '@/interfaces/DBReminder'
import Reminder from '@/interfaces/Reminder'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const now = new Date()
    const timeMin = now.toISOString()
    const timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&` +
        `privateExtendedProperty=medicineApp%3Dtrue`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch calendar events')
    }

    const data = await response.json()
    const googleEvents = data.items || []

    const normalizedEventIds = googleEvents.map(
      (event: GoogleCalendarEvent) => event.id.split('_')[0]
    )

    const dbReminders = await prisma.reminder.findMany({
      where: {
        googleEventId: {
          in: normalizedEventIds,
        },
      },
      include: {
        medicine: true,
      },
    })

    const remindersMap = new Map(dbReminders.map((r: DbReminder) => [r.googleEventId, r]))

    const allReminders = googleEvents.map((event: GoogleCalendarEvent) => {
      const normalizedEventId = event.id.split('_')[0]
      const dbReminder = remindersMap.get(normalizedEventId) as DbReminder | undefined

      const medicineName =
        event.extendedProperties?.private?.medicineName ||
        event.summary?.replace('Take ', '') ||
        'Unknown Medicine'

      const notes = event.extendedProperties?.private?.notes || dbReminder?.medicine?.notes || ''

      return {
        id: event.id,
        medicine: medicineName,
        time: new Date(event.start.dateTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: new Date(event.start.dateTime).toLocaleDateString('en-US'),
        status: dbReminder?.status || 'pending',
        description: event.description,
        notes: notes,
      }
    })

    const activeReminders = allReminders.filter(
      (reminder: Reminder) => reminder.status === 'pending' || reminder.status === 'scheduled'
    )

    console.log(`Total events: ${allReminders.length}, Active: ${activeReminders.length}`)
    console.log(
      'Reminder statuses:',
      allReminders.map((r: Reminder) => `${r.medicine}: ${r.status}`)
    )

    return NextResponse.json({ reminders: activeReminders })
  } catch (error) {
    console.error('Error fetching reminders:', error)
    return NextResponse.json(
      {
        error: (error as Error).message || 'Failed to fetch reminders',
      },
      { status: 500 }
    )
  }
}
