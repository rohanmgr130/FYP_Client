import React from 'react';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import Card from '../Card';

function TodaysSpecial() {
  const menuItems = [
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
    
  ];
  

  return (
    <div className="min-h-screen  bg-gray-50  py-12 px-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Today's Special
        </h1>
        <p className="text-gray-800 text-lg">
          Discover our chef's specially curated menu items
        </p>
      </div>

      {/* TodaysSpecial Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item, index) => (
          <Card item={item} key={index}/>
        ))}
      </div>
    </div>
  );
}

export default TodaysSpecial;