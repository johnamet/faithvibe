"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, MessageSquare, Users } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { db } from "@/app/firebase"
import { collection, query, getDocs, orderBy, limit, where, Timestamp } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"

// Interface for dashboard stats
interface DashboardStats {
  totalRevenue: number
  newUsers: number
  eventRegistrations: number
  prayerRequests: number
  recentOrders: any[]
  salesData: any[]
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    newUsers: 0,
    eventRegistrations: 0,
    prayerRequests: 0,
    recentOrders: [],
    salesData: [],
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)

        // Get total revenue from orders
        const ordersQuery = query(collection(db, "orders"))
        const ordersSnapshot = await getDocs(ordersQuery)
        let totalRevenue = 0
        ordersSnapshot.forEach((doc) => {
          const orderData = doc.data()
          totalRevenue += orderData.total || 0
        })

        // Get new users count (users created in the last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const usersQuery = query(collection(db, "users"), where("createdAt", ">=", Timestamp.fromDate(thirtyDaysAgo)))
        const usersSnapshot = await getDocs(usersQuery)
        const newUsersCount = usersSnapshot.size

        // Get event registrations count
        const registrationsQuery = query(collection(db, "eventRegistrations"))
        const registrationsSnapshot = await getDocs(registrationsQuery)
        const registrationsCount = registrationsSnapshot.size

        // Get active prayer requests count
        const prayerRequestsQuery = query(collection(db, "prayerRequests"), where("status", "==", "active"))
        const prayerRequestsSnapshot = await getDocs(prayerRequestsQuery)
        const prayerRequestsCount = prayerRequestsSnapshot.size

        // Get recent orders
        const recentOrdersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5))
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery)
        const recentOrders = recentOrdersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Generate sales data (last 7 months)
        const salesData = []
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const currentDate = new Date()

        for (let i = 6; i >= 0; i--) {
          const month = new Date()
          month.setMonth(currentDate.getMonth() - i)

          const monthName = months[month.getMonth()]
          const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
          const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

          const monthOrdersQuery = query(
            collection(db, "orders"),
            where("createdAt", ">=", Timestamp.fromDate(startOfMonth)),
            where("createdAt", "<=", Timestamp.fromDate(endOfMonth)),
          )

          const monthOrdersSnapshot = await getDocs(monthOrdersQuery)
          let monthTotal = 0

          monthOrdersSnapshot.forEach((doc) => {
            const orderData = doc.data()
            monthTotal += orderData.total || 0
          })

          salesData.push({
            name: monthName,
            total: monthTotal,
          })
        }

        setStats({
          totalRevenue,
          newUsers: newUsersCount,
          eventRegistrations: registrationsCount,
          prayerRequests: prayerRequestsCount,
          recentOrders,
          salesData,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.newUsers}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Event Registrations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.eventRegistrations}</div>
            <p className="text-xs text-muted-foreground">Total registrations</p>
          </CardContent>
        </Card>
        <Card className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Prayer Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.prayerRequests}</div>
            <p className="text-xs text-muted-foreground">Active requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="border-amber-100 col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={stats.salesData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-amber-100 col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Recent purchases from your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{order.customer?.name || "Customer"}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">${order.total?.toFixed(2) || "0.00"}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent orders</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-amber-200">
              View All Orders
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

