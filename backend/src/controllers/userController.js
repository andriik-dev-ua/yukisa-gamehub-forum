import User from '../models/User.js';

export const getProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Nie znaleziono użytkownika.' });
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { username, bio, avatar } = req.body;
  const updates = { username, bio, avatar };
  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
  res.json(user);
};

export const ranking = async (_req, res) => {
  const users = await User.find().sort({ points: -1, createdAt: 1 }).limit(10).select('username avatar points role');
  res.json(users);
};
