const { User, Thread, Post } = require('../models');
const path = require('path');
const fs = require('fs');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const threadCount = await Thread.count({ where: { userId: user.id } });
    const postCount = await Post.count({ where: { userId: user.id } });

    res.json({ ...user.toJSON(), threadCount, postCount });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    const { username, bio } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;

    if (req.file) {
      if (req.user.avatar) {
        const oldPath = path.join(__dirname, '..', req.user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    await req.user.update(updateData);
    res.json({ user: req.user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const { role } = req.body;
    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Nieprawidłowa rola' });
    }

    await user.update({ role });
    res.json({ user: user.toSafeJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.toggleBlock = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    await user.update({ isBlocked: !user.isBlocked });
    res.json({ isBlocked: user.isBlocked, message: user.isBlocked ? 'Użytkownik zablokowany' : 'Użytkownik odblokowany' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.getRanking = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'avatar', 'points', 'role', 'createdAt'],
      order: [['points', 'DESC']],
      limit: 20,
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};
