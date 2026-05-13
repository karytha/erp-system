"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSuppliers } from "@/features/suppliers/api/suppliers-api";
import { createProduct, deleteProduct, fetchProducts, type ProductInput } from "../api/products-api";
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

export function ProductsSection() {
  const qc = useQueryClient();
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: fetchSuppliers });
  const products = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const [form, setForm] = useState<ProductInput>({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
    supplierId: null,
  });

  const createMut = useMutation({
    mutationFn: () => createProduct(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setForm({ name: "", sku: "", price: 0, stock: 0, supplierId: null });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  return (
    <div>
      <PageTitle>Produtos</PageTitle>
      <PageSubtitle>Controle de catálogo e estoque.</PageSubtitle>

      <Panel>
        <PanelTitle>Novo produto</PanelTitle>
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
            SKU
            <TextInput value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
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
            Estoque
            <TextInput
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />
          </Label>
          <Label>
            Fornecedor
            <SelectInput
              value={form.supplierId ?? ""}
              onChange={(e) =>
                setForm({ ...form, supplierId: e.target.value ? e.target.value : null })
              }
            >
              <option value="">Nenhum</option>
              {suppliers.data?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectInput>
          </Label>
          <SmallButton
            type="button"
            disabled={!form.name || !form.sku || createMut.isPending}
            onClick={() => createMut.mutate()}
          >
            Adicionar
          </SmallButton>
        </FormGrid>
      </Panel>

      <Panel>
        <PanelTitle>Lista</PanelTitle>
        {products.isLoading && <PageSubtitle>Carregando…</PageSubtitle>}
        {products.isError && <ErrorBanner>{(products.error as Error).message}</ErrorBanner>}
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>SKU</Th>
                <Th>Preço</Th>
                <Th>Estoque</Th>
                <Th>Fornecedor</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {products.data?.map((p) => (
                <tr key={p.id}>
                  <Td>{p.name}</Td>
                  <Td>{p.sku}</Td>
                  <Td>R$ {Number(p.price).toFixed(2)}</Td>
                  <Td>{p.stock}</Td>
                  <Td>{p.supplier?.name ?? "—"}</Td>
                  <Td style={{ textAlign: "right" }}>
                    <DangerButton type="button" onClick={() => deleteMut.mutate(p.id)}>
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
