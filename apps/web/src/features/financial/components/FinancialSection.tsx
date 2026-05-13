"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFinancialEntry,
  deleteFinancialEntry,
  fetchFinancial,
  type FinancialEntryInput,
  type FinancialEntryType,
} from "../api/financial-api";
import { formatBRL } from "@/lib/format";
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
  SelectInput,
} from "@/components/ui/PagePrimitives";

export function FinancialSection() {
  const qc = useQueryClient();
  const [form, setForm] = useState<FinancialEntryInput>({
    type: "INCOME",
    amount: 0,
    description: "",
    category: "",
  });

  const list = useQuery({ queryKey: ["financial"], queryFn: fetchFinancial });

  const createMut = useMutation({
    mutationFn: () =>
      createFinancialEntry({
        type: form.type,
        amount: form.amount,
        description: form.description,
        category: form.category || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["financial"] });
      setForm({ type: "INCOME", amount: 0, description: "", category: "" });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFinancialEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["financial"] }),
  });

  return (
    <div>
      <PageTitle>Financeiro</PageTitle>
      <PageSubtitle>Lançamentos de receitas e despesas.</PageSubtitle>

      <Panel>
        <PanelTitle>Novo lançamento</PanelTitle>
        {(createMut.isError || deleteMut.isError) && (
          <ErrorBanner>
            {(createMut.error as Error)?.message ?? (deleteMut.error as Error)?.message}
          </ErrorBanner>
        )}
        <FormGrid>
          <Label>
            Tipo
            <SelectInput
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as FinancialEntryType })}
            >
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
            </SelectInput>
          </Label>
          <Label>
            Valor
            <TextInput
              type="number"
              min={0}
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </Label>
          <Label>
            Descrição
            <TextInput
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Label>
          <Label>
            Categoria
            <TextInput
              value={form.category ?? ""}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </Label>
          <SmallButton
            type="button"
            disabled={!form.description || form.amount <= 0 || createMut.isPending}
            onClick={() => createMut.mutate()}
          >
            Registrar
          </SmallButton>
        </FormGrid>
      </Panel>

      <Panel>
        <PanelTitle>Histórico</PanelTitle>
        {list.isLoading && <PageSubtitle>Carregando…</PageSubtitle>}
        {list.isError && <ErrorBanner>{(list.error as Error).message}</ErrorBanner>}
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Tipo</Th>
                <Th>Valor</Th>
                <Th>Descrição</Th>
                <Th>Categoria</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {list.data?.map((row) => (
                <tr key={row.id}>
                  <Td>{new Date(row.occurredAt).toLocaleString("pt-BR")}</Td>
                  <Td>{row.type === "INCOME" ? "Receita" : "Despesa"}</Td>
                  <Td>{formatBRL(row.amount)}</Td>
                  <Td>{row.description}</Td>
                  <Td>{row.category ?? "—"}</Td>
                  <Td style={{ textAlign: "right" }}>
                    <DangerButton type="button" onClick={() => deleteMut.mutate(row.id)}>
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
