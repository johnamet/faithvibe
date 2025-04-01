"use client"

import { useSettings } from "@/contexts/settings-context"
import { useEffect } from "react"

export function DynamicStyles() {
  const { settings } = useSettings()
  const { appearance } = settings

  useEffect(() => {
    // Apply CSS variables to the document root
    const root = document.documentElement

    root.style.setProperty("--primary", appearance.primaryColor)
    root.style.setProperty("--secondary", appearance.secondaryColor)
    root.style.setProperty("--accent", appearance.accentColor)
    root.style.setProperty("--font-family", appearance.fontFamily)

    // Apply custom CSS if provided
    if (appearance.customCss) {
      const existingStyle = document.getElementById("custom-css")
      if (existingStyle) {
        existingStyle.innerHTML = appearance.customCss
      } else {
        const styleElement = document.createElement("style")
        styleElement.id = "custom-css"
        styleElement.innerHTML = appearance.customCss
        document.head.appendChild(styleElement)
      }
    }
  }, [appearance])

  return null
}

