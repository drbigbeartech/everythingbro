"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, ExternalLink } from "lucide-react"

const SQL_SCRIPTS = {
  createTables: `-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'service_provider', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
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

-- Create services table
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

-- Create orders table
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

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,

  seedData: `-- Insert sample users
INSERT INTO users (name, email, role, phone) VALUES
('John Doe', 'john@example.com', 'customer', '+1234567890'),
('Jane Smith', 'jane@example.com', 'seller', '+1234567891'),
('Mike Wilson', 'mike@example.com', 'service_provider', '+1234567892'),
('Sarah Johnson', 'sarah@example.com', 'customer', '+1234567893');

-- Insert sample products
INSERT INTO products (user_id, name, description, price, stock, category, image_url) VALUES
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Fresh Tomatoes', 'Locally grown organic tomatoes', 3.99, 50, 'Vegetables', '/placeholder.svg?height=200&width=200'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Whole Wheat Bread', 'Freshly baked whole wheat bread', 2.50, 20, 'Bakery', '/placeholder.svg?height=200&width=200'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Farm Fresh Eggs', 'Free-range chicken eggs (dozen)', 4.99, 30, 'Dairy', '/placeholder.svg?height=200&width=200'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Local Honey', 'Pure wildflower honey', 8.99, 15, 'Pantry', '/placeholder.svg?height=200&width=200');

-- Insert sample services
INSERT INTO services (user_id, title, description, phone, category, price_range, availability, rating) VALUES
((SELECT id FROM users WHERE email = 'mike@example.com'), 'Electrical Repairs', 'Professional electrical repair and installation services', '+1234567892', 'Home Services', '$50-150', 'Mon-Sat 9AM-6PM', 4.8),
((SELECT id FROM users WHERE email = 'mike@example.com'), 'Plumbing Services', 'Emergency plumbing repairs and maintenance', '+1234567892', 'Home Services', '$40-120', '24/7 Available', 4.6),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'House Cleaning', 'Professional house cleaning services', '+1234567891', 'Cleaning', '$30-80', 'Mon-Fri 8AM-5PM', 4.9),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Tutoring Services', 'Math and Science tutoring for students', '+1234567891', 'Education', '$25-50/hour', 'Evenings & Weekends', 4.7);`,
}

export default function ManualSetup() {
  const [copiedScript, setCopiedScript] = useState<string | null>(null)

  const copyToClipboard = async (text: string, scriptName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedScript(scriptName)
      setTimeout(() => setCopiedScript(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manual Database Setup</CardTitle>
          <CardDescription>
            If the automated setup doesn't work, you can manually create the tables using your Supabase dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <ExternalLink className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Go to your{" "}
              <a
                href="https://dydirocktitcqrduqevz.supabase.co/project/default/sql"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                Supabase SQL Editor
              </a>
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Step 1: Create Tables</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(SQL_SCRIPTS.createTables, "createTables")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedScript === "createTables" ? "Copied!" : "Copy SQL"}
                </Button>
              </div>
              <Textarea value={SQL_SCRIPTS.createTables} readOnly className="font-mono text-xs h-40" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Step 2: Seed Sample Data</h4>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(SQL_SCRIPTS.seedData, "seedData")}>
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedScript === "seedData" ? "Copied!" : "Copy SQL"}
                </Button>
              </div>
              <Textarea value={SQL_SCRIPTS.seedData} readOnly className="font-mono text-xs h-32" />
            </div>
          </div>

          <div className="p-3 bg-gray-50 border rounded-lg">
            <h5 className="font-medium mb-2">Instructions:</h5>
            <ol className="text-sm space-y-1 list-decimal list-inside text-gray-700">
              <li>Click the Supabase SQL Editor link above</li>
              <li>Copy and paste the "Create Tables" SQL script</li>
              <li>Click "Run" to execute the script</li>
              <li>Copy and paste the "Seed Sample Data" SQL script</li>
              <li>Click "Run" to execute the script</li>
              <li>Return to this page and test the connection</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
