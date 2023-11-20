import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

export function userErrorHandler(err: unknown, res: Response) {
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      if (Array.isArray(err.meta?.target) && err.meta?.target.includes('id')) {
        return res
          .status(409)
          .json({ message: 'このIDはすでに登録されています' });
      }
      if (
        Array.isArray(err.meta?.target) &&
        err.meta?.target.includes('email')
      ) {
        return res
          .status(409)
          .json({ message: 'このメールアドレスはすでに登録されています' });
      }
    }
    if (err.code === 'P2000') {
      return res.status(400).json({
        message: '無効なユーザー',
        err,
      });
    }
    return res.json(err);
  }
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }
}

export function defaultErrorHandler(err: unknown, res: Response) {
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }
}
