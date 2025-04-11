import type React from "react"
import ProtectedRoute from "@/components/protected-route"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | Task Manager",
  description: "Manage your tasks",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
