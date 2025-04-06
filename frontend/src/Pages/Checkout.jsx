import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Qrimage from "./Qr-image.jpeg";

function Checkout() {
  const [paymentScreen, setPaymentScreen] = useState("checkout"); // "checkout", "khalti", "success"
  const [screenshot, setScreenshot] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // For navigation
  
  const handleKhaltiPay = () => {
    setPaymentScreen("khalti");
  };
  
  const handleBack = () => {
    setPaymentScreen("checkout");
  };

  const handlePaymentComplete = () => {
    setPaymentScreen("success");
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmitPayment = () => {
    // Here you would normally handle the payment submission
    alert("Payment submitted successfully!");
    setPaymentScreen("checkout");
    setScreenshot(null);
  };
  
  // Navigate to the order confirmation page
  const handleContinue = () => {
    navigate('/orderplace');
  };
  
  // Payment Success Screen
  if (paymentScreen === "success") {
    return (
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden min-h-screen flex flex-col">
        {/* Back button at the top */}
        <div className="p-4 flex items-center border-b">
          <button 
            onClick={() => setPaymentScreen("khalti")}
            className="flex items-center text-purple-700 font-medium bg-purple-50 px-4 py-2 rounded-full hover:bg-purple-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h2 className="text-xl font-semibold ml-4">Payment Verification</h2>
        </div>
        
        <div className="p-6 flex-grow">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Initiated</h3>
            <p className="text-gray-600">Please upload your payment screenshot for verification</p>
          </div>
          
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
            {screenshot ? (
              <div className="relative">
                <img 
                  src={screenshot} 
                  alt="Payment Screenshot" 
                  className="max-h-64 mx-auto rounded-lg shadow-sm" 
                />
                <button 
                  onClick={() => setScreenshot(null)}
                  className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 mb-2">Tap to upload payment screenshot</p>
                <p className="text-gray-400 text-sm">JPG, PNG or PDF</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf" 
              className="hidden" 
            />
          </div>
          
          <button 
            onClick={screenshot ? handleSubmitPayment : handleUploadClick}
            className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition"
          >
            {screenshot ? "Submit Payment" : "Upload Screenshot"}
          </button>
        </div>
      </div>
    );
  }
  
  // Khalti QR Screen
  if (paymentScreen === "khalti") {
    return (
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden min-h-screen flex flex-col">
        {/* Updated Back button at the top */}
        <div className="p-4 flex items-center border-b">
          <button 
            onClick={handleBack}
            className="flex items-center text-purple-700 font-medium bg-purple-50 px-4 py-2 rounded-full hover:bg-purple-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          <h2 className="text-xl font-semibold ml-4">Khalti Payment</h2>
        </div>
        
        {/* Khalti header with updated logo */}
        <div className="px-6 py-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-purple-700 rounded-full p-1 mr-1">
              <span className="text-white text-xl font-bold">K</span>
            </div>
            <span className="text-purple-700 font-bold text-xl">khalti</span>
          </div>
          
          <h2 className="text-2xl font-semibold text-purple-800">Scan QR Code</h2>
          <p className="text-gray-500 text-sm">Use Khalti app to scan and make payment</p>
        </div>
        
        {/* QR Code display with fixed amount */}
        <div className="px-6 flex-grow flex flex-col items-center">
          <div className="w-64 h-64 mb-6">
            <div className="border-4 border-purple-200 p-3 rounded-lg shadow-md">
              <img 
                src={Qrimage}
                alt="Payment QR Code" 
                className="w-full h-full" 
              />
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Rohan Thapa Magar</h3>
            <p className="text-gray-600 mb-2">9808528626</p>
            
            {/* Fixed amount with real money */}
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 inline-block">
              <p className="text-sm text-purple-700 font-medium mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-purple-800">Rs. 2,499.00</p>
            </div>
          </div>
          
          {/* Added help text */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Having trouble? Contact our support</p>
            <p className="text-sm text-purple-700 font-medium">help@yourstore.com</p>
          </div>
          
          {/* Added button to proceed after payment */}
          <button 
            onClick={handlePaymentComplete}
            className="mt-8 bg-purple-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-800 transition"
          >
            I've Completed Payment
          </button>
        </div>
        
        {/* Updated purple wave bottom */}
        <div className="mt-auto">
          <div className="relative">
            <div className="w-full h-4 bg-purple-700 absolute bottom-0"></div>
            <div className="w-full h-16 bg-white rounded-b-full border-b-8 border-purple-700"></div>
          </div>
          <div className="h-4 bg-purple-700"></div>
        </div>
      </div>
    );
  }
  
  // Regular Checkout Screen
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b">
        <h2 className="text-xl font-semibold text-center text-gray-800">Choose Payment Method</h2>
      </div>
      
      {/* Payment options */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-gray-50">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="payment" className="form-radio h-5 w-5 text-blue-600" />
              <div className="ml-3">
                <span className="text-gray-800 font-medium">Cash Pay</span>
                <p className="text-gray-500 text-sm">Pay with cash when you receive your order</p>
              </div>
              <div className="ml-auto bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
            </label>
          </div>
          
          <div 
            onClick={handleKhaltiPay}
            className="border border-purple-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-purple-50"
          >
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="payment" className="form-radio h-5 w-5 text-purple-600" />
              <div className="ml-3">
                <span className="text-gray-800 font-medium">Khalti Pay</span>
                <p className="text-gray-500 text-sm">Pay securely with Khalti wallet</p>
              </div>
              <div className="ml-auto bg-purple-100 p-2 rounded-full">
                <div className="bg-purple-700 rounded-sm p-1 h-6 w-6 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">K</span>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="p-6 pt-0">
        <button 
          onClick={handleContinue} 
          className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition"
        >
          Continue
        </button>
        
        <button 
          onClick={() => window.history.back()}
          className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Checkout;