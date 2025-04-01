"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// This would be fetched from Firebase in a real implementation
const products = [
  {
    id: "1",
    name: "Daily Devotional Journal",
    price: 24.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Books",
  },
  {
    id: "2",
    name: "Handcrafted Wooden Cross",
    price: 39.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Decor",
    sale: true,
    originalPrice: 49.99,
  },
  {
    id: "3",
    name: "Premium Prayer Beads",
    price: 18.5,
    image: "/placeholder.svg?height=400&width=400",
    category: "Accessories",
  },
  {
    id: "4",
    name: "Inspirational Wall Art",
    price: 32.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Decor",
  },
]

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: Number.parseInt(product.id) * 0.1 }}
          onHoverStart={() => setHoveredProduct(product.id)}
          onHoverEnd={() => setHoveredProduct(null)}
        >
          <Card className="overflow-hidden border-amber-100 h-full flex flex-col">
            <div className="relative pt-4 px-4">
              {product.sale && <Badge className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 z-10">Sale</Badge>}
              <div className="overflow-hidden rounded-lg aspect-square relative">
                <Image
                  src={product.image || "/placeholder.svg"}
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
                {product.sale && (
                  <span className="text-muted-foreground line-through text-sm">
                    ${product.originalPrice?.toFixed(2)}
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

