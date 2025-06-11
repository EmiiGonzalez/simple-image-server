import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/config';

export class FileService {
  static async uploadFile(file: Express.Multer.File, userId: string | undefined): Promise<string> {
    const fileName = `${Date.now()}-${userId || 'unknown'}-${file.originalname}`;
    const filePath = path.join(config.uploadDir, fileName);

    await fs.mkdir(config.uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    return `${config.baseUrl}/uploads/${fileName}`;
  }
}