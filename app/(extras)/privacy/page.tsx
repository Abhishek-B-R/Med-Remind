import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Database, Eye, Trash2, Lock, Globe } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your privacy is our priority. Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Shield className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  Privacy Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Our Promise</p>
                  <p>
                    We are committed to protecting your privacy and ensuring the security of your personal and medical
                    information. This policy explains how we collect, use, and protect your data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Database className="w-5 h-5 text-green-500 dark:text-green-400" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Google Account Data:</strong> Name, email address, and profile picture from your Google
                    account
                  </li>
                  <li>
                    <strong>User Preferences:</strong> Medication timing preferences, snooze settings, and notification
                    preferences
                  </li>
                  <li>
                    <strong>Medication Data:</strong> Medicine names, dosages, schedules, and notes extracted from
                    prescriptions
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Technical Information</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Usage Data:</strong> How you interact with our service, pages visited, features used
                  </li>
                  <li>
                    <strong>Device Information:</strong> Browser type, operating system, IP address (for security
                    purposes)
                  </li>
                  <li>
                    <strong>Session Data:</strong> Authentication tokens and session identifiers
                  </li>
                </ul>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mt-6">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">What We DON&apos;T Collect</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Prescription Images:</strong> Images are processed and immediately deleted
                    </li>
                    <li>
                      <strong>Other Calendar Events:</strong> We only access events created by our app
                    </li>
                    <li>
                      <strong>Medical History:</strong> We don&apos;t store comprehensive medical records
                    </li>
                    <li>
                      <strong>Payment Information:</strong> We don&apos;t process payments or store financial data
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Eye className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Primary Uses</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Medication Reminders:</strong> Create and manage calendar events for your medication
                    schedule
                  </li>
                  <li>
                    <strong>Personalization:</strong> Customize reminder times and preferences based on your settings
                  </li>
                  <li>
                    <strong>Service Improvement:</strong> Analyze usage patterns to improve our OCR and AI accuracy
                  </li>
                  <li>
                    <strong>Account Management:</strong> Maintain your user account and preferences
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Data Processing</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>OCR Processing:</strong> Extract text from prescription images using AI
                  </li>
                  <li>
                    <strong>Calendar Integration:</strong> Sync with Google Calendar to create and update events
                  </li>
                  <li>
                    <strong>Reminder Management:</strong> Track medication adherence and reschedule missed doses
                  </li>
                </ul>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mt-6">
                  <p className="text-green-600 dark:text-green-400 font-semibold mb-2">We NEVER:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Sell your personal or medical information</li>
                    <li>Share your data with third-party advertisers</li>
                    <li>Use your information for marketing purposes</li>
                    <li>Store your prescription images permanently</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Lock className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                  Data Security & Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Measures</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard
                    protocols
                  </li>
                  <li>
                    <strong>Access Control:</strong> Strict access controls limit who can view your information
                  </li>
                  <li>
                    <strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments
                  </li>
                  <li>
                    <strong>Secure Infrastructure:</strong> Our servers are hosted on secure, compliant cloud platforms
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Data Retention</h3>
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Account Data:</strong> Retained while your account is active
                    </li>
                    <li>
                      <strong>Medication Records:</strong> Stored for historical tracking and adherence monitoring
                    </li>
                    <li>
                      <strong>Prescription Images:</strong> Immediately deleted after processing (never stored)
                    </li>
                    <li>
                      <strong>Session Data:</strong> Automatically expires after 30 days of inactivity
                    </li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Data Deletion</h3>
                <p>When you delete your account, all personal data is permanently removed within 30 days, including:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>User profile and preferences</li>
                  <li>Medication records and history</li>
                  <li>Calendar events created by our service</li>
                  <li>All associated session and authentication data</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Globe className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Google Services</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Google Calendar API:</strong> Used to create and manage medication reminders
                  </li>
                  <li>
                    <strong>Google OAuth:</strong> For secure authentication and authorization
                  </li>
                  <li>
                    <strong>Google&apos;s Privacy Policy:</strong> Also applies to data processed through Google services
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">AI/OCR Services</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>OpenAI API:</strong> Used for prescription text extraction and processing
                  </li>
                  <li>
                    <strong>Data Processing:</strong> Prescription images are sent to AI services for analysis
                  </li>
                  <li>
                    <strong>No Storage:</strong> Third-party AI services do not retain your prescription images
                  </li>
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-6">
                  <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">Third-Party Compliance</p>
                  <p>
                    All third-party services we use are GDPR and HIPAA compliant and maintain strict data protection
                    standards.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
                  Your Rights & Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Rights</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of all personal data we have about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct any inaccurate personal information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account and all associated data
                  </li>
                  <li>
                    <strong>Portability:</strong> Export your medication history and preferences
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">Privacy Controls</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Google Calendar Access:</strong> Can be revoked at any time through Google Account settings
                  </li>
                  <li>
                    <strong>Notification Preferences:</strong> Customize or disable reminder notifications
                  </li>
                  <li>
                    <strong>Data Sharing:</strong> Control what information is included in doctor reports
                  </li>
                  <li>
                    <strong>Account Deletion:</strong> Permanently delete your account and all data
                  </li>
                </ul>

                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4 mt-6">
                  <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2">Contact Us</p>
                  <p>
                    For any privacy concerns, data requests, or questions about this policy, contact us at:
                    <strong className="text-gray-900 dark:text-white"> privacy@medreminder.com</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Policy Updates</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                <p>
                  We may update this privacy policy from time to time. We will notify you of any material changes by
                  email or through a prominent notice in our application. Your continued use of the service after such
                  modifications constitutes acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
