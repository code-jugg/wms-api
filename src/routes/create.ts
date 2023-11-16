import Router from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

router.post('/product', async (req, res) => {
  try {
    const { JAN, code, branch, name, MFD, BBE } = req.body;
    const toISO = {
      MFD: new Date(MFD).toISOString(),
      BBE: new Date(BBE).toISOString(),
    };
    const same = await prisma.product.findMany({
      where: {
        JAN,
        code,
        branch,
        name,
        MFD: toISO.MFD,
        BBE: toISO.BBE,
      },
      include: {
        storingBy: true,
      },
    });
    if (same.length) {
      return res.status(409).json({ message: 'すでに存在しています' });
    }
    await prisma.product.create({
      data: {
        JAN,
        code,
        branch,
        name,
        MFD: toISO.MFD,
        BBE: toISO.BBE,
      },
    });
    return res.json({ message: '新しい製品を作成しました' });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return res.status(500).json({ message: err });
    }
  }
});
router.post('/location', async (req, res) => {
  try {
    for (let i = 1; i < 500; i++) {
      await prisma.location.create({
        data: {
          number: i,
          QTY: 0,
        },
      });
    }
    return res.json({ message: 'すべてのロケーションを作成しました' });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});

export default router;
