"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  cardNumber: z.string().regex(/^\d{16}$/, {
    message: "Card number must be 16 digits.",
  }),
  cardName: z.string().min(2, {
    message: "Name on card is required.",
  }),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, {
    message: "Expiry date must be in MM/YY format.",
  }),
  cvv: z.string().regex(/^\d{3,4}$/, {
    message: "CVV must be 3 or 4 digits.",
  }),
  paymentMethod: z.enum(["credit", "debit", "paypal"]),
  notes: z.string().optional(),
})

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      paymentMethod: "credit",
      notes: "",
    },
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }

    if (cart.length === 0) {
      router.push("/products")
    }
  }, [isAuthenticated, cart.length, router])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Pre-validate cart
    if (cart.length === 0) {
      alert('Your cart is empty. Please add some products before checking out.')
      router.push('/products')
      setIsSubmitting(false)
      return
    }

    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    if (!token) {
      alert('You must be logged in to place an order')
      router.push('/login')
      setIsSubmitting(false)
      return
    }

    // Check if any product has a non-numeric ID
    const nonNumericIds = cart.filter(item => {
      // We now allow non-numeric IDs like "f1", "d2", etc.
      return !item.id || typeof item.id !== 'string' || item.id.trim() === '';
    });

    if (nonNumericIds.length > 0) {
      console.error('Invalid product IDs found:', nonNumericIds);
      alert(`Your cart contains products with invalid IDs. Please use the "Fix Cart Data" button in the cart page to fix this issue.`);
      router.push('/cart');
      setIsSubmitting(false);
      return;
    }

    // Create order items from cart
    try {
      const orderItems = cart.map(item => {
        if (!item.id) {
          throw new Error('Invalid product ID: Product ID is missing');
        }
        
        // We'll let the backend handle the ID mapping, just ensure it's a string
        return {
          productId: String(item.id),
          quantity: item.quantity,
          price: parseFloat(item.price.toString())
        };
      });

      // Create order in database
      fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: {
            fullName: values.fullName,
            email: values.email,
            address: values.address,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode
          },
          paymentMethod: values.paymentMethod
        })
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            let errorMessage = 'Failed to create order';
            try {
              // Try to parse the error message from the server
              const errorData = JSON.parse(text);
              errorMessage = errorData.message || errorMessage;
              
              // Log detailed error information
              console.error("Server error details:", errorData);
            } catch (e) {
              // If parsing fails, use the raw text
              console.error("Server error response:", text);
              errorMessage = `${response.status} ${response.statusText}: ${text.substring(0, 100)}`;
            }
            throw new Error(errorMessage);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Order created successfully:', data)
        clearCart()
        setIsSubmitting(false)
        router.push('/checkout/success')
      })
      .catch(error => {
        console.error('Error creating order:', error)
        alert('There was an error processing your order: ' + error.message)
        setIsSubmitting(false)
      })
    } catch (error: any) {
      console.error('Error preparing order:', error)
      alert('There was an error with your cart data: ' + error.message)
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated || cart.length === 0) {
    return null // Will redirect in useEffect
  }

  const shipping = 50
  const tax = Math.round(cartTotal * 0.18)
  const total = cartTotal + shipping + tax

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                  <CardDescription>Enter your shipping details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TN">Tamil Nadu</SelectItem>
                                <SelectItem value="KA">Karnataka</SelectItem>
                                <SelectItem value="KL">Kerala</SelectItem>
                                <SelectItem value="AP">Andhra Pradesh</SelectItem>
                                <SelectItem value="MH">Maharashtra</SelectItem>
                                <SelectItem value="DL">Delhi</SelectItem>
                                <SelectItem value="GJ">Gujarat</SelectItem>
                                <SelectItem value="WB">West Bengal</SelectItem>
                                <SelectItem value="UP">Uttar Pradesh</SelectItem>
                                <SelectItem value="RJ">Rajasthan</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Enter your payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="credit" id="credit" />
                              <Label htmlFor="credit">Credit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="debit" id="debit" />
                              <Label htmlFor="debit">Debit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <Label htmlFor="paypal">PayPal</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Special instructions for delivery"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
