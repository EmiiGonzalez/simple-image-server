import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token requerido' });
    return;
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      res.status(403).json({ message: 'Token inválido' });
      return;
    }

    //extraigo la información del usuario del token
    const { sub } = jwt.decode(token) as { sub: string };

    req.id = sub; // Guardamos el ID del usuario en la request
    req.user = user;
    req.token = token; // Guardamos el token para rate limiting
    next();
  });
};