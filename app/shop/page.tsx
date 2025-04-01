"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Filter, Search, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { getAllProducts, getProductsByCategory } from "@/services/product-service" // Adjust path

const categories = ["All", "Books", "Decor", "Accessories", "Apparel", "Music"]

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [sortBy, setSortBy] = useState("featured")
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([]) // State for fetched products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true) // Loading state

  // Fetch products from Firebase on mount and when activeTab changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let data = []
        if (activeTab.toLowerCase() === "all") {
          data = await getAllProducts() // Fetch all products
        } else {
          data = await getProductsByCategory(activeTab) // Fetch by category
        }
        setProducts(data)
        setFilteredProducts(data) // Initially set filtered to all fetched data
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeTab])

  const handleFilter = () => {
    let filtered = [...products]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by price range
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort products
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }
    // For "featured" we rely on the default order from Firebase (createdAt desc)

    setFilteredProducts(filtered)
  }

  if (loading) {
    return (
      <div className="container px-4 py-12 md:py-16 text-center">
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4">Shop</h1>
        <p className="text-muted-foreground max-w-[700px] mb-8">
          Browse our collection of books, devotionals, apparel, and more to support your spiritual journey.
        </p>

        <div className="w-full max-w-4xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 border-amber-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px] border-amber-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleFilter} className="bg-primary hover:bg-primary/90 w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="w-full max-w-4xl mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Price Range</span>
              <span className="text-sm text-muted-foreground">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 50]}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full max-w-3xl" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.toLowerCase()}
                value={category.toLowerCase()}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onHoverStart={() => setHoveredProduct(product.id)}
              onHoverEnd={() => setHoveredProduct(null)}
            >
              <Card className="overflow-hidden border-amber-100 h-full flex flex-col">
                <div className="relative pt-4 px-4">
                  {product.sale && (
                    <Badge className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 z-10">Sale</Badge>
                  )}
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    {product.sale && product.originalPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
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
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No products found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-12">
        <Button className="bg-primary hover:bg-primary/90 text-white">Load More</Button>
      </div>
    </div>
  )
}

// Define the Product interface within the file for clarity
interface Product {
  id?: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  sale?: boolean
  featured?: boolean
  stock?: number
  createdAt?: any
  updatedAt?: any
}