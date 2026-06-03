import multer from 'multer';

// Avatar w wersji edukacyjnej jest przyjmowany jako data URL w pamięci serwera.
export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });
