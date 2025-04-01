import * as z from "zod"
import type { Event } from "@/services/event-service"
import type { Product } from "@/services/product-service"

// Event validation schema
export const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" }),
  time: z.string().regex(/^\d{2}:\d{2}$/, { message: "Time must be in HH:MM format" }),
  location: z.string().min(3, { message: "Location is required" }).max(200),
  image: z.string().url({ message: "Image must be a valid URL" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  registrationOpen: z.boolean(),
  featured: z.boolean().optional(),
  capacity: z.number().int().positive({ message: "Capacity must be a positive number" }),
  registrations: z.number().int().min(0).optional(),
  status: z.enum(["upcoming", "completed", "cancelled"]).default("upcoming"),
})

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(100),
  price: z.number().positive({ message: "Price must be greater than 0" }),
  originalPrice: z.number().positive().optional(),
  image: z.string().url({ message: "Image must be a valid URL" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  sale: z.boolean().optional(),
  featured: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
})

/**
 * Validate an event object
 * @param event The event to validate
 * @returns Validated event or throws error
 */
export function validateEvent(event: Partial<Event>): Event {
  return eventSchema.parse(event) as Event
}

/**
 * Validate a product object
 * @param product The product to validate
 * @returns Validated product or throws error
 */
export function validateProduct(product: Partial<Product>): Product {
  return productSchema.parse(product) as Product
}

/**
 * Safe validation that returns errors instead of throwing
 * @param schema The zod schema to validate against
 * @param data The data to validate
 * @returns Object with success flag and either validated data or errors
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: boolean; data?: T; errors?: z.ZodError } {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

