"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Upload, Bell, Home, LogOut, Settings, Sun, Moon, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { setTheme } = useTheme()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Upload", icon: Upload },
    { href: "/reminders", label: "Reminders", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  if (pathname === "/" || pathname === "/auth/signin") {
    return null
  }

  return (
    <nav className="bg-white shadow-sm border-b dark:bg-gray-950 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              MedRemind
            </Link>
            {session && (
              <div className="hidden md:flex space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-50 dark:hover:bg-gray-800"
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

          <div className="flex items-center space-x-2 md:space-x-4">
            {session && (
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={`flex items-center space-x-2 w-full ${
                              pathname === item.href
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                : ""
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {session && (
              <>
                <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-300">
                  Hello, {session.user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
