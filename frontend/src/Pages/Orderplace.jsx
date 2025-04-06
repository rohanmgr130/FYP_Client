import React from 'react';
import { useNavigate } from 'react-router-dom';

function Orderplace() {
  const navigate = useNavigate();
  
  const orderDetails = {
    orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
    orderDate: new Date().toLocaleDateString(),
    items: [
      { name: "Product Name", quantity: 1, price: 2499.00 }
    ],
    paymentMethod: "Khalti Pay",
    subtotal: 2499.00,
    deliveryFee: 100.00,
    total: 2599.00
  };

  const handlePlaceOrder = () => {
    // Navigate to the orderconfirm route and pass orderDetails as state
    navigate('/order-confirm', { state: { orderDetails } });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-center border-b relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-4 flex items-center text-purple-700 font-medium bg-purple-50 px-4 py-2 rounded-full hover:bg-purple-100 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        <h2 className="text-xl font-semibold">Order Place</h2>
      </div>
      
      {/* Order Details */}
      <div className="px-6 pb-6 pt-6">
        <h4 className="font-semibold text-lg mb-3 text-gray-800">Order Details</h4>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          {orderDetails.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">Rs. {item.price.toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Subtotal</span>
              <span>Rs. {orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-1">
              <span>Delivery Fee</span>
              <span>Rs. {orderDetails.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Total</span>
              <span>Rs. {orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <h5 className="font-medium mb-2">Payment Method</h5>
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-full mr-2">
              <div className="bg-purple-700 rounded-sm p-1 h-5 w-5 flex items-center justify-center">
                <span className="text-white text-xs font-bold">K</span>
              </div>
            </div>
            <span>{orderDetails.paymentMethod}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            className="flex-1 bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Orderplace;