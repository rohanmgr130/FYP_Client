import { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

const OnlinePayment = ({ cartTotal, onCheckout, loading, checkoutLoading, paymentImage, setPaymentImage }) => {
  // Store the actual file, not just the URL
  const [imageFile, setImageFile] = useState(null);
  // Toast state
  const [toast, setToast] = useState(null);
  
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size must be less than 5MB", "error");
        return;
      }
      // Store the actual file for sending to server
      setImageFile(file);
      // Store URL for preview
      setPaymentImage(URL.createObjectURL(file));
      showToast("Image uploaded successfully", "success");
    }
  };

  // Pass the actual file to the checkout handler
  const handleSubmit = () => {
    if (!imageFile) {
      showToast("Please upload a payment screenshot", "error");
      return;
    }
    onCheckout(imageFile);
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
      
      <h2 className="text-xl font-semibold mb-4">Khalti Payment</h2>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>Amount to Pay:</span>
          {loading ? (
            <span className="font-medium">Loading...</span>
          ) : (
            <span className="font-medium">Rs. {cartTotal?.toFixed(2) || '0.00'}</span>
          )}
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-center mb-3 font-medium">Scan QR Code to Pay</h3>
        <div className="flex justify-center">
          <div className="bg-gray-200 w-48 h-48 flex items-center justify-center">
            <img 
              src="./qr.jpeg" 
              alt="Khalti QR Code" 
              className="max-w-full" 
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">
          Upload Payment Screenshot
        </label>
        <div className="flex flex-col items-center">
          {paymentImage ? (
            <div className="mb-3">
              <img 
                src={paymentImage} 
                alt="Payment Screenshot" 
                className="max-w-full h-40 object-contain rounded-md" 
              />
            </div>
          ) : (
            <div className="mb-3 w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">No image uploaded</p>
            </div>
          )}
          <label className="cursor-pointer bg-blue-100 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-200 transition duration-200">
            <span>Choose Image</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </label>
        </div>
      </div>
      
      <button 
        onClick={handleSubmit}
        disabled={!paymentImage || checkoutLoading}
        className={`w-full py-3 rounded-md font-medium transition duration-200 ${
          paymentImage && !checkoutLoading
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {checkoutLoading ? "Please wait..." : "Place Order"}
      </button>
    </div>
  );
};

export default OnlinePayment;