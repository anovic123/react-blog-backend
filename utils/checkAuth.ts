import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface RequestWithUserId extends Request {
  userId?: string;
}

export const checkAuth = (req: RequestWithUserId, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123') as { id: string };

      req.userId = decoded.id;

      next();
    } catch (error) {
      return res.status(403).json({
        message: 'Нет доступа.',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа.',
    });
  }
};
