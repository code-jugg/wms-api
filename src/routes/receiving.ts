import Router from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

router.put('/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { productId, QTY } = req.body;
    const response = await prisma.location.findUnique({
      where: { number: parseInt(location) },
      include: { storingBy: true },
    });
    if (!response) {
      return res
        .status(404)
        .json({ message: '該当するロケーションがありません' });
    }
    if (response.storingBy.length) {
      //同一製品があるか確認
      const storedItem = response.storingBy.map((item) => {
        return item;
      });
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      const isMatchCode = (item: any) => item.code === product?.code;
      const isMatchId = (item: any) => item.id === product?.id;
      if (storedItem.some(isMatchCode)) {
        if (storedItem.some(isMatchId)) {
          await prisma.location.update({
            where: { number: parseInt(location) },
            data: { QTY: response.QTY + parseInt(QTY) },
          });
          return res.json({
            message: `製品を追加で格納しました。在庫数は${
              parseInt(QTY) + response.QTY
            }csです`,
          });
        } else {
          await prisma.location.update({
            where: { number: parseInt(location) },
            data: {
              storingBy: { connect: { id: productId } },
              QTY: response.QTY + parseInt(QTY),
            },
          });
          return res.json({
            message: `製品を追加で格納しました。在庫数は${
              parseInt(QTY) + response.QTY
            }csです。枝番${product?.branch}を格納しました`,
          });
        }
      } else {
        return res.status(409).json({ message: '別の製品が格納されています' });
      }
    }
    await prisma.location.update({
      where: {
        number: parseInt(location),
      },
      data: {
        storingBy: { connect: { id: productId } },
        QTY: parseInt(QTY),
      },
    });
    return res.json({ message: `製品をPick${response.number}に格納しました` });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});

export default router;
