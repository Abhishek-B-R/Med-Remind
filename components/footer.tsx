import Link from "next/link"
import { Github, Heart, Calendar, Shield, FileText } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              MedRemind
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Never miss your medicine again. Smart prescription scanning with AI-powered Google Calendar integration.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Upload Prescription</span>
              </Link>
              <Link
                href="/reminders"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>My Reminders</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                <Shield className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Legal</h3>
            <div className="space-y-2">
              <Link
                href="/privacy"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                <Shield className="w-4 h-4" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                href="/terms"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Terms of Service</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Developer</h3>
            <div className="space-y-3">
              <a
                href="https://github.com/Abhishek-B-R/Med-Remind"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>by Abhishek</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              © {new Date().getFullYear()} MedRemind. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
              <span>Powered by Next.js & Google Calendar</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
