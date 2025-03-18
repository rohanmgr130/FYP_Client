import React, { useState, useEffect } from "react";
// import { IoIosSettings } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";

function Nav() {
  // State to track scroll position
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll and update state
  const handleScroll = () => {
    if (window.scrollY > 160) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

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
            href="/search"
            className="text-lg cursor-pointer transition-all duration-300 hover:text-gray-300"
          >
            Search
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
        <a href='/profile'>
          <img src="profile.jpg" alt="profile image" className="w-10 h-10 rounded-full object-cover" />
        </a>
      </div>
    </div>
  );
}

export default Nav;
