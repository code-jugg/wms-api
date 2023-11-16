import Router from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from '../middleware/isAuthenticated';
const router = Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  try {
    const { id, email, password } = req.body;
    const user = await prisma.user.findMany({
      where: {
        OR: [{ id }, { email }],
      },
    });
    if (!user.length) {
      return res.status(404).json({ message: 'ユーザーが見つかりません' });
    }
    const isVaildPassword = await bcrypt.compare(password, user[0].password);
    if (!isVaildPassword) {
      return res.status(400).json({ message: 'パスワードが違います' });
    }
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!SECRET_KEY) {
      return res.status(500).json({ message: 'ログインに失敗しました' });
    }
    const token = jwt.sign({ id: user[0].id }, SECRET_KEY, {
      expiresIn: '24h',
    });
    res.cookie('token', token, {
      maxAge: 86400000,
      httpOnly: true,
      sameSite: true,
    });
    return res.json({ message: 'ログインしました', user: user[0] });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});

router.delete('/logout', isAuthenticated, async (req, res) => {
  try {
    res.cookie('token', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: true,
    });
    return res.json({ message: 'ログアウトしました' });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});

router.get('/verify', isAuthenticated, async (req, res) => {
  try {
    const { user } = req.body;
    const response = await prisma.user.findUnique({ where: { id: user } });
    return res.json({ id: response?.id, name: response?.name });
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ message: err.message });
    }
  }
});

export default router;
