export interface Product {
  id: string  // Always treat IDs as strings for frontend use
  name: string
  description: string
  price: number
  image: string
  category: string
  unit: string
  sale?: boolean
}
