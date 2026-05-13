"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      <PageTitle>Fornecedores</PageTitle>
      <PageSubtitle>Cadastre e mantenha seus fornecedores.</PageSubtitle>

      <Panel>
        <PanelTitle>Novo fornecedor</PanelTitle>
        {(createMut.isError || deleteMut.isError) && (
          <ErrorBanner>
            {(createMut.error as Error)?.message ?? (deleteMut.error as Error)?.message}
          </ErrorBanner>
        )}
        <FormGrid>
          <Label>
            Nome
            <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Label>
          <Label>
            Documento
            <TextInput
              value={form.document ?? ""}
              onChange={(e) => setForm({ ...form, document: e.target.value })}
            />
          </Label>
          <Label>
            E-mail
            <TextInput
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Label>
          <Label>
            Telefone
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
            Adicionar
          </SmallButton>
        </FormGrid>
      </Panel>

      <Panel>
        <PanelTitle>Lista</PanelTitle>
        {list.isLoading && <PageSubtitle>Carregando…</PageSubtitle>}
        {list.isError && <ErrorBanner>{(list.error as Error).message}</ErrorBanner>}
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Documento</Th>
                <Th>Contato</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {list.data?.map((s) => (
                <tr key={s.id}>
                  <Td>{s.name}</Td>
                  <Td>{s.document ?? "—"}</Td>
                  <Td>
                    {s.email ?? "—"} {s.phone ? `· ${s.phone}` : ""}
                  </Td>
                  <Td style={{ textAlign: "right" }}>
                    <DangerButton type="button" onClick={() => deleteMut.mutate(s.id)}>
                      Excluir
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
