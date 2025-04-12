import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProjectSubmissionForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goals: "",
    requiredSkills: "",
    tags: "",
    useAIEnhancement: false,
  });
  const api_url = import.meta.env.VITE_API_URL;
  const [enhancedDescription, setEnhancedDescription] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [editedEnhancedDescription, setEditedEnhancedDescription] =
    useState("");
  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(newFormData);

    if (name === "useAIEnhancement" && checked) {
      setIsEnhancing(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage");
        setIsEnhancing(false);
        return;
      }
      try {
        const response = await axios.post(
          `${api_url}/api/projects/enhance-description`,
          {
            description: newFormData.description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEnhancedDescription(response.data.enhancedDescription);
        setEditedEnhancedDescription(response.data.enhancedDescription); // Initialize edited enhanced description with the original enhanced description
      } catch (error) {
        console.error("Error enhancing description:", error);
      } finally {
        setIsEnhancing(false);
      }
    } else {
      setEnhancedDescription("");
      setEditedEnhancedDescription("");
    }
  };
  const handleEditedEnhancedDescriptionChange = (e) => {
    setEditedEnhancedDescription(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    try {
      const dataToSubmit = {
        ...formData,
        description: formData.useAIEnhancement
          ? editedEnhancedDescription
          : formData.description,
      };

      const response = await axios.post(
        `${api_url}/api/projects/submit`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 dark:text-gray-100">
          Submit Your Project
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Project Title */}
          <div>
            <label htmlFor="title" className="sr-only">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project Title"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="sr-only">
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project Description"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              required
            />
          </div>

          {/* Project Goals */}
          <div>
            <label htmlFor="goals" className="sr-only">
              Project Goals
            </label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="Project Goals"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              required
            />
          </div>

          {/* Required Skills */}
          <div>
            <label htmlFor="requiredSkills" className="sr-only">
              Required Skills
            </label>
            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="Required Skills"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="sr-only">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Tags (comma-separated)"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              required
            />
          </div>

          {/* Use AI Enhancement Checkbox */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="useAIEnhancement"
                checked={formData.useAIEnhancement}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                Enhance description with AI
              </span>
            </label>
          </div>

          {/* Enhanced Description */}
          {formData.useAIEnhancement && !isEnhancing && (
            <div>
              <label htmlFor="enhancedDescription" className="sr-only">
                Enhanced Description
              </label>
              <textarea
                name="enhancedDescription"
                value={editedEnhancedDescription}
                onChange={handleEditedEnhancedDescriptionChange}
                placeholder="Enhanced Description"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          )}

          {isEnhancing && <div>Loading enhanced description...</div>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isEnhancing}
            >
              Submit Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSubmissionForm;
