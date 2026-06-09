const { Like, Thread, Post } = require('../models');

exports.toggle = async (req, res) => {
  try {
    const { threadId, postId } = req.body;
    const userId = req.user.id;

    if (!threadId && !postId) {
      return res.status(400).json({ message: 'Wymagane threadId lub postId' });
    }

    const where = { userId };
    if (threadId) where.threadId = threadId;
    if (postId) where.postId = postId;

    const existing = await Like.findOne({ where });

    if (existing) {
      await existing.destroy();
      return res.json({ liked: false, message: 'Polubienie usunięte' });
    }

    await Like.create({ userId, threadId: threadId || null, postId: postId || null });
    res.json({ liked: true, message: 'Polubiono' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};
