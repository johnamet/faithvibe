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

// This would be fetched from Firebase in a real implementation
const devotionals = [
  {
    id: "1",
    title: "Finding Peace in Troubled Times",
    verse: "John 14:27",
    verseText:
      "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    content:
      "In a world filled with uncertainty and challenges, the promise of peace from Jesus stands as an anchor for our souls. This peace is not dependent on external circumstances but flows from a deep connection with God.",
    author: {
      name: "Pastor David Johnson",
      image: "/placeholder-user.jpg",
    },
    date: "April 1, 2025",
    likes: 124,
    comments: 18,
    category: "Peace",
  },
  {
    id: "2",
    title: "The Power of Gratitude",
    verse: "1 Thessalonians 5:16-18",
    verseText:
      "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
    content:
      "Gratitude has the power to transform our perspective and bring joy even in difficult seasons. When we choose to focus on God's blessings rather than our challenges, we experience His presence in new ways.",
    author: {
      name: "Sarah Williams",
      image: "/placeholder-user.jpg",
    },
    date: "March 28, 2025",
    likes: 98,
    comments: 12,
    category: "Gratitude",
  },
  {
    id: "3",
    title: "Walking in Faith",
    verse: "Hebrews 11:1",
    verseText: "Now faith is confidence in what we hope for and assurance about what we do not see.",
    content:
      "Faith is the foundation of our spiritual journey. It's not just believing that God exists, but trusting Him completely with every aspect of our lives, even when the path ahead is unclear.",
    author: {
      name: "Pastor David Johnson",
      image: "/placeholder-user.jpg",
    },
    date: "March 25, 2025",
    likes: 156,
    comments: 24,
    category: "Faith",
  },
  {
    id: "4",
    title: "The Transforming Power of Love",
    verse: "1 Corinthians 13:4-7",
    verseText:
      "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.",
    content:
      "God's love has the power to transform our hearts and relationships. When we allow His love to flow through us, we become agents of healing and reconciliation in a broken world.",
    author: {
      name: "Michael Chen",
      image: "/placeholder-user.jpg",
    },
    date: "March 22, 2025",
    likes: 112,
    comments: 16,
    category: "Love",
  },
]

const categories = ["All", "Peace", "Faith", "Love", "Gratitude", "Hope", "Prayer"]

export default function DevotionalsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDevotionals, setFilteredDevotionals] = useState(devotionals)

  useEffect(() => {
    let filtered = devotionals

    // Filter by category
    if (activeTab.toLowerCase() !== "all") {
      filtered = filtered.filter((dev) => dev.category.toLowerCase() === activeTab.toLowerCase())
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (dev) =>
          dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dev.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dev.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dev.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredDevotionals(filtered)
  }, [activeTab, searchQuery])

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
                      <AvatarImage src={devotional.author.image} alt={devotional.author.name} />
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
                        {devotional.date}
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
                      <span>{devotional.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground" asChild>
                      <Link href={`/devotionals/${devotional.id}#comments`}>
                        <MessageSquare className="h-4 w-4" />
                        <span>{devotional.comments}</span>
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

