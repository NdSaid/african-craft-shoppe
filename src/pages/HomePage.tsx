
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productsApi } from '../services/api';
import { Product, FilterOptions } from '../types';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let fetchedProducts: Product[];
      
      if (searchQuery) {
        fetchedProducts = await productsApi.search(searchQuery);
      } else {
        fetchedProducts = await productsApi.getAll();
      }
      
      setProducts(fetchedProducts);
      
      // Extract unique categories and locations
      const uniqueCategories = Array.from(
        new Set(fetchedProducts.map(product => product.category))
      );
      
      const uniqueLocations = Array.from(
        new Set(fetchedProducts.map(product => product.location))
      );
      
      // Find the maximum price
      const highestPrice = Math.max(
        ...fetchedProducts.map(product => product.price)
      );
      
      setCategories(uniqueCategories);
      setLocations(uniqueLocations);
      setMaxPrice(highestPrice || 1000);
      
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async (filters: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);
      
      const filteredProducts = await productsApi.filter(filters);
      setProducts(filteredProducts);
      
    } catch (err) {
      console.error('Failed to filter products:', err);
      setError('Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {searchQuery 
          ? `Search Results for "${searchQuery}"` 
          : "Discover Cameroon's Finest Products"}
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-64 shrink-0">
          <FilterSidebar 
            onApplyFilters={handleApplyFilters}
            categories={categories}
            locations={locations}
            maxPriceValue={maxPrice}
          />
        </aside>
        
        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchProducts} />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">No products found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
