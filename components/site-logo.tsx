"use client"

import { useSettings } from "@/contexts/settings-context"
import { motion } from "framer-motion"
import { Cross } from "lucide-react"
import Link from "next/link"

interface SiteLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export default function SiteLogo({ size = "md", showText = true }: SiteLogoProps) {
  const { settings } = useSettings()
  const { general, appearance } = settings

  // Define sizes
  const sizes = {
    sm: { container: "w-8 h-8", icon: "h-4 w-4", text: "text-sm" },
    md: { container: "w-10 h-10", icon: "h-5 w-5", text: "text-base" },
    lg: { container: "w-16 h-16", icon: "h-8 w-8", text: "text-xl" },
  }

  // Define animation variants
  const logoVariants = {
    initial: { scale: 0.9, opacity: 0.8 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  return (
    <Link href="/" className="flex items-center gap-2">
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={logoVariants}
        className={`${sizes[size].container} rounded-full flex items-center justify-center`}
        style={{ backgroundColor: appearance.primaryColor }}
      >
        <Cross className={`${sizes[size].icon} text-white`} />
      </motion.div>
      {showText && (
        <span className={`font-bold ${sizes[size].text}`} style={{ color: appearance.primaryColor }}>
          {general.logoText || "Faith Community"}
        </span>
      )}
    </Link>
  )
}

