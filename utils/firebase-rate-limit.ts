"use client"

import { useState, useEffect } from "react"

// Simple in-memory rate limiting
const rateLimits: Record<string, { count: number; resetTime: number }> = {}

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60000 // 1 minute in milliseconds
const DEFAULT_RATE_LIMIT = 100 // Default operations per minute

const RATE_LIMITS: Record<string, number> = {
  events: 50,
  products: 50,
  users: 30,
  orders: 20,
  eventRegistrations: 30,
  settings: 10,
}

/**
 * Check if an operation is rate limited
 * @param collection The Firestore collection being accessed
 * @param operation The operation type (read, write, etc.)
 * @returns True if the operation should be allowed, false if rate limited
 */
export function checkRateLimit(collection: string, operation: string): boolean {
  const key = `${collection}:${operation}`
  const now = Date.now()

  // Initialize or reset if window has passed
  if (!rateLimits[key] || rateLimits[key].resetTime < now) {
    rateLimits[key] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    }
    return true
  }

  // Increment counter
  rateLimits[key].count++

  // Get the appropriate rate limit
  const limit = RATE_LIMITS[collection] || DEFAULT_RATE_LIMIT

  // Check if over limit
  return rateLimits[key].count <= limit
}

/**
 * React hook for rate limiting Firebase operations
 * @param collection The Firestore collection being accessed
 * @param operation The operation type (read, write, etc.)
 * @returns Object with isLimited flag and remaining operations
 */
export function useRateLimit(collection: string, operation: string) {
  const [state, setState] = useState({
    isLimited: false,
    remaining: RATE_LIMITS[collection] || DEFAULT_RATE_LIMIT,
    resetTime: 0,
  })

  useEffect(() => {
    const key = `${collection}:${operation}`
    const now = Date.now()

    // Initialize if needed
    if (!rateLimits[key]) {
      rateLimits[key] = {
        count: 0,
        resetTime: now + RATE_LIMIT_WINDOW,
      }
    }

    // Update state
    const limit = RATE_LIMITS[collection] || DEFAULT_RATE_LIMIT
    const remaining = Math.max(0, limit - rateLimits[key].count)

    setState({
      isLimited: remaining === 0,
      remaining,
      resetTime: rateLimits[key].resetTime,
    })

    // Set up interval to refresh state
    const interval = setInterval(() => {
      const now = Date.now()

      // Reset if window has passed
      if (rateLimits[key].resetTime < now) {
        rateLimits[key] = {
          count: 0,
          resetTime: now + RATE_LIMIT_WINDOW,
        }
      }

      // Update state
      const remaining = Math.max(0, limit - rateLimits[key].count)

      setState({
        isLimited: remaining === 0,
        remaining,
        resetTime: rateLimits[key].resetTime,
      })
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [collection, operation])

  return state
}

