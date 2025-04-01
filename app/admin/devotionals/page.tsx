"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { type Devotional, getAllDevotionals, deleteDevotional, getAllAdminDevotionals } from "@/services/devotional-service"
import { format } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DevotionalsPage() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [filteredDevotionals, setFilteredDevotionals] = useState<Devotional[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [devotionalToDelete, setDevotionalToDelete] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchDevotionals() {
      try {
        setLoading(true)
        const data = await getAllAdminDevotionals()
        setDevotionals(data)
        setFilteredDevotionals(data)
      } catch (err) {
        console.error("Error fetching devotionals:", err)
        setError("Failed to load devotionals")
      } finally {
        setLoading(false)
      }
    }

    fetchDevotionals()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = devotionals.filter(
        (devotional) =>
          devotional.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          devotional.verse.toLowerCase().includes(searchQuery.toLowerCase()) ||
          devotional.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredDevotionals(filtered)
    } else {
      setFilteredDevotionals(devotionals)
    }
  }, [searchQuery, devotionals])

  const handleDeleteClick = (id: string) => {
    setDevotionalToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!devotionalToDelete) return

    try {
      await deleteDevotional(devotionalToDelete)
      setDevotionals(devotionals.filter((devotional) => devotional.id !== devotionalToDelete))
      setFilteredDevotionals(filteredDevotionals.filter((devotional) => devotional.id !== devotionalToDelete))
      setDeleteDialogOpen(false)
      setDevotionalToDelete(null)
    } catch (err) {
      console.error("Error deleting devotional:", err)
      setError("Failed to delete devotional")
    }
  }

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Devotionals</h1>
          <p className="text-muted-foreground">Manage your daily devotionals and spiritual content</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search devotionals..."
              className="pl-10 border-amber-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/admin/devotionals/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Devotional
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-amber-100">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredDevotionals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Verse</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevotionals.map((devotional) => (
                  <TableRow key={devotional.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="truncate max-w-[200px]">{devotional.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{devotional.verse}</TableCell>
                    <TableCell>{devotional.author.name}</TableCell>
                    <TableCell>
                      {devotional.date && devotional.date.seconds
                        ? format(new Date(devotional.date.seconds * 1000), "MMM d, yyyy")
                        : "No date"}
                    </TableCell>
                    <TableCell>{getStatusBadge(devotional.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/devotionals/edit/${devotional.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(devotional.id!)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              No devotionals found. Try adjusting your search or create a new devotional.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this devotional? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

