// src/component/ProfilePage.jsx (Improved Version)
import React, { useState, useEffect, useContext } from "react"; // Added useContext if needed later
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// Assuming ChatList is still relevant
// import ChatList from "./ChatList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../AuthContext"; // Import AuthContext if needed for edit check

const ProfilePage = () => {
  const { id: profileUserId } = useParams(); // Rename id to avoid conflict if using AuthContext userId
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    interests: "",
    pastProjects: "",
    endorsements: "",
    // Add avatar field if you allow editing it
    // avatar: '',
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetch

  // Get logged-in user ID from AuthContext to check if viewing own profile
  const { userId: loggedInUserId } = useContext(AuthContext); // Assuming AuthContext provides logged-in userId
  const isOwnProfile = profileUserId === loggedInUserId;

  // Use VITE env var correctly
  const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000"; // Provide fallback

  useEffect(() => {
    setIsLoading(true); // Start loading
    // Validate ID format before fetching (basic check)
    if (profileUserId && /^[0-9a-fA-F]{24}$/.test(profileUserId)) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `${api_url}/api/users/${profileUserId}`
          );
          const userData = response.data;
          setUser(userData);
          // Initialize form data based on fetched user data
          setFormData({
            bio: userData.bio || "",
            // Ensure data is handled correctly whether array or string initially
            skills: Array.isArray(userData.skills)
              ? userData.skills.join(", ")
              : userData.skills || "",
            interests: Array.isArray(userData.interests)
              ? userData.interests.join(", ")
              : userData.interests || "",
            pastProjects: Array.isArray(userData.pastProjects)
              ? userData.pastProjects.join(", ")
              : userData.pastProjects || "",
            endorsements: Array.isArray(userData.endorsements)
              ? userData.endorsements.join(", ")
              : userData.endorsements || "",
          });
        } catch (error) {
          console.error(
            `Error fetching user with ID ${profileUserId}:`,
            error.response?.data || error.message
          );
          // Optionally navigate to a 'not found' page or show an error message
          // navigate('/not-found');
          setUser(null); // Set user to null on error
        } finally {
          setIsLoading(false); // Stop loading regardless of outcome
        }
      };
      fetchUser();
    } else {
      console.error("Invalid or missing user ID:", profileUserId);
      setIsLoading(false);
      // navigate("/error"); // Redirect for invalid ID format
      setUser(null); // Set user to null for invalid ID
    }
  }, [
    profileUserId,
    api_url /* removed navigate from deps if not used inside effect */,
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    // Reset form data to original user data when cancelling
    setFormData({
      bio: user.bio || "",
      skills: Array.isArray(user.skills)
        ? user.skills.join(", ")
        : user.skills || "",
      interests: Array.isArray(user.interests)
        ? user.interests.join(", ")
        : user.interests || "",
      pastProjects: Array.isArray(user.pastProjects)
        ? user.pastProjects.join(", ")
        : user.pastProjects || "",
      endorsements: Array.isArray(user.endorsements)
        ? user.endorsements.join(", ")
        : user.endorsements || "",
    });
    setEditMode(false);
    setFormError(""); // Clear any previous form errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(""); // Clear previous errors

    // --- Prepare data for backend ---
    // Split comma-separated strings back into arrays, trimming whitespace
    const dataToSend = {
      bio: formData.bio.trim(),
      // Check if string is empty before splitting
      skills: formData.skills.trim()
        ? formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [],
      interests: formData.interests.trim()
        ? formData.interests
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i)
        : [],
      pastProjects: formData.pastProjects.trim()
        ? formData.pastProjects
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p)
        : [],
      endorsements: formData.endorsements.trim()
        ? formData.endorsements
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e)
        : [],
    };

    // --- Read token from localStorage for authenticated request ---
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Token not found. Please log in.",
        status: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Use PUT request with Authorization header
      const response = await axios.put(
        `${api_url}/api/users/${profileUserId}`, // Ensure this matches your user update route
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } } // Add Auth Header
      );

      // Update local user state with the response data (or dataToSend)
      // Using response.data is safer if the backend returns the updated user
      const updatedUser = response.data;
      setUser(updatedUser);

      // Update formData state as well to reflect saved changes
      setFormData({
        bio: updatedUser.bio || "",
        skills: Array.isArray(updatedUser.skills)
          ? updatedUser.skills.join(", ")
          : updatedUser.skills || "",
        interests: Array.isArray(updatedUser.interests)
          ? updatedUser.interests.join(", ")
          : updatedUser.interests || "",
        pastProjects: Array.isArray(updatedUser.pastProjects)
          ? updatedUser.pastProjects.join(", ")
          : updatedUser.pastProjects || "",
        endorsements: Array.isArray(updatedUser.endorsements)
          ? updatedUser.endorsements.join(", ")
          : updatedUser.endorsements || "",
      });

      setEditMode(false); // Exit edit mode
      // Optionally show a success toast
      // toast({ title: "Profile Updated", status: "success" });
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      setFormError(
        error.response?.data?.message ||
          "Failed to save profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-slate-800">
        {/* Add a spinner component here */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // User Not Found State
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-slate-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Profile Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The user profile you are looking for could not be found or is
            unavailable.
          </p>
          <button
            onClick={() => navigate("/")} // Go back home
            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Helper to display list items or a placeholder
  const renderList = (items) => {
    const displayItems = Array.isArray(items)
      ? items
      : typeof items === "string"
        ? items
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [];
    if (displayItems.length === 0) {
      return <span className="text-gray-500 italic">Not specified</span>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {displayItems.map((item, index) => (
          <span
            key={index}
            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-2.5 py-0.5 rounded-full"
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  // Main component return
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-slate-800 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ease-in-out">
      <div className="container mx-auto max-w-4xl">
        {" "}
        {/* Limit max width */}
        {/* --- Profile Header --- */}
        <div className="text-center mb-10">
          <img
            src={user.avatar || "/default-avatar.png"} // Use default if avatar missing
            alt={`${user.username}'s avatar`}
            className="w-36 h-36 md:w-48 md:h-48 object-cover rounded-full shadow-xl mx-auto mb-4 ring-4 ring-white dark:ring-gray-700 transform transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-1">
            {user.username}
          </h1>
          <p className="text-md text-gray-500 dark:text-gray-400">
            {user.email}
          </p>{" "}
          {/* Display email */}
        </div>
        {/* --- Profile Content Card --- */}
        <div
          className={`bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8 transition-all duration-300 ease-in-out ${editMode ? "ring-2 ring-blue-500" : ""}`}
        >
          {!editMode ? (
            // --- View Mode ---
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1 dark:border-gray-600">
                  Bio
                </h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {" "}
                  {/* Preserve whitespace */}
                  {user.bio || (
                    <span className="text-gray-500 italic">
                      No bio provided.
                    </span>
                  )}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1 dark:border-gray-600">
                  Skills
                </h2>
                {renderList(user.skills)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1 dark:border-gray-600">
                  Interests
                </h2>
                {renderList(user.interests)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1 dark:border-gray-600">
                  Past Projects
                </h2>
                {renderList(user.pastProjects)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1 dark:border-gray-600">
                  Endorsements
                </h2>
                {renderList(user.endorsements)}
              </div>

              {/* Show Edit Button only if it's the logged-in user's profile */}
              {isOwnProfile && (
                <div className="pt-4 text-right">
                  <button
                    className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition duration-200 ease-in-out shadow hover:shadow-lg transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 inline-flex items-center gap-2"
                    onClick={() => setEditMode(true)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit Profile
                  </button>
                </div>
              )}

              {/* Removed ChatList from here - consider where it fits best */}
              {/* {isOwnProfile && <ChatList userId={profileUserId} />} */}
            </div>
          ) : (
            // --- Edit Mode ---
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bio Input */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="shadow-sm appearance-none border border-gray-300 dark:border-gray-600 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                />
              </div>
              {/* Skills Input */}
              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="shadow-sm appearance-none border border-gray-300 dark:border-gray-600 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                />
              </div>
              {/* Interests Input */}
              <div>
                <label
                  htmlFor="interests"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Interests (comma-separated)
                </label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="shadow-sm appearance-none border border-gray-300 dark:border-gray-600 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                />
              </div>
              {/* Past Projects Input */}
              <div>
                <label
                  htmlFor="pastProjects"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Past Projects (comma-separated)
                </label>
                <input
                  type="text"
                  id="pastProjects"
                  name="pastProjects"
                  value={formData.pastProjects}
                  onChange={handleChange}
                  className="shadow-sm appearance-none border border-gray-300 dark:border-gray-600 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                />
              </div>
              {/* Endorsements Input (Consider if this should be editable here) */}
              <div>
                <label
                  htmlFor="endorsements"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Endorsements (comma-separated)
                </label>
                <input
                  type="text"
                  id="endorsements"
                  name="endorsements"
                  value={formData.endorsements}
                  onChange={handleChange}
                  className="shadow-sm appearance-none border border-gray-300 dark:border-gray-600 rounded-md w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                />
              </div>

              {/* Form Error Display */}
              {formError && (
                <div className="text-red-500 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 p-3 rounded-md">
                  {formError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button" // Important: type="button" to prevent form submission
                  onClick={handleCancelEdit}
                  className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-5 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200 ease-in-out shadow hover:shadow-lg transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 inline-flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition duration-200 ease-in-out shadow hover:shadow-lg transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  <FontAwesomeIcon
                    icon={isSubmitting ? faSave : faSave}
                    className={isSubmitting ? "animate-spin" : ""}
                  />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
        {/* Consider adding other sections like Projects Display, Chat Button (if not own profile) */}
        {!isOwnProfile && user && (
          <div className="mt-6 text-center">
            <button
              // onClick={handleStartChat} // Add function to start chat
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-200 ease-in-out shadow hover:shadow-lg transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
            >
              Message {user.username}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
