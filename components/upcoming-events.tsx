"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

// This would be fetched from Firebase in a real implementation
const events = [
  {
    id: "1",
    title: "Summer Spiritual Retreat",
    date: "June 15-18, 2025",
    time: "All Day",
    location: "Mountain View Retreat Center",
    image: "/placeholder.svg?height=400&width=600",
    category: "Retreat",
    registrationOpen: true,
  },
  {
    id: "2",
    title: "Youth Camp Registration",
    date: "July 10-15, 2025",
    time: "All Day",
    location: "Lakeside Camp Grounds",
    image: "/placeholder.svg?height=400&width=600",
    category: "Camp",
    registrationOpen: true,
    featured: true,
  },
  {
    id: "3",
    title: "Community Service Day",
    date: "May 8, 2025",
    time: "9:00 AM - 3:00 PM",
    location: "Downtown Community Center",
    image: "/placeholder.svg?height=400&width=600",
    category: "Service",
    registrationOpen: true,
  },
]

export default function UpcomingEvents() {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

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
                  src={event.image || "/placeholder.svg"}
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

