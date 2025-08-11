"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Loader2, History, Share2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Reminder {
  id: string
  medicine: string
  time: string
  status: "pending" | "taken" | "missed" | "scheduled"
  date: string
  description?: string
  notes?: string
}

interface HistoryEntry {
  id: string
  medicine: string
  time: string
  date: string
  status: "pending" | "taken" | "missed" | "scheduled"
  notes?: string
  actualTakenTime?: string
}

export default function RemindersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [reminders, setReminders] = useState<Reminder[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"current" | "history">("current")

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchReminders()
    fetchHistory()
  }, [session, status, router])

  const fetchReminders = async () => {
    try {
      const response = await fetch("/api/reminders")
      if (response.ok) {
        const data = await response.json()
        setReminders(data.reminders || [])
      } else {
        console.error("Failed to fetch current reminders:", await response.text())
        toast({
          title: "Error",
          description: "Failed to load current reminders.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching reminders:", error)
      toast({
        title: "Error",
        description: "Network error while loading current reminders.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history") // New API route for history
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
      } else {
        console.error("Failed to fetch history:", await response.text())
        toast({
          title: "Error",
          description: "Failed to load medication history.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Network error while loading medication history.",
        variant: "destructive",
      })
    }
  }

  const updateReminderStatus = async (reminderId: string, status: "taken" | "missed", snoozeDuration?: string) => {
    setUpdating(reminderId)
    try {
      const response = await fetch("/api/reminders/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reminderId, status, snoozeDuration }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update reminder")
      }

      const result = await response.json()
      toast({
        title: "Reminder Updated!",
        description: result.message,
      })
      fetchReminders() // Re-fetch current reminders
      fetchHistory() // Re-fetch history
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating reminder:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update reminder. Please try again.",
        variant: "destructive",
      })
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
      case "scheduled":
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      taken: "default",
      missed: "destructive",
      pending: "secondary",
      scheduled: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const exportHistory = () => {
    const data = history.map((entry) => ({
      Medicine: entry.medicine,
      Date: entry.date,
      Time: entry.time,
      Status: entry.status,
      Notes: entry.notes || "N/A",
      ActualTakenTime: entry.actualTakenTime ? new Date(entry.actualTakenTime).toLocaleString() : "N/A",
    }))

    if (data.length === 0) {
      toast({
        title: "No History to Export",
        description: "There is no medication history available to export.",
        variant: "destructive",
      })
      return
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") +
      "\n" +
      data
        .map((e) =>
          Object.values(e)
            .map((val) => `"${val}"`)
            .join(","),
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "medication_history.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "History Exported!",
      description: "Your medication history has been exported as a CSV file.",
    })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-400">Loading reminders...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Medicine Reminders</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your medication schedule and mark doses as taken or missed
          </p>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("current")}
            className={`rounded-none border-b-2 ${activeTab === "current" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            Current Reminders
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("history")}
            className={`rounded-none border-b-2 ${activeTab === "history" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            History
          </Button>
        </div>

        {activeTab === "current" && (
          <div className="grid gap-4">
            {reminders.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:text-gray-50">
                <CardContent className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">No Reminders Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Upload a prescription to get started with medication reminders
                  </p>
                  <Button onClick={() => router.push("/dashboard")}>Upload Prescription</Button>
                </CardContent>
              </Card>
            ) : (
              reminders.map((reminder) => (
                <Card key={reminder.id} className="dark:bg-gray-800 dark:text-gray-50">
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 dark:bg-gray-900 dark:hover:bg-gray-700 bg-transparent"
                              disabled={updating === reminder.id}
                            >
                              {updating === reminder.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4 mr-2" />
                              )}
                              Mark as Missed / Snooze
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="dark:bg-gray-900">
                            <DropdownMenuItem onClick={() => updateReminderStatus(reminder.id, "missed", "30min")}>
                              Snooze 30 min
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateReminderStatus(reminder.id, "missed", "1hr")}>
                              Snooze 1 hour
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateReminderStatus(reminder.id, "missed", "tomorrow")}>
                              Snooze until tomorrow
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateReminderStatus(reminder.id, "missed", "2hr")}>
                              Mark as Missed (Reschedule 2 hours later)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="grid gap-4">
            <div className="flex justify-end mb-4">
              <Button onClick={exportHistory} disabled={history.length === 0}>
                <Share2 className="w-4 h-4 mr-2" /> Export History (CSV)
              </Button>
            </div>
            {history.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:text-gray-50">
                <CardContent className="text-center py-12">
                  <History className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">No History Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Take some medications to build your history!</p>
                </CardContent>
              </Card>
            ) : (
              history
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <Card key={entry.id} className="dark:bg-gray-800 dark:text-gray-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(entry.status)}
                          <div>
                            <CardTitle className="text-lg">{entry.medicine}</CardTitle>
                            <CardDescription>
                              {entry.date} at {entry.time}
                              {entry.actualTakenTime &&
                                ` (Taken: ${new Date(entry.actualTakenTime).toLocaleTimeString()})`}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(entry.status)}
                      </div>
                    </CardHeader>
                    {entry.notes && (
                      <CardContent className="pt-0 text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-medium">Notes:</p>
                        <p>{entry.notes}</p>
                      </CardContent>
                    )}
                  </Card>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
