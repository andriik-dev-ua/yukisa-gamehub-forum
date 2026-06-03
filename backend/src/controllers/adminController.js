import User from '../models/User.js';
import Topic from '../models/Topic.js';
import Comment from '../models/Comment.js';
import Category from '../models/Category.js';

export const stats = async (_req, res) => {
  const [users, topics, comments, categories] = await Promise.all([
    User.countDocuments(),
    Topic.countDocuments(),
    Comment.countDocuments(),
    Category.countDocuments()
  ]);
  res.json({ users, topics, comments, categories });
};

export const listUsers = async (_req, res) => {
  res.json(await User.find().select('-password').sort({ createdAt: -1 }));
};

export const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json(user);
};

export const setRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  res.json(user);
};
