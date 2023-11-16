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
    const subQTY = response.QTY - parseInt(QTY);
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    const storedItem = response.storingBy;
    const isMatchCode = (elm: any) => elm.code === product?.code;
    if (!storedItem.length) {
      return res.status(404).json({ message: '製品が格納されていません' });
    }
    if (storedItem.some(isMatchCode)) {
      if (subQTY === 0) {
        await prisma.location.update({
          where: { number: parseInt(location) },
          data: {
            QTY: 0,
            storingBy: { disconnect: storedItem },
          },
        });
        return res.json({
          message: `Pick${response.number}から製品を出し切りました。現在空きロケです`,
        });
      }
      if (subQTY < 0) {
        console.log(subQTY)
        return res.status(404).json({ message: '過剰に出荷しています' });
      }
      await prisma.location.update({
        where: { number: parseInt(location) },
        data: { QTY: subQTY },
      });
      return res.json({ message: '製品を出荷しました' });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});

export default router;
