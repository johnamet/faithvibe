"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type Devotional, createDevotional } from "@/services/devotional-service"
import { useAuth } from "@/hooks/use-auth"

export default function NewDevotionalPage() {
  const { user } = useAuth()
  const [devotional, setDevotional] = useState<Devotional>({
    title: "",
    verse: "",
    verseText: "",
    content: "",
    author: {
      id: user?.uid || "",
      name: user?.displayName || "",
    },
    category: "",
    status: "draft",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDevotional((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDevotional((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        [name]: value,
      },
    }))
  }

  const handleStatusChange = (value: string) => {
    setDevotional((prev) => ({
      ...prev,
      status: value as "draft" | "published" | "scheduled",
    }))
  }

  const handleCategoryChange = (value: string) => {
    setDevotional((prev) => ({
      ...prev,
      category: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      await createDevotional(devotional)
      router.push("/admin/devotionals")
    } catch (err) {
      console.error("Error creating devotional:", err)
      setError("Failed to create devotional")
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">New Devotional</h1>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleSubmit} disabled={saving}>
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Devotional
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>Devotional Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={devotional.title}
                  onChange={handleChange}
                  className="border-amber-200"
                  required
                  placeholder="Enter devotional title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verse">Bible Verse Reference</Label>
                <Input
                  id="verse"
                  name="verse"
                  value={devotional.verse}
                  onChange={handleChange}
                  className="border-amber-200"
                  required
                  placeholder="e.g., John 3:16"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verseText">Bible Verse Text</Label>
                <Textarea
                  id="verseText"
                  name="verseText"
                  value={devotional.verseText}
                  onChange={handleChange}
                  className="min-h-[100px] border-amber-200"
                  required
                  placeholder="Enter the full text of the Bible verse"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Devotional Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={devotional.content}
                  onChange={handleChange}
                  className="min-h-[200px] border-amber-200"
                  required
                  placeholder="Write your devotional content here..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle>Devotional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author-name">Author Name</Label>
                <Input
                  id="author-name"
                  name="name"
                  value={devotional.author.name}
                  onChange={handleAuthorChange}
                  className="border-amber-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={devotional.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="border-amber-200">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Faith">Faith</SelectItem>
                    <SelectItem value="Hope">Hope</SelectItem>
                    <SelectItem value="Love">Love</SelectItem>
                    <SelectItem value="Peace">Peace</SelectItem>
                    <SelectItem value="Gratitude">Gratitude</SelectItem>
                    <SelectItem value="Prayer">Prayer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={devotional.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="border-amber-200">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Devotional
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

