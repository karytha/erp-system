import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { labels } from "@/constants";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { FinancialSection } from "./FinancialSection";
import { createFinancialEntry, deleteFinancialEntry, fetchFinancial } from "../api/financial-api";

jest.mock("../api/financial-api", () => ({
  fetchFinancial: jest.fn(),
  createFinancialEntry: jest.fn(),
  deleteFinancialEntry: jest.fn(),
}));

const entry = {
  id: "f1",
  type: "INCOME" as const,
  amount: "150.00",
  description: "Venda",
  category: "Loja",
  occurredAt: "2024-06-01T12:00:00.000Z",
  createdAt: "2024-06-01T12:00:00.000Z",
  updatedAt: "2024-06-01T12:00:00.000Z",
};

describe("FinancialSection", () => {
  beforeEach(() => {
    jest.mocked(fetchFinancial).mockReset();
    jest.mocked(createFinancialEntry).mockReset();
    jest.mocked(deleteFinancialEntry).mockReset();
  });

  it("mostra histórico financeiro", async () => {
    jest.mocked(fetchFinancial).mockResolvedValue([entry]);

    renderWithProviders(<FinancialSection />);

    expect(screen.getByRole("heading", { name: labels.financial.pageTitle })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Venda" })).toBeInTheDocument();
    });
  });

  it("mantém Registrar desativado sem descrição ou valor", async () => {
    jest.mocked(fetchFinancial).mockResolvedValue([]);

    renderWithProviders(<FinancialSection />);

    await waitFor(() => {
      expect(screen.queryByText(labels.common.loading)).not.toBeInTheDocument();
    });

    const panel = screen
      .getByRole("heading", { name: labels.financial.newPanel })
      .closest("section");
    expect(panel).toBeTruthy();
    const btn = within(panel as HTMLElement).getByRole("button", {
      name: labels.common.registerAction,
    });
    expect(btn).toBeDisabled();
  });

  it("regista lançamento", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchFinancial).mockResolvedValue([]);
    jest.mocked(createFinancialEntry).mockResolvedValue(entry);

    renderWithProviders(<FinancialSection />);

    await waitFor(() => {
      expect(screen.queryByText(labels.common.loading)).not.toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText(labels.common.value));
    await user.type(screen.getByLabelText(labels.common.value), "200");
    await user.type(screen.getByLabelText(labels.common.description), "Consultoria");

    await user.click(screen.getByRole("button", { name: labels.common.registerAction }));

    await waitFor(() => {
      expect(createFinancialEntry).toHaveBeenCalledWith({
        type: "INCOME",
        amount: 200,
        description: "Consultoria",
        category: null,
      });
    });
  });

  it("exclui lançamento", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchFinancial).mockResolvedValue([entry]);
    jest.mocked(deleteFinancialEntry).mockResolvedValue(undefined);

    renderWithProviders(<FinancialSection />);

    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Venda" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: labels.common.delete }));

    await waitFor(() => {
      expect(deleteFinancialEntry).toHaveBeenCalledWith("f1");
    });
  });
});
