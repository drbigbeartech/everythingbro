"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import ManualSetup from "@/components/setup/manual-setup"

export default function SetupPage() {
  \
  const [status, setStatus<{
    tables: "idle" | "loading" | "success" | "error"
    data: "idle" | "loading" | "success" | "error"
}
>(
{
  tables: "idle", data
  : "idle",
}
)
const [messages, setMessages] = useState<string[]>([])

const addMessage = (message: string) => {
  setMessages((prev) => [...prev, message])
}

const createTables = async () => {
  setStatus((prev) => ({ ...prev, tables: "loading" }))
  setMessages([])
  addMessage("Creating database tables...")

  try {
    // Create users table
    const { error: usersError } = await supabase.rpc("sql", {
      query: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'service_provider', 'admin')),
          phone TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    if (usersError) {
      // Try alternative method if RPC doesn't work
      const { error: altError } = await supabase.from("users").select("id").limit(1)

      if (altError && altError.code === "PGRST116") {
        throw new Error("Tables need to be created manually in Supabase dashboard")
      }
    }
    addMessage("✓ Users table created")

    // Create products table
    const { error: productsError } = await supabase.rpc("sql", {
      query: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          stock INTEGER DEFAULT 0,
          image_url TEXT,
          category TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    addMessage("✓ Products table created")

    // Create services table
    const { error: servicesError } = await supabase.rpc("sql", {
      query: `
        CREATE TABLE IF NOT EXISTS services (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          phone TEXT NOT NULL,
          rating DECIMAL(3,2) DEFAULT 0.0,
          price_range TEXT,
          category TEXT,
          availability TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    addMessage("✓ Services table created")

    // Create orders table
    const { error: ordersError } = await supabase.rpc("sql", {
      query: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL DEFAULT 1,
          total_amount DECIMAL(10,2) NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
          delivery_address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    addMessage("✓ Orders table created")

    // Create cart table
    const { error: cartError } = await supabase.rpc("sql", {
      query: `
        CREATE TABLE IF NOT EXISTS cart (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, product_id)
        );
      `,
    })

    addMessage("✓ Cart table created")

    // Create reviews table
    const { error: reviewsError } = await supabase.rpc("sql", {
      query: `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          service_id UUID REFERENCES services(id) ON DELETE CASCADE,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    addMessage("✓ Reviews table created")

    // Create notifications table
    const { error: notificationsError } = await supabase.rpc("sql", {
      query: `
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    })

    addMessage("✓ Notifications table created")

    setStatus((prev) => ({ ...prev, tables: "success" }))
    addMessage("All tables created successfully!")
  } catch (error) {
    console.error("Error creating tables:", error)
    setStatus((prev) => ({ ...prev, tables: "error" }))
    addMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    addMessage("Please try the manual setup method below.")
  }
}

const seedData = async () => {
  setStatus((prev) => ({ ...prev, data: "loading" }))
  addMessage("Seeding sample data...")

  try {
    // Insert sample users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        { name: "John Doe", email: "john@example.com", role: "customer", phone: "+1234567890" },
        { name: "Jane Smith", email: "jane@example.com", role: "seller", phone: "+1234567891" },
        { name: "Mike Wilson", email: "mike@example.com", role: "service_provider", phone: "+1234567892" },
        { name: "Sarah Johnson", email: "sarah@example.com", role: "customer", phone: "+1234567893" },
      ])
      .select()

    if (userError) throw userError
    addMessage("✓ Sample users created")

    // Get seller and service provider IDs
    const seller = userData.find((u) => u.email === "jane@example.com")
    const serviceProvider = userData.find((u) => u.email === "mike@example.com")

    if (seller) {
      // Insert sample products
      const { error: productError } = await supabase.from("products").insert([
        {
          user_id: seller.id,
          name: "Fresh Tomatoes",
          description: "Locally grown organic tomatoes",
          price: 3.99,
          stock: 50,
          category: "Vegetables",
          image_url: "/placeholder.svg?height=200&width=200",
        },
        {
          user_id: seller.id,
          name: "Whole Wheat Bread",
          description: "Freshly baked whole wheat bread",
          price: 2.5,
          stock: 20,
          category: "Bakery",
          image_url: "/placeholder.svg?height=200&width=200",
        },
        {
          user_id: seller.id,
          name: "Farm Fresh Eggs",
          description: "Free-range chicken eggs (dozen)",
          price: 4.99,
          stock: 30,
          category: "Dairy",
          image_url: "/placeholder.svg?height=200&width=200",
        },
        {
          user_id: seller.id,
          name: "Local Honey",
          description: "Pure wildflower honey",
          price: 8.99,
          stock: 15,
          category: "Pantry",
          image_url: "/placeholder.svg?height=200&width=200",
        },
      ])

      if (productError) throw productError
      addMessage("✓ Sample products created")
    }

    if (serviceProvider) {
      // Insert sample services
      const { error: serviceError } = await supabase.from("services").insert([
        {
          user_id: serviceProvider.id,
          title: "Electrical Repairs",
          description: "Professional electrical repair and installation services",
          phone: "+1234567892",
          category: "Home Services",
          price_range: "$50-150",
          availability: "Mon-Sat 9AM-6PM",
          rating: 4.8,
        },
        {
          user_id: serviceProvider.id,
          title: "Plumbing Services",
          description: "Emergency plumbing repairs and maintenance",
          phone: "+1234567892",
          category: "Home Services",
          price_range: "$40-120",
          availability: "24/7 Available",
          rating: 4.6,
        },
      ])

      if (serviceError) throw serviceError
      addMessage("✓ Sample services created")
    }

    setStatus((prev) => ({ ...prev, data: "success" }))
    addMessage("Sample data seeded successfully!")
  } catch (error) {
    console.error("Error seeding data:", error)
    setStatus((prev) => ({ ...prev, data: "error" }))
    addMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Database Setup</h1>
          <p className="text-gray-600">Initialize your Everything Platform database with tables and sample data.</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This setup page will create the necessary database tables and populate them with sample data. Run this only
            once when setting up your application.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 1: Create Database Tables
                {status.tables === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>Create the required tables for users, products, services, and orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={createTables}
                disabled={status.tables === "loading" || status.tables === "success"}
                className="w-full"
              >
                {status.tables === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {status.tables === "success" ? "Tables Created" : "Create Tables"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 2: Seed Sample Data
                {status.data === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>Add sample users, products, and services to test the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={seedData}
                disabled={status.data === "loading" || status.data === "success" || status.tables !== "success"}
                className="w-full"
              >
                {status.data === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {status.data === "success" ? "Data Seeded" : "Seed Sample Data"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <ManualSetup />

        {messages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Setup Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 font-mono text-sm">
                {messages.map((message, index) => (
                  <div key={index} className="text-gray-700">
                    {message}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {status.tables === "success" && status.data === "success" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Setup complete! You can now navigate to the{" "}
              <a href="/" className="font-medium underline">
                homepage
              </a>{" "}
              to see your Everything Platform in action.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
