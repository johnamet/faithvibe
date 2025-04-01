import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { AuthProvider } from "@/hooks/use-auth"
import { AuthSync } from "@/app/auth-sync"
import { SettingsProvider } from "@/contexts/settings-context"
import { DynamicStyles } from "@/components/dynamic-styles"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Faith Community - Find Peace and Purpose",
  description: "Join our community of faith and discover spiritual growth through worship, fellowship, and service.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SettingsProvider>
              <DynamicStyles />
              <AuthSync />
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'