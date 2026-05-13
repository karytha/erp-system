import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { labels } from "@/constants";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { SuppliersSection } from "./SuppliersSection";
import { createSupplier, deleteSupplier, fetchSuppliers } from "../api/suppliers-api";

jest.mock("../api/suppliers-api", () => ({
  fetchSuppliers: jest.fn(),
  createSupplier: jest.fn(),
  deleteSupplier: jest.fn(),
}));

const baseSupplier = {
  id: "s1",
  name: "Fornecedor Alfa",
  document: "12.345.678/0001-90",
  email: "contato@alfa.com",
  phone: "11999990000",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("SuppliersSection", () => {
  beforeEach(() => {
    jest.mocked(fetchSuppliers).mockReset();
    jest.mocked(createSupplier).mockReset();
    jest.mocked(deleteSupplier).mockReset();
  });

  it("lista fornecedores e colunas esperadas", async () => {
    jest.mocked(fetchSuppliers).mockResolvedValue([baseSupplier]);

    renderWithProviders(<SuppliersSection />);

    expect(screen.getByRole("heading", { name: labels.suppliers.pageTitle })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Fornecedor Alfa" })).toBeInTheDocument();
    });
  });

  it("desativa Adicionar sem nome", async () => {
    jest.mocked(fetchSuppliers).mockResolvedValue([]);

    renderWithProviders(<SuppliersSection />);

    await waitFor(() => {
      expect(screen.queryByText(labels.common.loading)).not.toBeInTheDocument();
    });

    const panel = screen
      .getByRole("heading", { name: labels.suppliers.newPanel })
      .closest("section");
    expect(panel).toBeTruthy();
    expect(
      within(panel as HTMLElement).getByRole("button", { name: labels.common.add }),
    ).toBeDisabled();
  });

  it("cria fornecedor", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchSuppliers).mockResolvedValue([]);
    jest.mocked(createSupplier).mockResolvedValue(baseSupplier);

    renderWithProviders(<SuppliersSection />);

    await waitFor(() => {
      expect(screen.queryByText(labels.common.loading)).not.toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(labels.common.name), "Beta Ltda");
    await user.click(screen.getByRole("button", { name: labels.common.add }));

    await waitFor(() => {
      expect(createSupplier).toHaveBeenCalledWith({
        name: "Beta Ltda",
        document: null,
        email: null,
        phone: null,
      });
    });
  });

  it("exclui fornecedor", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchSuppliers).mockResolvedValue([baseSupplier]);
    jest.mocked(deleteSupplier).mockResolvedValue(undefined);

    renderWithProviders(<SuppliersSection />);

    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Fornecedor Alfa" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: labels.common.delete }));

    await waitFor(() => {
      expect(deleteSupplier).toHaveBeenCalledWith("s1");
    });
  });
});
