"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Calendar, ChevronLeft, Upload } from "lucide-react"
import type { Event } from "@/services/event-service"
import { updateEventWithTransaction } from "@/services/enhanced-event-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format, parse } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { uploadFile } from "@/services/firebase-service"
import { useFirebaseDocument } from "@/hooks/use-firebase-document"
import { useToast } from "@/hooks/use-toast"

const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  date: z.date({ required_error: "Event date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  location: z.string().min(3, { message: "Location is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1" }),
  registrationOpen: z.boolean().default(true),
  featured: z.boolean().default(false),
  status: z.enum(["upcoming", "completed", "cancelled"]).default("upcoming"),
})

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Use the real-time hook to get the event
  const {
    data: currentEvent,
    loading: fetchLoading,
    error: fetchError,
  } = useFirebaseDocument<Event>("events", params.id)

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      location: "",
      category: "",
      description: "",
      capacity: 50,
      registrationOpen: true,
      featured: false,
      status: "upcoming",
    },
  })

  // Update form when event data changes
  useEffect(() => {
    if (currentEvent) {
      try {
        // Parse the date string to Date object
        const parsedDate = parse(currentEvent.date, "yyyy-MM-dd", new Date())

        // Set form values
        form.reset({
          title: currentEvent.title,
          date: parsedDate,
          time: currentEvent.time,
          location: currentEvent.location,
          category: currentEvent.category,
          description: currentEvent.description,
          capacity: currentEvent.capacity,
          registrationOpen: currentEvent.registrationOpen,
          featured: currentEvent.featured || false,
          status: currentEvent.status || "upcoming",
        })

        // Set image preview
        if (currentEvent.image && currentEvent.image !== "/placeholder.svg") {
          setImagePreview(currentEvent.image)
        }
      } catch (err) {
        console.error("Error setting form values:", err)
        toast({
          title: "Error",
          description: "Failed to load event details properly",
          variant: "destructive",
        })
      }
    }
  }, [currentEvent, form, toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    if (!currentEvent) return

    try {
      setLoading(true)

      let imageUrl = currentEvent.image

      // Upload new image if selected
      if (imageFile) {
        const path = `events/${Date.now()}_${imageFile.name}`
        imageUrl = await uploadFile(imageFile, path)
      }

      // Format date as string
      const formattedDate = format(values.date, "yyyy-MM-dd")

      const updatedEvent: Partial<Event> = {
        ...values,
        date: formattedDate,
        image: imageUrl,
      }

      // Use the enhanced transaction-based update
      await updateEventWithTransaction(params.id, updatedEvent)

      toast({
        title: "Event updated",
        description: "The event has been successfully updated.",
        variant: "default",
      })

      router.push("/admin/events")
    } catch (err) {
      console.error("Error updating event:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update event",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          {fetchError instanceof Error ? fetchError.message : "Failed to load event details"}
        </AlertDescription>
      </Alert>
    )
  }

  if (!currentEvent) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>Event not found</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" onClick={() => router.push("/admin/events")}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-primary">Edit Event</h1>
      </div>

      <Card className="border-amber-100">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="worship">Worship Service</SelectItem>
                          <SelectItem value="bible-study">Bible Study</SelectItem>
                          <SelectItem value="youth">Youth Event</SelectItem>
                          <SelectItem value="outreach">Outreach</SelectItem>
                          <SelectItem value="fellowship">Fellowship</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>Maximum number of attendees</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-1 md:col-span-2">
                  <FormLabel className="block mb-2">Event Image</FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="border border-input rounded-md p-2 flex-1">
                      <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {imageFile ? imageFile.name : "Upload new image (optional)"}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="h-20 w-20 relative rounded-md overflow-hidden">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter event description" className="min-h-32" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="registrationOpen"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Registration Open</FormLabel>
                          <FormDescription>Allow users to register for this event</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Featured Event</FormLabel>
                          <FormDescription>Display this event on the homepage</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Event"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

