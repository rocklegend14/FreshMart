"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/types"

type CartItem = Product & {
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Validate cart data before setting state
        const validatedCart = parsedCart.filter((item: any) => {
          // Check that item has a valid ID
          const isValid = item && 
                         item.id && 
                         typeof item.id === 'string' && 
                         item.id.trim() !== '';
          
          if (!isValid) {
            console.error('Invalid cart item found:', item)
          }
          return isValid
        })
        console.log('Cart loaded:', validatedCart)
        setCart(validatedCart)
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        localStorage.removeItem("cart") // Clear corrupted cart data
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Validate cart before saving to localStorage
    const validCart = cart.filter(item => 
      item && 
      item.id && 
      typeof item.id === 'string' && 
      item.id.trim() !== ''
    );
    
    if (validCart.length !== cart.length) {
      console.error('Invalid items removed from cart before saving');
      setCart(validCart); // Update state with valid items only
      return; // Don't proceed with this save since setCart will trigger another effect call
    }
    
    localStorage.setItem("cart", JSON.stringify(cart))

    // Calculate cart total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setCartTotal(total)
  }, [cart])

  const addToCart = (product: Product) => {
    // Ensure product has a valid ID
    if (!product || !product.id) {
      console.error('Cannot add product to cart: Product has no ID');
      return;
    }
    
    // Ensure product ID is always a string
    const safeProduct = {
      ...product,
      id: String(product.id) // Ensure ID is a string
    };
    
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === safeProduct.id)

      if (existingItem) {
        // If item already exists, increase quantity
        return prevCart.map((item) => (item.id === safeProduct.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Otherwise add new item with quantity 1
        return [...prevCart, { ...safeProduct, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    if (!productId) {
      console.error('Cannot remove product from cart: Product ID is missing');
      return;
    }
    
    // Convert to string for consistency
    const safeId = String(productId);
    
    setCart((prevCart) => prevCart.filter((item) => item.id !== safeId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (!productId) {
      console.error('Cannot update quantity: Product ID is missing');
      return;
    }
    
    // Convert to string for consistency
    const safeId = String(productId);
    
    setCart((prevCart) => prevCart.map((item) => (item.id === safeId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
