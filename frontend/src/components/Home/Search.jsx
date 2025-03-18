import React, { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

function Search() {
  const imageUrl = "bgimg.jpg";
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sample data - replace with your actual data
  const popularSearches = ['Pizza', 'Burger', 'Sushi', 'Salad', 'Noodles', 'Ice Cream'];
  const suggestions = [
    { id: 1, name: 'Margherita Pizza', category: 'Pizza' },
    { id: 2, name: 'Chicken Burger', category: 'Burger' },
    { id: 3, name: 'Sushi Roll', category: 'Sushi' },
    { id: 4, name: 'Caesar Salad', category: 'Salad' },
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    
    if (value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handlePopularSearch = (term) => {
    setSearchTerm(term);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
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
          <div className="relative group">
            {/* Search Input */}
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search category or menu..."
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
            <button className="absolute right-2 top-1/2 -translate-y-1/2
                             w-12 h-12 flex items-center justify-center
                             bg-blue-500 rounded-lg text-white
                             transition-all duration-300
                             hover:bg-blue-600 active:scale-95
                             shadow-lg">
              
              <IoSearch className="w-5 h-5 stroke-[2.5]"/>
            </button>

            {/* Search Suggestions */}
            {showSuggestions && searchTerm && (
              <div className="absolute w-full mt-2 py-2 bg-white rounded-xl shadow-xl 
                            border border-gray-100 z-50">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handlePopularSearch(item.name)}
                    className="w-full px-6 py-3 text-left hover:bg-gray-50 
                              flex items-center justify-between group"
                  >
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-sm text-gray-400 group-hover:text-gray-600">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Searches */}
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-300 flex-wrap">
            <span>Popular:</span>
            {popularSearches.map((term, index) => (
              <button
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
      </div>
    </div>
  );
}

export default Search;