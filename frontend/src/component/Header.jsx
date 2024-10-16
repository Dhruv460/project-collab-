import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import { AuthContext } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import SearchComponent from './SearchComponent';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { userId, userAvatar, setUserId } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    // localStorage.removeItem('id');
    setUserId(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNavDropdown = () => {
    setIsNavDropdownOpen(!isNavDropdownOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };


  return (
    <header className="sticky top-0 z-50 bg-gray-800 dark:bg-gray-900 text-white p-4 flex justify-between items-center flex-wrap md:flex-nowrap transition-colors duration-500">
      <div className="flex items-center">
        <div className="mr-4">
          <img
            src="/collab2.jpg"
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
        </div>
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
            checked={theme === 'dark'}
          />
          <span className="slider"></span>
        </label>
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300 flex items-center">
            <FontAwesomeIcon icon={faHome} className="h-5 w-5 mr-2" />
            Home
          </Link>
          {token && (
            <>
              <Link to="/projects" className="text-white hover:text-gray-300">
                Feed
              </Link>
              <Link to="/projects/submit" className="text-white hover:text-gray-300 flex items-center ml-4">
                <FontAwesomeIcon icon={faPlusCircle} className="h-5 w-5 mr-2" />
                Post
              </Link>

              <Link to="/chatAi" className="text-white hover:text-gray-300">
                AI-Chat
              </Link>
            </>

            
          )}
        </nav>
        <button className="md:hidden text-white" onClick={toggleNavDropdown}>
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
        {isNavDropdownOpen && (
          <div className="absolute top-16 left-0 right-0 bg-gray-800 dark:bg-gray-900 text-white rounded-md shadow-lg z-20 md:hidden">
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
              onClick={toggleNavDropdown}
            >
              <FontAwesomeIcon icon={faHome} className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
              onClick={toggleNavDropdown}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
              onClick={toggleNavDropdown}
            >
              Contact
            </Link>
            {token && (
              <>
                <Link
                  to="/projects"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md"
                  onClick={toggleNavDropdown}
                >
                  Projects
                </Link>
                <Link
                  to="/projects/submit"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md flex items-center ml-4"
                  onClick={toggleNavDropdown}
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="h-4 w-4 mr-1" />
                  Post
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center flex-grow justify-center mt-4 md:mt-0">
        <button className="text-white focus:outline-none" onClick={toggleSearch}>
          <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
        </button>
        {isSearchOpen && (
          <div className="ml-1">
            <SearchComponent />
          </div>
        )}
      </div>
      <div className="flex items-center">
        {token ? (
          <div className="relative">
            <button
              className="flex items-center focus:outline-none"
              onClick={toggleDropdown}
            >
              <img
                src={userAvatar}
                alt="Profile Image"
                className="h-8 w-8 rounded-full cursor-pointer"
              />
              <svg
                className={`h-5 w-5 ml-2 ${isDropdownOpen ? 'transform rotate-180' : ''} text-white dark:text-gray-300 transition-transform duration-300`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M2 8a2 2 0 114 0 2 2 0 01-4 0zM16 8a2 2 0 114 0 2 2 0 01-4 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link
                  to={`/profile/${userId}`}
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Profile
                </Link>
                <Link
                  to={`/myprojects`}
                  className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  My Projects
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
