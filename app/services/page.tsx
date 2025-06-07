"use client"

import { useEffect, useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ServiceCard from "@/components/services/service-card"
import { supabase } from "@/lib/supabase"

interface Service {
  id: string
  title: string
  description: string
  phone: string
  rating: number
  price_range: string | null
  category: string | null
  availability: string | null
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    async function fetchServices() {
      try {
        let query = supabase.from("services").select("*").eq("is_active", true)

        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        }

        if (selectedCategory && selectedCategory !== "all") {
          query = query.eq("category", selectedCategory)
        }

        const { data, error } = await query.order("rating", { ascending: false })

        if (error) {
          console.error("Error fetching services:", error)
          if (error.code === "PGRST116" || error.message.includes("does not exist")) {
            setServices([])
          }
          return
        }
        setServices(data || [])
      } catch (error) {
        console.error("Error fetching services:", error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [searchTerm, selectedCategory])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from("services").select("category").not("category", "is", null)

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
        <h1 className="text-3xl font-bold mb-4">Services</h1>
        <p className="text-gray-600 mb-6">Find trusted professionals in your community</p>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search services..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No services found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
