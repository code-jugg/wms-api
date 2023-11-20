import Router from 'express';
import { PrismaClient } from '@prisma/client';
import { defaultErrorHandler } from '../handlers/error';
const router = Router();
const prisma = new PrismaClient();

//格納済みのリスト一覧
router.get('/stored', async (req, res) => {
  try {
    const response = await prisma.location.findMany({
      where: {
        storingBy: {
          some: {},
        },
      },
    });
    return res.json(response);
  } catch (err) {
    defaultErrorHandler(err, res);
  }
});
//ロケーションを空きロケにする
router.put('/:location/clear', async (req, res) => {
  try {
    const { location } = req.params;
    const current = await prisma.location.findUnique({
      where: { number: parseInt(location) },
      include: { storingBy: true },
    });
    const id = current?.storingBy[0].id;
    const response = await prisma.location.update({
      where: {
        number: parseInt(location),
      },
      data: {
        storingBy: {
          disconnect: { id },
        },
        QTY: 0,
      },
    });
    return res.json({ message: `Pick${response.number}をリセットしました` });
  } catch (err) {
    defaultErrorHandler(err, res);
  }
});

export default router;
