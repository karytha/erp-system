import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const supplierSchema = z.object({
  name: z.string().min(1),
  document: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
});

router.get("/", async (_req, res) => {
  const items = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  res.json(items);
});

router.post("/", async (req, res) => {
  const parsed = supplierSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  const created = await prisma.supplier.create({ data: parsed.data });
  res.status(201).json(created);
});

router.patch("/:id", async (req, res) => {
  const parsed = supplierSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  try {
    const updated = await prisma.supplier.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(updated);
  } catch {
    res.status(404).json({ message: "Fornecedor não encontrado" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.supplier.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Fornecedor não encontrado" });
  }
});

export default router;
