import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

// Cash payment component
const CashPayment = ({ cartTotal, onPlaceOrder, loading, checkoutLoading }) => {
  // Toast state
  const [toast, setToast] = useState(null);

  // Handle place order with toast validation
  const handlePlaceOrder = () => {
    if (!cartTotal || cartTotal <= 0) {
      showToast("Your cart is empty", "error");
      return;
    }
    
    showToast("Processing your order...", "info");
    onPlaceOrder();
  };

  // Show toast notification
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md relative">
      {/* Toast notification */}
      {toast && (
        <div 
          className={`absolute top-2 right-2 left-2 p-3 rounded-md shadow-md flex items-center justify-between ${
            toast.type === "error" ? "bg-red-100 text-red-700" : 
            toast.type === "success" ? "bg-green-100 text-green-700" : 
            "bg-blue-100 text-blue-700"
          }`}
        >
          <div className="flex items-center">
            {toast.type === "error" ? (
              <AlertCircle className="mr-2 h-5 w-5" />
            ) : toast.type === "success" ? (
              <CheckCircle className="mr-2 h-5 w-5" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5" />
            )}
            <span>{toast.message}</span>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Cash Payment Details</h2>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>Cart Total:</span>
          {loading ? (
            <span className="font-medium">Loading...</span>
          ) : (
            <span className="font-medium">Rs. {cartTotal?.toFixed(2) || '0.00'}</span>
          )}
        </div>
        <div className="flex justify-between mb-2 text-gray-600 text-sm">
          <span>Delivery Fee:</span>
          <span>Free</span>
        </div>
        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
          <span>Total Amount:</span>
          {loading ? (
            <span className="font-medium">Loading...</span>
          ) : (
            <span className="font-medium">Rs. {cartTotal?.toFixed(2) || '0.00'}</span>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-600 mb-4 text-sm">
          Collect your order from college canteen.
        </p>
        <button 
          onClick={handlePlaceOrder}
          disabled={checkoutLoading || !cartTotal || cartTotal <= 0}
          className={`w-full py-3 rounded-md font-medium transition duration-200 ${
            !checkoutLoading && cartTotal > 0
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {checkoutLoading ? "Please wait..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CashPayment;