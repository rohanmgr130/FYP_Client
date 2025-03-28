import React, { useState } from 'react';
import { FaArrowLeft, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AddToCart = () => {
  // State for cart items
  const [cartItems, setCartItems] = useState([]);

  // Handle quantity change
  const updateQuantity = (id, change) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Handle item removal
  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Calculate tax (assuming 10%)
  const tax = subtotal * 0.1;
  
  // Calculate total
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 mt-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Cart</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <FaTrash className="text-gray-400 text-2xl" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
            <Link 
              to="/" 
              className="inline-block px-4 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex py-4 border-b">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center bg-gray-200" />
                  </div>
                  
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.name}</h3>
                      <p className="ml-4">Rs {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-gray-600 hover:text-gray-800"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-gray-600 hover:text-gray-800"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span>Rs {tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-medium text-gray-900">
                  <span>Total</span>
                  <span>Rs {total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md transition"
                onClick={() => alert("Order Placed successfully")}
              >
                Place order
              </button>
            </div>
            
            {/* Continue shopping link */}
            <div className="text-center">
              <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddToCart;