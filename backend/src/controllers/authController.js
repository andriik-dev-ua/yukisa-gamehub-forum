import User from '../models/User.js';
import { signToken } from '../utils/token.js';

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  role: user.role,
  points: user.points
});

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Uzupełnij wszystkie pola.' });
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(409).json({ message: 'Użytkownik o takim loginie lub e-mailu już istnieje.' });
  const user = await User.create({ username, email, password });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Nieprawidłowy e-mail lub hasło.' });
  if (user.isBlocked) return res.status(403).json({ message: 'Konto zostało zablokowane.' });
  res.json({ token: signToken(user), user: publicUser(user) });
};

export const me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};

export const forgotPassword = async (req, res) => {
  res.json({ message: `Symulacja: wysłano link resetowania hasła na ${req.body.email || 'podany e-mail'}.` });
};
