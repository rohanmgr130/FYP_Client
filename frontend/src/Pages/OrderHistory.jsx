import React, { useState, useEffect } from "react";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import Footer from "../components/FooterPart";
import Navbar from "../components/Navbar";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // Handle deleting an order
  const handleDeleteOrder = (orderId) => {
    fetch(`http://localhost:4000/api/orders/${orderId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setOrders(orders.filter((order) => order._id !== orderId)))
      .catch((err) => console.error("Error deleting order:", err));
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen mt-10 bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-700 mt-2">Review your past orders and manage your history</p>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Product</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Order Date</th>
                  <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="py-3 px-6 text-center text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-100">
                    <td className="py-4 px-6 text-sm text-gray-800">{order.productName}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-sm text-gray-800">${order.price}</td>
                    <td className="py-4 px-6 text-center space-x-4">
                      <button className="text-blue-500 hover:text-blue-700" title="View Product">
                        <FaEye size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Order"
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;
