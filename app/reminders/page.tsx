"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"

interface Reminder {
  id: string
  medicine: string
  time: string
  status: "pending" | "taken" | "missed"
  date: string
  description?: string
}

export default function RemindersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchReminders()
  }, [session, status, router])

  const fetchReminders = async () => {
    try {
      const response = await fetch("/api/reminders")
      const data = await response.json()
      setReminders(data.reminders || [])
    } catch (error) {
      console.error("Error fetching reminders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateReminderStatus = async (reminderId: string, status: "taken" | "missed") => {
    setUpdating(reminderId)
    try {
      const response = await fetch("/api/reminders/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reminderId, status }),
      })

      if (response.ok) {
        await response.json()
        setReminders((prev) =>
          prev.map((reminder) => (reminder.id === reminderId ? { ...reminder, status } : reminder)),
        )

        if (status === "missed") {
          alert("A new reminder has been scheduled for 2 hours later.")
        } else {
          alert("Reminder marked as taken!")
        }
      }
    } catch (error) {
      console.error("Error updating reminder:", error)
      alert("Failed to update reminder. Please try again.")
    } finally {
      setUpdating(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "missed":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      taken: "default",
      missed: "destructive",
      pending: "secondary",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Loading reminders...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicine Reminders</h1>
          <p className="text-gray-600">Track your medication schedule and mark doses as taken or missed</p>
        </div>

        <div className="grid gap-4">
          {reminders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reminders Yet</h3>
                <p className="text-gray-600 mb-4">Upload a prescription to get started with medication reminders</p>
                <Button onClick={() => router.push("/dashboard")}>Upload Prescription</Button>
              </CardContent>
            </Card>
          ) : (
            reminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(reminder.status)}
                      <div>
                        <CardTitle className="text-lg">{reminder.medicine}</CardTitle>
                        <CardDescription>
                          {reminder.date} at {reminder.time}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(reminder.status)}
                  </div>
                </CardHeader>
                {reminder.status === "pending" && (
                  <CardContent className="pt-0">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateReminderStatus(reminder.id, "taken")}
                        className="flex-1"
                        disabled={updating === reminder.id}
                      >
                        {updating === reminder.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Mark as Taken
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReminderStatus(reminder.id, "missed")}
                        className="flex-1"
                        disabled={updating === reminder.id}
                      >
                        {updating === reminder.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        Mark as Missed
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
