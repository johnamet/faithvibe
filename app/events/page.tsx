"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarIcon, Clock, Filter, MapPin, Search } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

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
    description:
      "Join us for a weekend of spiritual renewal, fellowship, and growth in the beautiful mountains. Activities include worship sessions, small group discussions, hiking, and more.",
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
    description:
      "A life-changing week for youth ages 12-18 with activities, worship, teaching, and adventure. Build lasting friendships and grow in faith.",
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
    description:
      "Serve our local community through various projects including food distribution, park cleanup, and home repairs for seniors.",
  },
  {
    id: "4",
    title: "Women's Bible Study",
    date: "Every Tuesday",
    time: "7:00 PM - 8:30 PM",
    location: "Faith Community Center, Room 201",
    image: "/placeholder.svg?height=400&width=600",
    category: "Bible Study",
    registrationOpen: false,
    description: "Weekly Bible study focusing on women in Scripture and applying biblical principles to daily life.",
  },
  {
    id: "5",
    title: "Men's Breakfast Fellowship",
    date: "First Saturday of each month",
    time: "8:00 AM - 10:00 AM",
    location: "Faith Community Center, Dining Hall",
    image: "/placeholder.svg?height=400&width=600",
    category: "Fellowship",
    registrationOpen: false,
    description:
      "Monthly gathering for men to enjoy breakfast together, hear from guest speakers, and build meaningful relationships.",
  },
  {
    id: "6",
    title: "Family Camp Weekend",
    date: "August 5-7, 2025",
    time: "All Day",
    location: "Pine Valley Campground",
    image: "/placeholder.svg?height=400&width=600",
    category: "Camp",
    registrationOpen: true,
    description:
      "A weekend getaway for the whole family with activities for all ages, worship under the stars, and opportunities to connect with other families.",
  },
]

const categories = ["All", "Retreat", "Camp", "Service", "Bible Study", "Fellowship", "Workshop"]

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date>()
  const [filteredEvents, setFilteredEvents] = useState(events)

  const handleFilter = () => {
    let filtered = events

    // Filter by category
    if (activeTab.toLowerCase() !== "all") {
      filtered = filtered.filter((event) => event.category.toLowerCase() === activeTab.toLowerCase())
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by date (this is simplified - in a real app you'd need more complex date handling)
    if (date) {
      const dateStr = format(date, "MMMM d, yyyy")
      filtered = filtered.filter((event) => event.date.includes(dateStr))
    }

    setFilteredEvents(filtered)
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">Events & Activities</h1>
        <p className="text-muted-foreground max-w-[700px] mb-8">
          Join us for upcoming events, retreats, camps, and activities for all ages.
        </p>

        <div className="w-full max-w-4xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-10 border-amber-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border-amber-200 w-full md:w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Button onClick={handleFilter} className="bg-primary hover:bg-primary/90 w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full max-w-3xl" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-7 h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.toLowerCase()}
                value={category.toLowerCase()}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute bottom-2 left-2 bg-black/60 hover:bg-black/70">{event.category}</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-primary line-clamp-2">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4 flex-grow">
                  <div className="space-y-2 text-sm mb-4">
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
                  <p className="text-muted-foreground text-sm line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href={`/events/${event.id}`}>{event.registrationOpen ? "Register Now" : "View Details"}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No events found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-12">
        <Button className="bg-primary hover:bg-primary/90 text-white">Load More</Button>
      </div>
    </div>
  )
}

