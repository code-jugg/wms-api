import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

//読み取ったJANの製品一覧を表示
router.get('/:JAN/product', async (req, res) => {
  const { JAN } = req.params;
  const toPrisma = {
    JAN: BigInt(JAN),
  };
  try {
    const response = await prisma.product.findMany({
      where: {
        JAN: toPrisma.JAN,
      },
    });
    const toClient = response.map((item) => {
      return {
        ...item,
        JAN: item.JAN.toString(),
        MFD: item.MFD.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
          .padStart(2, '0')
          .split('T')[0],
        BBE: item.BBE.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
          .padStart(2, '0')
          .split('T')[0],
      };
    });
    if (!response) {
      return res.status(404).json({ message: '製品が見つかりません' });
    }
    return res.json(toClient);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});

//該当製品の格納されたロケーション一覧を表示
router.get('/:product/stored', async (req, res) => {
  try {
    const { product } = req.params;
    const stored = await prisma.location.findMany({
      where: {
        storingBy: {
          some: {
            id: product,
          },
        },
      },
    });
    if (!stored[0]) {
      const empty = await prisma.location.findMany({
        where: {
          storingBy: {
            none: {},
          },
        },
      });
      return res.json(empty);
    }
    return res.json(stored);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});

router.get('/empty', async (req, res) => {
  try {
    const response = await prisma.location.findMany({
      where: {
        storingBy: {
          none: {},
        },
      },
    });
    return res.json(response);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});

//選択した製品情報を取得
router.get('/product/:product/select', async (req, res) => {
  try {
    const { product } = req.params;
    const response = await prisma.product.findUnique({
      where: { id: product },
    });
    if (!response) {
      return res.status(404).json({ message: '該当する製品が見つかりません' });
    }
    const toClient = {
      ...response,
      JAN: response.JAN.toString(),
      MFD: response.MFD.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
        .padStart(2, '0')
        .split('T')[0],
      BBE: response.BBE.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
        .padStart(2, '0')
        .split('T')[0],
    };
    return res.json(toClient);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});
router.get('/location/:location/select', async (req, res) => {
  try {
    const { location } = req.params;
    const response = await prisma.location.findUnique({
      where: { number: parseInt(location) },
    });
    if (!response) {
      return res
        .status(404)
        .json({ message: '該当するロケーションが見つかりません' });
    }
    return res.json(response);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
});

export default router;
