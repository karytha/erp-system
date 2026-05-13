import { apiFetch } from "@/lib/api-client";

export type Supplier = {
  id: string;
  name: string;
  document: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SupplierInput = {
  name: string;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
};

export async function fetchSuppliers(): Promise<Supplier[]> {
  return apiFetch<Supplier[]>("/suppliers");
}

export async function createSupplier(data: SupplierInput): Promise<Supplier> {
  return apiFetch<Supplier>("/suppliers", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteSupplier(id: string): Promise<void> {
  await apiFetch<void>(`/suppliers/${id}`, { method: "DELETE" });
}
