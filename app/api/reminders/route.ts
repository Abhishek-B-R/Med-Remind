import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'
import GoogleCalendarEvent from '@/interfaces/GoogleCalenderEvent'
import DbReminder from '@/interfaces/DBReminder'
import Reminder from '@/interfaces/Reminder'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `singleEvents=true&orderBy=startTime&privateExtendedProperty=medicineApp%3Dtrue`,
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
        googleEventId: { in: normalizedEventIds },
      },
      include: { medicine: true },
    })

    const remindersMap = new Map(dbReminders.map((r: DbReminder) => [r.googleEventId, r]))

    const allReminders: Reminder[] = googleEvents.map((event: GoogleCalendarEvent) => {
      const normalizedEventId = event.id.split('_')[0]
      const dbReminder = remindersMap.get(normalizedEventId) as DbReminder | undefined

      return {
        id: event.id,
        medicine:
          event.extendedProperties?.private?.medicineName ||
          event.summary?.replace('Take ', '') ||
          'Unknown Medicine',
        time: event.start?.dateTime
          ? new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : '',
        date: event.start?.dateTime
          ? new Date(event.start.dateTime).toLocaleDateString('en-US')
          : '',
        status: dbReminder?.status || 'pending',
        description: event.description || '',
        notes:
          event.extendedProperties?.private?.notes ||
          dbReminder?.medicine?.notes ||
          '',
      }
    })

    const activeReminders = allReminders.filter(
      (reminder) => reminder.status === 'pending' || reminder.status === 'scheduled'
    )

    const paginatedReminders = activeReminders.slice(offset, offset + limit)

    return NextResponse.json({
      total: activeReminders.length,
      limit,
      offset,
      reminders: paginatedReminders,
    })
  } catch (error) {
    console.error('Error fetching reminders:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch reminders' },
      { status: 500 }
    )
  }
}
