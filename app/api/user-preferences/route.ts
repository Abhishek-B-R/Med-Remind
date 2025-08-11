import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

interface UserPreferencesData {
  morningTime: string
  afternoonTime: string
  eveningTime: string
  allergies: string[]
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    })

    if (!preferences) {
      // Return default preferences if none exist
      return NextResponse.json({
        morningTime: "08:00",
        afternoonTime: "13:00",
        eveningTime: "20:00",
        allergies: [],
      })
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { morningTime, afternoonTime, eveningTime, allergies } = (await request.json()) as UserPreferencesData

    const updatedPreferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: {
        morningTime,
        afternoonTime,
        eveningTime,
        allergies,
      },
      create: {
        userId: session.user.id,
        morningTime,
        afternoonTime,
        eveningTime,
        allergies,
      },
    })

    return NextResponse.json(updatedPreferences)
  } catch (error) {
    console.error("Error saving user preferences:", error)
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 })
  }
}
