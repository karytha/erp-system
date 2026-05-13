import { Router } from "express";
import { z } from "zod";
import { FinancialEntryType } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const router = Router();

const entrySchema = z.object({
  type: z.nativeEnum(FinancialEntryType),
  amount: z.coerce.number().positive(),
  description: z.string().min(1),
  category: z.string().optional().nullable(),
  occurredAt: z.coerce.date().optional(),
});

router.get("/", async (_req, res) => {
  const items = await prisma.financialEntry.findMany({ orderBy: { occurredAt: "desc" } });
  res.json(items);
});

router.post("/", async (req, res) => {
  const parsed = entrySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  const created = await prisma.financialEntry.create({ data: parsed.data });
  res.status(201).json(created);
});

router.patch("/:id", async (req, res) => {
  const parsed = entrySchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  try {
    const updated = await prisma.financialEntry.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(updated);
  } catch {
    res.status(404).json({ message: "Lançamento não encontrado" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.financialEntry.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Lançamento não encontrado" });
  }
});

export default router;
