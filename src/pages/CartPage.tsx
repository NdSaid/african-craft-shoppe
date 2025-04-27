
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Trash, ShoppingCart, Plus, Minus, ChevronLeft } from 'lucide-react';

const CartPage = () => {
  const { items, loading, error, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

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
        <ErrorMessage message={error} />
      </div>
    );
  }

  const handleQuantityChange = (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center text-cameroon-accent hover:text-cameroon-green mb-6 transition-colors">
        <ChevronLeft size={20} />
        <span>Continue Shopping</span>
      </Link>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex flex-col items-center py-12">
            <ShoppingCart size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link to="/">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.product.id}>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                            <img
                              src={item.product.imageUrl || "https://images.unsplash.com/photo-1498936178812-4b2e558d2937"}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4">
                            <Link 
                              to={`/product/${item.product.id}`} 
                              className="font-medium text-gray-900 hover:text-cameroon-accent"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-500">{item.product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        ${item.product.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout} 
                className="w-full mt-6"
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
