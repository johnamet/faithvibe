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

export interface Event {
  id?: string
  title: string
  date: string
  time: string
  location: string
  image: string
  category: string
  description: string
  registrationOpen: boolean
  featured?: boolean
  capacity: number
  registrations?: number
  status?: "upcoming" | "completed" | "cancelled"
  createdAt?: any
  updatedAt?: any
}

const COLLECTION = "events"

export async function getAllEvents() {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[]
}

export async function getEventById(id: string) {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Event
  } else {
    throw new Error("Event not found")
  }
}

export async function getEventsByCategory(category: string) {
  const q = query(collection(db, COLLECTION), where("category", "==", category), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[]
}

export async function getUpcomingEvents(limit = 3) {
  const q = query(collection(db, COLLECTION), where("status", "==", "upcoming"), orderBy("date", "asc"), limit(limit))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Event[]
}

export async function createEvent(event: Event) {
  return await addDoc(collection(db, COLLECTION), {
    ...event,
    registrations: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateEvent(id: string, event: Partial<Event>) {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...event,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteEvent(id: string) {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}

export async function registerForEvent(eventId: string, userId: string) {
  // First, get the event to check capacity
  const eventRef = doc(db, COLLECTION, eventId)
  const eventSnap = await getDoc(eventRef)

  if (!eventSnap.exists()) {
    throw new Error("Event not found")
  }

  const eventData = eventSnap.data() as Event

  if (eventData.registrations >= eventData.capacity) {
    throw new Error("Event is at full capacity")
  }

  // Update the event registrations count
  await updateDoc(eventRef, {
    registrations: (eventData.registrations || 0) + 1,
  })

  // Add the registration record
  await addDoc(collection(db, "eventRegistrations"), {
    eventId,
    userId,
    registeredAt: serverTimestamp(),
  })
}

