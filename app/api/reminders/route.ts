import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
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

    // Transform calendar events to reminder format
    const reminders =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items?.map((event: any) => ({
        id: event.id,
        medicine:
          event.extendedProperties?.private?.medicineName || event.summary?.replace("Take ", "") || "Unknown Medicine",
        time: new Date(event.start.dateTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(event.start.dateTime).toLocaleDateString("en-US"),
        status: event.description?.includes("Status: TAKEN")
          ? "taken"
          : event.description?.includes("Status: MISSED")
            ? "missed"
            : "pending",
        description: event.description,
      })) || []

    return NextResponse.json({ reminders })
  } catch (error) {
    console.error("Error fetching reminders:", error)
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 })
  }
}
