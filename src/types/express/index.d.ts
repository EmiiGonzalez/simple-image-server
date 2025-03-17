declare namespace Express {
    interface Request {
        user?: string | JwtPayload;
        token?: string;
        tipo_de_cuenta?: string;
      }
  }
