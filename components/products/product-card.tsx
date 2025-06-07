import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  category: string | null
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg?height=200&width=200"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.stock < 10 && product.stock > 0 && (
          <Badge className="absolute top-2 left-2 bg-orange-500">Low Stock</Badge>
        )}
        {product.stock === 0 && <Badge className="absolute top-2 left-2 bg-red-500">Out of Stock</Badge>}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-lg hover:text-gray-600 transition-colors">{product.name}</h3>
          </Link>
          {product.description && <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-500">{product.stock} in stock</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={product.stock === 0}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
