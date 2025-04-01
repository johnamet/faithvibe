"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getFeaturedProducts, Product } from "@/services/product-service" // Adjust path

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch featured products from Firebase on mount
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getFeaturedProducts(4) // Limit to 4 featured products
        setProducts(data)
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden border-amber-100 h-full flex flex-col animate-pulse">
            <div className="relative pt-4 px-4">
              <div className="overflow-hidden rounded-lg aspect-square relative bg-gray-200" />
            </div>
            <CardContent className="pt-4 flex-grow">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-5 bg-gray-200 rounded w-1/4" />
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex gap-2 w-full">
                <div className="flex-1 h-9 bg-gray-200 rounded" />
                <div className="flex-1 h-9 bg-gray-200 rounded" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return <p className="text-center text-muted-foreground">No featured products available.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onHoverStart={() => setHoveredProduct(product.id)}
          onHoverEnd={() => setHoveredProduct(null)}
        >
          <Card className="overflow-hidden border-amber-100 h-full flex flex-col">
            <div className="relative pt-4 px-4">
              {product.sale && <Badge className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 z-10">Sale</Badge>}
              <div className="overflow-hidden rounded-lg aspect-square relative">
                <Image
                  src={product.image || "/placeholder.svg?height=400&width=400"}
                  alt={product.name}
                  fill
                  className={`object-cover transition-transform duration-500 ${
                    hoveredProduct === product.id ? "scale-110" : "scale-100"
                  }`}
                />
              </div>
            </div>
            <CardContent className="pt-4 flex-grow">
              <div className="text-xs text-muted-foreground mb-1">{product.category}</div>
              <h3 className="font-medium text-primary mb-1 line-clamp-2">{product.name}</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold">${product.price.toFixed(2)}</span>
                {product.sale && product.originalPrice && (
                  <span className="text-muted-foreground line-through text-sm">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1 border-amber-200 hover:bg-amber-50" asChild>
                  <Link href={`/shop/product/${product.id}`}>Details</Link>
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}