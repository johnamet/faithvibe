"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Calendar, Home, MessageSquare, Package, Settings, ShoppingBag, Users, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ProtectedRoute from "@/components/protected-route"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Devotionals",
    href: "/admin/devotionals",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Shop",
    href: "/admin/shop",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Prayer Requests",
    href: "/admin/prayer-requests",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="flex min-h-screen bg-gray-100">
        {/* Desktop Sidebar */}
        <aside
          className={`fixed inset-y-0 z-50 hidden bg-white border-r border-gray-200 transition-all duration-300 md:flex md:flex-col ${
            isSidebarOpen ? "md:w-64" : "md:w-16"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin" className={`flex items-center ${!isSidebarOpen && "justify-center"}`}>
              <span className="text-primary font-bold text-lg">{isSidebarOpen ? "Admin Dashboard" : "AD"}</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex"
            >
              <Menu className={`h-5 w-5 ${isSidebarOpen ? "hidden" : "block"}`} />
              <X className={`h-5 w-5 ${isSidebarOpen ? "block" : "hidden"}`} />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === item.href ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                  } ${!isSidebarOpen && "justify-center"}`}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-40">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <div className="flex items-center h-16 px-4 border-b">
              <Link href="/admin" className="flex items-center">
                <span className="text-primary font-bold text-lg">Admin Dashboard</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 py-4 h-[calc(100vh-4rem)]">
              <nav className="space-y-1 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname === item.href ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-16"}`}>
          <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

