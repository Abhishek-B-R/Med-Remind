import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Camera, Bell, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Never Miss Your Medicine Again</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Scan your doctor&apos;s prescriptions, let AI parse them, and get automatic reminders in Google Calendar. Smart
            medication management made simple.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="text-lg px-8 py-4">
              Get Started with Google Calendar
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Camera className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Scan Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Take a photo or upload an image of your doctor&apos;s prescription</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Bell className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <CardTitle>AI Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Advanced OCR and AI extract medicine details and dosage information</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Auto Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Automatic Google Calendar reminders based on your prescription schedule</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="w-12 h-12 mx-auto text-orange-600 mb-4" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Mark doses as taken or missed, with automatic rescheduling</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Google OAuth</h3>
                <p className="text-gray-600">Connect with Google Calendar for full access</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload & Scan</h3>
                <p className="text-gray-600">Take a photo or upload prescription image</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-gray-600">OCR + AI extracts medicine details</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2">Set Reminders</h3>
                <p className="text-gray-600">Automatic calendar reminders with tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
