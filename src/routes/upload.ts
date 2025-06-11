// routes/upload.ts
import express, { Request, Response } from 'express';
import { authenticateJWT } from '../middlewares/auth';
import { postLimiter, getLimiter } from '../middlewares/rateLimit';
import { uploadMiddleware } from '../middlewares/upload';
import { contentModerationMiddleware, moderationLogger } from '../middlewares/contentModeration';
import { FileService } from '../services/fileService';

const router = express.Router();

// Endpoint para subir imágenes con moderación de contenido
router.post(
  '/',
  authenticateJWT,
  postLimiter,
  uploadMiddleware,
  contentModerationMiddleware,  // Nuevo middleware de moderación
  moderationLogger,             // Opcional: logging de estadísticas
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: 'No se subió ninguna imagen', status: 400 });
        return;
      }

      const url = await FileService.uploadFile(file);
      
      // Respuesta exitosa con información adicional opcional
      res.json({ 
        directLink: url,
        moderated: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al subir la imagen', error, status: 500 });
    }
  },
);

export default router;