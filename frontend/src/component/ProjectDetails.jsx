import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";
const ProjectDetails = () => {
  const { id } = useParams();
  console.log(id);
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

  if (!project) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-lg"></div>
        <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-lg sm:p-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {project.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {<MarkdownRenderer markdownText={project.description} />}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Goals:</strong> {project.goals}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Required Skills:</strong>{" "}
              {project.requiredSkills.join(", ")}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Tags:</strong> {project.tags.join(", ")}
            </p>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Team Members
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-2">
                {project.teamMembers.map((member) => (
                  <li key={member._id} className="mb-2">
                    {member.username}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
