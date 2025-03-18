import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRegister = async () => {
    // Input validation
    if (!fullName || !email || !contact || !password) {
      alert("All fields are required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Enter a valid email address!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      // Make POST request to the backend for registration
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          contact,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
        console.error("Backend Response:", data);
        alert(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-700">Register</h2>
        
        {/* Full Name Field with Icon */}
        <div className="relative mb-4">
          <FontAwesomeIcon icon={faUser} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email Field with Icon */}
        <div className="relative mb-4">
          <FontAwesomeIcon icon={faEnvelope} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Contact Field with Icon */}
        <div className="relative mb-4">
          <FontAwesomeIcon icon={faPhone} className="absolute top-3 left-3 text-gray-400" />
          <input
            type="number" // Ensures that only numbers are allowed
            placeholder="Contact"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
            value={contact}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/, ""); // Only allows digits
              if (value.length <= 10) {
                setContact(value); // Set contact value if it's less than or equal to 10 digits
              }
            }}
          />
        </div>

        {/* Password Field with Icon */}
        <div className="relative mb-4">
          <FontAwesomeIcon icon={faLock} className="absolute top-3 left-3 text-gray-400" />
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute top-3 right-3 cursor-pointer"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
          </span>
        </div>

        {/* Register Button */}
        <button
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          onClick={handleRegister}
        >
          Register
        </button>

        {/* Link to Login */}
        <a href="/login" className="block text-center text-green-500 mt-4 text-sm">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default RegisterPage;
