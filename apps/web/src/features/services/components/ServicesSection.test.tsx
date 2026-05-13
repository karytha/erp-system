import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { labels } from "@/constants";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { ServicesSection } from "./ServicesSection";
import { createService, deleteService, fetchServices } from "../api/services-api";

jest.mock("../api/services-api", () => ({
  fetchServices: jest.fn(),
  createService: jest.fn(),
  deleteService: jest.fn(),
}));

const service = {
  id: "sv1",
  name: "Consulta",
  description: "1h",
  price: "120.00",
  durationMinutes: 60,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

describe("ServicesSection", () => {
  beforeEach(() => {
    jest.mocked(fetchServices).mockReset();
    jest.mocked(createService).mockReset();
    jest.mocked(deleteService).mockReset();
  });

  it("lista serviços", async () => {
    jest.mocked(fetchServices).mockResolvedValue([service]);

    renderWithProviders(<ServicesSection />);

    expect(screen.getByRole("heading", { name: labels.services.pageTitle })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Consulta" })).toBeInTheDocument();
    });
  });

  it("Adicionar desativado sem nome", async () => {
    jest.mocked(fetchServices).mockResolvedValue([]);

    renderWithProviders(<ServicesSection />);

    await waitFor(() => {
      expect(screen.queryByText(labels.common.loading)).not.toBeInTheDocument();
    });

    const panel = screen
      .getByRole("heading", { name: labels.services.newPanel })
      .closest("section");
    expect(panel).toBeTruthy();
    expect(
      within(panel as HTMLElement).getByRole("button", { name: labels.common.add }),
    ).toBeDisabled();
  });

  it("cria serviço", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchServices).mockResolvedValue([]);
    jest.mocked(createService).mockResolvedValue(service);

    renderWithProviders(<ServicesSection />);

    await waitFor(() => {
      expect(screen.queryByText(labels.common.loading)).not.toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(labels.common.name), "Suporte remoto");
    await user.clear(screen.getByLabelText(labels.common.price));
    await user.type(screen.getByLabelText(labels.common.price), "50");
    await user.type(screen.getByLabelText(labels.common.durationMinutesField), "30");

    await user.click(screen.getByRole("button", { name: labels.common.add }));

    await waitFor(() => {
      expect(createService).toHaveBeenCalledWith({
        name: "Suporte remoto",
        description: null,
        price: 50,
        durationMinutes: 30,
      });
    });
  });

  it("exclui serviço", async () => {
    const user = userEvent.setup();
    jest.mocked(fetchServices).mockResolvedValue([service]);
    jest.mocked(deleteService).mockResolvedValue(undefined);

    renderWithProviders(<ServicesSection />);

    await waitFor(() => {
      expect(screen.getByRole("cell", { name: "Consulta" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: labels.common.delete }));

    await waitFor(() => {
      expect(deleteService).toHaveBeenCalledWith("sv1");
    });
  });
});
