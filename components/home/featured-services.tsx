"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .limit(3)
          .order("rating", { ascending: false })

        if (error) {
          console.error("Error fetching services:", error)
          // If table doesn't exist, show empty state instead of error
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
  }, [])

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top-Rated Services</h2>
            <p className="text-gray-600">Trusted professionals in your area</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Top-Rated Services</h2>
            <p className="text-gray-600">Trusted professionals in your area</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/services">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
