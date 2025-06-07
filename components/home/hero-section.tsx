import Link from "next/link"
import { ArrowRight, ShoppingBag, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            Everything You Need,
            <br />
            <span className="text-gray-600">Right in Your Community</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Shop for groceries, find local services, and connect with your community. Your local marketplace for
            everything.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="/services">
                <Wrench className="mr-2 h-5 w-5" />
                Find Services
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Fresh Groceries</h3>
              <p className="text-gray-600 text-sm">Local produce, pantry essentials, and daily needs delivered fresh</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Local Services</h3>
              <p className="text-gray-600 text-sm">Trusted professionals for home repairs, cleaning, and more</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h3 className="font-semibold mb-2">Community First</h3>
              <p className="text-gray-600 text-sm">Supporting local businesses and building stronger communities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
