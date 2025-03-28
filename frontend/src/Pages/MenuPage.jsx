import React, { useState, useEffect } from 'react';
import { FaHeart, FaShoppingCart, FaStar, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/FooterPart';

const OurMenu = () => {
  const navigate = useNavigate();

  // State for menu items and API handling
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // Filtering states
  const [priceRange, setPriceRange] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [dietaryFilters, setDietaryFilters] = useState([]);

 

  // Helper function to safely convert price to a number
  const safePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Remove currency symbol and non-numeric characters
      const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
      return isNaN(numericPrice) ? 0 : numericPrice;
    }
    return 0;
  };

  // Add to cart functionality
  const addToCart = async (item) => {
    try {
      // Make the POST request to the backend
      const response = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        headers: {  
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item }), // Send the item as JSON
      });
  
      // Check if the response is okay
      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Update the cart state with the response from the backend
      setCart(data.cart); // Assuming the backend sends the updated cart
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  

  // Define categories and dietary options based on the data
  const categories = ["All", ...new Set(menuItems.flatMap(item => item.categories || []))];
  const dietaryOptions = ["Vegetarian", "Non-Vegetarian"];

  // Fetch menu items from API
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:4000/api/staff/get-all-menu')
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      setMenuItems(data)
      setFilteredItems(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch menu items. Please try again later.')
      console.error('Error fetching menu items:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems()
  }, [])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = menuItems;
    
    // Filter by category
    if (activeCategory !== "All") {
      result = result.filter(item => 
        item.categories && item.categories.includes(activeCategory)
      );
    }
    
    // Filter by dietary restrictions
    if (dietaryFilters.length > 0) {
      result = result.filter(item => {
        const itemType = (item.type || '').toLowerCase();
        return dietaryFilters.some(diet => 
          (diet === "Vegetarian" && itemType === "vegetarian") ||
          (diet === "Non-Vegetarian" && itemType === "non-vegetarian")
        );
      });
    }
    
    // Filter by price
    result = result.filter(item => {
      const itemPrice = safePrice(item.price);
      return itemPrice <= priceRange;
    });
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        (item.title || '').toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(result);
  }, [menuItems, activeCategory, dietaryFilters, priceRange, searchQuery]);

  // Toggle dietary filter
  const toggleDietaryFilter = (diet) => {
    if (dietaryFilters.includes(diet)) {
      setDietaryFilters(dietaryFilters.filter(d => d !== diet));
    } else {
      setDietaryFilters([...dietaryFilters, diet]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveCategory("All");
    setDietaryFilters([]);
    setPriceRange(20);
    setSearchQuery("");
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading menu items...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-600 mb-4">{error}</div>
          <button 
            onClick={fetchMenuItems}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-12 px-6 mt-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 text-center">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        <p className="text-gray-800 text-lg">Explore our wide range of delicious dishes</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search our menu..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="max-w-7xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-md">
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${activeCategory === category 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-bold text-lg mb-3">Dietary Preferences</h2>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map(diet => (
                <button
                  key={diet}
                  onClick={() => toggleDietaryFilter(diet)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${dietaryFilters.includes(diet) 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-3">Max Price: ${priceRange}</h2>
            <input
              type="range"
              min="5"
              max="20"
              step="1"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$5</span>
              <span>$20</span>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills (always visible) */}
      <div className="max-w-7xl mx-auto mb-8 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${activeCategory === category 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-4">
        <p className="text-gray-600">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="group relative bg-gray-800 rounded-xl overflow-hidden
                       transform transition-all duration-300
                       hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-black/10 z-10" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform transition-transform duration-300 
                           group-hover:scale-110"
                />
                {/* Category Badge */}
                {item.categories && item.categories.length > 0 && (
                  <div className="absolute top-4 left-4 bg-blue-500/90 px-3 py-1 rounded-full z-20">
                    <span className="text-white text-sm font-medium">{item.categories[0]}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-2 flex justify-between items-start">
                  <h2 className="text-xl font-bold text-white">{item.title}</h2>
                  {item.type && (
                    <div className="flex gap-1">
                      {item.type.toLowerCase() === "vegetarian" && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Veg</span>
                      )}
                      {item.type.toLowerCase() === "non-vegetarian" && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Non-Veg</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-400">
                    ${safePrice(item.price).toFixed(2)}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 
                                text-red-400 hover:text-red-300 transition-colors
                                transform hover:scale-110"
                      title="Add to Favorites"
                    >
                      <FaHeart size={18} />
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 
                                text-white transition-colors
                                transform hover:scale-110"
                      title="Add to Cart"
                    >
                      <FaShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No menu items match your filters</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria</p>
            <button 
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default OurMenu;