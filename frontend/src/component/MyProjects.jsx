import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const api_url = import.meta.env.VITE_API_URL;
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${api_url}/api/projects/myprojects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Sort projects by createdAt in descending order
      const sortedProjects = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProjects(sortedProjects);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    if (
      window.confirm(`Are you sure you want to delete project ${projectId}?`)
    ) {
      setDeleting(projectId);
      try {
        const response = await axios.delete(`${api_url}api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(`Project ${projectId} deleted successfully`);
        alert(`Project ${projectId} deleted successfully`);
        setDeleting(null);
        fetchProjects();
      } catch (error) {
        console.error(error);
        setDeleting(null);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center">
        My Projects
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <svg
            className="animate-spin h-10 w-10 text-gray-600 dark:text-gray-400"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {project.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {project.description}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/projects/${project._id}`}
                  className="inline-block text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-600 transition-colors duration-300"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="inline-block text-red-600 dark:text-red-400 font-semibold hover:text-red-800 dark:hover:text-red-600 transition-colors duration-300"
                  disabled={deleting === project._id}
                >
                  {deleting === project._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
