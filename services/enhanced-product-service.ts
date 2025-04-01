import { db } from "@/app/firebase"
import { collection, doc, serverTimestamp, runTransaction, type FirestoreError } from "firebase/firestore"
import type { Product } from "@/services/product-service"

// Error handling utility
const handleFirebaseError = (error: unknown, operation: string): never => {
  const firestoreError = error as FirestoreError
  console.error(`Firebase ${operation} error:`, firestoreError)

  // Customize error message based on error code
  let message = "An unexpected error occurred"

  if (firestoreError.code === "permission-denied") {
    message = "You don't have permission to perform this action"
  } else if (firestoreError.code === "unavailable") {
    message = "The service is currently unavailable. Please try again later"
  } else if (firestoreError.code === "resource-exhausted") {
    message = "You've reached the rate limit. Please try again later"
  }

  throw new Error(`${message} (${firestoreError.code})`)
}

// Create product with transaction
export async function createProductWithTransaction(product: Product): Promise<string> {
  try {
    const result = await runTransaction(db, async (transaction) => {
      // Add the product
      const productRef = doc(collection(db, "products"))

      transaction.set(productRef, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      return productRef.id
    })

    return result
  } catch (error) {
    return handleFirebaseError(error, "create product")
  }
}

// Update product with transaction
export async function updateProductWithTransaction(id: string, product: Partial<Product>): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const productRef = doc(db, "products", id)

      // Verify the document exists
      const productDoc = await transaction.get(productRef)
      if (!productDoc.exists()) {
        throw new Error("Product does not exist")
      }

      transaction.update(productRef, {
        ...product,
        updatedAt: serverTimestamp(),
      })
    })
  } catch (error) {
    handleFirebaseError(error, "update product")
  }
}

// Delete product with transaction
export async function deleteProductWithTransaction(id: string): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const productRef = doc(db, "products", id)

      // Check if the product exists
      const productDoc = await transaction.get(productRef)
      if (!productDoc.exists()) {
        throw new Error("Product does not exist")
      }

      // In a real app, you might want to check if the product is in any orders
      // and handle that appropriately

      transaction.delete(productRef)
    })
  } catch (error) {
    handleFirebaseError(error, "delete product")
  }
}

