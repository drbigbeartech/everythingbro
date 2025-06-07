import HeroSection from "@/components/home/hero-section"
import FeaturedProducts from "@/components/home/featured-products"
import FeaturedServices from "@/components/home/featured-services"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProducts />
      <FeaturedServices />
    </div>
  )
}
