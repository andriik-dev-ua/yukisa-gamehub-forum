const { User, Thread, Post, Category } = require('../models');

exports.getStats = async (req, res) => {
  try {
    const [userCount, threadCount, postCount, categoryCount] = await Promise.all([
      User.count(),
      Thread.count(),
      Post.count(),
      Category.count(),
    ]);

    res.json({ userCount, threadCount, postCount, categoryCount });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};
