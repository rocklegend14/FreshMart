"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { products } from "@/lib/products"

export default function ProductsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [filteredProducts, setFilteredProducts] = useState(products)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (category !== "all") {
      result = result.filter((product) => product.category === category)
    }

    // Sort products
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredProducts(result)
  }, [category, sortBy])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>

      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setCategory}>
          <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="fruits-vegetables">Fruits & Veg</TabsTrigger>
            <TabsTrigger value="dairy-eggs">Dairy & Eggs</TabsTrigger>
            <TabsTrigger value="bakery">Bakery</TabsTrigger>
            <TabsTrigger value="snacks">Snacks</TabsTrigger>
            <TabsTrigger value="beverages">Beverages</TabsTrigger>
            <TabsTrigger value="household">Household</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full md:w-64">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative h-48 w-full">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              {product.sale && <Badge className="absolute top-2 right-2 bg-red-500">Sale</Badge>}
            </div>
            <CardContent className="pt-6 flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="font-bold text-green-600">₹{product.price}</p>
              </div>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <p className="text-xs text-gray-500">{product.unit}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button onClick={() => addToCart(product)} className="w-full">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}
