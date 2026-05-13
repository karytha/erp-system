import { apiFetch } from "@/lib/api-client";

export type Service = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  durationMinutes: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ServiceInput = {
  name: string;
  description?: string | null;
  price: number;
  durationMinutes?: number | null;
};

export async function fetchServices(): Promise<Service[]> {
  return apiFetch<Service[]>("/services");
}

export async function createService(data: ServiceInput): Promise<Service> {
  return apiFetch<Service>("/services", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteService(id: string): Promise<void> {
  await apiFetch<void>(`/services/${id}`, { method: "DELETE" });
}
