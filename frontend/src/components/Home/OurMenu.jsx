import React from 'react';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';

const OurMenu = () => {
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
    // Add more menu items here as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-4 text-center">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <a href="/menus" className="text-lg font-medium text-blue-500 hover:text-blue-700">
            See All
          </a>
        </div>
        <p className="text-gray-800 text-lg">Explore our wide range of delicious dishes</p>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="group relative bg-gray-800 rounded-xl overflow-hidden
                       transform transition-all duration-300
                       hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-black/10 z-10" />
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transform transition-transform duration-300 
                         group-hover:scale-110"
              />
              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full
                            flex items-center space-x-1 z-20">
                <FaStar className="text-yellow-400" />
                <span className="text-gray-800 font-semibold">{item.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">{item.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-400">{item.price}</span>

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
        ))}
      </div>
    </div>
  );
};

export default OurMenu;
