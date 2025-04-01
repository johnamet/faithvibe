"use client"

import { useState, useEffect } from "react"
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
import { Archive, Eye, MessageSquare, MoreHorizontal, Search, Trash2 } from "lucide-react"
import {
  type PrayerRequest,
  getAllPrayerRequests,
  updatePrayerRequest,
  deletePrayerRequest,
} from "@/services/prayer-service"
import { format } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PrayerRequestsPage() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<PrayerRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null)

  useEffect(() => {
    async function fetchPrayerRequests() {
      try {
        setLoading(true)
        const data = await getAllPrayerRequests()
        setPrayerRequests(data)
        setFilteredRequests(data)
      } catch (err) {
        console.error("Error fetching prayer requests:", err)
        setError("Failed to load prayer requests")
      } finally {
        setLoading(false)
      }
    }

    fetchPrayerRequests()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = prayerRequests.filter(
        (request) =>
          request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.request.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredRequests(filtered)
    } else {
      setFilteredRequests(prayerRequests)
    }
  }, [searchQuery, prayerRequests])

  const handleViewClick = (request: PrayerRequest) => {
    setSelectedRequest(request)
    setViewDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setRequestToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleArchiveClick = async (id: string) => {
    try {
      await updatePrayerRequest(id, { status: "archived" })
      setPrayerRequests(
        prayerRequests.map((request) => (request.id === id ? { ...request, status: "archived" } : request)),
      )
      setFilteredRequests(
        filteredRequests.map((request) => (request.id === id ? { ...request, status: "archived" } : request)),
      )
    } catch (err) {
      console.error("Error archiving prayer request:", err)
      setError("Failed to archive prayer request")
    }
  }

  const confirmDelete = async () => {
    if (!requestToDelete) return

    try {
      await deletePrayerRequest(requestToDelete)
      setPrayerRequests(prayerRequests.filter((request) => request.id !== requestToDelete))
      setFilteredRequests(filteredRequests.filter((request) => request.id !== requestToDelete))
      setDeleteDialogOpen(false)
      setRequestToDelete(null)
    } catch (err) {
      console.error("Error deleting prayer request:", err)
      setError("Failed to delete prayer request")
    }
  }

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "archived":
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge className="bg-green-500">Active</Badge>
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Prayer Requests</h1>
          <p className="text-muted-foreground">Manage prayer requests from your community</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search prayer requests..."
              className="pl-10 border-amber-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
          ) : filteredRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Request</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Prayers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span>{request.isAnonymous ? "Anonymous" : request.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="truncate block max-w-[300px]">{request.request}</span>
                    </TableCell>
                    <TableCell>
                      {request.date && request.date.seconds
                        ? format(new Date(request.date.seconds * 1000), "MMM d, yyyy")
                        : "No date"}
                    </TableCell>
                    <TableCell>{request.prayerCount || 0}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewClick(request)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          {request.status === "active" && (
                            <DropdownMenuItem onClick={() => handleArchiveClick(request.id!)}>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(request.id!)}>
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
              No prayer requests found. Try adjusting your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Prayer Request Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Prayer Request</DialogTitle>
            <DialogDescription>
              {selectedRequest?.isAnonymous ? "Anonymous" : selectedRequest?.name}
              {selectedRequest?.date && selectedRequest.date.seconds
                ? ` • ${format(new Date(selectedRequest.date.seconds * 1000), "MMMM d, yyyy")}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p>{selectedRequest?.request}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{selectedRequest?.prayerCount || 0} people have prayed</span>
              <span>Status: {selectedRequest?.status || "active"}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedRequest?.status === "active" && (
              <Button
                variant="outline"
                onClick={() => {
                  handleArchiveClick(selectedRequest.id!)
                  setViewDialogOpen(false)
                }}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prayer request? This action cannot be undone.
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

