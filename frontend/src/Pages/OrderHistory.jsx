import React, { useState } from 'react';
import { FaEye, FaTrashAlt } from 'react-icons/fa';
import Footer from '../components/FooterPart';
import Navbar from '../components/Navbar';

const OrderHistory = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      productName: "Margherita Pizza",
      orderDate: "2025-01-05",
      status: "Delivered",
      price: "$12.99",
    },
    {
      id: 2,
      productName: "Cheeseburger",
      orderDate: "2025-01-04",
      status: "Pending",
      price: "$9.99",
    },
    {
      id: 3,
      productName: "Sushi Roll",
      orderDate: "2025-01-03",
      status: "Delivered",
      price: "$18.99",
    },
    // Add more orders as necessary
  ]);

  const handleViewProduct = (orderId) => {
    console.log(`Viewing product with Order ID: ${orderId}`);
    // Implement the view product functionality here
  };

  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
    console.log(`Order with ID ${orderId} deleted`);
  };

  return (
    <div>
        <Navbar/>
<div className="min-h-screen mt-10 bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-700 mt-2">Review your past orders and manage your history</p>
        </div>

        {/* Order History Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Product</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Order Date</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Price</th>
                <th className="py-3 px-6 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-100">
                  <td className="py-4 px-6 text-sm text-gray-800">{order.productName}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{order.orderDate}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{order.status}</td>
                  <td className="py-4 px-6 text-sm text-gray-800">{order.price}</td>
                  <td className="py-4 px-6 text-center space-x-4">
                    {/* View Product Button */}
                    <button
                      onClick={() => handleViewProduct(order.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="View Product"
                    >
                      <FaEye size={20} />
                    </button>
                    {/* Delete Order Button */}
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
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
