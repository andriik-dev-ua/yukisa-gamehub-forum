const { Thread, User, Category, Post, Like } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const { categoryId, sort, page = 1, limit = 20 } = req.query;
    const where = {};
    if (categoryId) where.categoryId = categoryId;

    let order = [['isPinned', 'DESC'], ['createdAt', 'DESC']];
    if (sort === 'popular') order = [['isPinned', 'DESC'], ['views', 'DESC']];

    const offset = (page - 1) * limit;
    const { count, rows } = await Thread.findAndCountAll({
      where,
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'role'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
      ],
      order,
      limit: parseInt(limit),
      offset,
    });

    const threads = await Promise.all(
      rows.map(async (thread) => {
        const postCount = await Post.count({ where: { threadId: thread.id } });
        const likeCount = await Like.count({ where: { threadId: thread.id } });
        return { ...thread.toJSON(), postCount, likeCount };
      })
    );

    res.json({
      threads,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'role', 'bio', 'points', 'createdAt'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
      ],
    });

    if (!thread) {
      return res.status(404).json({ message: 'Wątek nie znaleziony' });
    }

    await thread.increment('views');

    const likeCount = await Like.count({ where: { threadId: thread.id } });
    const postCount = await Post.count({ where: { threadId: thread.id } });

    let userLiked = false;
    if (req.user) {
      const like = await Like.findOne({
        where: { userId: req.user.id, threadId: thread.id },
      });
      userLiked = !!like;
    }

    res.json({ ...thread.toJSON(), views: thread.views + 1, likeCount, postCount, userLiked });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;

    if (!title || !content || !categoryId) {
      return res.status(400).json({ message: 'Tytuł, treść i kategoria są wymagane' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Kategoria nie istnieje' });
    }

    const thread = await Thread.create({
      title,
      content,
      categoryId,
      userId: req.user.id,
    });

    await req.user.increment('points', { by: 5 });

    const full = await Thread.findByPk(thread.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'role'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
      ],
    });

    res.status(201).json(full);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Wątek nie znaleziony' });
    }

    if (thread.userId !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    const { title, content } = req.body;
    await thread.update({ title, content });
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Wątek nie znaleziony' });
    }

    if (thread.userId !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    await Post.destroy({ where: { threadId: thread.id } });
    await Like.destroy({ where: { threadId: thread.id } });
    await thread.destroy();

    res.json({ message: 'Wątek usunięty' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Wątek nie znaleziony' });
    }
    await thread.update({ isPinned: !thread.isPinned });
    res.json({ isPinned: thread.isPinned });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.toggleLock = async (req, res) => {
  try {
    const thread = await Thread.findByPk(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Wątek nie znaleziony' });
    }
    await thread.update({ isLocked: !thread.isLocked });
    res.json({ isLocked: thread.isLocked });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.getLatest = async (req, res) => {
  try {
    const threads = await Thread.findAll({
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const result = await Promise.all(
      threads.map(async (thread) => {
        const postCount = await Post.count({ where: { threadId: thread.id } });
        const likeCount = await Like.count({ where: { threadId: thread.id } });
        return { ...thread.toJSON(), postCount, likeCount };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};
