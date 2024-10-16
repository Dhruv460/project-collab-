import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  type: { type: String, required: true }, // 'followRequest' or 'followAccepted'
  status: { type: String, default: 'pending' }, // 'pending', 'accepted', 'rejected'
  createdAt: { type: Date, default: Date.now },
  message: { type: String },
  read: { type: Boolean, default: false }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
