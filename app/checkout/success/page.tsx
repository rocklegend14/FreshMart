"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
}

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [latestOrder, setLatestOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Fetch the user's latest order
    const token = localStorage.getItem('token')
    if (!token) {
      router.push("/login")
      return
    }

    fetch('http://localhost:5000/api/orders/my-orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      return response.json()
    })
    .then(orders => {
      setLoading(false)
      if (orders && orders.length > 0) {
        // Get the most recent order
        setLatestOrder(orders[0])
      }
    })
    .catch(error => {
      console.error('Error fetching orders:', error)
      setLoading(false)
    })

    // Add redirect timer
    const redirectTimer = setTimeout(() => {
      router.push("/products")
    }, 10000)

    return () => clearTimeout(redirectTimer)
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <p>Loading order details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Thank you for your purchase. Your order has been received and is being processed.</p>
          
          {latestOrder ? (
            <div className="bg-gray-50 p-4 rounded-md mb-4 text-left">
              <p className="text-sm text-gray-600 mb-2">Order Details</p>
              <p className="font-medium">Order #: {latestOrder.id}</p>
              <p className="font-medium">Status: {latestOrder.status}</p>
              <p className="font-medium">Total: ₹{latestOrder.total}</p>
              <p className="font-medium">Date: {new Date(latestOrder.createdAt).toLocaleString()}</p>
              <div className="mt-2">
                <p className="text-sm text-gray-600">Order Items:</p>
                <ul className="list-disc pl-5 text-sm">
                  {latestOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.product?.name || 'Product'} x{item.quantity} (₹{item.price} each)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="font-medium">#FMG-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-4">A confirmation email has been sent to your email address.</p>
          <p className="text-sm text-amber-600">You will be redirected to the products page in 10 seconds...</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/products" className="w-full">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
          
          {latestOrder && (
            <Link href="/profile/orders" className="w-full">
              <Button variant="outline" className="w-full">View All Orders</Button>
            </Link>
          )}
          
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
