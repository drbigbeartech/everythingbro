"use client"

import { useEffect, useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductCard from "@/components/products/product-card"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  category: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        let query = supabase.from("products").select("*").eq("is_active", true)

        if (searchTerm) {
          query = query.ilike("name", `%${searchTerm}%`)
        }

        if (selectedCategory && selectedCategory !== "all") {
          query = query.eq("category", selectedCategory)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching products:", error)
          if (error.code === "PGRST116" || error.message.includes("does not exist")) {
            setProducts([])
          }
          return
        }
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from("products").select("category").not("category", "is", null)

        if (error) {
          console.error("Error fetching categories:", error)
          if (error.code === "PGRST116" || error.message.includes("does not exist")) {
            setCategories([])
          }
          return
        }

        const uniqueCategories = [...new Set(data?.map((item) => item.category).filter(Boolean))] as string[]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <p className="text-gray-600 mb-6">Fresh groceries and essentials from local sellers</p>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
