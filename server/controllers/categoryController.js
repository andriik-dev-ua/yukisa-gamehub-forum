const { Category, Thread, Post } = require('../models');
const { fn, col } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['order', 'ASC'], ['name', 'ASC']],
    });

    const result = await Promise.all(
      categories.map(async (cat) => {
        const threadCount = await Thread.count({ where: { categoryId: cat.id } });
        const postCount = await Post.count({
          include: [{ model: Thread, as: 'thread', where: { categoryId: cat.id }, attributes: [] }],
        });
        const lastThread = await Thread.findOne({
          where: { categoryId: cat.id },
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'title', 'createdAt'],
        });
        return {
          ...cat.toJSON(),
          threadCount,
          postCount,
          lastThread,
        };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, icon, color, order } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Nazwa kategorii jest wymagana' });
    }
    const category = await Category.create({ name, description, icon, color, order });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategoria nie znaleziona' });
    }
    const { name, description, icon, color, order } = req.body;
    await category.update({ name, description, icon, color, order });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategoria nie znaleziona' });
    }
    await category.destroy();
    res.json({ message: 'Kategoria usunięta' });
  } catch (error) {
    res.status(500).json({ message: 'Błąd serwera', error: error.message });
  }
};
