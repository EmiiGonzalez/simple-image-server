import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';

export class FileService {
  static async uploadFile(file: Express.Multer.File): Promise<string> {
    const uniqueId = uuidv4();
    const fileName = `${Date.now()}-${uniqueId}-${file.originalname}`;
    const filePath = path.join(config.uploadDir, fileName);

    await fs.mkdir(config.uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    return `${config.baseUrl}/uploads/${fileName}`;
  }
}