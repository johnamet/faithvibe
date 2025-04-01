import { db, storage } from "@/app/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

// Generic function to get a document by ID
export async function getDocumentById(collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  }

  return null
}

// Generic function to get all documents from a collection
export async function getAllDocuments(collectionName: string) {
  const querySnapshot = await getDocs(collection(db, collectionName))
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Generic function to create a document
export async function createDocument(collectionName: string, data: any) {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

// Generic function to update a document
export async function updateDocument(collectionName: string, id: string, data: any) {
  const docRef = doc(db, collectionName, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })

  return true
}

// Generic function to delete a document
export async function deleteDocument(collectionName: string, id: string) {
  const docRef = doc(db, collectionName, id)
  await deleteDoc(docRef)

  return true
}

// Function to upload a file to Firebase Storage
export async function uploadFile(file: File, path: string) {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)

  return downloadURL
}

// Function to delete a file from Firebase Storage
export async function deleteFile(path: string) {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)

  return true
}

// Function to query documents with filters
export async function queryDocuments(
  collectionName: string,
  filters: Array<{ field: string; operator: string; value: any }>,
  sortField?: string,
  sortDirection?: "asc" | "desc",
  limitCount?: number,
) {
  let q = collection(db, collectionName)

  // Apply filters
  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      q = query(q, where(filter.field, filter.operator as any, filter.value))
    })
  }

  // Apply sorting
  if (sortField) {
    q = query(q, orderBy(sortField, sortDirection || "asc"))
  }

  // Apply limit
  if (limitCount) {
    q = query(q, limit(limitCount))
  }

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

