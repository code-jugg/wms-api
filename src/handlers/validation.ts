import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

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
}