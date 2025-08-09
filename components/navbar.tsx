"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const pathname = usePathname()
  const { cart } = useCart()
  const { isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-green-600 text-2xl font-bold">FreshMart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${pathname === "/" ? "text-green-600" : "text-gray-600"}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${pathname === "/about" ? "text-green-600" : "text-gray-600"}`}
            >
              About
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${pathname === "/products" ? "text-green-600" : "text-gray-600"}`}
            >
              Products
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-green-600 ${pathname === "/contact" ? "text-green-600" : "text-gray-600"}`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon" aria-label="Cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Account">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/products">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/products">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/register" className="hidden sm:inline-block">
                  <Button>Register</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <Link
              href="/"
              className={`block py-2 px-3 rounded-md ${pathname === "/" ? "bg-green-50 text-green-600" : "hover:bg-gray-50"}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block py-2 px-3 rounded-md ${pathname === "/about" ? "bg-green-50 text-green-600" : "hover:bg-gray-50"}`}
            >
              About
            </Link>
            <Link
              href="/products"
              className={`block py-2 px-3 rounded-md ${pathname === "/products" ? "bg-green-50 text-green-600" : "hover:bg-gray-50"}`}
            >
              Products
            </Link>
            <Link
              href="/contact"
              className={`block py-2 px-3 rounded-md ${pathname === "/contact" ? "bg-green-50 text-green-600" : "hover:bg-gray-50"}`}
            >
              Contact
            </Link>
            {!isAuthenticated && (
              <Link href="/register" className="block py-2 px-3 rounded-md sm:hidden">
                Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
