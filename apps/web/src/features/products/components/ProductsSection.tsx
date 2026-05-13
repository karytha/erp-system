"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { labels } from "@/constants";
import { formatBRL } from "@/lib/format";
import { fetchSuppliers } from "@/features/suppliers/api/suppliers-api";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  type ProductInput,
} from "../api/products-api";
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
      <PageTitle>{labels.products.pageTitle}</PageTitle>
      <PageSubtitle>{labels.products.pageSubtitle}</PageSubtitle>

      <Panel>
        <PanelTitle>{labels.products.newPanel}</PanelTitle>
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
            {labels.common.sku}
            <TextInput
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
          </Label>
          <Label>
            {labels.common.price}
            <TextInput
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </Label>
          <Label>
            {labels.common.stock}
            <TextInput
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            />
          </Label>
          <Label>
            {labels.common.supplier}
            <SelectInput
              value={form.supplierId ?? ""}
              onChange={(e) =>
                setForm({ ...form, supplierId: e.target.value ? e.target.value : null })
              }
            >
              <option value="">{labels.common.noneSupplier}</option>
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
            {labels.common.add}
          </SmallButton>
        </FormGrid>
      </Panel>

      <Panel>
        <PanelTitle>{labels.common.list}</PanelTitle>
        {products.isLoading && <PageSubtitle>{labels.common.loading}</PageSubtitle>}
        {products.isError && <ErrorBanner>{(products.error as Error).message}</ErrorBanner>}
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>{labels.common.name}</Th>
                <Th>{labels.common.sku}</Th>
                <Th>{labels.common.price}</Th>
                <Th>{labels.common.stock}</Th>
                <Th>{labels.common.supplier}</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {products.data?.map((p) => (
                <tr key={p.id}>
                  <Td>{p.name}</Td>
                  <Td>{p.sku}</Td>
                  <Td>{formatBRL(p.price)}</Td>
                  <Td>{p.stock}</Td>
                  <Td>{p.supplier?.name ?? labels.common.emDash}</Td>
                  <Td style={{ textAlign: "right" }}>
                    <DangerButton type="button" onClick={() => deleteMut.mutate(p.id)}>
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
