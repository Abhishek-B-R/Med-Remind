import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export async function POST(request: NextRequest) {
  try {
    const { reminderId, status } = await request.json()
    const session = await getServerSession()

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // If marked as missed, create a new reminder for 2 hours later
    if (status === "missed") {
      // Get the original event
      const eventResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${reminderId}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        },
      )

      if (eventResponse.ok) {
        const originalEvent = await eventResponse.json()

        // Create a new reminder 2 hours later
        const originalStart = new Date(originalEvent.start.dateTime)
        const newStart = new Date(originalStart.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
        const newEnd = new Date(newStart.getTime() + 15 * 60 * 1000) // 15 minutes duration

        const newEvent = {
          summary: `${originalEvent.summary} (Missed Dose)`,
          description: `${originalEvent.description}\n\nThis is a rescheduled reminder for a missed dose.\nOriginal time: ${originalStart.toLocaleString()}`,
          start: {
            dateTime: newStart.toISOString(),
            timeZone: originalEvent.start.timeZone,
          },
          end: {
            dateTime: newEnd.toISOString(),
            timeZone: originalEvent.end.timeZone,
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: "popup", minutes: 10 },
              { method: "email", minutes: 30 },
            ],
          },
          extendedProperties: {
            private: {
              medicineApp: "true",
              medicineName: originalEvent.extendedProperties?.private?.medicineName || "Unknown",
              missedDose: "true",
              originalEventId: reminderId,
            },
          },
        }

        // Create the new reminder
        await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        })
      }
    }

    // Update the original event description to include status
    const updateResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${reminderId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: `Status: ${status.toUpperCase()}\nUpdated: ${new Date().toISOString()}\n\n${status === "taken" ? "✅ Dose taken successfully" : "❌ Dose was missed"}`,
        }),
      },
    )

    if (!updateResponse.ok) {
      throw new Error("Failed to update event")
    }

    return NextResponse.json({
      success: true,
      message: status === "missed" ? "Reminder rescheduled for 2 hours later" : "Status updated successfully",
    })
  } catch (error) {
    console.error("Error updating reminder:", error)
    return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 })
  }
}
