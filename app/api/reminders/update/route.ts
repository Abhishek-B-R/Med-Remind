import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const { reminderId, status, snoozeDuration } = (await request.json()) as {
      reminderId: string
      status: "taken" | "missed"
      snoozeDuration?: string
    }
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Fetch the original event from Google Calendar
    const eventResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${reminderId}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!eventResponse.ok) {
      throw new Error("Failed to fetch original event from Google Calendar")
    }
    const originalEvent = await eventResponse.json()

    // Update status in our database
    const updatedDbReminder = await prisma.reminder.update({
      where: { googleEventId: reminderId },
      data: {
        status: status,
        actualTakenTime: status === "taken" ? new Date() : null,
        snoozeCount: status === "missed" ? { increment: 1 } : 0,
      },
    })

    // If marked as missed, create a new reminder for 2 hours later or custom snooze
    if (status === "missed" && snoozeDuration) {
      const originalStart = new Date(originalEvent.start.dateTime)
      const newStart = new Date(originalStart)

      switch (snoozeDuration) {
        case "30min":
          newStart.setMinutes(newStart.getMinutes() + 30)
          break
        case "1hr":
          newStart.setHours(newStart.getHours() + 1)
          break
        case "tomorrow":
          newStart.setDate(newStart.getDate() + 1)
          break
        default:
          newStart.setHours(newStart.getHours() + 2) // Default to 2 hours if invalid snooze
      }

      const newEnd = new Date(newStart)
      newEnd.setMinutes(newEnd.getMinutes() + 15) // Keep duration same

      const newEvent = {
        summary: `${originalEvent.summary} (Rescheduled)`,
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
            medicineId: updatedDbReminder.medicineId, // Link to our internal medicine ID
          },
        },
      }

      const newEventResponse = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      })

      if (newEventResponse.ok) {
        const createdEvent = await newEventResponse.json()
        // Create a new Reminder record for the rescheduled event
        await prisma.reminder.create({
          data: {
            medicineId: updatedDbReminder.medicineId,
            googleEventId: createdEvent.id,
            scheduledTime: new Date(createdEvent.start.dateTime),
            status: "pending", // New rescheduled event is pending
            snoozeCount: updatedDbReminder.snoozeCount, // Carry over snooze count
          },
        })
      } else {
        console.error("Failed to create rescheduled event:", await newEventResponse.text())
        throw new Error("Failed to create rescheduled Google Calendar event.")
      }
    }

    // Update the original event description in Google Calendar (optional, for user visibility)
    const updateGoogleEventResponse = await fetch(
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

    if (!updateGoogleEventResponse.ok) {
      console.warn("Failed to update Google Calendar event description:", await updateGoogleEventResponse.text())
      // Don't throw error here, as the main DB update and reschedule already happened
    }

    return NextResponse.json({
      success: true,
      message: status === "missed" ? `Reminder rescheduled for ${snoozeDuration}` : "Status updated successfully",
    })
  } catch (error) {
    console.error("Error updating reminder:", error)
    return NextResponse.json({ error: (error as Error).message || "Failed to update reminder" }, { status: 500 })
  }
}
