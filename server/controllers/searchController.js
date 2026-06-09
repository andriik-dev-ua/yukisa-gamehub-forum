const { Thread, Post, User, Category } = require('../models');
const { Op } = require('sequelize');

exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Fraza wyszukiwania musi mieć min. 2 znaki' });
    }

    const query = `%${q.trim()}%`;

    const threads = await Thread.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: query } },
          { content: { [Op.like]: query } },
        ],
      },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'icon', 'color'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    res.json({ threads, count: threads.length });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};
