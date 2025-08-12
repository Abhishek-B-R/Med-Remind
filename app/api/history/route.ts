import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const historyEntries = await prisma.reminder.findMany({
      where: {
        medicine: {
          prescription: {
            userId: session.user.id,
          },
        },
      },
      include: {
        medicine: true,
      },
      orderBy: {
        scheduledTime: 'desc',
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedHistory = historyEntries.map((entry: any) => ({
      id: entry.id,
      medicine: entry.medicine.nameOfMedicine,
      time: new Date(entry.scheduledTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: new Date(entry.scheduledTime).toLocaleDateString('en-US'),
      status: entry.status,
      notes: entry.medicine.notes || '',
      actualTakenTime: entry.actualTakenTime?.toISOString() || undefined,
    }))

    return NextResponse.json({ history: formattedHistory })
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
