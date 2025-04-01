"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth"
import { auth, db } from "@/app/firebase"
import { doc, setDoc, onSnapshot } from "firebase/firestore"

interface UserRole {
  isAdmin: boolean
  permissions?: string[]
}

interface AuthUser extends User {
  roles?: UserRole
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  userRoles: UserRole | null
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isAdmin: boolean
  checkIsAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userRoles, setUserRoles] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Listen for auth state changes
  useEffect(() => {
    // Set persistence to LOCAL to maintain the user session
    import("firebase/auth").then(({ setPersistence, browserLocalPersistence }) => {
      setPersistence(auth, browserLocalPersistence)
    })

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Extend the user object with our custom properties
        const extendedUser = user as AuthUser
        setUser(extendedUser)

        // Fetch user roles from Firestore
        const userRolesRef = doc(db, "userRoles", user.uid)
        const unsubscribeRoles = onSnapshot(
          userRolesRef,
          (doc) => {
            if (doc.exists()) {
              const roles = doc.data() as UserRole
              setUserRoles(roles)
              setIsAdmin(roles.isAdmin || false)
              extendedUser.roles = roles
            } else {
              // If no roles document exists, create one with default roles
              const defaultRoles: UserRole = { isAdmin: false }
              setDoc(userRolesRef, defaultRoles)
              setUserRoles(defaultRoles)
              setIsAdmin(false)
              extendedUser.roles = defaultRoles
            }
            setLoading(false)
          },
          (error) => {
            console.error("Error fetching user roles:", error)
            setLoading(false)
          },
        )

        return () => unsubscribeRoles()
      } else {
        setUser(null)
        setUserRoles(null)
        setIsAdmin(false)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName })

      // Create default user roles
      const userRolesRef = doc(db, "userRoles", userCredential.user.uid)
      await setDoc(userRolesRef, { isAdmin: false })
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Check if this is a new user
      const details = getAdditionalUserInfo(result)
      if (details?.isNewUser) {
        // Create default user roles for new Google sign-in users
        const userRolesRef = doc(db, "userRoles", result.user.uid)
        await setDoc(userRolesRef, { isAdmin: false })
      }
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Error resetting password:", error)
      throw error
    }
  }

  const checkIsAdmin = () => {
    return isAdmin
  }

  const value = {
    user,
    loading,
    userRoles,
    signUp,
    signIn,
    signInWithGoogle,
    logOut,
    resetPassword,
    isAdmin,
    checkIsAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

