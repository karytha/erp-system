import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { labels } from "@/constants";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { LoginForm } from "./LoginForm";
import { loginRequest } from "../api/auth-api";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../api/auth-api", () => ({
  loginRequest: jest.fn(),
}));

describe("LoginForm", () => {
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
    jest.mocked(loginRequest).mockReset();
  });

  it("mostra título e campos de autenticação", () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByRole("heading", { name: labels.auth.loginTitle })).toBeInTheDocument();
    expect(screen.getByLabelText(labels.common.email)).toBeInTheDocument();
    expect(screen.getByLabelText(labels.common.password)).toBeInTheDocument();
  });

  it("submete login e redireciona ao dashboard em caso de sucesso", async () => {
    const user = userEvent.setup();
    jest.mocked(loginRequest).mockResolvedValue({
      token: "t",
      user: { id: "1", email: "a@b.com", name: "A" },
    });

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(labels.common.email), "a@b.com");
    await user.type(screen.getByLabelText(labels.common.password), "secret12");
    await user.click(screen.getByRole("button", { name: labels.auth.loginSubmit }));

    await waitFor(() => {
      expect(loginRequest).toHaveBeenCalledWith("a@b.com", "secret12");
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("mostra mensagem de erro quando o login falha", async () => {
    const user = userEvent.setup();
    jest.mocked(loginRequest).mockRejectedValue(new Error("Credenciais inválidas"));

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(labels.common.email), "x@y.com");
    await user.type(screen.getByLabelText(labels.common.password), "wrong");
    await user.click(screen.getByRole("button", { name: labels.auth.loginSubmit }));

    expect(await screen.findByText("Credenciais inválidas")).toBeInTheDocument();
  });

  it("navega para registo ao clicar em criar usuário", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole("button", { name: labels.auth.createUser }));

    expect(push).toHaveBeenCalledWith("/register");
  });
});
