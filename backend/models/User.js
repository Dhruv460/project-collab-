import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  skills: [String],
  interests: [String],
  pastProjects: [String],
  endorsements: [String],
  avatar:{
    type: String,
  },
  socketId: { type: String } , // Add the socketId field here
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  verified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
export default User;
