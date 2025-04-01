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

export interface Product {
  id?: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  sale?: boolean
  featured?: boolean
  stock?: number
  createdAt?: any
  updatedAt?: any
}

const COLLECTION = "products"

export async function getAllProducts() {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]
}

export async function getProductById(id: string) {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product
  } else {
    throw new Error("Product not found")
  }
}

export async function getProductsByCategory(category: string) {
  const q = query(collection(db, COLLECTION), where("category", "==", category), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]
}

export async function getFeaturedProducts(limit = 4) {
  const q = query(collection(db, COLLECTION), where("featured", "==", true), orderBy("createdAt", "desc"), limit(limit))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[]
}

export async function createProduct(product: Product) {
  return await addDoc(collection(db, COLLECTION), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...product,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id: string) {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}

