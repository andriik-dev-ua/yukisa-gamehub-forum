import Topic from '../models/Topic.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import User from '../models/User.js';

const enrichTopic = async (topic) => {
  const [commentsCount, likesCount] = await Promise.all([
    Comment.countDocuments({ topic: topic._id }),
    Like.countDocuments({ targetType: 'Topic', targetId: topic._id })
  ]);
  return { ...topic.toObject(), commentsCount, likesCount };
};

export const listTopics = async (req, res) => {
  const { q, category } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  const topics = await Topic.find(filter).populate('author', 'username avatar role').populate('category', 'name color icon').sort({ isPinned: -1, createdAt: -1 });
  res.json(await Promise.all(topics.map(enrichTopic)));
};

export const getTopic = async (req, res) => {
  const topic = await Topic.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    .populate('author', 'username avatar role')
    .populate('category', 'name color icon');
  if (!topic) return res.status(404).json({ message: 'Temat nie istnieje.' });
  const comments = await Comment.find({ topic: topic._id }).populate('author', 'username avatar role').sort({ createdAt: 1 });
  const topicLikes = await Like.countDocuments({ targetType: 'Topic', targetId: topic._id });
  const commentLikes = await Like.aggregate([
    { $match: { targetType: 'Comment', targetId: { $in: comments.map((c) => c._id) } } },
    { $group: { _id: '$targetId', count: { $sum: 1 } } }
  ]);
  const counts = Object.fromEntries(commentLikes.map((item) => [String(item._id), item.count]));
  res.json({ topic: { ...topic.toObject(), likesCount: topicLikes }, comments: comments.map((c) => ({ ...c.toObject(), likesCount: counts[String(c._id)] || 0 })) });
};

export const createTopic = async (req, res) => {
  const topic = await Topic.create({ ...req.body, author: req.user._id });
  await User.findByIdAndUpdate(req.user._id, { $inc: { points: 5 } });
  res.status(201).json(await topic.populate('author category'));
};

export const updateTopic = async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) return res.status(404).json({ message: 'Temat nie istnieje.' });
  if (String(topic.author) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Brak dostępu.' });
  Object.assign(topic, req.body);
  await topic.save();
  res.json(topic);
};

export const deleteTopic = async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) return res.status(404).json({ message: 'Temat nie istnieje.' });
  if (String(topic.author) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Brak dostępu.' });
  await Promise.all([Comment.deleteMany({ topic: topic._id }), Like.deleteMany({ targetType: 'Topic', targetId: topic._id }), topic.deleteOne()]);
  res.json({ message: 'Temat usunięty.' });
};

export const toggleTopicLike = async (req, res) => {
  const query = { user: req.user._id, targetType: 'Topic', targetId: req.params.id };
  const existing = await Like.findOne(query);
  if (existing) await existing.deleteOne();
  else await Like.create(query);
  res.json({ liked: !existing, likesCount: await Like.countDocuments({ targetType: 'Topic', targetId: req.params.id }) });
};
