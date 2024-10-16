import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Link} from 'react-router-dom'
const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-gray-200 dark:text-gray-400">
      <div className="container mx-auto py-8 flex flex-wrap justify-center">
        {/* Footer Links */}
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <h3 className="text-lg font-bold mb-2">Quick Links</h3>
          <ul>
            <li><Link to="/about" className="block py-1 hover:text-gray-400">About</Link></li>
            <li><Link to="/terms" className="block py-1 hover:text-gray-400">Terms of Service</Link></li>
            <li><Link to="/privacy" className="block py-1 hover:text-gray-400">Privacy Policy</Link></li>
            <li><Link to="/contact" className="block py-1 hover:text-gray-400">Contact Us</Link></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <h3 className="text-lg font-bold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://twitter.com" className="text-gray-300 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-500"><FontAwesomeIcon icon={['fab', 'twitter']} /></a>
            <a href="https://facebook.com" className="text-gray-300 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-500"><FontAwesomeIcon icon={['fab', 'facebook']} /></a>
            <a href="https://linkedin.com" className="text-gray-300 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-500"><FontAwesomeIcon icon={['fab', 'linkedin']} /></a>
            <a href="https://instagram.com" className="text-gray-300 dark:text-gray-400 hover:text-gray-400 dark:hover:text-gray-500"><FontAwesomeIcon icon={['fab', 'instagram']} /></a>
          </div>
        </div>

        {/* Contact Information */}
        <div className="w-full sm:w-1/2 md:w-1/4 px-4 mb-4">
          <h3 className="text-lg font-bold mb-2">Contact Information</h3>
          <p className="text-gray-300 dark:text-gray-400">Email: info@example.com</p>
          <p className="text-gray-300 dark:text-gray-400">Phone: +1234567890</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
