import { Product } from './types';

const API_URL = 'http://localhost:5000/api';

/**
 * Fetch all products from the backend
 * @returns {Promise<Product[]>} - Array of products
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID
 * @param {string|number} id - Product ID
 * @returns {Promise<Product|null>} - Product or null if not found
 */
export async function fetchProductById(id: string | number): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetch products by category
 * @param {number} categoryId - Category ID
 * @returns {Promise<Product[]>} - Array of products in the category
 */
export async function fetchProductsByCategory(categoryId: number): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products?categoryId=${categoryId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    return [];
  }
} 