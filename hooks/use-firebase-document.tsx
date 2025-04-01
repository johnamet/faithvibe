"use client"

import { useState, useEffect } from "react"
import { db } from "@/app/firebase"
import { doc, onSnapshot, type DocumentData, type FirestoreError } from "firebase/firestore"

export function useFirebaseDocument<T = DocumentData>(collectionName: string, documentId: string | undefined) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<FirestoreError | null>(null)

  useEffect(() => {
    if (!documentId) {
      setLoading(false)
      return () => {}
    }

    setLoading(true)

    const unsubscribe = onSnapshot(
      doc(db, collectionName, documentId),
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T)
        } else {
          setData(null)
        }
        setLoading(false)
        setError(null)
      },
      (err: FirestoreError) => {
        console.error(`Error fetching document ${documentId} from ${collectionName}:`, err)
        setError(err)
        setLoading(false)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [collectionName, documentId])

  return { data, loading, error }
}

