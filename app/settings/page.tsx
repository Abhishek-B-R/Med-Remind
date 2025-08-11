"use client"

import type React from "react"

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

interface UserPreferences {
  morningTime: string
  afternoonTime: string
  eveningTime: string
  allergies: string[]
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

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
    if (!session) {
      router.push("/auth/signin")
      return
    }

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
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your medication preferences and alerts.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="dark:bg-gray-800 dark:text-gray-50">
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

          <Card className="dark:bg-gray-800 dark:text-gray-50">
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>
                List your known allergies to receive alerts for conflicting medications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a new allergy (e.g., Penicillin)"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddAllergy()
                  }}
                  className="dark:bg-gray-950 dark:border-gray-700"
                />
                <Button onClick={handleAddAllergy}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.allergies.map((allergy, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 dark:bg-gray-700">
                    {allergy}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 dark:hover:bg-gray-600"
                      onClick={() => handleRemoveAllergy(allergy)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove allergy</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <AlertCircle className="inline-block h-4 w-4 mr-1" />
                Allergy alerts are a placeholder. Full functionality requires integration with a drug database.
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 dark:bg-gray-800 dark:text-gray-50">
            <CardHeader>
              <CardTitle>Drug Interaction Alerts</CardTitle>
              <CardDescription>
                Receive warnings if your prescribed medications have known dangerous interactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <AlertCircle className="inline-block h-4 w-4 mr-1" />
                Drug interaction alerts are a placeholder. Full functionality requires integration with a public drug
                interaction API (e.g., OpenFDA, RxNorm).
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-right">
          <Button onClick={handleSavePreferences} disabled={saving}>
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
