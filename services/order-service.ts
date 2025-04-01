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
  limit,
} from "firebase/firestore"

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id?: string
  userId: string
  userEmail: string
  userName: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  paymentMethod: string
  paymentId?: string
  notes?: string
  createdAt?: any
  updatedAt?: any
}

const COLLECTION = "orders"

export async function getAllOrders() {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[]
}

export async function getOrderById(id: string) {
  const docRef = doc(db, COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Order
  } else {
    throw new Error("Order not found")
  }
}

export async function getOrdersByUser(userId: string) {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId), orderBy("createdAt", "desc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[]
}

export async function getRecentOrders(limitCount = 10) {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"), limit(limitCount))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[]
}

export async function createOrder(order: Order) {
  return await addDoc(collection(db, COLLECTION), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateOrder(id: string, order: Partial<Order>) {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    ...order,
    updatedAt: serverTimestamp(),
  })
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const docRef = doc(db, COLLECTION, id)
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteOrder(id: string) {
  const docRef = doc(db, COLLECTION, id)
  await deleteDoc(docRef)
}

