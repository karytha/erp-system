"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { labels } from "@/constants";
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
      <PageTitle>{labels.financial.pageTitle}</PageTitle>
      <PageSubtitle>{labels.financial.pageSubtitle}</PageSubtitle>

      <Panel>
        <PanelTitle>{labels.financial.newPanel}</PanelTitle>
        {(createMut.isError || deleteMut.isError) && (
          <ErrorBanner>
            {(createMut.error as Error)?.message ?? (deleteMut.error as Error)?.message}
          </ErrorBanner>
        )}
        <FormGrid>
          <Label>
            {labels.common.type}
            <SelectInput
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as FinancialEntryType })}
            >
              <option value="INCOME">{labels.financial.income}</option>
              <option value="EXPENSE">{labels.financial.expense}</option>
            </SelectInput>
          </Label>
          <Label>
            {labels.common.value}
            <TextInput
              type="number"
              min={0}
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </Label>
          <Label>
            {labels.common.description}
            <TextInput
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Label>
          <Label>
            {labels.common.category}
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
            {labels.common.registerAction}
          </SmallButton>
        </FormGrid>
      </Panel>

      <Panel>
        <PanelTitle>{labels.financial.historyPanel}</PanelTitle>
        {list.isLoading && <PageSubtitle>{labels.common.loading}</PageSubtitle>}
        {list.isError && <ErrorBanner>{(list.error as Error).message}</ErrorBanner>}
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>{labels.common.date}</Th>
                <Th>{labels.common.type}</Th>
                <Th>{labels.common.value}</Th>
                <Th>{labels.common.description}</Th>
                <Th>{labels.common.category}</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {list.data?.map((row) => (
                <tr key={row.id}>
                  <Td>{new Date(row.occurredAt).toLocaleString("pt-BR")}</Td>
                  <Td>
                    {row.type === "INCOME" ? labels.financial.income : labels.financial.expense}
                  </Td>
                  <Td>{formatBRL(row.amount)}</Td>
                  <Td>{row.description}</Td>
                  <Td>{row.category ?? labels.common.emDash}</Td>
                  <Td style={{ textAlign: "right" }}>
                    <DangerButton type="button" onClick={() => deleteMut.mutate(row.id)}>
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
