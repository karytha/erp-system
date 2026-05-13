import { apiFetch } from "@/lib/api-client";

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  hiredAt: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeInput = {
  name: string;
  email: string;
  role: string;
  department?: string | null;
  hiredAt?: string;
};

export async function fetchEmployees(): Promise<Employee[]> {
  return apiFetch<Employee[]>("/employees");
}

export async function createEmployee(data: EmployeeInput): Promise<Employee> {
  return apiFetch<Employee>("/employees", { method: "POST", body: JSON.stringify(data) });
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiFetch<void>(`/employees/${id}`, { method: "DELETE" });
}
