import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Calendar, Trash2, Lock } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8">
            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Shield className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  By accessing and using MedReminder (&quot;the Service&quot;), you accept and agree to be bound by the terms and
                  provision of this agreement.
                </p>
                <p>If you do not agree to abide by the above, please do not use this service.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Calendar className="w-5 h-5 text-green-500 dark:text-green-400" />
                  Google Calendar Integration & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Required Permissions</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Google Calendar Access:</strong> We request read and write access to your Google Calendar to
                    create, modify, and delete medication reminder events.
                  </li>
                  <li>
                    <strong>Profile Information:</strong> We access your basic Google profile information (name, email)
                    for account identification and personalization.
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">How We Use Calendar Access</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Create recurring medication reminder events based on your prescription schedule</li>
                  <li>Update event status when you mark doses as taken or missed</li>
                  <li>Reschedule missed doses according to your preferences</li>
                  <li>Delete or modify reminders when you update your medication schedule</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Calendar Data Usage</h3>
                <p>
                  We only access calendar events created by our application. We do not read, modify, or access any other
                  calendar events or personal calendar data.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
                  Prescription Image Handling
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                    Important: No Image Storage
                  </h3>
                  <p>
                    <strong>We do NOT store your prescription images.</strong> All uploaded prescription images are
                    processed immediately using OCR (Optical Character Recognition) and AI analysis, then permanently
                    deleted from our servers.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Image Processing Flow</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>You upload a prescription image</li>
                  <li>Our AI processes the image to extract medication information</li>
                  <li>The extracted data is used to create calendar reminders</li>
                  <li>
                    <strong>The original image is immediately and permanently deleted</strong>
                  </li>
                </ol>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  This ensures your sensitive medical information remains private and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Lock className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  Service Usage & Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Acceptable Use</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Use the service only for legitimate medication reminder purposes</li>
                  <li>Provide accurate information when setting up reminders</li>
                  <li>Do not attempt to reverse engineer or exploit the service</li>
                  <li>Do not upload non-prescription images or inappropriate content</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Medical Disclaimer</h3>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <p>
                    <strong>This service is not a substitute for professional medical advice.</strong> Always consult
                    with your healthcare provider regarding your medications. We are not responsible for any medical
                    decisions made based on our reminders.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Service Availability</h3>
                <p>
                  We strive to maintain 99% uptime but cannot guarantee uninterrupted service. We are not liable for any
                  missed medications due to service outages.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Account Termination</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  You may terminate your account at any time by signing out and revoking Google Calendar access. Upon
                  termination:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>All your medication reminders will be deleted from your Google Calendar</li>
                  <li>Your account data will be permanently removed from our database</li>
                  <li>No personal information will be retained</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                <p>
                  We reserve the right to modify these terms at any time. Users will be notified of significant changes
                  via email or through the application interface.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
