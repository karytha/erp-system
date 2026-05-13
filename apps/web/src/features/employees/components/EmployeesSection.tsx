"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  fetchEmployees,
  type EmployeeInput,
} from "../api/employees-api";
import { labels } from "@/constants";
import {
  PageTitle,
  PageSubtitle,
  Panel,
  PanelTitle,
  FormGrid,
  Label,
  TextInput,
  SmallButton,
  TableWrap,
  Table,
  Th,
  Td,
  DangerButton,
  ErrorBanner,
} from "@/components/ui/PagePrimitives";

export function EmployeesSection() {
  const qc = useQueryClient();
  const [form, setForm] = useState<EmployeeInput>({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  const list = useQuery({ queryKey: ["employees"], queryFn: fetchEmployees });

  const createMut = useMutation({
    mutationFn: () =>
      createEmployee({
        name: form.name,
        email: form.email,
        role: form.role,
        department: form.department || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      setForm({ name: "", email: "", role: "", department: "" });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });

  return (
    <div>
      <PageTitle>{labels.employees.pageTitle}</PageTitle>
      <PageSubtitle>{labels.employees.pageSubtitle}</PageSubtitle>

      <Panel>
        <PanelTitle>{labels.employees.newPanel}</PanelTitle>
        {(createMut.isError || deleteMut.isError) && (
          <ErrorBanner>
            {(createMut.error as Error)?.message ?? (deleteMut.error as Error)?.message}
          </ErrorBanner>
        )}
        <FormGrid>
          <Label>
            {labels.common.name}
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Label>
          <Label>
            {labels.common.email}
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Label>
          <Label>
            {labels.common.role}
            <TextInput
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </Label>
          <Label>
            {labels.common.department}
            <TextInput
              value={form.department ?? ""}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </Label>
          <SmallButton
            type="button"
            disabled={!form.name || !form.email || !form.role || createMut.isPending}
            onClick={() => createMut.mutate()}
          >
            {labels.common.add}
          </SmallButton>
        </FormGrid>
      </Panel>

      <Panel>
        <PanelTitle>{labels.common.list}</PanelTitle>
        {list.isLoading && <PageSubtitle>{labels.common.loading}</PageSubtitle>}
        {list.isError && <ErrorBanner>{(list.error as Error).message}</ErrorBanner>}
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>{labels.common.name}</Th>
                <Th>{labels.common.email}</Th>
                <Th>{labels.common.role}</Th>
                <Th>{labels.common.department}</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {list.data?.map((e) => (
                <tr key={e.id}>
                  <Td>{e.name}</Td>
                  <Td>{e.email}</Td>
                  <Td>{e.role}</Td>
                  <Td>{e.department ?? labels.common.emDash}</Td>
                  <Td style={{ textAlign: "right" }}>
                    <DangerButton type="button" onClick={() => deleteMut.mutate(e.id)}>
                      {labels.common.delete}
                    </DangerButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Panel>
    </div>
  );
}
