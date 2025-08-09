export interface Product {
  id: string | number
  name: string
  description: string
  price: number
  image?: string
  categoryId?: number
  category?: {
    id: number
    name: string
  } | string
  unit?: string
  stock?: number
  sale?: boolean
  createdAt?: string
  updatedAt?: string
} 