import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Skeleton from "react-loading-skeleton";
import { AppleIcon } from "lucide-react";
const api_url = import.meta.env.VITE_API_URL;
const socket = io(`${api_url}`);

const ProjectListing = () => {
  const [projects, setProjects] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [likedProject, setLikedProject] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    console.log(`user id for notification is ${userId}`);
    if (!userId) return;

    socket.on("notification", (notification) => {
      console.log("Received notification:", notification.recipient);
      if (notification.recipient === userId) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          notification,
        ]);
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

  const handleFollow = async (projectId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    try {
      await axios.post(
        `${api_url}/api/projects/${projectId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Follow request successful");

      // Emit a notification event to the user being followed
      const project = projects.find((p) => p._id === projectId); // Find the project by ID
      const username = project.user.username; // Get the username from the project object

      socket.emit("notification", {
        type: "followRequest",
        userId: projectId, // assuming projectId is the user being followed
        senderId: userId, // assuming userId is the current user
        message: `Follow request from ${username}`,
      });
      console.log(`sender id is ${userId}`);
    } catch (error) {
      console.error("Error following project:", error);
      if (error.response && error.response.status === 400) {
        console.error("Error following project: Follow request already sent");
      }
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${api_url}/api/projects`);
        // const projectsData = response.data;
        const projectsData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ); // Sort projects by createdAt in descending order
        console.log(projectsData);
        // console.log(`dhruv:${response.data[0].user._id}`);
        // console.log(`dhruv:${response.data[0]._id}`)

        const likes = projectsData.reduce((acc, project) => {
          acc[project._id] = project.likes && project.likes.includes(userId);
          return acc;
        }, {});
        console.log("project ka user");
        console.log(response.data[0].user.id);
        setProjects(projectsData);
        setUserLikes(likes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();

    socket.on("projectCreated", (newProject) => {
      setProjects((prevProjects) => [...prevProjects, newProject]);
    });

    socket.on("projectUpdated", (updatedProject) => {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        )
      );
    });

    return () => {
      socket.off("projectCreated");
      socket.off("projectUpdated");
    };
  }, []);

  const handleNotificationAction = async (
    notificationId,
    action,
    projectId
  ) => {
    console.log(
      `Notification ID: ${notificationId}, Action: ${action}, Project ID: ${projectId}`
    );
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    try {
      await axios.post(
        `${api_url}/api/notifications/${notificationId}/handle`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (action === "accept") {
        // Update the state to reflect the acceptance of the follow request
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === projectId
              ? { ...project, followers: [...project.followers, userId] }
              : project
          )
        );

        // Remove the notification from the list
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== notificationId
          )
        );
        console.log(`notifications:${notifications}`);
      } else {
        // Handle rejection of the follow request
        // ...
      }
    } catch (error) {
      console.error(`Error ${action}ing follow request:`, error);
    }
  };

  const handleLike = async (projectId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    try {
      await axios.post(
        `${api_url}/api/projects/${projectId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update userLikes state
      setUserLikes((prevLikes) => ({
        ...prevLikes,
        [projectId]: !prevLikes[projectId],
      }));
      setLikedProject(projectId);
      setTimeout(() => setLikedProject(null), 1000);
    } catch (error) {
      console.error("Error liking project:", error);
    }
  };

  const handleComment = async (projectId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    try {
      const response = await axios.post(
        `${api_url}/api/projects/${projectId}/comment`,
        { comment: commentText[projectId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId
            ? { ...project, comments: [...project.comments, response.data] }
            : project
        )
      );
      setCommentText((prev) => ({ ...prev, [projectId]: "" }));
    } catch (error) {
      console.error("Error commenting on project:", error);
    }
  };

  const toggleComments = (projectId) => {
    setShowComments((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
          Project Listings
        </h1>
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <Skeleton height={192} />
                  <div className="p-4">
                    <Skeleton
                      height={20}
                      width="80%"
                      style={{ marginBottom: "8px" }}
                    />
                    <Skeleton height={16} width="50%" />
                    <Skeleton
                      height={16}
                      width="70%"
                      style={{ marginTop: "8px" }}
                    />
                  </div>
                </div>
              ))
            : projects.map((project, index) => (
                <div
                  key={project._id ? project._id : index}
                  className="relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                  onDoubleClick={() => handleLike(project._id)}
                >
                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <img
                        className="w-8 h-8 rounded-full mr-2"
                        src={
                          project.user.profileImage ||
                          `https://ui-avatars.com/api/?name=${project.user.username}&background=random&size=512`
                        }
                        alt={project.user.username}
                      />
                      <Link
                        to={`/profile/${project.user.id}`}
                        className="text-gray-700 dark:text-gray-300 font-bold hover:underline"
                      >
                        {project.user.username}
                      </Link>
                      {/* <p className="text-gray-700 dark:text-gray-300 font-bold">
                        {project.user.username}
                      </p> */}
                    </div>
                    <img
                      className="h-48 w-full object-cover"
                      src={`https://ui-avatars.com/api/?name=${project.title}&background=random&size=512`}
                      alt={project.title}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h2 className="text-lg font-medium text-white">
                        {project.title}
                      </h2>
                      <p className="text-gray-300 mt-1 truncate">
                        {project.description}
                      </p>
                    </div>
                    {likedProject === project._id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="w-24 h-24 text-red-500 animate-ping"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => handleLike(project._id)}
                        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                      >
                        {userLikes[project._id] ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="w-6 h-6 mr-1"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            className="w-6 h-6 mr-1"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        )}
                        Like
                      </button>
                      <span className="text-gray-600 dark:text-gray-400">
                        {project.likes && project.likes.length > 0
                          ? project.likes.length
                          : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => handleFollow(project._id)}
                        className="flex items-center text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="w-6 h-6 mr-1"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-2c3.86 0 7-3.14 7-7s-3.14-7-7-7-7 3.14-7 7 3.14 7 7 7zm-1-7H7v-2h4v-2l3 3-3 3v-2z" />
                        </svg>
                        Follow
                      </button>
                      <span className="text-gray-600 dark:text-gray-400">
                        {project.followers && project.followers.length > 0
                          ? project.followers.length
                          : 0}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <button
                        onClick={() => toggleComments(project._id)}
                        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="w-6 h-6 mr-1"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 11.5a8.38 8.38 0 01-1.79 5.11l-1.48-1.48a6.387 6.387 0 10-1.42 1.42l1.48 1.48A8.38 8.38 0 0111.5 21a8.5 8.5 0 010-17c4.71 0 8.5 3.79 8.5 8.5zm-3.5 0a5 5 0 01-7.84 4.01l-3.35 3.35-.71-.71 3.35-3.35A5 5 0 1117.5 11.5z" />
                        </svg>
                        Comments
                      </button>
                    </div>
                    {showComments[project._id] && (
                      <div className="mb-4">
                        {project.comments.map((comment, index) => (
                          <div key={index} className="flex items-center mb-1">
                            <img
                              className="w-8 h-8 rounded-full mr-2"
                              src={comment.avatar}
                              alt={comment.avatar}
                            />
                            <p className="text-gray-700 dark:text-gray-300 text-sm font-bold mr-2">
                              {comment.username}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                              {comment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mb-4">
                      <textarea
                        value={commentText[project._id] || ""}
                        onChange={(e) =>
                          setCommentText({
                            ...commentText,
                            [project._id]: e.target.value,
                          })
                        }
                        placeholder="Add a comment..."
                        rows="3"
                        className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleComment(project._id)}
                        className="mt-2 flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="w-6 h-6 mr-1"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-2c3.86 0 7-3.14 7-7s-3.14-7-7-7-7 3.14-7 7 3.14 7 7 7zm-1-7H7v-2h4v-2l3 3-3 3v-2z" />
                        </svg>
                        Post Comment
                      </button>
                    </div>
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Notifications
        </h2>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <p className="text-gray-700 dark:text-gray-300">
                {notification.message}
              </p>
              {notification.type === "followRequest" && (
                <div className="mt-2 flex space-x-4">
                  <button
                    onClick={() =>
                      handleNotificationAction(
                        notification._id,
                        "accept",
                        notification.projectId
                      )
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleNotificationAction(
                        notification._id,
                        "reject",
                        notification.projectId
                      )
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectListing;
