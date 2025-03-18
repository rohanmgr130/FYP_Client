import React from 'react';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';

const Card = ({ item }) => {
  return (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center space-x-1 z-20">
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
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-red-400 hover:text-red-300 transition-colors transform hover:scale-110"
              title="Add to Favorites"
            >
              <FaHeart size={18} />
            </button>
            <button
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-colors transform hover:scale-110"
              title="Add to Cart"
            >
              <FaShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
