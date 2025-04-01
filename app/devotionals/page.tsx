"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, Calendar, Heart, MessageSquare, Search, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Devotional, getAllDevotionals, getDevotionalsByCategory } from "@/services/devotional-service" // Adjust the import path as needed

const categories = ["All", "Peace", "Faith", "Love", "Gratitude", "Hope", "Prayer"]

export default function DevotionalsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [devotionals, setDevotionals] = useState<Devotional[]>([]) // State for fetched devotionals
  const [filteredDevotionals, setFilteredDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true) // Loading state

  // Fetch devotionals from Firebase on mount and when activeTab changes
  useEffect(() => {
    const fetchDevotionals = async () => {
      try {
        setLoading(true)
        let data:Array<Devotional> = []
        if (activeTab.toLowerCase() === "all") {
          data = await getAllDevotionals() // Fetch all published devotionals
        } else {
          data = await getDevotionalsByCategory(activeTab) // Fetch by category
        }
        setDevotionals(data)
        setFilteredDevotionals(data) // Initially set filtered to all fetched data
      } catch (error) {
        console.error("Error fetching devotionals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDevotionals()
  }, [activeTab])

  // Filter devotionals based on search query
  useEffect(() => {
    let filtered = [...devotionals]

    if (searchQuery) {
      filtered = filtered.filter(
        (dev) =>
          dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dev.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dev.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dev.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredDevotionals(filtered)
  }, [searchQuery, devotionals])

  if (loading) {
    return (
      <div className="container px-4 py-12 md:py-16 text-center">
        <p>Loading devotionals...</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">Daily Devotionals</h1>
        <p className="text-muted-foreground max-w-[700px] mb-8">
          Find inspiration, guidance, and spiritual nourishment through our collection of devotionals.
        </p>
        <div className="w-full max-w-md relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search devotionals..."
            className="pl-10 border-amber-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-full max-w-3xl" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 md:grid-cols-7 h-auto">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDevotionals.length > 0 ? (
          filteredDevotionals.map((devotional, index) => (
            <motion.div
              key={devotional.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-amber-100 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-white pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={devotional.author.image || "/placeholder-user.jpg"} alt={devotional.author.name} />
                      <AvatarFallback>
                        {devotional.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{devotional.author.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(devotional.date?.toDate()).toLocaleDateString()} {/* Convert Firestore timestamp */}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-primary">{devotional.title}</CardTitle>
                  <CardDescription className="font-medium text-amber-700">{devotional.verse}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <blockquote className="border-l-4 border-primary/30 pl-4 italic mb-4 text-muted-foreground text-sm">
                    "{devotional.verseText}"
                  </blockquote>
                  <p className="text-muted-foreground text-sm line-clamp-3">{devotional.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-amber-100 pt-4">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{devotional.likes || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground" asChild>
                      <Link href={`/devotionals/${devotional.id}#comments`}>
                        <MessageSquare className="h-4 w-4" />
                        <span>{devotional.comments || 0}</span>
                      </Link>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No devotionals found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-12">
        <Button className="bg-primary hover:bg-primary/90 text-white">Load More</Button>
      </div>
    </div>
  )
}