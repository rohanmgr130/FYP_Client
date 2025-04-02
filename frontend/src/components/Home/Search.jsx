import React, { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'; // Import for navigation

function Search() {
  const navigate = useNavigate(); // Hook for navigation
  const imageUrl = "bgimg.jpg";
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isHoveringFilter, setIsHoveringFilter] = useState(false);
  
  // Menu items state
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState(250);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");

  // Sample data for initial display
  const popularSearches = ['Pizza', 'Burger', 'Sushi', 'Salad', 'Noodles', 'Ice Cream'];

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:4000/api/staff/get-all-menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch menu details: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      setMenuItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
      setError('Failed to load menu items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Helper function to safely convert price to a number
  const safePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return 0;
  };

  // Extract unique categories and types from menu items
  const getUniqueCategories = () => {
    const allCategories = menuItems.flatMap(item => item.categories || []);
    return ["All", ...new Set(allCategories)];
  };

  const getUniqueTypes = () => {
    const allTypes = menuItems.map(item => item.type || "");
    return ["All", ...new Set(allTypes.filter(type => type))];
  };

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    
    // Show suggestions if there's a search term
    if (value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    
    // Apply filters with search term
    applyFilters(value, activeCategory, activeType, priceRange);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Apply all filters
  const applyFilters = (query = searchTerm, category = activeCategory, type = activeType, price = priceRange) => {
    let result = [...menuItems];
    
    // Filter by category
    if (category !== "All") {
      result = result.filter(item => 
        item.categories && item.categories.includes(category)
      );
    }
    
    // Filter by type
    if (type !== "All") {
      result = result.filter(item => 
        item.type && item.type.toLowerCase() === type.toLowerCase()
      );
    }
    
    // Filter by price
    result = result.filter(item => {
      const itemPrice = safePrice(item.price);
      return itemPrice <= price;
    });
    
    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(item =>
        (item.title || '').toLowerCase().includes(lowercaseQuery) ||
        (item.description || '').toLowerCase().includes(lowercaseQuery) ||
        (item.categories || []).some(cat => cat.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    setFilteredItems(result);
  };

  // Handle filter changes
  useEffect(() => {
    applyFilters();
  }, [activeCategory, activeType, priceRange]);

  // Handle popular search click
  const handlePopularSearch = (term) => {
    setSearchTerm(term);
    setShowSuggestions(false);
    applyFilters(term, activeCategory, activeType, priceRange);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    applyFilters('', activeCategory, activeType, priceRange);
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveCategory("All");
    setActiveType("All");
    setPriceRange(250);
    // Keep searchTerm as is
    applyFilters(searchTerm, "All", "All", 250);
  };

  // Handle mouse enter/leave for filters
  const handleFilterMouseEnter = () => {
    setIsHoveringFilter(true);
  };

  const handleFilterMouseLeave = () => {
    setIsHoveringFilter(false);
  };

  // NEW: Handle item click to navigate to menu detail page
  const handleItemClick = (item) => {
    // Navigate to the menu detail page with the item ID
    navigate(`/menu/${item._id}`, { state: { itemDetails: item } });
    setShowSuggestions(false);
  };

  // NEW: Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to search results page with search parameters
    navigate('/menu', { 
      state: { 
        searchTerm, 
        activeCategory,
        activeType,
        priceRange
      } 
    });
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full h-[540px]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />

      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        {/* Header Text */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Find Your Favorite Food
          </h1>
          <p className="text-gray-200 text-lg md:text-xl">
            Search from our wide selection of delicious dishes
          </p>
        </div>

        {/* Search Container */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="relative group">
            {/* Search Input */}
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by food name, category or description..."
              className="w-full px-6 py-4 pr-24 text-lg rounded-xl
                         bg-white/95 backdrop-blur-sm
                         placeholder-gray-400 text-gray-700
                         shadow-xl outline-none
                         transition-all duration-300
                         focus:bg-white focus:shadow-2xl
                         border-2 border-transparent
                         focus:border-blue-500"
            />

            {/* Clear and Loading Button */}
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 top-1/2 -translate-y-1/2 p-2
                          text-gray-400 hover:text-gray-600
                          transition-colors"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                  <RxCross1 className="w-5 h-5"/>
                )}
              </button>
            )}

            {/* Search Button */}
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2
                             w-12 h-12 flex items-center justify-center
                             bg-blue-500 rounded-lg text-white
                             transition-all duration-300
                             hover:bg-blue-600 active:scale-95
                             shadow-lg">
              <IoSearch className="w-5 h-5 stroke-[2.5]"/>
            </button>

            {/* Search Suggestions */}
            {showSuggestions && searchTerm && filteredItems.length > 0 && (
              <div className="absolute w-full mt-2 py-2 bg-white rounded-xl shadow-xl 
                            border border-gray-100 z-50 max-h-[300px] overflow-y-auto">
                {filteredItems.slice(0, 6).map((item) => (
                  <button
                    type="button"
                    key={item._id || item.id}
                    onClick={() => handleItemClick(item)}
                    className="w-full px-6 py-3 text-left hover:bg-gray-50 
                              flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'placeholder-food.jpg';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">{item.title}</span>
                        <span className="text-xs text-gray-400">{item.description?.substring(0, 60)}...</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-blue-500 group-hover:text-blue-600">
                      {item.price ? `₹${item.price}` : ''}
                    </span>
                  </button>
                ))}
                {filteredItems.length > 6 && (
                  <div 
                    className="text-center py-2 text-sm text-blue-500 cursor-pointer hover:underline"
                    onClick={handleSearchSubmit}
                  >
                    Show all {filteredItems.length} results
                  </div>
                )}
              </div>
            )}
          </form>

          {/* No Results Message */}
          {searchTerm && filteredItems.length === 0 && !isSearching && (
            <div className="w-full mt-2 p-3 bg-white/90 backdrop-blur-sm rounded-xl text-center">
              <p className="text-gray-600">No results found for "{searchTerm}"</p>
              <p className="text-sm text-gray-400 mt-1">Try different keywords or filters</p>
            </div>
          )}

          {/* Filter Button and Popular Searches */}
          <div className="mt-4 flex items-center justify-between">
            <div className="relative">
              <button 
                type="button"
                onMouseEnter={handleFilterMouseEnter}
                className="flex items-center gap-2 px-4 py-2 
                        bg-white/20 text-white rounded-lg 
                        hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                <FaFilter /> Filters
              </button>
              
              {/* Hover Filter Panel */}
              {isHoveringFilter && (
                <div 
                  className="absolute top-full left-0 mt-2 w-72 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl z-50"
                  onMouseEnter={handleFilterMouseEnter}
                  onMouseLeave={handleFilterMouseLeave}
                >
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {getUniqueCategories().slice(0, 6).map(category => (
                        <button
                          type="button"
                          key={category}
                          onClick={() => setActiveCategory(category)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                            ${activeCategory === category 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {getUniqueTypes().slice(0, 4).map(type => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setActiveType(type)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                            ${activeType === type 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Max Price: ₹{priceRange}</h3>
                    <input
                      type="range"
                      min="20"
                      max="1250"
                      step="5"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Rs 5</span>
                      <span>Rs250</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={resetFilters}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center flex-wrap gap-2 text-sm text-gray-300">
              <span>Popular:</span>
              {popularSearches.slice(0, 4).map((term, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => handlePopularSearch(term)}
                  className="px-3 py-1 rounded-full 
                          bg-white/10 hover:bg-white/20
                          transition-all duration-300
                          backdrop-blur-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Regular Filter Panel (if activated through showFilters toggle) */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl">
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {getUniqueCategories().slice(0, 6).map(category => (
                    <button
                      type="button"
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                        ${activeCategory === category 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Type</h3>
                <div className="flex flex-wrap gap-2">
                  {getUniqueTypes().slice(0, 4).map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setActiveType(type)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                        ${activeType === type 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Max Price: ₹{priceRange}</h3>
                <input
                  type="range"
                  min="20"
                  max="1250"
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹5</span>
                  <span>₹250</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;