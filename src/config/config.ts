import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10),
  jwtSecret: process.env.JWT_SECRET || 'tu_secreto',
  minutesLimit: process.env.MINUTES_LIMIT || '1',
};