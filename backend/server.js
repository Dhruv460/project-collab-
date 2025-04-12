import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import apiRouter from "./routes/apiRouter.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "./models/User.js";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
const JWT_SECRET = process.env.JWT_SECRET;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(
  "/api",
  (req, res, next) => {
    req.io = io;
    next();
  },
  apiRouter
);
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.status(404).json({ message: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mradhruv27@gmail.com",
        pass: "mpnn pjfm ivdn aapf",
      },
    });

    var mailOptions = {
      from: "mradhruv27@gmail.com",
      to: email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Email could not be sent." });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "Password reset link sent!" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

let onlineUsers = new Map(); // Map<userId, socketId>

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // 1. Setup: User identifies themselves after connection
  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      // Create a room for this specific user based on their MongoDB ID
      socket.join(userData._id.toString());
      onlineUsers.set(userData._id.toString(), socket.id);
      console.log(
        `<span class="math-inline">\{userData\.username\} \(</span>{userData._id}) joined their personal room and is online.`
      );
      socket.emit("connected"); // Acknowledge setup
      // Optionally broadcast online users list if needed
      io.emit("online users", Array.from(onlineUsers.keys()));
    } else {
      console.log("Setup failed: userData or _id missing");
    }
  });

  // 2. Join Chat Room: User explicitly joins a room when they open a chat
  socket.on("join chat", (room) => {
    socket.join(room); // Room is the chatId
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // 3. Typing Indicators (Optional)
  socket.on("typing", (room) => {
    // Broadcast to everyone in the room *except* the sender
    socket.in(room).emit("typing", room); // Send room ID so frontend knows which chat is typing
    console.log(`User ${socket.id} is typing in room: ${room}`);
  });
  socket.on("stop typing", (room) => {
    // Broadcast to everyone in the room *except* the sender
    socket.in(room).emit("stop typing", room);
    console.log(`User ${socket.id} stopped typing in room: ${room}`);
  });

  // Note: 'new message' is now primarily handled by the sendMessage controller emitting
  // We keep the listener here mainly for logging or potential direct socket-only messages if designed differently.
  // socket.on("new message", (newMessageReceived) => {
  //     // ... logic if messages were sent *only* via socket ...
  // });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Find which user disconnected and remove them
    let userIdToRemove = null;
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        userIdToRemove = userId;
        break;
      }
    }
    if (userIdToRemove) {
      onlineUsers.delete(userIdToRemove);
      console.log(`User ${userIdToRemove} went offline.`);
      // Optionally broadcast updated online users list
      io.emit("online users", Array.from(onlineUsers.keys()));
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
