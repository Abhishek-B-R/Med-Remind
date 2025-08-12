"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, X, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import UserPreferences from "@/interfaces/UserPreferences"

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  console.log(session)
  const [preferences, setPreferences] = useState<UserPreferences>({
    morningTime: "08:00",
    afternoonTime: "13:00",
    eveningTime: "20:00",
    allergies: [],
  })
  const [newAllergy, setNewAllergy] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/user-preferences")
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setPreferences(data)
          }
        } else {
          console.error("Failed to fetch user preferences:", await response.text())
          toast({
            title: "Error",
            description: "Failed to load preferences. Using defaults.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching preferences:", error)
        toast({
          title: "Error",
          description: "Network error while loading preferences. Using defaults.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [session, status, router, toast])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !preferences.allergies.includes(newAllergy.trim())) {
      setPreferences((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }))
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (allergyToRemove: string) => {
    setPreferences((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((allergy) => allergy !== allergyToRemove),
    }))
  }

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        toast({
          title: "Preferences Saved!",
          description: "Your settings have been updated successfully.",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save preferences.")
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to save preferences:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-400">Loading preferences...</p>
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
          <h1 className="text-3xl font-extrabold">Settings</h1>
          <p className="text-sm text-slate-600 dark:text-gray-300">Manage your medication preferences and alerts.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="dark:bg-gray-800 dark:text-gray-50 border border-gray-100 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Preferred Reminder Times</CardTitle>
              <CardDescription>Set your ideal times for morning, afternoon, and evening reminders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="morningTime">Morning Reminder</Label>
                <Input
                  id="morningTime"
                  name="morningTime"
                  type="time"
                  value={preferences.morningTime}
                  onChange={handleTimeChange}
                  className="dark:bg-gray-950 dark:border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="afternoonTime">Afternoon Reminder</Label>
                <Input
                  id="afternoonTime"
                  name="afternoonTime"
                  type="time"
                  value={preferences.afternoonTime}
                  onChange={handleTimeChange}
                  className="dark:bg-gray-950 dark:border-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="eveningTime">Evening Reminder</Label>
                <Input
                  id="eveningTime"
                  name="eveningTime"
                  type="time"
                  value={preferences.eveningTime}
                  onChange={handleTimeChange}
                  className="dark:bg-gray-950 dark:border-gray-700"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:text-gray-50 border border-gray-100 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>
                List your known allergies to receive alerts for conflicting medications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <Input
                  placeholder="Add a new allergy (e.g., Penicillin)"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddAllergy()
                  }}
                  className="dark:bg-gray-950 dark:border-gray-700 flex-1"
                />
                <Button onClick={handleAddAllergy} className="mt-2 sm:mt-0">Add</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {preferences.allergies.map((allergy, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2 dark:bg-gray-700">
                    <span>{allergy}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 dark:hover:bg-gray-600"
                      onClick={() => handleRemoveAllergy(allergy)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove allergy</span>
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="text-sm text-slate-600 dark:text-gray-400 flex items-start gap-2">
                <AlertCircle className="inline-block h-4 w-4 mt-[2px]" />
                <span>
                  Allergy alerts are a placeholder. Full functionality requires integration with a drug database.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 dark:bg-gray-800 dark:text-gray-50 border border-gray-100 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Drug Interaction Alerts</CardTitle>
              <CardDescription>
                Receive warnings if your prescribed medications have known dangerous interactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600 dark:text-gray-400 flex items-start gap-2">
                <AlertCircle className="inline-block h-4 w-4 mt-[2px]" />
                <span>
                  Drug interaction alerts are a placeholder. Full functionality requires integration with a public drug
                  interaction API (e.g., OpenFDA, RxNorm).
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-right">
          <Button onClick={handleSavePreferences} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Preferences
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
