import { db } from "@/app/firebase"
import { collection, doc, serverTimestamp, runTransaction, type FirestoreError } from "firebase/firestore"
import type { Event } from "@/services/event-service"

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

// Create event with transaction for data integrity
export async function createEventWithTransaction(event: Event): Promise<string> {
  try {
    const result = await runTransaction(db, async (transaction) => {
      // Add the event
      const eventRef = doc(collection(db, "events"))

      transaction.set(eventRef, {
        ...event,
        registrations: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      return eventRef.id
    })

    return result
  } catch (error) {
    return handleFirebaseError(error, "create event")
  }
}

// Update event with transaction
export async function updateEventWithTransaction(id: string, event: Partial<Event>): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const eventRef = doc(db, "events", id)

      // Verify the document exists
      const eventDoc = await transaction.get(eventRef)
      if (!eventDoc.exists()) {
        throw new Error("Event does not exist")
      }

      transaction.update(eventRef, {
        ...event,
        updatedAt: serverTimestamp(),
      })
    })
  } catch (error) {
    handleFirebaseError(error, "update event")
  }
}

// Delete event with transaction
export async function deleteEventWithTransaction(id: string): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const eventRef = doc(db, "events", id)

      // Check if the event exists
      const eventDoc = await transaction.get(eventRef)
      if (!eventDoc.exists()) {
        throw new Error("Event does not exist")
      }

      // Check if there are registrations
      const eventData = eventDoc.data() as Event
      if (eventData.registrations && eventData.registrations > 0) {
        // Delete all registrations for this event
        // Note: In a real app, you might want to handle this differently
        const registrationsQuery = collection(db, "eventRegistrations")
        // We can't query in a transaction, so this is a limitation
        // In a real app, you might want to use a Cloud Function for this
      }

      transaction.delete(eventRef)
    })
  } catch (error) {
    handleFirebaseError(error, "delete event")
  }
}

// Register for event with transaction to ensure capacity isn't exceeded
export async function registerForEventWithTransaction(eventId: string, userId: string): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const eventRef = doc(db, "events", eventId)

      // Get the event
      const eventDoc = await transaction.get(eventRef)
      if (!eventDoc.exists()) {
        throw new Error("Event not found")
      }

      const eventData = eventDoc.data() as Event

      // Check capacity
      if (eventData.registrations >= eventData.capacity) {
        throw new Error("Event is at full capacity")
      }

      // Update the event registrations count
      transaction.update(eventRef, {
        registrations: (eventData.registrations || 0) + 1,
      })

      // Add the registration record
      const registrationRef = doc(collection(db, "eventRegistrations"))
      transaction.set(registrationRef, {
        eventId,
        userId,
        registeredAt: serverTimestamp(),
      })
    })
  } catch (error) {
    handleFirebaseError(error, "register for event")
  }
}

