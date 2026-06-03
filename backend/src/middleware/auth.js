import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Brak tokenu autoryzacji.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.isBlocked) return res.status(401).json({ message: 'Konto nieaktywne lub zablokowane.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Nieprawidłowy token.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Wymagane uprawnienia administratora.' });
  next();
};
