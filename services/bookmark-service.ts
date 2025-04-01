// src/firebase/bookmarks.ts
import { db } from "@/app/firebase"
import { collection, addDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp } from "firebase/firestore"

export async function addBookmark(userId: string, devotionalId: string) {
  return await addDoc(collection(db, "bookmarks"), {
    userId,
    devotionalId,
    createdAt: serverTimestamp(),
  })
}

export async function removeBookmark(userId: string, devotionalId: string) {
  const q = query(
    collection(db, "bookmarks"),
    where("userId", "==", userId),
    where("devotionalId", "==", devotionalId)
  )
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach(async (docSnap) => await deleteDoc(doc(db, "bookmarks", docSnap.id)))
}

export async function getUserBookmarks(userId: string): Promise<string[]> {
  const q = query(collection(db, "bookmarks"), where("userId", "==", userId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data().devotionalId)
}