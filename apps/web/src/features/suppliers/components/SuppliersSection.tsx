"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { labels } from "@/constants";
import {
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  type SupplierInput,
} from "../api/suppliers-api";
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

export function SuppliersSection() {
  const qc = useQueryClient();
  const [form, setForm] = useState<SupplierInput>({ name: "", document: "", email: "", phone: "" });

  const list = useQuery({ queryKey: ["suppliers"], queryFn: fetchSuppliers });

  const createMut = useMutation({
    mutationFn: () =>
      createSupplier({
        name: form.name,
        document: form.document || null,
        email: form.email || null,
        phone: form.phone || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suppliers"] });
      setForm({ name: "", document: "", email: "", phone: "" });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["suppliers"] }),
  });

  return (
    <div>
      <PageTitle>{labels.suppliers.pageTitle}</PageTitle>
      <PageSubtitle>{labels.suppliers.pageSubtitle}</PageSubtitle>

      <Panel>
        <PanelTitle>{labels.suppliers.newPanel}</PanelTitle>
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
            {labels.common.document}
            <TextInput
              value={form.document ?? ""}
              onChange={(e) => setForm({ ...form, document: e.target.value })}
            />
          </Label>
          <Label>
            {labels.common.email}
            <TextInput
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Label>
          <Label>
            {labels.common.phone}
            <TextInput
              value={form.phone ?? ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Label>
          <SmallButton
            type="button"
            disabled={!form.name || createMut.isPending}
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
                <Th>{labels.common.document}</Th>
                <Th>{labels.common.contact}</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {list.data?.map((s) => (
                <tr key={s.id}>
                  <Td>{s.name}</Td>
                  <Td>{s.document ?? labels.common.emDash}</Td>
                  <Td>
                    {s.email ?? labels.common.emDash}
                    {s.phone ? `${labels.common.contactSeparator}${s.phone}` : ""}
                  </Td>
                  <Td style={{ textAlign: "right" }}>
                    <DangerButton type="button" onClick={() => deleteMut.mutate(s.id)}>
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
