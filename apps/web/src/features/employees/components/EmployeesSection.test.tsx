import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { labels } from "@/constants";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { EmployeesSection } from "./EmployeesSection";
import { createEmployee, deleteEmployee, fetchEmployees } from "../api/employees-api";

jest.mock("../api/employees-api", () => ({
  fetchEmployees: jest.fn(),
  createEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
}));

const baseEmployee = {
  id: "e1",
  name: "Ana Costa",
  email: "ana@empresa.com",
  role: "Engenheira",
  department: "TI",
  hiredAt: "2024-01-01T00:00:00.000Z",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("EmployeesSection", () => {
  beforeEach(() => {
    jest.mocked(fetchEmployees).mockReset();
    jest.mocked(createEmployee).mockReset();
    jest.mocked(deleteEmployee).mockReset();
  });

  it("mostra título e cabeçalhos da tabela quando há dados", async () => {
    jest.mocked(fetchEmployees).mockResolvedValue([baseEmployee]);

    renderWithProviders(<EmployeesSection />);

    expect(screen.getByRole("heading", { name: labels.employees.pageTitle })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Ana Costa" })).toBeInTheDocument();
    });
    expect(screen.getByRole("columnheader", { name: labels.common.email })).toBeInTheDocument();
  });

  it("mantém o botão Adicionar desativado sem campos obrigatórios", async () => {
    jest.mocked(fetchEmployees).mockResolvedValue([]);

    renderWithProviders(<EmployeesSection />);

    await waitFor(() => {
      expect(screen.queryByText(labels.common.loading)).not.toBeInTheDocument();
    });

    const novoPanel = screen
      .getByRole("heading", { name: labels.employees.newPanel })
      .closest("section");
    expect(novoPanel).toBeTruthy();
    const addBtn = within(novoPanel as HTMLElement).getByRole("button", {
      name: labels.common.add,
    });
    expect(addBtn).toBeDisabled();
  });

  it("cria colaborador ao preencher o formulário", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchEmployees).mockResolvedValue([]);
    jest.mocked(createEmployee).mockResolvedValue(baseEmployee);

    renderWithProviders(<EmployeesSection />);

    await waitFor(() => {
      expect(screen.queryByText(labels.common.loading)).not.toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(labels.common.name), "Bruno");
    await user.type(screen.getByLabelText(labels.common.email), "bruno@empresa.com");
    await user.type(screen.getByLabelText(labels.common.role), "Designer");
    await user.type(screen.getByLabelText(labels.common.department), "UX");

    await user.click(screen.getByRole("button", { name: labels.common.add }));

    await waitFor(() => {
      expect(createEmployee).toHaveBeenCalledWith({
        name: "Bruno",
        email: "bruno@empresa.com",
        role: "Designer",
        department: "UX",
      });
    });
  });

  it("remove colaborador ao clicar em Excluir", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchEmployees).mockResolvedValue([baseEmployee]);
    jest.mocked(deleteEmployee).mockResolvedValue(undefined);

    renderWithProviders(<EmployeesSection />);

    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Ana Costa" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: labels.common.delete }));

    await waitFor(() => {
      expect(deleteEmployee).toHaveBeenCalledWith("e1");
    });
  });
});
