import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import { config } from '../config/config';

export const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // 5 solicitudes por token
  keyGenerator: (req: Request) => req.token || 'anonymous',
  message: { message: `Demasiadas solicitudes, intentá de nuevo en ${config.minutesLimit} minuto` },
});

export const getLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 500, // 100 solicitudes por token
  keyGenerator: (req: Request) => req.token || 'anonymous',
  message: { message: 'Demasiadas solicitudes, intentá de nuevo en 10 minutos' },
});