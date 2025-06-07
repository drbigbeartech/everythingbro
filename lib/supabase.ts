import { createClient } from "@supabase/supabase-js"

// Debug environment variables
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("Supabase Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: "customer" | "seller" | "service_provider" | "admin"
          phone: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: "customer" | "seller" | "service_provider" | "admin"
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: "customer" | "seller" | "service_provider" | "admin"
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          price: number
          stock: number
          image_url: string | null
          category: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          price: number
          stock?: number
          image_url?: string | null
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          image_url?: string | null
          category?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          phone: string
          rating: number
          price_range: string | null
          category: string | null
          availability: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          phone: string
          rating?: number
          price_range?: string | null
          category?: string | null
          availability?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          phone?: string
          rating?: number
          price_range?: string | null
          category?: string | null
          availability?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          buyer_id: string
          product_id: string
          quantity: number
          total_amount: number
          status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
          delivery_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          product_id: string
          quantity?: number
          total_amount: number
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
          delivery_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          product_id?: string
          quantity?: number
          total_amount?: number
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
          delivery_address?: string | null
          created_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
      }
    }
  }
}
