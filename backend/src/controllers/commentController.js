import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import User from '../models/User.js';

export const createComment = async (req, res) => {
  const comment = await Comment.create({ content: req.body.content, topic: req.params.topicId, author: req.user._id });
  await User.findByIdAndUpdate(req.user._id, { $inc: { points: 2 } });
  res.status(201).json(await comment.populate('author', 'username avatar role'));
};

export const updateComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Komentarz nie istnieje.' });
  if (String(comment.author) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Brak dostępu.' });
  comment.content = req.body.content;
  await comment.save();
  res.json(comment);
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Komentarz nie istnieje.' });
  if (String(comment.author) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Brak dostępu.' });
  await Like.deleteMany({ targetType: 'Comment', targetId: comment._id });
  await comment.deleteOne();
  res.json({ message: 'Komentarz usunięty.' });
};

export const toggleCommentLike = async (req, res) => {
  const query = { user: req.user._id, targetType: 'Comment', targetId: req.params.id };
  const existing = await Like.findOne(query);
  if (existing) await existing.deleteOne();
  else await Like.create(query);
  res.json({ liked: !existing, likesCount: await Like.countDocuments({ targetType: 'Comment', targetId: req.params.id }) });
};
