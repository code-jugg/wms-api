import Router from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userErrorHandler } from '../handlers/error';
const router = Router();
const prisma = new PrismaClient();

//ユーザー登録用api
router.post('/new', async (req, res) => {
  try {
    const { id, name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        id,
        name,
        email,
        password: hashedPassword,
      },
    });
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!SECRET_KEY) {
      return res.status(500).json({ message: 'ログインに失敗しました' });
    }
    const token = jwt.sign({ id }, SECRET_KEY, {
      expiresIn: '24h',
    });
    res.cookie('token', token, {
      maxAge: 86400000,
      httpOnly: true,
      sameSite: true,
    });
    return res.json({ message: 'ユーザーを登録しました' });
  } catch (err) {
    userErrorHandler(err, res);
  }
});

export default router;
