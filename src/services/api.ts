
import { Product, Order, CartItem } from '../types';

const BASE_URL = '/api';

// Error handling helper
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'An error occurred');
  }
  return response.json();
};

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/products`);
    return handleResponse(response);
  },
  
  getById: async (id: string): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    return handleResponse(response);
  },
  
  search: async (query: string): Promise<Product[]> => {
    const response = await fetch(`${BASE_URL}/products?search=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },
  
  filter: async (filters: Record<string, string | number>): Promise<Product[]> => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const response = await fetch(`${BASE_URL}/products?${queryParams.toString()}`);
    return handleResponse(response);
  }
};

// Cart API
export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await fetch(`${BASE_URL}/cart`);
    return handleResponse(response);
  },
  
  addToCart: async (productId: string, quantity: number): Promise<CartItem[]> => {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    });
    return handleResponse(response);
  },
  
  updateQuantity: async (productId: string, quantity: number): Promise<CartItem[]> => {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    });
    return handleResponse(response);
  },
  
  removeFromCart: async (productId: string): Promise<CartItem[]> => {
    const response = await fetch(`${BASE_URL}/cart/${productId}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },
  
  clearCart: async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// Orders API
export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await fetch(`${BASE_URL}/orders`);
    return handleResponse(response);
  },
  
  getById: async (id: string): Promise<Order> => {
    const response = await fetch(`${BASE_URL}/orders/${id}`);
    return handleResponse(response);
  },
  
  create: async (orderData: { customerName: string, customerAddress: string }): Promise<Order> => {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  }
};
