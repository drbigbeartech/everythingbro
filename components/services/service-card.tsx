import { Phone, Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{service.title}</h3>
            {service.category && (
              <Badge variant="outline" className="text-xs">
                {service.category}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">{service.description}</p>

        <div className="space-y-2">
          {service.price_range && (
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">Price:</span>
              <span className="text-green-600 font-semibold">{service.price_range}</span>
            </div>
          )}

          {service.availability && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{service.availability}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{service.phone}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex space-x-2">
        <Button className="flex-1">
          <Phone className="h-4 w-4 mr-2" />
          Contact
        </Button>
        <Button variant="outline" className="flex-1">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  )
}
