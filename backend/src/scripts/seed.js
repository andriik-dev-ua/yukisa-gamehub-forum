import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import Notification from '../models/Notification.js';
import Topic from '../models/Topic.js';
import User from '../models/User.js';
import { avatarDataUri } from '../utils/avatar.js';

dotenv.config();
await connectDB();
await Promise.all([User.deleteMany(), Category.deleteMany(), Topic.deleteMany(), Comment.deleteMany(), Like.deleteMany(), Notification.deleteMany()]);

const [admin, player, moderator] = await User.create([
  { username: 'admin', email: 'admin@gamehub.pl', password: 'admin123', role: 'admin', points: 120, avatar: avatarDataUri('Admin') },
  { username: 'pixelowyLis', email: 'lis@gamehub.pl', password: 'test1234', points: 64, avatar: avatarDataUri('Fox') },
  { username: 'retroMistrz', email: 'retro@gamehub.pl', password: 'test1234', points: 91, avatar: avatarDataUri('Retro') }
]);

const categories = await Category.create([
  { name: 'PC Gaming', slug: 'pc-gaming', description: 'Sprzęt, konfiguracje i gry komputerowe.', color: '#0ea5e9', icon: '🖥️' },
  { name: 'Konsole', slug: 'konsole', description: 'PlayStation, Xbox, Nintendo i kanapowe granie.', color: '#22c55e', icon: '🎮' },
  { name: 'E-sport', slug: 'esport', description: 'Turnieje, rankingi i taktyki drużynowe.', color: '#f97316', icon: '🏆' },
  { name: 'Retro', slug: 'retro', description: 'Klasyczne gry i wspomnienia z dzieciństwa.', color: '#a855f7', icon: '🕹️' }
]);

const topics = await Topic.create([
  { title: 'Najlepsze ustawienia graficzne do Cyberpunk 2077', content: 'Podzielcie się konfiguracjami pod płynne 60 FPS i ładny ray tracing.', author: player._id, category: categories[0]._id, tags: ['pc', 'rpg', 'rtx'], isPinned: true },
  { title: 'Czy warto kupić Steam Decka?', content: 'Szukam opinii użytkowników po kilku miesiącach grania mobilnego.', author: moderator._id, category: categories[1]._id, tags: ['sprzęt', 'handheld'] },
  { title: 'Taktyki na ranked w Counter-Strike', content: 'Zbieramy proste komunikaty i rozpiski smoke dla nowych graczy.', author: admin._id, category: categories[2]._id, tags: ['esport', 'fps'] }
]);

await Comment.create([
  { content: 'DLSS Quality i limit FPS bardzo pomagają utrzymać stabilność.', author: admin._id, topic: topics[0]._id },
  { content: 'Steam Deck świetnie sprawdza się w indykach i starszych AAA.', author: player._id, topic: topics[1]._id },
  { content: 'Dobrze opisać role entry, support i lurker przed startem meczu.', author: moderator._id, topic: topics[2]._id }
]);
await Like.create([{ user: admin._id, targetType: 'Topic', targetId: topics[0]._id }, { user: player._id, targetType: 'Topic', targetId: topics[2]._id }]);
await Notification.create([{ user: player._id, message: 'Witaj w GameHub Forum! Dodaj swój pierwszy temat.' }]);

console.log('Dane demonstracyjne dodane. Konta: admin@gamehub.pl/admin123, lis@gamehub.pl/test1234');
await mongoose.disconnect();
