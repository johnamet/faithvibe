"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bookmark, Heart, MessageSquare, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

// This would be fetched from Firebase in a real implementation
const devotional = {
  id: "1",
  title: "Finding Peace in Troubled Times",
  verse: "John 14:27",
  verseText:
    "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
  content:
    "In a world filled with uncertainty and challenges, the promise of peace from Jesus stands as an anchor for our souls. This peace is not dependent on external circumstances but flows from a deep connection with God. When we align our hearts with His truth and presence, we can experience tranquility even amid life's storms. Today, take a moment to quiet your mind, release your worries to God, and receive the peace that surpasses all understanding.",
  author: {
    name: "Pastor David Johnson",
    image: "/placeholder-user.jpg",
  },
  date: "April 1, 2025",
  likes: 124,
  comments: 18,
}

export default function DevotionalPreview() {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(devotional.likes)

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setLiked(!liked)
    // In a real implementation, this would update Firebase
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    // In a real implementation, this would update Firebase
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-amber-100 shadow-md hover:shadow-lg transition-shadow">
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
              <p className="text-xs text-muted-foreground">{devotional.date}</p>
            </div>
          </div>
          <CardTitle className="text-xl md:text-2xl text-primary">{devotional.title}</CardTitle>
          <CardDescription className="font-medium text-amber-700">{devotional.verse}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <blockquote className="border-l-4 border-primary/30 pl-4 italic mb-4 text-muted-foreground">
            "{devotional.verseText}"
          </blockquote>
          <p className="text-muted-foreground">{devotional.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-amber-100 pt-4">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-muted-foreground"
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground" asChild>
              <Link href={`/devotionals/${devotional.id}#comments`}>
                <MessageSquare className="h-4 w-4" />
                <span>{devotional.comments}</span>
              </Link>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={handleBookmark}>
              <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-primary text-primary" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

