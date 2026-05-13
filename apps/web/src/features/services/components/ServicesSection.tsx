"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createService, deleteService, fetchServices, type ServiceInput } from "../api/services-api";
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
} from "@/components/ui/PagePrimitives";

export function ServicesSection() {
  const qc = useQueryClient();
  const [form, setForm] = useState<ServiceInput>({
    name: "",
    description: "",
    price: 0,
    durationMinutes: null,
  });

  const list = useQuery({ queryKey: ["services"], queryFn: fetchServices });

  const createMut = useMutation({
    mutationFn: () =>
      createService({
        name: form.name,
        description: form.description || null,
        price: form.price,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      setForm({ name: "", description: "", price: 0, durationMinutes: null });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });

  return (
    <div>
      <PageTitle>Serviços</PageTitle>
      <PageSubtitle>Serviços comercializados pela empresa.</PageSubtitle>

      <Panel>
        <PanelTitle>Novo serviço</PanelTitle>
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
            Descrição
            <TextInput
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Label>
          <Label>
            Preço
            <TextInput
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </Label>
          <Label>
            Duração (min)
            <TextInput
              type="number"
              min={0}
              value={form.durationMinutes ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  durationMinutes: e.target.value ? Number(e.target.value) : null,
                })
              }
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
                <Th>Descrição</Th>
                <Th>Preço</Th>
                <Th>Duração</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {list.data?.map((s) => (
                <tr key={s.id}>
                  <Td>{s.name}</Td>
                  <Td>{s.description ?? "—"}</Td>
                  <Td>{formatBRL(s.price)}</Td>
                  <Td>{s.durationMinutes ? `${s.durationMinutes} min` : "—"}</Td>
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
