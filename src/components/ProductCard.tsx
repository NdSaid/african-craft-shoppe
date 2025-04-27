
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();  // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    addToCart(product, 1);
  };
  
  // Use a placeholder image if the product image URL is not provided
  const imageUrl = product.imageUrl || "https://images.unsplash.com/photo-1498936178812-4b2e558d2937";

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative pb-[75%] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-cameroon-green text-white px-2 py-1 rounded-full text-xs font-medium">
              {product.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="font-bold text-cameroon-dark">
              ${product.price.toFixed(2)}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-cameroon-green hover:text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} className="mr-1" />
              Add
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">{product.location}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
