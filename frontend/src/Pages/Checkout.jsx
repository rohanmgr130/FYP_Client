import React from 'react'
import MyOrder from '../components/Order/MyOrder'
import Navbar from '../components/Navbar'
import Footer from '../components/FooterPart'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const router = useNavigate();
  const orderId = "6808badf626b41196225c5fd"


  const handlePayment = async () => {
    try {
      const response = await fetch(`http://localhost:4000/khalti/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.khaltiPaymentUrl) {
        console.log("Redirecting to Khalti");
        if (typeof window !== "undefined") {
          window.location.href = data.khaltiPaymentUrl;
        }
      } else {
        console.error(data.error || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };
  

  return (
    <>
      <Navbar/>
      <MyOrder />
      <button className='bg-blue-300'onClick={handlePayment}>checkout</button>
      <Footer/>
    </>
  )
}

export default Checkout