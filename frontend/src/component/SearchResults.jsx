import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery().get('query');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true); // Set loading state before fetching
      try {
        const response = await axios.get('http://localhost:3000/api/users/search', {
          params: { query }
        });
        console.log('Search response:', response.data); // Log the response data
        if (Array.isArray(response.data)) {
          setResults(response.data);
        } else {
          setResults([]);
        }
      } catch (error) {
        setError(error);
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false); // Set loading state after fetching
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-4">Error fetching search results: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result._id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-center mb-4">
                <img
                  src={result.avatar || 'default-avatar.png'}
                  alt={result.username}
                  className="w-12 h-12 object-cover rounded-full mr-4"
                />
                <div>
                  <Link to={`/profile/${result._id}`} className="text-xl font-bold text-blue-500 hover:underline">
                    {result.username}
                  </Link>
                  <p className="text-gray-700">{result.bio}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-700"><strong>Skills:</strong> {Array.isArray(result.skills) ? result.skills.join(', ') : 'None'}</p>
                <p className="text-gray-700"><strong>Interests:</strong> {Array.isArray(result.interests) ? result.interests.join(', ') : 'None'}</p>
                <p className="text-gray-700"><strong>Past Projects:</strong> {Array.isArray(result.pastProjects) ? result.pastProjects.join(', ') : 'None'}</p>
                <p className="text-gray-700"><strong>Endorsements:</strong> {Array.isArray(result.endorsements) ? result.endorsements.join(', ') : 'None'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-700 text-center">No results found</div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
