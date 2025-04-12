import express from "express";
import {
  submitProject,
  getProjects,
  getProject,
  likeProject,
  commentProject,
  enhanceDescription,
  getMyProjects,
  deleteProject,
  getChat,
  sendMessage,
} from "../controllers/projectControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { followProject } from "../controllers/projectControllers.js";

const router = express.Router();

router.post("/submit", protect, (req, res) => submitProject(req, res, req.io));
router.post("/enhance-description", protect, (req, res) =>
  enhanceDescription(req, res, req.io)
);
router.get("/myprojects", protect, (req, res) =>
  getMyProjects(req, res, req.io)
);

router.get("/", getProjects);
router.get("/:id", getProject);
router.delete("/:id", protect, (req, res) => deleteProject(req, res, req.io));
// router.get('/:id', protect, (req, res) => deleteProject(req, res, req.io));
router.post("/:id/like", protect, (req, res) => likeProject(req, res, req.io));
router.post("/:id/comment", protect, (req, res) =>
  commentProject(req, res, req.io)
);
router.post("/:id/follow", protect, (req, res) =>
  followProject(req, res, req.io)
);
router.get("/:projectId/chat", getChat);
router.post("/:projectId/chat", (req, res) => sendMessage(req, res, req.io));

export default router;
