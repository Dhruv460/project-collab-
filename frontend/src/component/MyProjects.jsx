import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

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
      const sortedProjects = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProjects(sortedProjects);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false); // Ensure loading is set to false on error
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
        await axios.delete(`${api_url}/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(`Project ${projectId} deleted successfully`);
        alert(`Project ${projectId} deleted successfully`);
        setDeleting(null);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        setDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8 text-center">
        My Projects
      </h2>
      {projects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            You haven't submitted any projects yet.
          </p>
          <Link
            to="/submit"
            className="inline-block mt-4 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-300"
          >
            Submit a New Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/projects/${project._id}`}
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-600 transition-colors duration-300"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="inline-flex items-center text-red-600 dark:text-red-400 font-semibold hover:text-red-800 dark:hover:text-red-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deleting === project._id}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    {deleting === project._id ? "Deleting" : "Delete"}
                  </button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  Created at: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
