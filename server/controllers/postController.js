const { Post, User, Thread, Like } = require('../models');

exports.getByThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      where: { threadId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'role', 'points', 'createdAt'] },
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset,
    });

    const posts = await Promise.all(
      rows.map(async (post) => {
        const likeCount = await Like.count({ where: { postId: post.id } });
        let userLiked = false;
        if (req.user) {
          const like = await Like.findOne({
            where: { userId: req.user.id, postId: post.id },
          });
          userLiked = !!like;
        }
        return { ...post.toJSON(), likeCount, userLiked };
      })
    );

    res.json({
      posts,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Treść jest wymagana' });
    }

    const thread = await Thread.findByPk(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Wątek nie znaleziony' });
    }

    if (thread.isLocked) {
      return res.status(403).json({ message: 'Wątek jest zamknięty' });
    }

    const post = await Post.create({
      content,
      threadId,
      userId: req.user.id,
    });

    await req.user.increment('points', { by: 2 });

    const full = await Post.findByPk(post.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'role', 'points'] },
      ],
    });

    res.status(201).json(full);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post nie znaleziony' });
    }

    if (post.userId !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    const { content } = req.body;
    await post.update({ content });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post nie znaleziony' });
    }

    if (post.userId !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    await Like.destroy({ where: { postId: post.id } });
    await post.destroy();
    res.json({ message: 'Post usunięty' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};
