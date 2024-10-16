import React from 'react';
import axios from 'axios';

const ContactUs = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, phone } = event.target.elements;
    
    try {
      await axios.post('http://localhost:3000/api/contact', {
        name: name.value,
        email: email.value,
        phone: phone.value,
      });
      alert('Your message has been sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send your message. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Get in touch with us for any questions or inquiries.</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
      <div className="text-center mt-8">
        <ul className="flex justify-center space-x-6 mb-4">
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-300">Phones</a>
          </li>
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-300">Loans</a>
          </li>
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-300">For Retailers</a>
          </li>
        </ul>
        <ul className="flex justify-center space-x-6">
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-300">
              <i className="fab fa-facebook-f"></i>
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-300">
              <i className="fab fa-instagram"></i>
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-300">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition duration-300">
              <i className="fab fa-twitter"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactUs;
