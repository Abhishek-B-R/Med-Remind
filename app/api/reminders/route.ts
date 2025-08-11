import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: {
    dateTime: string;
  };
  extendedProperties?: {
    private?: {
      medicineName?: string;
      notes?: string;
      medicineApp?: string;
    };
  };
}

interface DbReminder {
  googleEventId: string;
  status: string;
  medicine?: {
    notes?: string | null;
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Fetch upcoming events from Google Calendar
    const now = new Date()
    const timeMin = now.toISOString()
    const timeMax = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next 7 days

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&` +
        `privateExtendedProperty=medicineApp%3Dtrue`, // Filter for our medicine reminders
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch calendar events")
    }

    const data = await response.json()
    const googleEvents = data.items || []

    // **FIX: Normalize Google Calendar event IDs to match database**
    const normalizedEventIds = googleEvents.map((event: GoogleCalendarEvent) => 
      event.id.split("_")[0] // Remove recurring event suffix
    )

    const dbReminders = await prisma.reminder.findMany({
      where: {
        googleEventId: {
          in: normalizedEventIds,
        },
      },
      include: {
        medicine: true, // Include medicine details
      },
    })

    // **FIX: Create map using normalized IDs**
    const remindersMap = new Map(
      dbReminders.map((r: DbReminder) => [r.googleEventId, r])
    )

    // Transform calendar events to reminder format, using DB status
    const allReminders = googleEvents.map((event: GoogleCalendarEvent) => {
      const normalizedEventId = event.id.split("_")[0] // Normalize here too
      const dbReminder = remindersMap.get(normalizedEventId) as DbReminder | undefined
      
      const medicineName =
        event.extendedProperties?.private?.medicineName || 
        event.summary?.replace("Take ", "") || 
        "Unknown Medicine"
      
      const notes = event.extendedProperties?.private?.notes || 
        dbReminder?.medicine?.notes || ""

      return {
        id: event.id, // Keep original ID for frontend operations
        medicine: medicineName,
        time: new Date(event.start.dateTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(event.start.dateTime).toLocaleDateString("en-US"),
        status: dbReminder?.status || "pending", // Use DB status, fallback to pending
        description: event.description,
        notes: notes,
      }
    })

    // **Filter out completed reminders for current reminders endpoint**
    interface Reminder {
      id: string;
      medicine: string;
      time: string;
      date: string;
      status: string;
      description?: string;
      notes: string;
    }

    const activeReminders = allReminders.filter((reminder: Reminder) => 
      reminder.status === "pending" || reminder.status === "scheduled"
    );

    console.log(`Total events: ${allReminders.length}, Active: ${activeReminders.length}`)
    console.log("Reminder statuses:", allReminders.map((r: Reminder) => `${r.medicine}: ${r.status}`))

    return NextResponse.json({ reminders: activeReminders })
  } catch (error) {
    console.error("Error fetching reminders:", error)
    return NextResponse.json({ 
      error: (error as Error).message || "Failed to fetch reminders" 
    }, { status: 500 })
  }
}