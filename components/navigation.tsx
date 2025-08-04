"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Upload, Bell, Home, LogOut } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Upload", icon: Upload },
    { href: "/reminders", label: "Reminders", icon: Bell },
  ]

  if (pathname === "/" || pathname === "/auth/signin") {
    return null
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              MedReminder
            </Link>
            {session && (
              <div className="flex space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
          {session && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hello, {session.user?.name}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
