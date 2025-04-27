
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-cameroon-red"></span>
              <span className="w-3 h-3 rounded-full bg-cameroon-yellow"></span>
              <span className="w-3 h-3 rounded-full bg-cameroon-green"></span>
            </div>
            <span className="font-bold text-xl">Made in Cameroon</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-700"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <div className="relative">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="rounded-l-none">
                  <Search size={18} />
                </Button>
              </form>
            </div>

            <nav className="flex items-center space-x-4">
              <Link to="/" className="font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/orders" className="font-medium hover:text-primary transition-colors">
                My Orders
              </Link>
              <Link to="/cart" className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-cameroon-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <form onSubmit={handleSearch} className="flex mb-4">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none">
                <Search size={18} />
              </Button>
            </form>
            
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/orders" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </Link>
              <Link 
                to="/cart" 
                className="relative py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" className="flex items-center gap-2 w-full">
                  <ShoppingCart size={18} />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-cameroon-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
