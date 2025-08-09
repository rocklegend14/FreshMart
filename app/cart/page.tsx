"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6 pb-6 flex flex-col items-center">
              <div className="w-24 h-24 mb-4 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/products">
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({cart.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b last:border-0"
                >
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow mt-2 sm:mt-0">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.unit}</p>
                    <p className="font-semibold text-green-600 mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center mt-3 sm:mt-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-3 w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 ml-2 text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    try {
                      // Get the current cart and check for invalid IDs
                      const savedCart = localStorage.getItem("cart");
                      if (savedCart) {
                        const parsedCart = JSON.parse(savedCart);
                        
                        // Filter out items with invalid IDs
                        const validCart = parsedCart.filter((item: any) => {
                          if (!item || !item.id) return false;
                          return typeof item.id === 'string' && item.id.trim() !== '';
                        });
                        
                        if (validCart.length !== parsedCart.length) {
                          console.log(`Removed ${parsedCart.length - validCart.length} invalid items from cart`);
                          localStorage.setItem("cart", JSON.stringify(validCart));
                          alert(`Fixed cart data by removing invalid items. Page will refresh.`);
                        } else {
                          // If there's nothing to fix, just clear the cart
                          localStorage.removeItem("cart");
                          alert("Cart data has been reset. Page will refresh.");
                        }
                      } else {
                        alert("No cart data found.");
                      }
                    } catch (error) {
                      console.error("Error fixing cart:", error);
                      localStorage.removeItem("cart");
                      alert("Cart data has been reset. Page will refresh.");
                    }
                    
                    window.location.reload();
                  }}
                >
                  Fix Cart Data
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹50</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{Math.round(cartTotal * 0.18)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{cartTotal + 50 + Math.round(cartTotal * 0.18)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout" className="w-full">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
