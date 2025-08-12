'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Camera, Upload, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { createWorker } from 'tesseract.js'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface Medicine {
  nameOfMedicine: string
  noOfTablets: number
  whenToTake: number[] // [morning, afternoon, evening] as 1 or 0
  notes?: string // New field for side effects/notes
}

interface UserPreferences {
  morningTime: string
  afternoonTime: string
  eveningTime: string
  allergies: string[]
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrText, setOcrText] = useState<string>('')
  const [extractedData, setExtractedData] = useState<Medicine[] | null>(null)
  const [error, setError] = useState<string>('')
  const [ocrLanguage, setOcrLanguage] = useState('eng') // Default OCR language
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/user-preferences')
        if (response.ok) {
          const data = await response.json()
          setUserPreferences(data)
        } else {
          console.error('Failed to fetch user preferences:', await response.text())
          setUserPreferences({
            morningTime: '08:00',
            afternoonTime: '13:00',
            eveningTime: '20:00',
            allergies: [],
          })
        }
      } catch (error) {
        console.error('Error fetching preferences:', error)
        setUserPreferences({
          morningTime: '08:00',
          afternoonTime: '13:00',
          eveningTime: '20:00',
          allergies: [],
        })
      }
    }

    fetchPreferences()
  }, [session, status, router])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setError('')
      setExtractedData(null)
      setOcrText('')
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

  const performOCR = async (imageFile: File, lang: string): Promise<string> => {
    try {
      const worker = await createWorker(lang)
      const {
        data: { text },
      } = await worker.recognize(imageFile)
      await worker.terminate()
      return text
    } catch (error) {
      console.error('Tesseract OCR error:', error)
      throw new Error(
        'Failed to perform OCR. Please ensure the image is clear and the language pack is loaded.'
      )
    }
  }

  const processPrescription = async () => {
    if (!selectedImage) {
      setError('Please select an image first.')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      console.log(`Starting OCR processing with language: ${ocrLanguage}...`)
      const extractedText = await performOCR(selectedImage, ocrLanguage)
      setOcrText(extractedText)
      console.log('OCR completed:', extractedText)

      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('ocrText', extractedText)

      const response = await fetch('/api/process-prescription', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process prescription with AI.')
      }

      const result = await response.json()
      setExtractedData(result.medicines)

      const allergies = userPreferences?.allergies || []
      const detectedAlerts: string[] = []

      result.medicines.forEach((med: Medicine) => {
        if (
          allergies.some((allergy) =>
            med.nameOfMedicine.toLowerCase().includes(allergy.toLowerCase())
          )
        ) {
          detectedAlerts.push(`Potential allergy to "${med.nameOfMedicine}".`)
        }
      })

      const medNames = result.medicines.map((m: Medicine) => m.nameOfMedicine.toLowerCase())
      if (medNames.includes('aspirin') && medNames.includes('warfarin')) {
        detectedAlerts.push(
          'Potential drug interaction: Aspirin and Warfarin can increase bleeding risk.'
        )
      }
      if (medNames.includes('ibuprofen') && medNames.includes('lisinopril')) {
        detectedAlerts.push(
          'Potential drug interaction: Ibuprofen and Lisinopril can affect kidney function.'
        )
      }

      if (detectedAlerts.length > 0) {
        setError(
          `Important Alerts: ${detectedAlerts.join(
            ' '
          )} Please consult your doctor or pharmacist before proceeding.`
        )
        toast({
          title: 'Medication Alerts!',
          description: 'Potential allergies or drug interactions detected. Please review.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Prescription Processed!',
          description: 'Review the extracted details and set reminders.',
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error processing prescription:', err)
      setError(err.message || 'An unexpected error occurred during processing. Please try again.')
      toast({
        title: 'Processing Failed, please try again',
        description: err.message || 'Could not process prescription.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const createCalendarReminders = async (medicines: Medicine[]) => {
    try {
      const response = await fetch('/api/create-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicines, userPreferences }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create reminders.')
      }

      const result = await response.json()
      toast({
        title: 'Reminders Created!',
        description: `Successfully created ${result.eventsCreated} reminders in your Google Calendar!`,
      })
      router.push('/reminders')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error creating reminders:', err)
      setError(
        err.message ||
          'Failed to create calendar reminders. Please ensure you have granted calendar access.'
      )
      toast({
        title: 'Reminder Creation Failed',
        description: err.message || 'Could not create calendar reminders.',
        variant: 'destructive',
      })
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  // fallback one empty medicine for manual entry
  const emptyMedicine: Medicine = {
    nameOfMedicine: '',
    noOfTablets: 1,
    whenToTake: [1, 0, 0],
    notes: '',
  }

  // key ensures PrescriptionEditor remounts when OCR results arrive
  const editorKey = extractedData ? `ocr-${JSON.stringify(extractedData)}` : 'manual-empty'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-slate-900 dark:text-gray-50 relative overflow-x-hidden py-10">
      <div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.05) 0%, transparent 25%), radial-gradient(circle at 90% 80%, rgba(139,92,246,0.03) 0%, transparent 20%)',
        }}
      />

      <div className="relative z-10 container mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Upload Prescription</h1>
            <p className="text-sm text-slate-600 dark:text-gray-300">
              Take a photo or upload an image of your prescription. We support multi-language OCR
              and secure calendar sync.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="px-3 py-2 rounded bg-white dark:bg-gray-800 shadow text-xs font-bold">
              Logged in as: <span className="font-medium ml-2">{session?.user?.email}</span>
            </div>
            <Button
              onClick={() => router.push('/reminders')}
              variant="ghost"
              className="px-4 cursor-pointer border-1"
            >
              View Reminders
            </Button>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="dark:bg-gray-800 dark:text-gray-50 border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Choose how you&apos;d like to add your prescription image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleCameraCapture}
                  variant="outline"
                  className="h-36 flex-col bg-transparent dark:bg-gray-900 dark:hover:bg-gray-700 border-dashed border-2 border-gray-200 dark:border-gray-700"
                >
                  <Camera className="w-8 h-8 mb-2 text-blue-600" />
                  <div className="text-sm">Take Photo</div>
                  <div className="text-xs text-slate-500 mt-1">Use your camera for quick scans</div>
                </Button>
                <Button
                  onClick={handleUploadClick}
                  variant="outline"
                  className="h-36 flex-col bg-transparent dark:bg-gray-900 dark:hover:bg-gray-700 border-dashed border-2 border-gray-200 dark:border-gray-700"
                >
                  <Upload className="w-8 h-8 mb-2 text-purple-600" />
                  <div className="text-sm">Upload File</div>
                  <div className="text-xs text-slate-500 mt-1">Supports PNG, JPG and PDFs</div>
                </Button>
              </div>

              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="space-y-2">
                <Label htmlFor="ocr-language">OCR Language</Label>
                <Select value={ocrLanguage} onValueChange={setOcrLanguage}>
                  <SelectTrigger id="ocr-language" className="w-full dark:bg-gray-900">
                    <SelectValue placeholder="Select OCR Language" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900">
                    <SelectItem value="eng">English</SelectItem>
                    <SelectItem value="hin">Hindi</SelectItem>
                    <SelectItem value="spa">Spanish</SelectItem>
                    <SelectItem value="fra">French</SelectItem>
                    <SelectItem value="deu">German</SelectItem>
                    <SelectItem value="ita">Italian</SelectItem>
                    <SelectItem value="por">Portuguese</SelectItem>
                    <SelectItem value="rus">Russian</SelectItem>
                    <SelectItem value="ara">Arabic</SelectItem>
                    <SelectItem value="chi_sim">Chinese (Simplified)</SelectItem>
                    <SelectItem value="chi_tra">Chinese (Traditional)</SelectItem>
                    <SelectItem value="jpn">Japanese</SelectItem>
                    <SelectItem value="kor">Korean</SelectItem>
                    <SelectItem value="kan">Kannada</SelectItem>
                    <SelectItem value="tam">Tamil</SelectItem>
                    <SelectItem value="tel">Telugu</SelectItem>
                    <SelectItem value="mal">Malayalam</SelectItem>
                    <SelectItem value="guj">Gujarati</SelectItem>
                    <SelectItem value="mar">Marathi</SelectItem>
                    <SelectItem value="ben">Bengali</SelectItem>
                    <SelectItem value="pan">Punjabi</SelectItem>
                    <SelectItem value="urd">Urdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {imagePreview && (
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shadow">
                  <div className="relative w-full h-56">
                    <Image
                      src={imagePreview || '/placeholder.svg'}
                      alt="Prescription preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {selectedImage && !isProcessing && !extractedData && (
                <Button
                  onClick={processPrescription}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" /> Process Prescription with AI
                  </span>
                </Button>
              )}

              {isProcessing && (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-gray-600 dark:text-gray-400">Processing prescription...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    This may take a few moments
                  </p>
                </div>
              )}

              {ocrText && (
                <Card className="mt-4 dark:bg-gray-900 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm dark:text-gray-50">OCR Extracted Text</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {ocrText}
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Always render the editor. If OCR results exist we show them, otherwise we show an empty editor for manual entry. */}
          <Card className="dark:bg-gray-800 dark:text-gray-50 border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle>Extracted Medicines</CardTitle>
              <CardDescription>
                Review and edit the extracted information before setting reminders or add manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrescriptionEditor
                key={editorKey}
                medicines={extractedData ?? [emptyMedicine]}
                onSave={createCalendarReminders}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PrescriptionEditor({
  medicines,
  onSave,
}: {
  medicines: Medicine[]
  onSave: (medicines: Medicine[]) => void
}) {
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
        nameOfMedicine: '',
        noOfTablets: 1,
        whenToTake: [1, 0, 0], // Default to morning only
        notes: '',
      },
    ])
  }

  return (
    <div className="space-y-4">
      {editedMedicines.map((medicine, index) => (
        <Card key={index} className="p-4 dark:bg-gray-900 dark:border-gray-700">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Medicine {index + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeMedicine(index)}
                className="dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Remove
              </Button>
            </div>
            <Input
              value={medicine.nameOfMedicine}
              onChange={(e) => updateMedicine(index, 'nameOfMedicine', e.target.value)}
              placeholder="Medicine name"
              className="dark:bg-gray-950 dark:border-gray-700"
            />
            <Input
              type="number"
              min="1"
              value={medicine.noOfTablets}
              onChange={(e) =>
                updateMedicine(index, 'noOfTablets', Number.parseInt(e.target.value) || 1)
              }
              placeholder="Number of tablets"
              className="dark:bg-gray-950 dark:border-gray-700"
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
                      updateMedicine(index, 'whenToTake', newWhenToTake)
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600"
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
                      updateMedicine(index, 'whenToTake', newWhenToTake)
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600"
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
                      updateMedicine(index, 'whenToTake', newWhenToTake)
                    }}
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span>Evening</span>
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor={`notes-${index}`}>Side Effects/Notes</Label>
              <Input
                id={`notes-${index}`}
                value={medicine.notes || ''}
                onChange={(e) => updateMedicine(index, 'notes', e.target.value)}
                placeholder="e.g., Felt dizzy after this pill"
                className="dark:bg-gray-950 dark:border-gray-700"
              />
            </div>
          </div>
        </Card>
      ))}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={addMedicine}
          className="flex-1 bg-transparent dark:bg-gray-900 dark:hover:bg-gray-700"
        >
          Add Medicine
        </Button>
        <Button
          onClick={() => onSave(editedMedicines)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={editedMedicines.some((med) => !med.nameOfMedicine.trim())}
        >
          Create Calendar Reminders
        </Button>
      </div>
    </div>
  )
}
