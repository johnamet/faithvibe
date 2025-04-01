"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllPrayerRequests, createPrayerRequest, prayForRequest } from "@/services/prayer-service" // Adjust path

export default function PrayerRequestsPage() {
  const [name, setName] = useState("")
  const [request, setRequest] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [prayedFor, setPrayedFor] = useState<string[]>([])
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]) // State for fetched requests
  const [loading, setLoading] = useState(true) // Loading state

  // Fetch prayer requests from Firebase on mount
  useEffect(() => {
    const fetchPrayerRequests = async () => {
      try {
        setLoading(true)
        const data = await getAllPrayerRequests() // Fetch active prayer requests
        setPrayerRequests(data)
      } catch (error) {
        console.error("Error fetching prayer requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrayerRequests()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create new prayer request in Firebase
      await createPrayerRequest({
        name: isAnonymous ? "Anonymous" : name,
        request,
        isAnonymous,
        userId: "current-user-id", // Replace with actual user ID from auth
      })

      // Fetch updated list of prayer requests
      const updatedRequests = await getAllPrayerRequests()
      setPrayerRequests(updatedRequests)

      setIsSubmitted(true)
      setName("")
      setRequest("")
      setIsAnonymous(false)

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (error) {
      console.error("Error submitting prayer request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrayClick = async (id: string) => {
    const hasPrayed = prayedFor.includes(id)

    try {
      if (!hasPrayed) {
        // Update prayer count in Firebase
        await prayForRequest(id)

        // Update local state
        setPrayerRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, prayerCount: (req.prayerCount || 0) + 1 } : req
          )
        )
        setPrayedFor([...prayedFor, id])
      } else {
        // Optional: If you want to allow "unpraying", you'd need a corresponding Firebase function
        setPrayedFor(prayedFor.filter((item) => item !== id))
      }
    } catch (error) {
      console.error("Error updating prayer count:", error)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-12 md:py-16 text-center">
        <p>Loading prayer requests...</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">Prayer Requests</h1>
        <p className="text-muted-foreground max-w-[700px] mb-8">
          Share your prayer needs with our community and join us in praying for others.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div>
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="text-primary">Submit a Prayer Request</CardTitle>
              <CardDescription>Your request will be shared with our prayer team and community.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isAnonymous || isSubmitting}
                    className="border-amber-200"
                    required={!isAnonymous}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="request">Prayer Request</Label>
                  <Textarea
                    id="request"
                    placeholder="Share your prayer need..."
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    disabled={isSubmitting}
                    className="min-h-[120px] border-amber-200"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="anonymous" className="text-sm font-normal">
                    Submit anonymously
                  </Label>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || (!name && !isAnonymous) || !request}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Prayer Request
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-center"
              >
                Thank you for sharing your prayer request. Our community will be praying for you.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <Tabs defaultValue="community" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger
                value="community"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Community Prayers
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Prayer Resources
              </TabsTrigger>
            </TabsList>
            <TabsContent value="community" className="space-y-4">
              {prayerRequests.length > 0 ? (
                prayerRequests.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="border-amber-100">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {item.isAnonymous ? (
                              <AvatarFallback>A</AvatarFallback>
                            ) : (
                              <>
                                <AvatarImage src={item.avatar || "/placeholder-user.jpg"} alt={item.name} />
                                <AvatarFallback>
                                  {item.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{item.name}</CardTitle>
                            <CardDescription>
                              {item.date ? new Date(item.date.toDate()).toLocaleDateString() : "N/A"}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-muted-foreground">{item.request}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-muted-foreground"
                          onClick={() => handlePrayClick(item.id!)}
                        >
                          <Heart
                            className={`h-4 w-4 ${prayedFor.includes(item.id!) ? "fill-red-500 text-red-500" : ""}`}
                          />
                          <span>
                            {prayedFor.includes(item.id!)
                              ? `You and ${item.prayerCount} others prayed`
                              : `${item.prayerCount || 0} people prayed`}
                          </span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground text-center">No active prayer requests at this time.</p>
              )}
            </TabsContent>
            <TabsContent value="resources">
              <Card className="border-amber-100">
                <CardHeader>
                  <CardTitle className="text-primary">Prayer Resources</CardTitle>
                  <CardDescription>Guides and resources to enhance your prayer life</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Prayer Guides</h3>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Guide to Intercessory Prayer</li>
                      <li>Praying Scripture</li>
                      <li>Prayer Journal Templates</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Weekly Prayer Focus</h3>
                    <p className="text-muted-foreground">
                      This week we're focusing our prayers on families in our community facing challenges.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Prayer Times</h3>
                    <p className="text-muted-foreground">
                      Join our prayer team every Wednesday at 7:00 PM for corporate prayer.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90">Download Prayer Guide</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Define the PrayerRequest interface within the file for clarity
interface PrayerRequest {
  id?: string
  name: string
  request: string
  date?: any
  prayerCount?: number
  isAnonymous: boolean
  userId?: string
  avatar?: string
  status?: "active" | "archived"
}