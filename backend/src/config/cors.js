const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

// Lista dozwolonych adresów frontendu może być rozszerzona przez CLIENT_URLS po przecinku.
export const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const envOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const allowedOrigins = new Set([...defaultOrigins, ...envOrigins]);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} nie jest dozwolony przez CORS.`));
  },
  credentials: true
};
