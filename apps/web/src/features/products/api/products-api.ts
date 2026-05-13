import { apiFetch } from "@/lib/api-client";
import type { Supplier } from "@/features/suppliers/api/suppliers-api";

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  supplierId: string | null;
  supplier: Supplier | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  sku: string;
  price: number;
  stock: number;
  supplierId?: string | null;
};

export async function fetchProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/products");
}

export async function createProduct(data: ProductInput): Promise<Product> {
  return apiFetch<Product>("/products", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch<void>(`/products/${id}`, { method: "DELETE" });
}
