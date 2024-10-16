import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/authMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import Token from '../models/token.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password, socketId } = req.body;
  console.log('Registering user with socketId:', socketId);
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profileImageUrl = result.secure_url;
      console.log('Uploaded Image URL:', profileImageUrl);
    }

    user = new User({ username, email, password: hashedPassword, avatar: profileImageUrl, socketId });
    await user.save();

const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
    console.log(`token while registering is : ${token}`)
		const url = `${process.env.BASE_URL}/users/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);

	


    res.status(201).json({
      message: user._id,
      avatar: user.avatar,
      mssg:"An Email sent to your account please verify"
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { bio, skills, interests, pastProjects, endorsements, socketId } = req.body;
  console.log('Updating user with socketId:', socketId);
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    if (pastProjects) user.pastProjects = pastProjects;
    if (endorsements) user.endorsements = endorsements;
    if (socketId) user.socketId = socketId;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.avatar = result.secure_url;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password, socketId } = req.body;
  console.log('Logging in user with socketId:', socketId);
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update socketId
    if (socketId) {
      user.socketId = socketId;
      await user.save();
    }

		if (!user.verified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
				const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
				await sendEmail(user.email, "Verify Email", url);
			}

			return res
				.status(400)
				.send({ message: "An Email sent to your account please verify" });
		}
    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
      avatar: user.avatar, // Return avatar in response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    console.log(`Fetching user profile for ID: ${id}`);
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users
export const searchUsers = async (req, res) => {
  const { query } = req.query;
  console.log(`Received search query: ${query}`); // Log the received query
  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }
  try {
    const users = await User.find({ username: { $regex: new RegExp(query, 'i') } });
    console.log(`Found users: ${users}`); // Log found users
    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const emailVerification = async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		console.log(`email verify user is :${user}`);
		if (!user) return res.status(400).send({ message: "Invalid link due to absence of user " });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		console.log(`email verify token is :${token}`);
		if (!token) return res.status(400).send({ message: "Invalid link due to absence of token " });

		user.verified = true; // Set the verified field to true
		await user.save(); // Save the user document

		// await Token.deleteOne({ _id: token._id }); // Delete the token

		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Internal Server Error! well that sucks" });
	}
};
