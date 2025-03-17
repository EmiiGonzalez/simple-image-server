import multer from 'multer';
import { config } from '../config/config';

const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: config.maxFileSizeMb * 1024 * 1024 },
}).single('image');