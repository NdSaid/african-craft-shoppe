
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ShoppingCart, ChevronLeft } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getById(productId);
      setProduct(data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorMessage 
          message={error} 
          onRetry={id ? () => fetchProduct(id) : undefined} 
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold">Product not found</h2>
        <Link to="/" className="text-cameroon-accent hover:underline mt-4 inline-block">
          Return to home page
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center text-cameroon-accent hover:text-cameroon-green mb-6 transition-colors">
        <ChevronLeft size={20} />
        <span>Back to Products</span>
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <img 
              src={product.imageUrl || "https://images.unsplash.com/photo-1498936178812-4b2e558d2937"} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-cameroon-green text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                  {product.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xl font-bold text-cameroon-dark">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">From {product.location}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {product.stock} items available
              </p>
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={handleAddToCart}
                className="w-full"
                disabled={product.stock === 0}
              >
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>
              {product.stock === 0 && (
                <p className="text-center text-destructive mt-2">Out of stock</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
