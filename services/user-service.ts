import { db } from "@/app/firebase"
import { collection, doc, getDoc, getDocs, query, where, updateDoc, setDoc, serverTimestamp } from "firebase/firestore"

export interface UserData {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt?: any
  lastSignInTime?: any
  phoneNumber?: string
}

export interface UserRole {
  isAdmin: boolean
  permissions?: string[]
}

// Create or update user data in Firestore
export async function createOrUpdateUser(userData: UserData) {
  const userRef = doc(db, "users", userData.uid)

  // Check if user exists
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    // Update existing user
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    })
  } else {
    // Create new user
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

// Get user data from Firestore
export async function getUserData(uid: string) {
  const userRef = doc(db, "users", uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data() as UserData
  }

  return null
}

// Get user roles from Firestore
export async function getUserRoles(uid: string) {
  const userRolesRef = doc(db, "userRoles", uid)
  const userRolesSnap = await getDoc(userRolesRef)

  if (userRolesSnap.exists()) {
    return userRolesSnap.data() as UserRole
  }

  return { isAdmin: false }
}

// Set user roles in Firestore
export async function setUserRoles(uid: string, roles: UserRole) {
  const userRolesRef = doc(db, "userRoles", uid)
  await setDoc(userRolesRef, roles)
}

// Get all users with admin role
export async function getAdminUsers() {
  const userRolesQuery = query(collection(db, "userRoles"), where("isAdmin", "==", true))
  const userRolesSnap = await getDocs(userRolesQuery)

  const adminUserIds = userRolesSnap.docs.map((doc) => doc.id)
  const adminUsers: (UserData & { roles: UserRole })[] = []

  for (const uid of adminUserIds) {
    const userData = await getUserData(uid)
    const userRoles = await getUserRoles(uid)

    if (userData) {
      adminUsers.push({
        ...userData,
        roles: userRoles,
      })
    }
  }

  return adminUsers
}

// Check if a user is an admin
export async function isUserAdmin(uid: string) {
  const userRoles = await getUserRoles(uid)
  return userRoles.isAdmin
}

