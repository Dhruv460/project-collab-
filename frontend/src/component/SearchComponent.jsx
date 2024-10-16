import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchComponent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        placeholder="Search by username..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 bg-black"
      />
      <button type="submit" className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
        Search
      </button>
    </form>
  );
};

export default SearchComponent;
