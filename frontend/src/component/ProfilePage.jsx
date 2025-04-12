import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "./ChatList";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    interests: "",
    pastProjects: "",
    endorsements: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api_url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (id && id !== "null") {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${api_url}/api/users/${id}`);
          const userData = response.data;
          setUser(userData);
          setFormData({
            bio: userData.bio || "",
            skills: Array.isArray(userData.skills)
              ? userData.skills.join(", ")
              : "",
            interests: Array.isArray(userData.interests)
              ? userData.interests.join(", ")
              : "",
            pastProjects: Array.isArray(userData.pastProjects)
              ? userData.pastProjects.join(", ")
              : "",
            endorsements: Array.isArray(userData.endorsements)
              ? userData.endorsements.join(", ")
              : "",
          });
        } catch (error) {
          console.error(
            `Error fetching user with ID ${id}:`,
            error.response?.data || error.message
          );
        }
      };
      fetchUser();
    } else {
      console.error("Invalid user ID");
      navigate("/error"); // Redirect to error page if user ID is invalid
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(`${api_url}/api/users/${id}`, formData);
      setUser({ ...user, ...formData });
      setEditMode(false);
      setIsSubmitting(false);
      navigate("/"); // Navigate to home page or show a success message
    } catch (error) {
      console.error(error);
      setFormError("Failed to save. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-5xl font-bold mb-6 text-center text-gray-800">
        {user.username}'s Profile
      </h1>
      <div className="flex flex-wrap justify-center -mx-4">
        <div className="w-full md:w-1/3 p-4 flex justify-center">
          <img
            src={user.avatar || "default-avatar.png"}
            alt={user.username}
            className="w-48 h-48 object-cover rounded-full shadow-lg"
          />
        </div>
        <div className="w-full md:w-2/3 p-4">
          {!editMode ? (
            <div className="bg-white shadow-lg rounded-lg p-8 space-y-4">
              <p className="text-lg text-gray-800">
                <strong>Bio:</strong> {user.bio}
              </p>
              <p className="text-lg text-gray-800">
                <strong>Skills:</strong>{" "}
                {Array.isArray(user.skills) ? user.skills.join(", ") : ""}
              </p>
              <p className="text-lg text-gray-800">
                <strong>Interests:</strong>{" "}
                {Array.isArray(user.interests) ? user.interests.join(", ") : ""}
              </p>
              <p className="text-lg text-gray-800">
                <strong>Past Projects:</strong>{" "}
                {Array.isArray(user.pastProjects)
                  ? user.pastProjects.join(", ")
                  : ""}
              </p>
              <p className="text-lg text-gray-800">
                <strong>Endorsements:</strong>{" "}
                {Array.isArray(user.endorsements)
                  ? user.endorsements.join(", ")
                  : ""}
              </p>
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
              <ChatList userId={id} />
            </div>
          ) : (
            <form
              className="bg-white shadow-lg rounded-lg p-8 space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Skills
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Interests
                </label>
                <textarea
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Past Projects
                </label>
                <textarea
                  name="pastProjects"
                  value={formData.pastProjects}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Endorsements
                </label>
                <textarea
                  name="endorsements"
                  value={formData.endorsements}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {formError && (
                <div className="text-red-500 text-sm">{formError}</div>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
