"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .limit(4)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching products:", error)
          // If table doesn't exist, show empty state instead of error
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
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600">Fresh from local sellers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600">Fresh from local sellers</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
