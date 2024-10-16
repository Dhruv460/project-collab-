import Project from "../models/Project.js";
import User from "../models/User.js";

import Notification from "../models/Notifications.js";
import Chat from "../models/Chat.js";
import run from "../gemini-api.js";

// getChat
export const getChat = async (req, res) => {
  try {
    // console.log(`id for get chat is ${req.params.id}`)
    console.log(`logging params:${JSON.stringify(req.params)}`);
    const projectId = req.params.projectId; // Get projectId from URL params
    console.log(`projectId for get chat:${projectId}`);

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const chat = await Chat.findOne({ projectId }).populate(
      "messages.user",
      "username"
    );
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json(chat);
    console.log(`getchat:${chat.projectId}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// sendMessage
export const sendMessage = async (req, res, io) => {
  console.log("Request body:", req.body); // Debugging line
  const { projectId, text } = req.body;

  console.log(`project id for send message:${projectId}`);
  if (!projectId || !text) {
    return res.status(400).json({ message: "projectId and text are required" });
  }

  try {
    let chat = await Chat.findOne({ projectId });
    if (!chat) {
      chat = new Chat({ projectId, messages: [] });
    }

    chat.messages.push({ user: req.userId, text });
    await chat.save();
    console.log(chat.projectId);
    io.emit("message", chat);

    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const followProject = async (req, res, io) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log("Project not found");
      return res.status(404).json({ message: "Project not found" });
    }
    console.log(`project owner :${project.teamMembers[0]}`);
    const projectOwner = await User.findById(project.teamMembers[0]); // Assuming first member is owner
    if (!projectOwner) {
      console.log("Project owner not found");
      return res.status(404).json({ message: "Project owner not found" });
    }

    const notification = new Notification({
      recipient: projectOwner._id, // Set recipient to project owner's ID
      sender: req.userId,
      project: project._id,
      type: "followRequest",
    });
    await notification.save();

    console.log(`notification data :${notification}`);
    // console.log(`recipient is ${projectOwner._id}`)

    // console.log(`user is :${user}`)

    const projectOwnerSocketId = await getUserSocketId(projectOwner._id);
    console.log(`project owner socket id is${projectOwnerSocketId}`);
    // Send the notification to the project owner's socket ID
    io.emit("notification", notification);

    res.json({ message: "Follow request sent" });
  } catch (error) {
    console.error("Error in followProject:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to get a user's socket ID
const getUserSocketId = async (userId) => {
  // Assuming you have a users collection with socket IDs
  const user = await User.findById(userId);
  return user.socketId;
};

export const handleFollowRequest = async (req, res, io) => {
  const action = req.body.action; // 'accept' or 'reject'
  const notificationId = req.params.id;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const project = await Project.findById(notification.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (action === "accept") {
      if (!project.followers) {
        project.followers = [];
      }
      project.followers.push(notification.sender);
      await project.save();

      const projectOwner = await User.findById(project.teamMembers[0]);
      const user = await User.findById(notification.sender);

      const chat = new Chat({
        participants: [projectOwner._id, user._id],
      });
      await chat.save();
      console.log(`chat is ${chat}`);
      console.log(`project owner before includes is : ${projectOwner}`);
      if (!projectOwner.chats.includes(chat._id)) {
        projectOwner.chats.push(chat._id);
        await projectOwner.save();
      }

      if (!user.chats.includes(chat._id)) {
        user.chats.push(chat._id);
        await user.save();
      }
      console.log(`not chat is :${chat}`);
      notification.status = "accepted";
    } else {
      notification.status = "rejected";
    }

    await notification.save();

    res.json({
      message: `Follow request ${action}ed, projectId: ${project._id}`,
    });
  } catch (error) {
    console.error("Error in handleFollowRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitProject = async (req, res, io) => {
  const { title, description, goals, requiredSkills, tags, useAIEnhancement } =
    req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let enhancedDescription = description;

    if (useAIEnhancement) {
      enhancedDescription = await run(description);
    }

    const newProjectData = {
      title,
      description: enhancedDescription,
      goals,
      teamMembers: [req.userId],
      user: {
        id: req.userId,
        username: user.username,
        profileImage: user.avatar, // Assuming 'avatar' stores the profile picture URL
      },
    };

    // Check and parse requiredSkills if defined
    if (requiredSkills) {
      newProjectData.requiredSkills = requiredSkills
        .split(",")
        .map((skill) => skill.trim());
    }

    // Check and parse tags if defined
    if (tags) {
      newProjectData.tags = tags.split(",").map((tag) => tag.trim());
    }

    const newProject = new Project(newProjectData);
    await newProject.save();
    io.emit("projectCreated", newProject);
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const enhanceDescription = async (req, res) => {
  const { description } = req.body;
  try {
    const enhancedDescription = await run(description);
    res.json({ enhancedDescription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error enhancing description" });
  }
};

// Update a project
export const updateProject = async (req, res, io) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    io.emit("projectUpdated", project); // Emit 'projectUpdated' event
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
    // console.log(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "teamMembers",
      "username"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like a project
export const likeProject = async (req, res, io) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure project.likes is initialized as an array
    if (!project.likes) {
      project.likes = [];
    }

    // Check if user has already liked this project
    const alreadyLiked = project.likes.some((userId) =>
      userId.equals(req.userId)
    );

    if (alreadyLiked) {
      // User has already liked, so unlike
      project.likes = project.likes.filter(
        (userId) => !userId.equals(req.userId)
      );
    } else {
      // User hasn't liked, so like the project
      project.likes.push(req.userId);
    }

    await project.save();

    // Emit event to update clients
    io.emit("projectUpdated", project);

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Comment on a project
export const commentProject = async (req, res, io) => {
  const { comment } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Fetch the user to get the username
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add comment with user's ID and username
    project.comments.push({
      user: req.userId,
      username: user.username,
      text: comment,
      avatar: user.avatar,
    });
    await project.save();

    // Emit event to update clients
    io.emit("projectUpdated", project);

    res.json(project);
    console.log(`dhruvs project comment :${project}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ teamMembers: req.userId });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a project
export const deleteProject = async (req, res, io) => {
  const projectId = req.params.id;
  console.log(`dhruv:${projectId}`);
  try {
    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ensure only the project owner can delete the project
    // if (!project.teamMembers.includes(req.userId)) {
    //   return res.status(403).json({ message: 'You are not authorized to delete this project' });
    // }

    // Delete the project from the database
    await Project.deleteOne({ _id: projectId });

    // Emit event to update clients
    io.emit("projectDeleted", projectId);

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
