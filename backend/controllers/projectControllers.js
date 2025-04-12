import Project from "../models/Project.js";
import User from "../models/User.js";

import Notification from "../models/Notifications.js";
import Chat from "../models/Chat.js";
import run from "../gemini-api.js";

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

// message bhejoooo
export const sendMessage = async (req, res, io) => {
  console.log("Request body:", req.body);
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
    const projectOwner = await User.findById(project.teamMembers[0]);
    if (!projectOwner) {
      console.log("Project owner not found");
      return res.status(404).json({ message: "Project owner not found" });
    }

    const notification = new Notification({
      recipient: projectOwner._id,
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

    io.emit("notification", notification);

    res.json({ message: "Follow request sent" });
  } catch (error) {
    console.error("Error in followProject:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserSocketId = async (userId) => {
  const user = await User.findById(userId);
  return user.socketId;
};

export const handleFollowRequest = async (req, res, io) => {
  const action = req.body.action;
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
        profileImage: user.avatar,
      },
    };

    if (requiredSkills) {
      newProjectData.requiredSkills = requiredSkills
        .split(",")
        .map((skill) => skill.trim());
    }

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

export const updateProject = async (req, res, io) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    io.emit("projectUpdated", project);
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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

export const likeProject = async (req, res, io) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.likes) {
      project.likes = [];
    }

    const alreadyLiked = project.likes.some((userId) =>
      userId.equals(req.userId)
    );

    if (alreadyLiked) {
      project.likes = project.likes.filter(
        (userId) => !userId.equals(req.userId)
      );
    } else {
      project.likes.push(req.userId);
    }

    await project.save();

    io.emit("projectUpdated", project);

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const commentProject = async (req, res, io) => {
  const { comment } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    project.comments.push({
      user: req.userId,
      username: user.username,
      text: comment,
      avatar: user.avatar,
    });
    await project.save();

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

export const deleteProject = async (req, res, io) => {
  const projectId = req.params.id;
  console.log(`dhruv:${projectId}`);
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // if (!project.teamMembers.includes(req.userId)) {
    //   return res.status(403).json({ message: 'You are not authorized to delete this project' });
    // }

    await Project.deleteOne({ _id: projectId });

    io.emit("projectDeleted", projectId);

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
