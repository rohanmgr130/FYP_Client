import React from 'react';
import { FaStar, FaHeart, FaShoppingCart, FaLeaf, FaDrumstickBite, FaMugHot } from 'react-icons/fa';

const Card = ({ item, addToCart }) => {
  // Helper function to get the appropriate icon based on item type
  const getTypeIcon = (type) => {
    if (!type) return null;
    
    switch (type.toLowerCase()) {
      case 'vegetarian':
        return <FaLeaf className="text-green-500" title="Vegetarian" />;
      case 'non-vegetarian':
        return <FaDrumstickBite className="text-red-500" title="Non-Vegetarian" />;
      case 'drinks':
      case 'beverage':
        return <FaMugHot className="text-orange-400" title="Drinks" />;
      default:
        return null;
    }
  };

  // Generate a placeholder rating if none exists
  const rating = item.rating || (4 + Math.random()).toFixed(1);

  const userId = localStorage.getItem("id")

  // Handle adding to cart
  const handleAddToCart = async(menuId) => {
    const quantity = 1
    if(!userId){
      alert("Please login to add to cart")
      return
    }
   try {
     const response = await fetch("http://localhost:4000/api/add-to-cart",{
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         },
         body: JSON.stringify({
          
           "productId": menuId,
           "userId": userId,
           "productQuantity": quantity
           })
     })
 
     const data = await response.json()
     if(data.success){
       alert("Added to cart")
     }else{
       alert("Failed to add to cart")
     }
   } catch (error) {
      console.log("error while adding to cart : ",error)
   }



    
  };

  // Handle add to favorites
  const handleAddToFavorites = () => {
    // Implement favorites functionality if needed
    console.log('Added to favorites:', item.title);
  };

  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-700">
      {/* Menu Type Badge */}
      {item.menuType && (
        <div className="absolute top-0 left-0 z-20">
          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
            {item.menuType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
        <img
          src={`http://localhost:4000${item.image}` || "https://hungerend.com/wp-content/uploads/2023/06/buff-keema-noodles.jpg"}
          alt={item.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center space-x-1 z-20 shadow-md">
          <FaStar className="text-yellow-400" />
          <span className="text-gray-800 font-semibold">{rating}</span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">
            Rs. {item.price}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-white">{item.title}</h2>
          <div className="ml-2">{item.type && getTypeIcon(item.type)}</div>
        </div>
        
        {/* Categories */}
        {item.categories && item.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.categories.map((category, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
              >
                {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            ))}
          </div>
        )}
        
        {/* Description - Optional */}
        {item.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handleAddToFavorites}
            className="flex-1 mr-2 py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors flex items-center justify-center space-x-2 group-hover:bg-red-600"
          >
            <FaHeart className="text-red-400 group-hover:text-white" />
            <span className="text-sm font-medium">Favorite</span>
          </button>
          <button
            onClick={()=>handleAddToCart(item._id)}
            className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center space-x-2"
          >
            <FaShoppingCart className="text-white" />
            <span className="text-sm font-medium">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;