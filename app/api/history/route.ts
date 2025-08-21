import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const [historyEntries, total] = await Promise.all([
      prisma.reminder.findMany({
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
        skip: offset,
        take: limit,
      }),
      prisma.reminder.count({
        where: {
          medicine: {
            prescription: {
              userId: session.user.id,
            },
          },
        },
      }),
    ])

    const formattedHistory = historyEntries?.map((entry) => ({
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

    return NextResponse.json({
      total,
      limit,
      offset,
      history: formattedHistory,
    })
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch history' },
      { status: 500 }
    )
  }
}