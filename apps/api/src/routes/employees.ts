import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const employeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  department: z.string().optional().nullable(),
  hiredAt: z.coerce.date().optional(),
});

router.get("/", async (_req, res) => {
  const items = await prisma.employee.findMany({ orderBy: { name: "asc" } });
  res.json(items);
});

router.post("/", async (req, res) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  try {
    const created = await prisma.employee.create({ data: parsed.data });
    res.status(201).json(created);
  } catch {
    res.status(409).json({ message: "E-mail já utilizado" });
  }
});

router.patch("/:id", async (req, res) => {
  const parsed = employeeSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Dados inválidos", issues: parsed.error.flatten() });
  }
  try {
    const updated = await prisma.employee.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(updated);
  } catch {
    res.status(404).json({ message: "Colaborador não encontrado" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.employee.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Colaborador não encontrado" });
  }
});

export default router;
