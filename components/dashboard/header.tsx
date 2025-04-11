"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export function DashboardHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b">
      <Link href="/dashboard" className="flex items-center justify-center">
        <span className="font-bold text-xl">Task Manager</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <div className="flex items-center">
          <span className="mr-4">Welcome, {user?.name}</span>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </nav>
    </header>
  )
}
