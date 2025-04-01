"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Truck, Package, CheckCircle, XCircle, User, MapPin, CreditCard } from "lucide-react"
import { type Order, getOrderById, updateOrderStatus } from "@/services/order-service"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true)
        const data = await getOrderById(params.id)
        setOrder(data)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  const handleStatusChange = async (status: Order["status"]) => {
    if (!order) return

    try {
      await updateOrderStatus(order.id!, status)
      setOrder({ ...order, status })
    } catch (err) {
      console.error("Error updating order status:", err)
      setError("Failed to update order status")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "shipped":
        return <Badge className="bg-indigo-500">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return format(date, "MMM d, yyyy h:mm a")
    } catch (e) {
      return "Invalid date"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/orders")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-2" onClick={() => router.push("/admin/orders")}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-primary">Order Details</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-amber-100 md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Order #{order.id?.substring(0, 8)}</CardTitle>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{item.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Shipping
                  </TableCell>
                  <TableCell className="text-right">$0.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 mb-4">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.userName}</p>
                  <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Shipping Address</p>
                  <p className="text-sm">{order.shippingAddress.name}</p>
                  <p className="text-sm">{order.shippingAddress.street}</p>
                  <p className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p className="text-sm">{order.shippingAddress.country}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm capitalize">{order.paymentMethod}</p>
                  {order.paymentId && <p className="text-sm text-muted-foreground">ID: {order.paymentId}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={order.status === "processing" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleStatusChange("processing")}
                  disabled={order.status === "cancelled" || order.status === "delivered"}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Processing
                </Button>
                <Button
                  variant={order.status === "shipped" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleStatusChange("shipped")}
                  disabled={order.status === "cancelled" || order.status === "delivered"}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Shipped
                </Button>
                <Button
                  variant={order.status === "delivered" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleStatusChange("delivered")}
                  disabled={order.status === "cancelled"}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Delivered
                </Button>
                <Button
                  variant={order.status === "cancelled" ? "destructive" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleStatusChange("cancelled")}
                  disabled={order.status === "delivered"}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelled
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {order.notes && (
        <Card className="border-amber-100 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

