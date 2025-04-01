import { db } from "@/app/firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"

// Collection name for site settings
const SETTINGS_COLLECTION = "siteSettings"
const SITE_SETTINGS_DOC_ID = "siteConfig" // Single document for all site settings

// Interface for site settings
export interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    phoneNumber: string
    address: string
    logoText: string
  }
  appearance: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    enableDarkMode: boolean
    customCss: string
  }
  services: {
    sundayService1: string
    sundayService2: string
    wednesdayBible: string
    youthGroup: string
  }
  notifications: {
    enableEmailNotifications: boolean
    enablePrayerAlerts: boolean
    enableEventReminders: boolean
    enableNewDevotionalAlerts: boolean
  }
  moderation: {
    requireApprovalForPrayerRequests: boolean
    requireApprovalForComments: boolean
    enableProfanityFilter: boolean
    restrictedWords: string[]
    autoDeleteReportedContent: boolean
  }
  seo: {
    metaTitle: string
    metaDescription: string
    ogImage: string
    twitterHandle: string
  }
}

// Default settings
export const defaultSettings: SiteSettings = {
  general: {
    siteName: "Faith Community",
    siteDescription:
      "Join our community of faith and discover spiritual growth through worship, fellowship, and service.",
    contactEmail: "contact@faithcommunity.org",
    phoneNumber: "(555) 123-4567",
    address: "123 Faith Street, Cityville, ST 12345",
    logoText: "Faith Community",
  },
  appearance: {
    primaryColor: "#f59e0b", // amber-500
    secondaryColor: "#1e40af", // blue-800
    accentColor: "#10b981", // emerald-500
    fontFamily: "Inter, sans-serif",
    enableDarkMode: true,
    customCss: "",
  },
  services: {
    sundayService1: "9:00 AM",
    sundayService2: "11:00 AM",
    wednesdayBible: "7:00 PM",
    youthGroup: "Fridays at 6:30 PM",
  },
  notifications: {
    enableEmailNotifications: true,
    enablePrayerAlerts: true,
    enableEventReminders: true,
    enableNewDevotionalAlerts: true,
  },
  moderation: {
    requireApprovalForPrayerRequests: true,
    requireApprovalForComments: true,
    enableProfanityFilter: true,
    restrictedWords: ["inappropriate", "offensive"],
    autoDeleteReportedContent: false,
  },
  seo: {
    metaTitle: "Faith Community - Find Peace and Purpose",
    metaDescription:
      "Join our community of faith and discover spiritual growth through worship, fellowship, and service.",
    ogImage: "/images/og-image.jpg",
    twitterHandle: "@faithcommunity",
  },
}

// Get all site settings
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings
    } else {
      // If no settings exist, create default settings
      await setDoc(docRef, defaultSettings)
      return defaultSettings
    }
  } catch (error) {
    console.error("Error getting site settings:", error)
    return defaultSettings
  }
}

// Update site settings
export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID)
    await updateDoc(docRef, settings)
    return true
  } catch (error) {
    console.error("Error updating site settings:", error)
    return false
  }
}

// Update a specific section of site settings
export async function updateSettingsSection<K extends keyof SiteSettings>(
  section: K,
  data: Partial<SiteSettings[K]>,
): Promise<boolean> {
  try {
    const currentSettings = await getSiteSettings()
    const updatedSection = {
      ...currentSettings[section],
      ...data,
    }

    const docRef = doc(db, SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID)
    await updateDoc(docRef, { [section]: updatedSection })
    return true
  } catch (error) {
    console.error(`Error updating ${String(section)} settings:`, error)
    return false
  }
}

