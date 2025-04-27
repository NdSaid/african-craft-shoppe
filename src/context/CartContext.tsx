
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { cartApi } from '../services/api';
import { toast } from '../hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate derived values
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const cartItems = await cartApi.getCart();
        setItems(cartItems);
        setError(null);
      } catch (err) {
        setError('Failed to load cart');
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      setLoading(true);
      // Optimistic update
      const existingItemIndex = items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        const newQuantity = items[existingItemIndex].quantity + quantity;
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], quantity: newQuantity };
        setItems(updatedItems);
      } else {
        setItems([...items, { product, quantity }]);
      }
      
      await cartApi.addToCart(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart`
      });
    } catch (err) {
      setError('Failed to add item to cart');
      console.error('Failed to add to cart:', err);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      // Optimistic update
      setItems(items.filter(item => item.product.id !== productId));
      await cartApi.removeFromCart(productId);
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error('Failed to remove from cart:', err);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      // Optimistic update
      const updatedItems = items.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      );
      setItems(updatedItems);
      
      await cartApi.updateQuantity(productId, quantity);
    } catch (err) {
      setError('Failed to update quantity');
      console.error('Failed to update quantity:', err);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      // Optimistic update
      setItems([]);
      await cartApi.clearCart();
    } catch (err) {
      setError('Failed to clear cart');
      console.error('Failed to clear cart:', err);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider 
      value={{
        items,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
