import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import suppliersRoutes from "./routes/suppliers.js";
import productsRoutes from "./routes/products.js";
import employeesRoutes from "./routes/employees.js";
import financialRoutes from "./routes/financial.js";
import servicesRoutes from "./routes/services.js";
import { authMiddleware } from "./middleware/auth.js";
import { prisma } from "./lib/prisma.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);

app.use(authMiddleware);
app.use("/suppliers", suppliersRoutes);
app.use("/products", productsRoutes);
app.use("/employees", employeesRoutes);
app.use("/financial", financialRoutes);
app.use("/services", servicesRoutes);

async function start() {
  try {
    await prisma.$connect();
  } catch {
    console.error(`
Não foi possível conectar ao PostgreSQL.
Na raiz do monorepo, suba o banco: npm run db:up
(usa docker-compose.yml; credenciais em apps/api/.env.example)
`);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`API ERP em http://localhost:${port}`);
  });
}

void start();
