import React, { useState } from 'react';
import { FaStar, FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/FooterPart';
import Card from '../components/Card';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState([
    {
      name: "Margherita Pizza",
      image: "bgimg.jpg",
      rating: 4.5,
      description: "Classic pizza with fresh mozzarella and basil.",
      price: "$12.99"
    },
    {
      name: "Cheeseburger",
      image: "bgimg.jpg",
      rating: 4.7,
      description: "Juicy beef patty with cheddar cheese and all the fixings.",
      price: "$9.99"
    },
    {
      name: "Spaghetti Carbonara",
      image: "bgimg.jpg",
      rating: 4.8,
      description: "Classic Italian pasta with creamy egg and bacon sauce.",
      price: "$14.99"
    },
    {
      name: "Chicken Tikka Masala",
      image: "bgimg.jpg",
      rating: 4.6,
      description: "Tender chicken pieces in a rich, spicy tomato gravy.",
      price: "$16.99"
    },
    {
      name: "Mushroom Risotto",
      image: "bgimg.jpg",
      rating: 4.4,
      description: "Creamy rice dish with wild mushrooms and Parmesan.",
      price: "$13.99"
    },
    {
      name: "Sushi Roll",
      image: "bgimg.jpg",
      rating: 4.9,
      description: "Fresh sushi rolls with fish and vegetables.",
      price: "$18.99"
    },
    // Add more items as needed
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-10 py-12 px-6">
        {/* Search Bar Section */} 
        <div className="max-w-7xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Search Menu</h1>
          </div>

        <div className="max-w-7xl mx-auto mb-8 text-center">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for your favorite dish..."
              className="w-full py-3 pl-10 pr-4 rounded-xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" size={20} />
          </div>
        </div>

        {/* Search Results Section */}
        {searchTerm && (
          <div className="max-w-7xl mx-auto mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h2>
            <p className="text-gray-700 mb-6">{filteredItems.length} results found</p>
          </div>
        )}

        {/* Search Results Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <Card key={index} item={item}/>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
