"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, CheckCircle2, Search, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { db } from "@/app/firebase"
import { collection, query, getDocs, doc, getDoc, updateDoc, setDoc, where } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"

interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  isAdmin: boolean
  lastSignIn?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user: currentUser } = useAuth()

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)

        // Get all user documents from the users collection
        const usersQuery = query(collection(db, "users"))
        const usersSnapshot = await getDocs(usersQuery)

        // Get all user roles
        const userRolesQuery = query(collection(db, "userRoles"))
        const userRolesSnapshot = await getDocs(userRolesQuery)

        // Create a map of user roles by user ID
        const userRolesMap = new Map()
        userRolesSnapshot.forEach((doc) => {
          userRolesMap.set(doc.id, doc.data())
        })

        // Combine user data with roles
        const fetchedUsers: User[] = []
        usersSnapshot.forEach((doc) => {
          const userData = doc.data()
          const userRoles = userRolesMap.get(doc.id) || { isAdmin: false }

          fetchedUsers.push({
            id: doc.id,
            email: userData.email || "",
            displayName: userData.displayName || "User",
            photoURL: userData.photoURL,
            isAdmin: userRoles.isAdmin || false,
            lastSignIn: userData.lastSignInTime ? new Date(userData.lastSignInTime).toLocaleDateString() : "Never",
          })
        })

        setUsers(fetchedUsers)
        setFilteredUsers(fetchedUsers)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  // Toggle admin status
  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    try {
      // Don't allow removing admin status from yourself
      if (userId === currentUser?.uid && !isAdmin) {
        setError("You cannot remove your own admin privileges")
        return
      }

      // Update user roles in Firestore
      const userRoleRef = doc(db, "userRoles", userId)
      await updateDoc(userRoleRef, { isAdmin })

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, isAdmin } : user)))
      setFilteredUsers(filteredUsers.map((user) => (user.id === userId ? { ...user, isAdmin } : user)))

      setSuccess(`User ${isAdmin ? "promoted to" : "removed from"} admin role`)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error updating user role:", err)
      setError("Failed to update user role")

      // Clear error message after 3 seconds
      setTimeout(() => setError(""), 3000)
    }
  }

  // Add new admin by email
  const addAdminByEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Check if email is valid
      if (!newAdminEmail || !newAdminEmail.includes("@")) {
        setError("Please enter a valid email address")
        setIsSubmitting(false)
        return
      }

      // Find user by email
      const usersQuery = query(collection(db, "users"), where("email", "==", newAdminEmail))
      const usersSnapshot = await getDocs(usersQuery)

      if (usersSnapshot.empty) {
        setError("No user found with this email address")
        setIsSubmitting(false)
        return
      }

      // Get the user ID
      const userId = usersSnapshot.docs[0].id

      // Check if user is already an admin
      const userRoleRef = doc(db, "userRoles", userId)
      const userRoleSnap = await getDoc(userRoleRef)

      if (userRoleSnap.exists() && userRoleSnap.data().isAdmin) {
        setError("This user is already an admin")
        setIsSubmitting(false)
        return
      }

      // Update or create user role
      if (userRoleSnap.exists()) {
        await updateDoc(userRoleRef, { isAdmin: true })
      } else {
        await setDoc(userRoleRef, { isAdmin: true })
      }

      // Update local state if user is in the list
      const updatedUsers = users.map((user) => (user.id === userId ? { ...user, isAdmin: true } : user))

      if (JSON.stringify(updatedUsers) === JSON.stringify(users)) {
        // User wasn't in our list, fetch them and add them
        const userDoc = await getDoc(doc(db, "users", userId))
        const userData = userDoc.data()

        if (userData) {
          const newUser: User = {
            id: userId,
            email: userData.email || newAdminEmail,
            displayName: userData.displayName || "User",
            photoURL: userData.photoURL,
            isAdmin: true,
            lastSignIn: userData.lastSignInTime ? new Date(userData.lastSignInTime).toLocaleDateString() : "Never",
          }

          setUsers([...users, newUser])
          setFilteredUsers([...filteredUsers, newUser])
        }
      } else {
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers.map((user) => (user.id === userId ? { ...user, isAdmin: true } : user)))
      }

      setSuccess("User successfully promoted to admin")
      setNewAdminEmail("")
      setIsDialogOpen(false)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error adding admin:", err)
      setError("Failed to add admin")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-10 border-amber-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>Enter the email address of the user you want to promote to admin.</DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={addAdminByEmail}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      required
                      className="border-amber-200"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                        Adding...
                      </>
                    ) : (
                      "Add Admin"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-500 text-green-700 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card className="border-amber-100">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Admin Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {user.photoURL ? <AvatarImage src={user.photoURL} alt={user.displayName} /> : null}
                          <AvatarFallback>
                            {user.displayName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.displayName}</span>
                        {user.id === currentUser?.uid && (
                          <Badge variant="outline" className="ml-2 border-amber-200">
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.lastSignIn || "Never"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.isAdmin}
                          onCheckedChange={(checked) => toggleAdminStatus(user.id, checked)}
                          disabled={user.id === currentUser?.uid} // Can't toggle your own admin status
                        />
                        <span>{user.isAdmin ? "Admin" : "User"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8 text-muted-foreground">No users found. Try adjusting your search.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

