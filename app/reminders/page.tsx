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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

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

  const [showCustomSnoozeDialog, setShowCustomSnoozeDialog] = useState(false)
  const [currentReminderIdForSnooze, setCurrentReminderIdForSnooze] = useState<string | null>(null)
  const [customSnoozeValue, setCustomSnoozeValue] = useState("30")
  const [customSnoozeUnit, setCustomSnoozeUnit] = useState<"minutes" | "hours" | "days">("minutes")

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    fetchReminders()
    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const response = await fetch("/api/history")
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
      fetchReminders()
      fetchHistory()
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

  const handleCustomSnoozeClick = (reminderId: string) => {
    setCurrentReminderIdForSnooze(reminderId)
    setShowCustomSnoozeDialog(true)
    setCustomSnoozeValue("30")
    setCustomSnoozeUnit("minutes")
  }

  const handleCustomSnoozeSubmit = async () => {
    if (!currentReminderIdForSnooze) return

    const value = Number.parseInt(customSnoozeValue)
    if (Number.isNaN(value) || value <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid positive number for snooze duration.",
        variant: "destructive",
      })
      return
    }

    let snoozeString: string
    if (customSnoozeUnit === "minutes") {
      snoozeString = `${value}min`
    } else if (customSnoozeUnit === "hours") {
      snoozeString = `${value}hr`
    } else {
      snoozeString = value === 1 ? "tomorrow" : "custom"
      toast({
        title: "Note on Days Snooze",
        description: "Day-based snooze currently defaults to rescheduling 2 hours later if not 'tomorrow'.",
        variant: "default",
      })
    }

    await updateReminderStatus(currentReminderIdForSnooze, "missed", snoozeString)
    setShowCustomSnoozeDialog(false)
    setCurrentReminderIdForSnooze(null)
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
      Actual_Updated_Time: entry.actualTakenTime ? new Date(entry.actualTakenTime).toLocaleString() : "N/A",
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-slate-900 dark:text-gray-50 relative overflow-x-hidden py-8">
      <div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, rgba(59,130,246,0.05) 0%, transparent 25%), radial-gradient(circle at 90% 80%, rgba(139,92,246,0.03) 0%, transparent 20%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 max-w-[1200px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Medicine Reminders</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your medication schedule and mark doses as taken or missed</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("current")}
              className={`rounded-none border-b-2 ${
                activeTab === "current" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Current Reminders
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("history")}
              className={`rounded-none border-b-2 ${
                activeTab === "history" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              History
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs px-3 py-2 rounded bg-white dark:bg-gray-800 shadow">Logged in as <span className="font-medium ml-2">{session?.user?.email}</span></div>
            <Button onClick={() => router.push('/dashboard')} variant="outline" className="hidden sm:inline-flex">Upload Prescription</Button>
            <Button onClick={exportHistory} disabled={history.length === 0} className="inline-flex">
              <Share2 className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {activeTab === "current" && (
          <div className="grid gap-4">
            {reminders.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:text-gray-50 border border-gray-100 dark:border-gray-800">
                <CardContent className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">No Reminders Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Upload a prescription to get started with medication reminders</p>
                  <Button onClick={() => router.push("/dashboard")}>Upload Prescription</Button>
                </CardContent>
              </Card>
            ) : (
              reminders.map((reminder) => (
                <Card key={reminder.id} className="dark:bg-gray-800 dark:text-gray-50 border border-gray-100 dark:border-gray-800">
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
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          size="sm"
                          onClick={() => updateReminderStatus(reminder.id, "taken")}
                          className="flex-1 dark:bg-gray-900 dark:hover:bg-gray-700 bg-blue-600 hover:bg-blue-700 text-white"
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
                            <DropdownMenuItem onClick={() => updateReminderStatus(reminder.id, "missed", "30min")}>Snooze 30 min</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateReminderStatus(reminder.id, "missed", "1hr")}>Snooze 1 hour</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateReminderStatus(reminder.id, "missed", "tomorrow")}>Snooze until tomorrow</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCustomSnoozeClick(reminder.id)}>Custom Snooze...</DropdownMenuItem>
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
            {history.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:text-gray-50 border border-gray-100 dark:border-gray-800">
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
                  <Card key={entry.id} className="dark:bg-gray-800 dark:text-gray-50 border border-gray-100 dark:border-gray-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(entry.status)}
                          <div>
                            <CardTitle className="text-lg">{entry.medicine}</CardTitle>
                            <CardDescription>
                              {entry.date} at {entry.time}
                              {entry.actualTakenTime && ` (Taken: ${new Date(entry.actualTakenTime).toLocaleTimeString()})`}
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

      {/* Custom Snooze Dialog */}
      <Dialog open={showCustomSnoozeDialog} onOpenChange={setShowCustomSnoozeDialog}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle>Custom Snooze</DialogTitle>
            <DialogDescription>Set a custom duration to reschedule this reminder.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="snooze-value" className="text-right">
                Snooze for
              </Label>
              <Input
                id="snooze-value"
                type="number"
                value={customSnoozeValue}
                onChange={(e) => setCustomSnoozeValue(e.target.value)}
                className="col-span-2 dark:bg-gray-950 dark:border-gray-700"
                min="1"
              />
              <Select
                value={customSnoozeUnit}
                onValueChange={(value: "minutes" | "hours" | "days") => setCustomSnoozeUnit(value)}
              >
                <SelectTrigger className="dark:bg-gray-950 dark:border-gray-700">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900">
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCustomSnoozeDialog(false)}
              className="dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={handleCustomSnoozeSubmit}>Snooze</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
