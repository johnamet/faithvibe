"use client"

import { useState, useEffect } from "react"
import { db } from "@/app/firebase"
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  type QueryConstraint,
  type DocumentData,
  type FirestoreError,
} from "firebase/firestore"

interface UseFirebaseCollectionOptions {
  orderByField?: string
  orderDirection?: "asc" | "desc"
  whereConditions?: Array<{
    field: string
    operator: "==" | "!=" | ">" | ">=" | "<" | "<=" | "array-contains" | "in" | "array-contains-any" | "not-in"
    value: any
  }>
  limit?: number
}

export function useFirebaseCollection<T = DocumentData>(
  collectionName: string,
  options: UseFirebaseCollectionOptions = {},
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<FirestoreError | null>(null)

  useEffect(() => {
    setLoading(true)

    const constraints: QueryConstraint[] = []

    if (options.orderByField) {
      constraints.push(orderBy(options.orderByField, options.orderDirection || "desc"))
    }

    if (options.whereConditions && options.whereConditions.length > 0) {
      options.whereConditions.forEach((condition) => {
        constraints.push(where(condition.field, condition.operator, condition.value))
      })
    }

    const q = query(collection(db, collectionName), ...constraints)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[]

        setData(items)
        setLoading(false)
        setError(null)
      },
      (err: FirestoreError) => {
        console.error(`Error fetching ${collectionName}:`, err)
        setError(err)
        setLoading(false)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [collectionName, options])

  return { data, loading, error }
}

