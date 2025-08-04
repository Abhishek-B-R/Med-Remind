"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Camera, Upload, Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { createWorker } from "tesseract.js"

interface Medicine {
  nameOfMedicine: string
  noOfTablets: number
  whenToTake: number[] // [morning, afternoon, evening] as 1 or 0
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrText, setOcrText] = useState<string>("")
  const [extractedData, setExtractedData] = useState<Medicine[] | null>(null)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setError("")
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const performOCR = async (imageFile: File): Promise<string> => {
    const worker = await createWorker("eng")
    try {
      const {
        data: { text },
      } = await worker.recognize(imageFile)
      await worker.terminate()
      return text
    } catch (error) {
      await worker.terminate()
      throw error
    }
  }

  const processPrescription = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    setError("")

    try {
      // Step 1: Perform OCR
      console.log("Starting OCR processing...")
      const extractedText = await performOCR(selectedImage)
      setOcrText(extractedText)
      console.log("OCR completed:", extractedText)

      // Step 2: Send to AI for parsing
      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("ocrText", extractedText)

      const response = await fetch("/api/process-prescription", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process prescription")
      }

      const result = await response.json()
      setExtractedData(result.medicines)
    } catch (error) {
      console.error("Error processing prescription:", error)
      setError("Failed to process prescription. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const createCalendarReminders = async (medicines: Medicine[]) => {
    try {
      const response = await fetch("/api/create-reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicines }),
      })

      if (!response.ok) {
        throw new Error("Failed to create reminders")
      }

      const result = await response.json()
      alert(`Successfully created ${result.eventsCreated} reminders in your Google Calendar!`)
      router.push("/reminders")
    } catch (error) {
      console.error("Error creating reminders:", error)
      setError("Failed to create calendar reminders. Please try again.")
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Prescription</h1>
          <p className="text-gray-600">Take a photo or upload an image of your prescription</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Choose how you&apos;d like to add your prescription image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleCameraCapture} variant="outline" className="h-32 flex-col bg-transparent">
                  <Camera className="w-8 h-8 mb-2" />
                  Take Photo
                </Button>
                <Button onClick={handleUploadClick} variant="outline" className="h-32 flex-col bg-transparent">
                  <Upload className="w-8 h-8 mb-2" />
                  Upload File
                </Button>
              </div>

              <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <Input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              {imagePreview && (
                <div className="mt-4">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Prescription preview"
                    width={400}
                    height={300}
                    className="rounded-lg border w-full object-cover"
                  />
                </div>
              )}

              {selectedImage && !isProcessing && !extractedData && (
                <Button onClick={processPrescription} className="w-full">
                  Process Prescription with AI
                </Button>
              )}

              {isProcessing && (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Processing prescription...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              )}

              {ocrText && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">OCR Extracted Text</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600 max-h-32 overflow-y-auto">{ocrText}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {extractedData && (
            <Card>
              <CardHeader>
                <CardTitle>Extracted Medicines</CardTitle>
                <CardDescription>Review and edit the extracted information before setting reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <PrescriptionEditor medicines={extractedData} onSave={createCalendarReminders} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function PrescriptionEditor({ medicines, onSave }: { medicines: Medicine[]; onSave: (medicines: Medicine[]) => void }) {
  const [editedMedicines, setEditedMedicines] = useState(medicines)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMedicine = (index: number, field: string, value: any) => {
    const updated = [...editedMedicines]
    updated[index] = { ...updated[index], [field]: value }
    setEditedMedicines(updated)
  }

  const removeMedicine = (index: number) => {
    const updated = editedMedicines.filter((_, i) => i !== index)
    setEditedMedicines(updated)
  }

  const addMedicine = () => {
    setEditedMedicines([
      ...editedMedicines,
      {
        nameOfMedicine: "",
        noOfTablets: 1,
        whenToTake: [1, 0, 0], // Default to morning only
      },
    ])
  }

  return (
    <div className="space-y-4">
      {editedMedicines.map((medicine, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Medicine {index + 1}</h4>
              <Button variant="outline" size="sm" onClick={() => removeMedicine(index)}>
                Remove
              </Button>
            </div>
            <Input
              value={medicine.nameOfMedicine}
              onChange={(e) => updateMedicine(index, "nameOfMedicine", e.target.value)}
              placeholder="Medicine name"
            />
            <Input
              type="number"
              min="1"
              value={medicine.noOfTablets}
              onChange={(e) => updateMedicine(index, "noOfTablets", Number.parseInt(e.target.value) || 1)}
              placeholder="Number of tablets"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">When to take:</p>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={medicine.whenToTake[0] === 1}
                    onChange={(e) => {
                      const newWhenToTake = [...medicine.whenToTake]
                      newWhenToTake[0] = e.target.checked ? 1 : 0
                      updateMedicine(index, "whenToTake", newWhenToTake)
                    }}
                  />
                  <span>Morning</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={medicine.whenToTake[1] === 1}
                    onChange={(e) => {
                      const newWhenToTake = [...medicine.whenToTake]
                      newWhenToTake[1] = e.target.checked ? 1 : 0
                      updateMedicine(index, "whenToTake", newWhenToTake)
                    }}
                  />
                  <span>Afternoon</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={medicine.whenToTake[2] === 1}
                    onChange={(e) => {
                      const newWhenToTake = [...medicine.whenToTake]
                      newWhenToTake[2] = e.target.checked ? 1 : 0
                      updateMedicine(index, "whenToTake", newWhenToTake)
                    }}
                  />
                  <span>Evening</span>
                </label>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <div className="flex space-x-2">
        <Button variant="outline" onClick={addMedicine} className="flex-1 bg-transparent">
          Add Medicine
        </Button>
        <Button onClick={() => onSave(editedMedicines)} className="flex-1">
          Create Calendar Reminders
        </Button>
      </div>
    </div>
  )
}
