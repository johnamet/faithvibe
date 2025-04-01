"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bookmark, Heart, MessageSquare, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Devotional, getLatestDevotional, likeDevotional } from "@/services/devotional-service" // Adjust path
// Assume a bookmark function exists or create one
import { addBookmark, removeBookmark, getUserBookmarks } from "@/services/bookmark-service" // Hypothetical
import {getAuth} from "firebase/auth"

export default function DevotionalPreview() {
  const [devotional, setDevotional] = useState<Devotional|null>(null)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const auth = getAuth()
  const userId = auth.currentUser?.uid || "guest"

  useEffect(() => {
    const fetchDevotional = async () => {
      try {
        const data = await getLatestDevotional()
        if (data) {
          setDevotional(data)
          setLikeCount(data.likes || 0)

          // Check if user has bookmarked this devotional (hypothetical)
          const bookmarks = await getUserBookmarks(userId)
          setBookmarked(bookmarks?.includes(data.id))
        }
      } catch (error) {
        console.error("Error fetching latest devotional:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDevotional()
  }, [userId])

  const handleLike = async () => {
    if (!devotional) return
    try {
      if (!liked) {
        await likeDevotional(devotional.id)
        setLikeCount((prev) => prev + 1)
        setLiked(true)
      }
      // Note: No unlike functionality in current Firebase setup; add if needed
    } catch (error) {
      console.error("Error liking devotional:", error)
    }
  }

  const handleBookmark = async () => {
    if (!devotional) return
    try {
      if (bookmarked) {
        await removeBookmark(userId, devotional.id)
        setBookmarked(false)
      } else {
        await addBookmark(userId, devotional.id)
        setBookmarked(true)
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  if (loading) return <p>Loading devotional...</p>
  if (!devotional) return <p>No devotional available.</p>

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-amber-100 shadow-md hover:shadow-lg transition-shadow">
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
              <p className="text-xs text-muted-foreground">
                {new Date(devotional.date.toDate()).toLocaleDateString()}
              </p>
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
                <span>{devotional.comments || 0}</span>
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