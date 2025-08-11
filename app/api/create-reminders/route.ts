import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { medicines } = await request.json()
    const events = []

    for (const medicine of medicines) {
      const { nameOfMedicine, noOfTablets, whenToTake } = medicine

      // Create events for each time the medicine should be taken
      const times = [
        { time: "08:00", label: "Morning" },
        { time: "13:00", label: "Afternoon" },
        { time: "20:00", label: "Evening" },
      ]

      for (let i = 0; i < whenToTake.length; i++) {
        if (whenToTake[i] === 1) {
          const timeSlot = times[i]
          const today = new Date()
          const startDate = new Date(today)
          startDate.setHours(
            Number.parseInt(timeSlot.time.split(":")[0]),
            Number.parseInt(timeSlot.time.split(":")[1]),
            0,
            0,
          )

          // If the time has already passed today, start tomorrow
          if (startDate <= today) {
            startDate.setDate(startDate.getDate() + 1)
          }

          const endDate = new Date(startDate)
          endDate.setMinutes(endDate.getMinutes() + 15)

          // Create recurring daily event for the duration of the prescription
          const event = {
            summary: `Take ${nameOfMedicine}`,
            description: `Medication reminder: Take ${nameOfMedicine}\n\nTotal tablets: ${noOfTablets}\nTime: ${timeSlot.label}\n\nClick 'Done' when taken or 'Missed' if you missed this dose.`,
            start: {
              dateTime: startDate.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime: endDate.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recurrence: [`RRULE:FREQ=DAILY;COUNT=${Math.ceil(noOfTablets / whenToTake.filter((t:any) => t === 1).length)}`],
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
                medicineName: nameOfMedicine,
                totalTablets: noOfTablets.toString(),
                timeSlot: timeSlot.label,
              },
            },
          }

          // Create the event in Google Calendar
          const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
          })

          if (response.ok) {
            const createdEvent = await response.json()
            events.push(createdEvent)
          } else {
            console.error("Failed to create event:", await response.text())
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      eventsCreated: events.length,
      events,
    })
  } catch (error) {
    console.error("Error creating calendar reminders:", error)
    return NextResponse.json({ error: "Failed to create reminders" }, { status: 500 })
  }
}
