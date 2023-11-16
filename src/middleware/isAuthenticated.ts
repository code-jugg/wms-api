import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headerCookie = req.headers.cookie;
  if (!headerCookie) {
    return res.status(401).json({ message: '権限がありません' });
  }
  const token = headerCookie.split('=')[1];
  const SECRET_KEY = process.env.JWT_SECRET_KEY;
  if (!SECRET_KEY) {
    return res.status(500).json({ message: 'ログインに失敗しました' });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err instanceof Error) {
      return res.status(401).json(err);
    }
    if (!(typeof decoded === 'object' && 'id' in decoded)) {
      return res.json({ message: '権限がありません' });
    }
    req.body.user = decoded.id;
    next();
  });
}
