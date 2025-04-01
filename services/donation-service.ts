// src/firebase/donations.ts
import { db } from "@/app/firebase"
import { collection, getDocs, query } from "firebase/firestore"

export interface DonationProgressData {
  goal: number
  current: number
  lastUpdated: any
}

const COLLECTION = "donationProgress"

export async function getDonationProgress(): Promise<DonationProgressData> {
  const q = query(collection(db, COLLECTION))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.docs.length > 0) {
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as DonationProgressData
  }
  return { goal: 10000, current: 0, lastUpdated: null } // Default if no data
}