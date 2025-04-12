import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faHome,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "./SearchComponent";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { userId, userAvatar, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Removed isNavDropdownOpen state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setUserId(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Removed toggleNavDropdown function

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800 dark:bg-gray-900 text-white p-4 flex flex-wrap justify-between items-center transition-colors duration-500">
      {/* Left Section */}
      <div className="flex items-center">
        {/* Mobile: Hamburger to open Sidebar (Single Mobile Toggle Now) */}
        <button
          className="md:hidden text-white mr-4 transform transition duration-300 hover:scale-110 focus:outline-none" // Added focus:outline-none
          onClick={toggleSidebar}
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Desktop: Logo & Toggle Button */}
        <div className="hidden md:flex items-center">
          <Link to="/" className="flex items-center mr-4">
            {" "}
            {/* Added Link to logo */}
            <img
              src="/collab2.jpg" // Consider making this dynamic or an import
              alt="Logo"
              className="h-8 w-8 rounded-full"
            />
          </Link>
          {/* Theme Toggle Button */}
          <label className="switch ml-1">
            <span className="sun">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="#ffd43b">
                  <circle r="3" cy="12" cx="12"></circle>
                  <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 00 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
                </g>
              </svg>
            </span>
            <span className="moon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
              </svg>
            </span>
            <input
              type="checkbox"
              className="input"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <span className="slider"></span>
          </label>
          {/* Desktop Navigation */}
          <nav className="ml-4 hidden md:flex space-x-4">
            <Link
              to="/"
              className="text-white hover:text-gray-300 flex items-center transform transition duration-300 hover:scale-105"
            >
              <FontAwesomeIcon icon={faHome} className="h-5 w-5 mr-2" />
              Home
            </Link>
            {token && (
              <>
                <Link
                  to="/projects"
                  className="text-white hover:text-gray-300 transform transition duration-300 hover:scale-105"
                >
                  Feed
                </Link>
                <Link
                  to="/projects/submit"
                  className="text-white hover:text-gray-300 flex items-center ml-4 transform transition duration-300 hover:scale-105"
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    className="h-5 w-5 mr-2"
                  />
                  Post
                </Link>
                <Link
                  to="/chatAi"
                  className="text-white hover:text-gray-300 transform transition duration-300 hover:scale-105"
                >
                  AI-Chat
                </Link>
              </>
            )}
          </nav>
        </div>
        {/* REMOVED Redundant Mobile Navigation Dropdown Button */}
        {/* REMOVED Redundant Mobile Navigation Dropdown Content */}
      </div>{" "}
      {/* End Left Section Div */}
      {/* Center Section: Search */}
      {/* Add relative positioning for potential absolute positioning of search results */}
      <div className="relative flex items-center flex-grow justify-center mt-4 md:mt-0 mx-4">
        <button
          className="text-white focus:outline-none transform transition duration-300 hover:scale-110 hover:text-gray-300" // Added hover text color change
          onClick={toggleSearch}
          aria-label="Toggle search" // Added aria-label for accessibility
        >
          <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
        </button>
        {/* Animated Search Component Container */}
        {/* We render the container always for exit animation, control presence with opacity/scale/pointer-events */}
        <div
          className={`absolute top-full mt-2 transition-all duration-300 ease-in-out origin-top ${
            isSearchOpen
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible" // Use invisible for better accessibility hiding
          }`}
          style={{ minWidth: "250px" }} // Optional: give it a minimum width
        >
          {/* Render SearchComponent only when needed or keep it rendered if it manages its own state */}
          {isSearchOpen && <SearchComponent />}
          {/* Or if SearchComponent should handle its own visibility state based on a prop:
           <SearchComponent isOpen={isSearchOpen} />
           */}
        </div>
      </div>{" "}
      {/* End Center Section Div */}
      {/* Right Section: Profile/Login */}
      <div className="flex items-center">
        {token ? (
          <div className="relative">
            <button
              className="flex items-center focus:outline-none transform transition duration-300 hover:scale-105"
              onClick={toggleDropdown}
            >
              <img
                src={userAvatar || "/default-avatar.png"} // Provide a fallback avatar
                alt="User Profile" // Improved alt text
                className="h-8 w-8 rounded-full cursor-pointer object-cover" // Added object-cover
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }} // Handle broken image links
              />
              {/* Dropdown Arrow Icon */}
              <svg
                className={`h-5 w-5 ml-2 ${isDropdownOpen ? "transform rotate-180" : ""} text-white dark:text-gray-300 transition-transform duration-300`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true" // Hide decorative icon from screen readers
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" // Using a chevron down instead
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* Profile Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
                {" "}
                {/* Increased z-index */}
                <Link
                  to={`/profile/${userId}`}
                  onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Profile
                </Link>
                <Link
                  to={`/myprojects`}
                  onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  My Projects
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false); // Close dropdown on click
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2 transition-colors duration-300" // Added transition
          >
            Login
          </Link>
        )}
      </div>{" "}
      {/* End Right Section Div */}
      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {" "}
          {/* Ensure z-index is high */}
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={toggleSidebar}
            aria-label="Close sidebar overlay" // Accessibility
          ></div>
          {/* Sidebar Drawer */}
          <div
            className="relative bg-gray-800 dark:bg-gray-900 w-64 max-w-[80%] transform transition-transform duration-300 ease-in-out flex flex-col" // Added max-width, flex column
            style={{
              transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            }}
            role="dialog" // Accessibility
            aria-modal="true" // Accessibility
          >
            {/* Sidebar Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-700 dark:border-gray-600">
              <Link
                to="/"
                onClick={toggleSidebar}
                className="flex items-center"
              >
                <img
                  src="/collab2.jpg"
                  alt="Logo"
                  className="h-8 w-8 rounded-full mr-3"
                />
                <span className="text-xl font-bold">Collab</span>
              </Link>
              <button
                onClick={toggleSidebar}
                className="text-white focus:outline-none transform transition duration-300 hover:scale-110"
                aria-label="Close sidebar" // Accessibility
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* Sidebar Navigation (scrollable) */}
            <nav className="flex-grow p-4 space-y-4 overflow-y-auto">
              <Link
                to="/"
                onClick={toggleSidebar}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={toggleSidebar}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={toggleSidebar}
                className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Contact
              </Link>
              {token && (
                <>
                  <Link
                    to="/projects"
                    onClick={toggleSidebar}
                    className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    Feed
                  </Link>
                  <Link
                    to="/projects/submit"
                    onClick={toggleSidebar}
                    className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      className="h-4 w-4 mr-1"
                    />{" "}
                    Post
                  </Link>
                  <Link
                    to="/chatAi"
                    onClick={toggleSidebar}
                    className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    AI-Chat
                  </Link>
                  {/* Add My Projects link to sidebar if desired */}
                  <Link
                    to={`/myprojects`}
                    onClick={toggleSidebar}
                    className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    My Projects
                  </Link>
                  {/* Add Profile link to sidebar if desired */}
                  <Link
                    to={`/profile/${userId}`}
                    onClick={toggleSidebar}
                    className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    Profile
                  </Link>
                </>
              )}
            </nav>
            {/* Sidebar Footer (Theme Toggle) */}
            <div className="p-4 mt-auto border-t border-gray-700 dark:border-gray-600">
              <label className="switch ml-1 flex items-center">
                {" "}
                {/* Added flex */}
                <span className="mr-2 text-sm">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>{" "}
                {/* Added label */}
                <span className="sun">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    {" "}
                    <g fill="#ffd43b">
                      {" "}
                      <circle r="3" cy="12" cx="12"></circle>{" "}
                      <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 00 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>{" "}
                    </g>{" "}
                  </svg>
                </span>
                <span className="moon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                    {" "}
                    <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>{" "}
                  </svg>
                </span>
                <input
                  type="checkbox"
                  className="input"
                  onChange={toggleTheme}
                  checked={theme === "dark"}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}{" "}
      {/* End Mobile Sidebar Block */}
    </header> /* End Header Element */
  );
};

export default Header;
