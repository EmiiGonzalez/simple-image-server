declare namespace Express {
    interface Request {
        user?: string | JwtPayload;
        token?: string;
        id?: string;
        tipo_de_cuenta?: string;
      }
  }
