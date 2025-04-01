"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Calendar, Heart, Settings, ShoppingBag } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";

// Optional: Force dynamic rendering to skip prerendering
export const dynamic = "force-dynamic";

export default function AccountPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate auth state loading
  useEffect(() => {
    if (user !== null) {
      setIsLoading(false);
    }
  }, [user]);

  console.log(user);

  if (isLoading) {
    return (
      <div className="container px-4 py-12 md:py-16 flex justify-center items-center">
        <p className="text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  // If user is still null after loading, redirect or show an error (handled by ProtectedRoute)
  if (!user) {
    return null; // ProtectedRoute should handle redirection
  }

  return (
    <ProtectedRoute>
      <div className="container px-4 py-12 md:py-16">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">My Account</h1>
          <p className="text-muted-foreground max-w-[700px] mb-8">
            Manage your profile, orders, event registrations, and saved content.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <Card className="border-amber-100 md:w-1/3">
              <CardHeader>
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder-user.jpg" alt={user.displayName || "User"} />
                    <AvatarFallback>
                      {user.displayName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{user.displayName || "Welcome"}</CardTitle>
                  <CardDescription>{user.email || "No email set"}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Button variant="outline" className="border-amber-200" asChild>
                    <Link href="/account/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="md:w-2/3 space-y-4">
              <Card className="border-amber-100">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                      <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">3</span>
                      <span className="text-sm text-muted-foreground">Orders</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                      <Calendar className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">2</span>
                      <span className="text-sm text-muted-foreground">Events</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                      <BookOpen className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">7</span>

                      <span className="text-sm text-muted-foreground">Saved</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                      <Heart className="h-8 w-8 text-primary mb-2" />
                      <span className="text-2xl font-bold">12</span>
                      <span className="text-sm text-muted-foreground">Prayers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-100">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Order #ORD-001 was delivered</p>
                        <p className="text-sm text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Registered for Summer Spiritual Retreat</p>
                        <p className="text-sm text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Saved "Finding Peace in Troubled Times"</p>
                        <p className="text-sm text-muted-foreground">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid grid-cols-4 h-auto mb-8">
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger
                value="devotionals"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Saved
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card className="border-amber-100">
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>View and track your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-amber-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">Order #ORD-001</p>
                          <p className="text-sm text-muted-foreground">April 1, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$49.99</p>
                          <p className="text-sm text-green-600">Delivered</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="h-16 w-16 bg-muted rounded-md overflow-hidden relative">
                          <img src="/placeholder.svg" alt="Product" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">Daily Devotional Journal</p>
                          <p className="text-sm text-muted-foreground">Qty: 1</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="border-amber-200">
                          View Order Details
                        </Button>
                      </div>
                    </div>

                    <div className="border border-amber-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">Order #ORD-002</p>
                          <p className="text-sm text-muted-foreground">March 15, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$32.50</p>
                          <p className="text-sm text-blue-600">Shipped</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="h-16 w-16 bg-muted rounded-md overflow-hidden relative">
                          <img src="/placeholder.svg" alt="Product" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">Inspirational Wall Art</p>
                          <p className="text-sm text-muted-foreground">Qty: 1</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="border-amber-200">
                          View Order Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card className="border-amber-100">
                <CardHeader>
                  <CardTitle>My Event Registrations</CardTitle>
                  <CardDescription>View your upcoming and past events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-amber-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">Summer Spiritual Retreat</p>
                          <p className="text-sm text-muted-foreground">June 15-18, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-600">Upcoming</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Location:</span> Mountain View Retreat Center
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Registration ID:</span> REG-001
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="border-amber-200">
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="border border-amber-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">Community Service Day</p>
                          <p className="text-sm text-muted-foreground">May 8, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-600">Upcoming</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Location:</span> Downtown Community Center
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Registration ID:</span> REG-002
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="border-amber-200">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href="/events">Browse More Events</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="devotionals">
              <Card className="border-amber-100">
                <CardHeader>
                  <CardTitle>Saved Devotionals</CardTitle>
                  <CardDescription>Access your bookmarked devotionals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border border-amber-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">Finding Peace in Troubled Times</p>
                          <p className="text-sm text-muted-foreground">John 14:27</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">April 1, 2025</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          In a world filled with uncertainty and challenges, the promise of peace from Jesus stands as
                          an anchor for our souls...
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="border-amber-200">
                          Read Devotional
                        </Button>
                      </div>
                    </div>

                    <div className="border border-amber-100 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">The Power of Gratitude</p>
                          <p className="text-sm text-muted-foreground">1 Thessalonians 5:16-18</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">March 28, 2025</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Gratitude has the power to transform our perspective and bring joy even in difficult
                          seasons...
                        </p>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="border-amber-200">
                          Read Devotional
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href="/devotionals">Browse More Devotionals</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="border-amber-100">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <p className="text-muted-foreground">{user.displayName || "Not set"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <p className="text-muted-foreground">{user.email || "Not set"}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 border-amber-200">
                        Edit Profile
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Password</h3>
                      <p className="text-muted-foreground">Change your password to keep your account secure</p>
                      <Button variant="outline" size="sm" className="border-amber-200">
                        Change Password
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <p className="text-muted-foreground">Manage how and when you receive updates from us</p>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="email-notifications"
                            className="rounded border-amber-200"
                            defaultChecked
                          />
                          <label htmlFor="email-notifications" className="text-sm">
                            Email notifications
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="devotional-updates"
                            className="rounded border-amber-200"
                            defaultChecked
                          />
                          <label htmlFor="devotional-updates" className="text-sm">
                            Daily devotional updates
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="event-reminders"
                            className="rounded border-amber-200"
                            defaultChecked
                          />
                          <label htmlFor="event-reminders" className="text-sm">
                            Event reminders
                          </label>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 border-amber-200">
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="border-amber-200">
                    Cancel
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
