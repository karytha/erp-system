import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { labels } from "@/constants";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { fetchSuppliers } from "@/features/suppliers/api/suppliers-api";
import { ProductsSection } from "./ProductsSection";
import { createProduct, deleteProduct, fetchProducts } from "../api/products-api";

jest.mock("@/features/suppliers/api/suppliers-api", () => ({
  fetchSuppliers: jest.fn(),
}));

jest.mock("../api/products-api", () => ({
  fetchProducts: jest.fn(),
  createProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

const supplier = {
  id: "sup-1",
  name: "Fornecedor Z",
  document: null,
  email: null,
  phone: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

const product = {
  id: "p1",
  name: "Item X",
  sku: "SKU-1",
  price: "10.50",
  stock: 3,
  supplierId: "sup-1",
  supplier,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("ProductsSection", () => {
  beforeEach(() => {
    jest.mocked(fetchSuppliers).mockReset();
    jest.mocked(fetchProducts).mockReset();
    jest.mocked(createProduct).mockReset();
    jest.mocked(deleteProduct).mockReset();
  });

  it("mostra catálogo e produtos", async () => {
    jest.mocked(fetchSuppliers).mockResolvedValue([supplier]);
    jest.mocked(fetchProducts).mockResolvedValue([product]);

    renderWithProviders(<ProductsSection />);

    expect(screen.getByRole("heading", { name: labels.products.pageTitle })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Item X" })).toBeInTheDocument();
    });
  });

  it("Adicionar desativado sem nome ou SKU", async () => {
    jest.mocked(fetchSuppliers).mockResolvedValue([]);
    jest.mocked(fetchProducts).mockResolvedValue([]);

    renderWithProviders(<ProductsSection />);

    await waitFor(() => {
      expect(screen.queryAllByText(labels.common.loading)).toHaveLength(0);
    });

    const panel = screen
      .getByRole("heading", { name: labels.products.newPanel })
      .closest("section");
    expect(panel).toBeTruthy();
    expect(
      within(panel as HTMLElement).getByRole("button", { name: labels.common.add }),
    ).toBeDisabled();
  });

  it("cria produto com dados do formulário", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchSuppliers).mockResolvedValue([supplier]);
    jest.mocked(fetchProducts).mockResolvedValue([]);
    jest.mocked(createProduct).mockResolvedValue(product);

    renderWithProviders(<ProductsSection />);

    await waitFor(() => {
      expect(screen.queryAllByText(labels.common.loading)).toHaveLength(0);
    });

    await user.type(screen.getByLabelText(labels.common.name), "Novo item");
    await user.type(screen.getByLabelText(labels.common.sku), "SKU-99");
    await user.clear(screen.getByLabelText(labels.common.price));
    await user.type(screen.getByLabelText(labels.common.price), "15");
    await user.clear(screen.getByLabelText(labels.common.stock));
    await user.type(screen.getByLabelText(labels.common.stock), "5");

    await user.selectOptions(screen.getByLabelText(labels.common.supplier), "sup-1");

    await user.click(screen.getByRole("button", { name: labels.common.add }));

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledWith({
        name: "Novo item",
        sku: "SKU-99",
        price: 15,
        stock: 5,
        supplierId: "sup-1",
      });
    });
  });

  it("exclui produto", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchSuppliers).mockResolvedValue([]);
    jest.mocked(fetchProducts).mockResolvedValue([product]);
    jest.mocked(deleteProduct).mockResolvedValue(undefined);

    renderWithProviders(<ProductsSection />);

    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Item X" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: labels.common.delete }));

    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith("p1");
    });
  });
});
