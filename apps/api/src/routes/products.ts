import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative().default(0),
  supplierId: z.string().uuid().optional().nullable(),
});

router.get("/", async (_req, res) => {
  const items = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { supplier: true },
  });
  res.json(items);
});

router.post("/", async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  try {
    const created = await prisma.product.create({ data: parsed.data });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: "Não foi possível criar o produto (SKU duplicado?)" });
  }
});

router.patch("/:id", async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  try {
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(updated);
  } catch {
    res.status(404).json({ message: "Produto não encontrado" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Produto não encontrado" });
  }
});

export default router;
