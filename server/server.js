require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/threads', require('./routes/threads'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/search', require('./routes/search'));
app.use('/api/stats', require('./routes/stats'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', name: 'GameStopDev API', version: '1.0.0' });
});

// Serve frontend in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Wewnętrzny błąd serwera' });
});

// Start
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Baza danych zsynchronizowana');
    app.listen(PORT, () => {
      console.log(`GameStopDev API działa na porcie ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Nie udało się uruchomić serwera:', error);
    process.exit(1);
  }
};

startServer();
