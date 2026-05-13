import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { labels } from "@/constants";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { RegisterForm } from "./RegisterForm";
import { registerRequest } from "../api/auth-api";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../api/auth-api", () => ({
  registerRequest: jest.fn(),
}));

describe("RegisterForm", () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    jest.mocked(useRouter).mockReturnValue({
      push,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as ReturnType<typeof useRouter>);
    jest.mocked(registerRequest).mockReset();
  });

  it("mostra título e campos de cadastro", () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByRole("heading", { name: labels.auth.registerTitle })).toBeInTheDocument();
    expect(screen.getByLabelText(labels.common.name)).toBeInTheDocument();
    expect(screen.getByLabelText(labels.common.email)).toBeInTheDocument();
    expect(screen.getByLabelText(labels.common.password)).toBeInTheDocument();
  });

  it("regista utilizador e redireciona ao dashboard", async () => {
    const user = userEvent.setup();
    jest.mocked(registerRequest).mockResolvedValue({
      token: "t",
      user: { id: "1", email: "n@b.com", name: "N" },
    });

    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(labels.common.name), "Nome");
    await user.type(screen.getByLabelText(labels.common.email), "n@b.com");
    await user.type(screen.getByLabelText(labels.common.password), "senha12");
    await user.click(screen.getByRole("button", { name: labels.auth.registerSubmit }));

    await waitFor(() => {
      expect(registerRequest).toHaveBeenCalledWith("n@b.com", "senha12", "Nome");
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("mostra erro quando o registo falha", async () => {
    const user = userEvent.setup();
    jest.mocked(registerRequest).mockRejectedValue(new Error("E-mail já em uso"));

    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(labels.common.name), "X");
    await user.type(screen.getByLabelText(labels.common.email), "dup@b.com");
    await user.type(screen.getByLabelText(labels.common.password), "senha12");
    await user.click(screen.getByRole("button", { name: labels.auth.registerSubmit }));

    expect(await screen.findByText("E-mail já em uso")).toBeInTheDocument();
  });

  it("navega para login ao clicar em já tenho conta", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    await user.click(screen.getByRole("button", { name: labels.auth.hasAccount }));

    expect(push).toHaveBeenCalledWith("/login");
  });
});
