"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createOrUpdateUser } from "@/services/user-service"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/app/firebase"

// This component syncs Firebase Auth user data with Firestore
export function AuthSync() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Sync user data with Firestore
      const syncUserData = async () => {
        try {
          // Update user profile data
          await createOrUpdateUser({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || null,
            photoURL: user.photoURL || null,
            phoneNumber: user.phoneNumber || null,
            lastSignInTime: user.metadata.lastSignInTime,
          })

          // Ensure user roles document exists
          const userRolesRef = doc(db, "userRoles", user.uid)
          const userRolesSnap = await getDoc(userRolesRef)

          if (!userRolesSnap.exists()) {
            await setDoc(userRolesRef, { isAdmin: false })
          }
        } catch (error) {
          console.error("Error syncing user data:", error)
        }
      }

      syncUserData()
    }
  }, [user])

  return null
}

