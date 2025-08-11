import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"

interface MedicineData {
  nameOfMedicine: string
  noOfTablets: number
  whenToTake: number[] // [morning, afternoon, evening] as 1 or 0
  notes?: string
}

interface UserPreferences {
  morningTime: string
  afternoonTime: string
  eveningTime: string
  allergies: string[]
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { medicines, userPreferences } = (await request.json()) as {
      medicines: MedicineData[]
      userPreferences: UserPreferences | null
    }
    const eventsCreated = []

    const defaultPreferences: UserPreferences = {
      morningTime: "08:00",
      afternoonTime: "13:00",
      eveningTime: "20:00",
      allergies: [],
    }
    const effectivePreferences = userPreferences || defaultPreferences

    // 1. Create a new Prescription record
    const newPrescription = await prisma.prescription.create({
      data: {
        userId: session.user.id,
        ocrText: "OCR text will be stored here if passed from client", // Placeholder, ideally passed from client
        imageUrl: "Image URL will be stored here if uploaded to blob storage", // Placeholder
      },
    })

    for (const medicine of medicines) {
      const { nameOfMedicine, noOfTablets, whenToTake, notes } = medicine

      // 2. Create a new Medicine record linked to the Prescription
      const newMedicine = await prisma.medicine.create({
        data: {
          prescriptionId: newPrescription.id,
          nameOfMedicine,
          noOfTablets,
          whenToTake,
          notes,
        },
      })

      const times = [
        { time: effectivePreferences.morningTime, label: "Morning" },
        { time: effectivePreferences.afternoonTime, label: "Afternoon" },
        { time: effectivePreferences.eveningTime, label: "Evening" },
      ]

      const dosesPerDay = whenToTake.filter((t) => t === 1).length
      const totalDays = dosesPerDay > 0 ? Math.ceil(noOfTablets / dosesPerDay) : noOfTablets

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

          if (startDate <= today) {
            startDate.setDate(startDate.getDate() + 1)
          }

          const endDate = new Date(startDate)
          endDate.setMinutes(endDate.getMinutes() + 15)

          const event = {
            summary: `Take ${nameOfMedicine}`,
            description: `Medication reminder: Take ${nameOfMedicine}\n\nTotal tablets: ${noOfTablets}\nTime: ${timeSlot.label}\nNotes: ${notes || "N/A"}\n\nClick 'Done' when taken or 'Missed' if you missed this dose.`,
            start: {
              dateTime: startDate.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime: endDate.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            recurrence: [`RRULE:FREQ=DAILY;COUNT=${totalDays}`],
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
                notes: notes || "",
                medicineId: newMedicine.id, // Link to our internal medicine ID
              },
            },
          }

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
            eventsCreated.push(createdEvent)

            // 3. Create a new Reminder record linked to the Medicine and Google Event
            await prisma.reminder.create({
              data: {
                medicineId: newMedicine.id,
                googleEventId: createdEvent.id,
                scheduledTime: new Date(createdEvent.start.dateTime),
                status: "pending",
              },
            })
          } else {
            console.error("Failed to create event:", await response.text())
            throw new Error("Failed to create Google Calendar event.")
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      eventsCreated: eventsCreated.length,
      events: eventsCreated,
    })
  } catch (error) {
    console.error("Error creating calendar reminders:", error)
    return NextResponse.json({ error: (error as Error).message || "Failed to create reminders" }, { status: 500 })
  }
}
