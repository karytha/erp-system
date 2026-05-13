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

app.listen(port, () => {
  console.log(`API ERP em http://localhost:${port}`);
});
