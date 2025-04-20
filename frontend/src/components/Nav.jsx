import React, { useState, useEffect } from "react";
import { IoCartOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Nav() {
  // State to track scroll position
  const [isScrolled, setIsScrolled] = useState(false);

  const fullname=localStorage.getItem("fullname")
  const email=localStorage.getItem("email")
  // Detect scroll and update state
  const handleScroll = () => {
    if (window.scrollY > 160) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clears all localStorage data
    alert('You have been logged out.');
    window.location.href = '/login';
   }

  // Add scroll event listener on mount and clean up on unmount
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 z-10 w-full h-16 text-white flex items-center px-5 shadow-md transition-all duration-300 ${
        isScrolled ? "bg-gray-800" : "bg-transparent"
      }`}
    >
      {/* Logo on the left */}
      <div className="text-2xl font-bold">
        <h2>Logo</h2>
      </div>

      {/* Centered menu */}
      <ul className="list-none flex items-center space-x-8 m-0 p-0 mx-auto">
        <li>
          <a
            href="#home"
            className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
          >
            Home
          </a>
        </li>
        
        <li>
          <a
            href="/menus"
            className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
          >
            Menu
          </a>
        </li>

        <li>
          <a
            href="/favorites"
            className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
          >
            Favorites
          </a>
        </li>
        
        <li>
          <a
            href="/order-history"
            className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
          >
            Order History
          </a>
        </li>
        
      </ul>

      {/* Log Out button on the right */}
      <div className="flex justify-center items-center gap-6  ">
        <a href="/message" className='cursor-pointer transition-all duration-300 hover:text-red-500'>
        <FaRegMessage size={20} />
        </a>
        <a href="/cart" className='cursor-pointer transition-all duration-300 hover:text-red-500'>
        <IoCartOutline size={30} />
        </a>
       {/* Profile with dropdown */}
       <div className="relative cursor-pointer group">
          <img 
            src="profile.jpg" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover" 
          />
          
          {/* Profile Dropdown Menu - Using CSS for hover instead of useState */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center">
                <img src="profile.jpg" alt="User" className="w-8 h-8 rounded-full mr-3" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">{fullname}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
              </div>
            </div>
            
            <a href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <Link to={"/profile"}>
              <span className="truncate">My Account</span>
              </Link>
            </a>
            
            <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="truncate">Settings</span>
            </a>
                          
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={()=>handleLogout()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
