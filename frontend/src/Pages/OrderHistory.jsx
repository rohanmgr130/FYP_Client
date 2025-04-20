import React, { useState, useEffect } from "react";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import Footer from "../components/FooterPart";
import Navbar from "../components/Navbar";

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Fetch user ID from localStorage
  const userId = localStorage.getItem("id");

  // Fetch order history for the user from backend
  const getOrderHistory = async () => {
    if (!userId) {
      setError("User ID not found in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/api/orderhistory/user/${userId}`);
      
      const data = await res.json();
      console.log("Order history data:", data);
      
      // If API returns success: true and has history data
      if (data.success && data.history) {
        setOrderHistory(data.history);
        
        // Fetch details for each order
        if (data.history.orders && data.history.orders.length > 0) {
          await fetchOrderDetails(data.history.orders);
        }
      } else {
        // Handle the case when API returns success: false or no history
        setOrderHistory(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch details for each order ID
  const fetchOrderDetails = async (orderIds) => {
    const details = {};
    
    for (const orderId of orderIds) {
      try {
        const res = await fetch(`http://localhost:4000/api/order/${orderId}`);
        
        if (res.ok) {
          const data = await res.json();
          details[orderId] = data.order;
        } else {
          console.error(`Could not fetch details for order ${orderId}`);
          details[orderId] = { error: "Could not load order details" };
        }
      } catch (err) {
        console.error(`Error fetching order ${orderId}:`, err);
        details[orderId] = { error: "Error loading order details" };
      }
    }
    
    setOrderDetails(details);
  };

  useEffect(() => {
    getOrderHistory();
  }, [userId]);

  // Handle deleting an order from history
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this order from your history?")) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:4000/api/orderhistory`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          orderId: orderId
        }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete order");
      }
      
      const data = await res.json();
      console.log("Order deleted:", data);
      
      // Refresh the list after deletion
      getOrderHistory();
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Error deleting order. Please try again.");
    }
  };

  // View order details
  const viewOrderDetails = (orderId) => {
    setSelectedOrder(orderId);
    setViewModalOpen(true);
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate total items in order
  const countItems = (order) => {
    if (!order || !order.items) return "N/A";
    return order.items.length;
  };

  // Close modal
  const closeModal = () => {
    setViewModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-xl">Loading order history...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-lg">
            <p className="text-xl text-red-600 font-bold mb-2">Error</p>
            <p className="text-gray-700">{error}</p>
            <button 
              onClick={() => getOrderHistory()}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen mt-10 bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-700 mt-2">Review your past orders and manage your history</p>
          </div>

          {orderHistory && orderHistory.orders && orderHistory.orders.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Order ID</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Items</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Total Amount</th>
                    <th className="py-3 px-6 text-center text-sm font-medium text-gray-600">Status</th>
                    <th className="py-3 px-6 text-center text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.orders.map((orderId) => {
                    const order = orderDetails[orderId] || {};
                    return (
                      <tr key={orderId} className="border-t hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                          {/* #{orderId.substring(orderId.length - 8)} */}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {formatDate(order.createdAt || orderHistory.createdAt)}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-800">
                          {order.items ? order.items.length : 'N/A'} items
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                          ${order.additionalInfo?.totalAmount?.toFixed(2) || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status || "Processing"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center space-x-4">
                            <button 
                              onClick={() => viewOrderDetails(orderId)}
                              className="text-blue-500 hover:text-blue-700" 
                              title="View Order Details"
                            >
                              <FaEye size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(orderId)}
                              className="text-red-500 hover:text-red-700"
                              title="Remove from History"
                            >
                              <FaTrashAlt size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <p className="text-gray-600 text-xl font-medium mb-2">No order history found</p>
              <p className="text-gray-500">Your past orders will appear here once you make a purchase</p>
              <a href="/" className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-md">
                Start Shopping
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details <span className="text-blue-500">#{selectedOrder.substring(selectedOrder.length - 8)}</span>
                </h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {orderDetails[selectedOrder] ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                      <p className="text-gray-800">{formatDate(orderDetails[selectedOrder].createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                      <p className="text-gray-800 capitalize">{orderDetails[selectedOrder].status || "Processing"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                      <p className="text-gray-800 capitalize">{orderDetails[selectedOrder].paymentMethod || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                      <p className="text-gray-800 font-medium">
                        ${orderDetails[selectedOrder].additionalInfo?.totalAmount?.toFixed(2) || "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  {orderDetails[selectedOrder].items && orderDetails[selectedOrder].items.length > 0 ? (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Order Items</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {orderDetails[selectedOrder].items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                  {item.name || item.itemName || "Unknown Item"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {item.quantity || 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  ${item.price?.toFixed(2) || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No item details available</p>
                  )}
                  
                  {orderDetails[selectedOrder].shippingAddress && (
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800">
                          {orderDetails[selectedOrder].shippingAddress.street}, {orderDetails[selectedOrder].shippingAddress.city}<br />
                          {orderDetails[selectedOrder].shippingAddress.state}, {orderDetails[selectedOrder].shippingAddress.zip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading order details...</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default OrderHistory;