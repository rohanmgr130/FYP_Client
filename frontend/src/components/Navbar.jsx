import React, { useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar=()=> {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

    // Redirect to the login page
    }

    const handleLogout = () => {
      localStorage.clear(); // Clears all localStorage data
      alert('logged out.');
      window.location.href = '/login';
     }
  
  return (
    <div className="fixed top-0 left-0 z-10 w-full h-16 text-white flex items-center px-5 shadow-md transition-all duration-300 bg-gray-800">
      {/* Logo on the left */}
      <div className="text-2xl font-bold truncate">
        <h2>Logo</h2>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden ml-auto flex items-center">
        <button 
          onClick={toggleMenu}
          className="text-white focus:outline-none"
        >
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Desktop menu - centered */}
      <ul className="hidden md:flex list-none items-center space-x-4 lg:space-x-8 m-0 p-0 mx-auto">
        <li className="whitespace-nowrap">
          <a
            href="/"
            className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
          >
            Home
          </a>
        </li>
        
        <li className="whitespace-nowrap">
          <a
            href="/menus"
            className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
          >
            Menu
          </a>
        </li>

        <li className="whitespace-nowrap">
          <a
            href="/favorites"
            className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
          >
            Favorites
          </a>
        </li>
        
        <li className="whitespace-nowrap">
          <a
            href="/order-history"
            className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
          >
            Order History
          </a>
        </li>
      </ul>

      {/* Mobile menu - full screen overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-gray-800 z-20 flex flex-col items-center py-5">
          <ul className="list-none flex flex-col items-center space-y-6 m-0 p-0 w-full">
            <li className="whitespace-nowrap">
              <a
                href="/"
                className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
              >
                Home
              </a>
            </li>
            
            <li className="whitespace-nowrap">
              <a
                href="/menus"
                className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
              >
                Menu
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a
                href="/search"
                className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
              >
                Search
              </a>
            </li>
            <li className="whitespace-nowrap">
              <a
                href="/favorites"
                className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
              >
                Favorites
              </a>
            </li>
            
            <li className="whitespace-nowrap">
              <a
                href="/order-history"
                className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
              >
                Order History
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Right side icons */}
      <div className="hidden md:flex justify-center items-center gap-4 lg:gap-6">
        <a href="/message" className="cursor-pointer transition-all duration-300 hover:text-red-500">
          <FaRegMessage size={20} />
        </a>
        <a href="/cart" className="cursor-pointer transition-all duration-300 hover:text-red-500">
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
                  <p className="text-sm font-medium text-gray-900 truncate">Kenneth Becker</p>
                  <p className="text-xs text-gray-500 truncate">kennethbecker@example.com</p>
                </div>
              </div>
            </div>
            
            <a href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="truncate">My Account</span>
            </a>
            
            <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span className="truncate">Settings</span>
            </a>
            
            <a href="/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="truncate">Support</span>
            </a>
            
            <div className="border-t border-gray-100 my-1"></div>
            
                  {/* Logout Button */}
      <button
        // onClick={handleLogout()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Log Out
      </button>
            
        </div>
        </div>
      </div>

      {/* Mobile right corner - only showing profile on mobile */}
      <div className="md:hidden flex items-center gap-4 ml-4">
        <div className="relative cursor-pointer">
          <img 
            src="profile.jpg" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover" 
            onClick={() => window.location.href = '/profile'}
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;