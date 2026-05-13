import { apiFetch } from "@/lib/api-client";

export type FinancialEntryType = "INCOME" | "EXPENSE";

export type FinancialEntry = {
  id: string;
  type: FinancialEntryType;
  amount: string;
  description: string;
  category: string | null;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
};

export type FinancialEntryInput = {
  type: FinancialEntryType;
  amount: number;
  description: string;
  category?: string | null;
  occurredAt?: string;
};

export async function fetchFinancial(): Promise<FinancialEntry[]> {
  return apiFetch<FinancialEntry[]>("/financial");
}

export async function createFinancialEntry(data: FinancialEntryInput): Promise<FinancialEntry> {
  return apiFetch<FinancialEntry>("/financial", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteFinancialEntry(id: string): Promise<void> {
  await apiFetch<void>(`/financial/${id}`, { method: "DELETE" });
}
