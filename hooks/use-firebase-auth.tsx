"use client"

import { useState, useEffect } from "react"
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/app/firebase"

export function useFirebaseAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userRoles, setUserRoles] = useState({ isAdmin: false })

  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setLoading(true)

      if (authUser) {
        setUser(authUser)

        // Fetch user roles
        const userRolesRef = doc(db, "userRoles", authUser.uid)
        const unsubscribeRoles = onSnapshot(
          userRolesRef,
          (doc) => {
            if (doc.exists()) {
              setUserRoles(doc.data())
            } else {
              // Create default roles if none exist
              setDoc(userRolesRef, { isAdmin: false })
              setUserRoles({ isAdmin: false })
            }
            setLoading(false)
          },
          (error) => {
            console.error("Error fetching user roles:", error)
            setError(error)
            setLoading(false)
          },
        )

        return () => unsubscribeRoles()
      } else {
        setUser(null)
        setUserRoles({ isAdmin: false })
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [auth])

  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      setError(error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      setError(error)
      throw error
    }
  }

  const signUp = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })

      // Create default user roles
      const userRolesRef = doc(db, "userRoles", result.user.uid)
      await setDoc(userRolesRef, { isAdmin: false })

      return result.user
    } catch (error) {
      setError(error)
      throw error
    }
  }

  const logOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      setError(error)
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      setError(error)
      throw error
    }
  }

  return {
    user,
    loading,
    error,
    userRoles,
    isAdmin: userRoles.isAdmin,
    signIn,
    signInWithGoogle,
    signUp,
    logOut,
    resetPassword,
  }
}

