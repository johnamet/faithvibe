"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Event, getUpcomingEvents } from "@/services/event-service" // Adjust path

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getUpcomingEvents(3) // Limit to 3 events
        setEvents(data)
      } catch (error) {
        console.error("Error fetching upcoming events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  if (loading) return <p>Loading events...</p>
  if (!events.length) return <p>No upcoming events available.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onHoverStart={() => setHoveredEvent(event.id)}
          onHoverEnd={() => setHoveredEvent(null)}
        >
          <Card
            className={`overflow-hidden h-full flex flex-col border-amber-100 ${
              event.featured ? "ring-2 ring-primary/20" : ""
            }`}
          >
            <div className="relative">
              {event.featured && (
                <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary/90 z-10">Featured</Badge>
              )}
              <div className="overflow-hidden h-48 relative">
                <Image
                  src={event.image || "/placeholder.svg?height=400&width=600"}
                  alt={event.title}
                  fill
                  className={`object-cover transition-transform duration-500 ${
                    hoveredEvent === event.id ? "scale-110" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute bottom-2 left-2 bg-black/60 hover:bg-black/70">{event.category}</Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-primary line-clamp-2">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 flex-grow">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                <Link href={`/events/${event.id}`}>{event.registrationOpen ? "Register Now" : "View Details"}</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}