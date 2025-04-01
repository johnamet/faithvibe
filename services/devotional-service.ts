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
  limit,
  serverTimestamp,
} from "firebase/firestore"

export interface Devotional {
  id?: string
  title: string
  verse: string
  verseText: string
  content: string
  author: {
    id: string
    name: string
    image?: string
  }
  date?: any
  likes?: number
  comments?: number
  category?: string
  status?: "draft" | "published" | "scheduled"
}

const COLLECTION = "devotionals"

export async function getAllAdminDevotionals() {
  const q = query(collection(db, COLLECTION), orderBy("date", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Devotional[]
}

export async function getAllDevotionals() {
  const q = query(collection(db, COLLECTION), where("status", "==", "published"), orderBy("date", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Devotional[]
}

export async function getDevotionalById(id: string) {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Devotional
  } else {
    throw new Error("Devotional not found")
  }
}

export async function getDevotionalsByCategory(category: string) {
  const q = query(
    collection(db, COLLECTION),
    where("status", "==", "published"),
    where("category", "==", category),
    orderBy("date", "desc"),
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Devotional[]
}

export async function getLatestDevotional() {
  const q = query(collection(db, COLLECTION), where("status", "==", "published"), orderBy("date", "desc"), limit(1))

  const querySnapshot = await getDocs(q)
  if (querySnapshot.docs.length > 0) {
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Devotional
  }

  return null
}

export async function createDevotional(devotional: Devotional) {
  return await addDoc(collection(db, COLLECTION), {
    ...devotional,
    date: serverTimestamp(),
    likes: 0,
    comments: 0,
  })
}

export async function updateDevotional(id: string, devotional: Partial<Devotional>) {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, devotional)
}

export async function deleteDevotional(id: string) {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}

export async function likeDevotional(id: string) {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const currentLikes = docSnap.data().likes || 0
    await updateDoc(docRef, { likes: currentLikes + 1 })
  }
}

