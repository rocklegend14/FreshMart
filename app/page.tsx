import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, ShieldCheck, Clock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full">
        <Image
          src="/images/home.jpeg"
          alt="Fresh groceries"
          fill
          className="object-fill brightness-75"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Fresh Groceries Delivered to Your Doorstep</h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            Quality products sourced from local farmers and delivered right to your home
          </p>
          <Link href="/products">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Welcome to FreshMart</h2>
          <p className="text-lg text-gray-700 mb-8">
            At FreshMart, we believe everyone deserves access to fresh, high-quality groceries at affordable prices. Our
            mission is to connect local farmers and producers directly with consumers, reducing food miles and ensuring
            you get the freshest products possible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Quality Guaranteed</h3>
                <p className="text-center text-gray-600">
                  We carefully select all our products to ensure premium quality and freshness.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Fast Delivery</h3>
                <p className="text-center text-gray-600">Same-day delivery available for orders placed before 2 PM.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">50+ Products</h3>
                <p className="text-center text-gray-600">
                  Wide selection of fresh produce, dairy, bakery items and more.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Shop?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Browse our selection of fresh groceries and get them delivered to your doorstep.
          </p>
          <Link href="/products">
            <Button size="lg" className="text-lg px-8">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
