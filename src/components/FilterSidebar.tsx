
import React, { useState, useEffect } from 'react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { FilterOptions } from '../types';

interface FilterSidebarProps {
  onApplyFilters: (filters: FilterOptions) => void;
  categories: string[];
  locations: string[];
  maxPriceValue: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onApplyFilters, 
  categories, 
  locations,
  maxPriceValue
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedLocation, setSelectedLocation] = useState<string>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPriceValue || 1000]);

  // Update price range max when maxPriceValue changes
  useEffect(() => {
    if (maxPriceValue && maxPriceValue > 0) {
      setPriceRange([priceRange[0], maxPriceValue]);
    }
  }, [maxPriceValue]);

  const handleApplyFilters = () => {
    const filters: FilterOptions = {};
    
    if (selectedCategory) {
      filters.category = selectedCategory;
    }
    
    if (selectedLocation) {
      filters.location = selectedLocation;
    }
    
    filters.minPrice = priceRange[0];
    filters.maxPrice = priceRange[1];
    
    onApplyFilters(filters);
  };
  
  const handleReset = () => {
    setSelectedCategory(undefined);
    setSelectedLocation(undefined);
    setPriceRange([0, maxPriceValue || 1000]);
    onApplyFilters({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Category</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(
                  selectedCategory === category ? undefined : category
                )}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Location Filter */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Location</Label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLocation(
                  selectedLocation === location ? undefined : location
                )}
                className="text-xs"
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Price Range Filter */}
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-sm font-medium">Price Range</Label>
            <span className="text-sm text-gray-500">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={[0, 1000]}
            value={priceRange}
            min={0}
            max={maxPriceValue || 1000}
            step={10}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="my-6"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
