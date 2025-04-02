import React, { useState, useEffect } from 'react';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/FooterPart';

const FavouritePage = () => {
  const navigate = useNavigate();
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Load favorite items on component mount
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        // Get favorites IDs from localStorage
        const savedFavorites = localStorage.getItem('favorites');
        const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
        
        // Update local state with favorite IDs
        setFavorites(favoriteIds);
        
        if (favoriteIds.length === 0) {
          setFavoriteItems([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch menu items from API
        const response = await fetch(`http://localhost:4000/api/staff/get-all-menu`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch menu details: ${response.status} ${response.statusText}`);
        }
        
        const allMenuItems = await response.json();
        
        // Filter to only include favorited items
        const favorites = allMenuItems.filter(item => 
          favoriteIds.includes(item._id)
        );
        
        setFavoriteItems(favorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFavorites();
  }, []);

  // Remove an item from favorites
  const removeFromFavorites = (itemId) => {
    // Update the UI immediately
    setFavoriteItems(prevItems => prevItems.filter(item => item._id !== itemId));
    
    // Update favorites state
    const updatedFavorites = favorites.filter(id => id !== itemId);
    setFavorites(updatedFavorites);
    
    // Update localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Add to cart functionality
  const addToCart = async (item) => {
    try {
      const response = await fetch("http://localhost:4000/api/cart/add", {
        method: "POST",
        headers: {  
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }
  
      // Navigate to the cart page after successful addition
      navigate('/cart');
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        {/* Favourite Menu Section */}
        <div className="min-h-screen mt-8 bg-gray-50 py-12 px-6">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">My Favourites</h1>
            <p className="text-gray-800 text-lg">These are the items I love the most!</p>
          </div>

          {/* Favourite Menu Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : favoriteItems.length > 0 ? (
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative bg-gray-800 rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 z-10" />
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <p className="text-gray-400">No image available</p>
                      </div>
                    )}
                    {/* Rating Badge (if available) */}
                    {item.rating && (
                      <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center space-x-1 z-20">
                        <FaStar className="text-yellow-400" />
                        <span className="text-gray-800 font-semibold">{item.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
                    <p className="text-gray-400 text-sm mb-4">{item.description || "No description available"}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-400">₹{item.price}</span>
                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => removeFromFavorites(item._id)}
                          className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors transform hover:scale-110"
                          title="Remove from Favorites"
                        >
                          <FaHeart size={18} />
                        </button>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors transform hover:scale-110"
                          title="Add to Cart"
                        >
                          <FaShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-7xl mx-auto text-center py-16">
              <div className="bg-white rounded-xl shadow-md p-8 max-w-lg mx-auto">
                <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
                <p className="text-gray-600 mb-6">Browse our menu and click the heart icon to add items to your favorites.</p>
                <button 
                  onClick={() => navigate('/menu')}
                  className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FavouritePage;