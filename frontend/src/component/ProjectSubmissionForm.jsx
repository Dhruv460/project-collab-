import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
const ProjectSubmissionForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goals: "",
    requiredSkills: "",
    tags: "",
    useAIEnhancement: false,
  });

  const toast = useToast();
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
      toast({
        title: "Success",
        description: "project uploaded successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h2 className="mt-2 text-center text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Submit Your Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          {/* Project Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project"
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          {/* Project Goals */}
          <div>
            <label
              htmlFor="goals"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Project Goals
            </label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              placeholder="What are the goals of this project?"
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          {/* Required Skills */}
          <div>
            <label
              htmlFor="requiredSkills"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Required Skills
            </label>
            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="List the skills required (e.g., React, Node.js)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter relevant tags (comma-separated)"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>

          {/* Use AI Enhancement Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="useAIEnhancement"
              checked={formData.useAIEnhancement}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600"
            />
            <label
              htmlFor="useAIEnhancement"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Enhance description with AI
            </label>
          </div>

          {/* Enhanced Description */}
          {formData.useAIEnhancement && !isEnhancing && (
            <div>
              <label
                htmlFor="enhancedDescription"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enhanced Description
              </label>
              <textarea
                name="enhancedDescription"
                value={editedEnhancedDescription}
                onChange={handleEditedEnhancedDescriptionChange}
                placeholder="AI-enhanced description"
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
          )}

          {isEnhancing && (
            <div className="text-indigo-600 dark:text-indigo-400">
              Loading enhanced description...
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
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
