const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'gamestopdev_secret_key_2026';

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Brak tokenu autoryzacji' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Użytkownik nie istnieje' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Konto zostało zablokowane' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Nieprawidłowy token' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user && !user.isBlocked) {
        req.user = user;
      }
    }
  } catch (_) {
    // ignore invalid tokens
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Wymagane uprawnienia administratora' });
  }
  next();
};

const requireModerator = (req, res, next) => {
  if (!req.user || !['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Wymagane uprawnienia moderatora' });
  }
  next();
};

module.exports = { authenticate, optionalAuth, requireAdmin, requireModerator };
