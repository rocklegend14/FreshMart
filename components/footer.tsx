import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FreshMart</h3>
            <p className="text-gray-600 mb-4">
              Fresh groceries delivered to your doorstep. Quality products sourced from local farmers.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-green-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-green-600">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-green-600">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-600 space-y-2">
              <p>42 Anna Nagar Main Road</p>
              <p>Chennai, Tamil Nadu 600040</p>
              <p>Phone: +91 44 2345 6789</p>
              <p>Email: info@freshmart.com</p>
            </address>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} FreshMart. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-600 hover:text-green-600 text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-green-600 text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-600 hover:text-green-600 text-sm">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
