import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${api_url}/api/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex justify-center items-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto"
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
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-semibold transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Listings
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              {project.title}
            </h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </h2>
              <div className="prose dark:prose-invert">
                <MarkdownRenderer markdownText={project.description} />
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Goals
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {project.goals}
              </p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Required Skills
              </h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {project.requiredSkills && project.requiredSkills.length > 0 ? (
                  project.requiredSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))
                ) : (
                  <li>No specific skills mentioned</li>
                )}
              </ul>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags && project.tags.length > 0 ? (
                  project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-300 font-semibold px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span>No tags provided</span>
                )}
              </div>
            </div>
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Team Members
                </h2>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                  {project.teamMembers.map((member) => (
                    <li key={member._id}>{member.username}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-8">
              Created at: {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
