import { db } from "@/app/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

export interface PrayerRequest {
  id?: string
  name: string
  request: string
  date?: any
  prayerCount?: number
  isAnonymous: boolean
  userId?: string
  avatar?: string
  status?: "active" | "archived"
}

const COLLECTION = "prayerRequests"

export async function getAllPrayerRequests() {
  const q = query(collection(db, COLLECTION), where("status", "==", "active"), orderBy("date", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PrayerRequest[]
}

export async function getPrayerRequestById(id: string) {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as PrayerRequest
  } else {
    throw new Error("Prayer request not found")
  }
}

export async function getUserPrayerRequests(userId: string) {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("date", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PrayerRequest[]
}

export async function createPrayerRequest(prayerRequest: PrayerRequest) {
  return await addDoc(collection(db, COLLECTION), {
    ...prayerRequest,
    date: serverTimestamp(),
    prayerCount: 0,
    status: "active",
  })
}

export async function updatePrayerRequest(id: string, prayerRequest: Partial<PrayerRequest>) {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, prayerRequest)
}

export async function deletePrayerRequest(id: string) {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}

export async function prayForRequest(id: string) {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const currentCount = docSnap.data().prayerCount || 0
    await updateDoc(docRef, { prayerCount: currentCount + 1 })
  }
}

