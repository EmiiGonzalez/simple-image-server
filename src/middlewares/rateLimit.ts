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
  windowMs: 60 * 1000, // 10 minutos
  max: 100, // 100 solicitudes por token
  keyGenerator: (req: Request) => req.token || 'anonymous',
  message: { message: 'Demasiadas solicitudes, intentá de nuevo en 10 minutos' },
});

const limiter = rateLimit({
	windowMs: 60 * 1000, // 10 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	keyGenerator: (req) => req.ip || "anonymous",
  handler: (req, res) => {
    res.status(429).json({ message: 'Demasiadas solicitudes, intentá de nuevo en 10 minutos' });
  },
})