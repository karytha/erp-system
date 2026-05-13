import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.coerce.number().nonnegative(),
  durationMinutes: z.coerce.number().int().positive().optional().nullable(),
});

router.get("/", async (_req, res) => {
  const items = await prisma.service.findMany({ orderBy: { name: "asc" } });
  res.json(items);
});

router.post("/", async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  const created = await prisma.service.create({ data: parsed.data });
  res.status(201).json(created);
});

router.patch("/:id", async (req, res) => {
  const parsed = serviceSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  try {
    const updated = await prisma.service.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(updated);
  } catch {
    res.status(404).json({ message: "Serviço não encontrado" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Serviço não encontrado" });
  }
});

export default router;
